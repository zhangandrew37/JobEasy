const functions = require("firebase-functions")
var admin = require("firebase-admin")
var geofirestore = require("geofirestore")

admin.initializeApp()

const firestore = admin.firestore()
const GeoFirestore = geofirestore.initializeApp(firestore)

exports.getQualifications = functions.https.onCall(async (data, context) => {
  const qualRef = firestore.collection("qualifications")
  const querySnapshot = await qualRef.get()
  const formattedObject = {}
  if (data) {
    // Filter by input

    // Throw an error if data is not a string
    if (typeof data !== "string") {
      throw new Error("data object is not a string!")
    }
    const filteredSnapshot = querySnapshot.docs.filter(snapshot => {
      return snapshot.data().name.toLowerCase().includes(data)
    })

    filteredSnapshot.forEach(documentSnapshot => {
      formattedObject[documentSnapshot.id] = documentSnapshot.data()
    })
  } else {
    querySnapshot.forEach(documentSnapshot => {
      formattedObject[documentSnapshot.id] = documentSnapshot.data()
    })
  }
  return formattedObject
})

exports.getMatchingJobListings = functions.https.onCall(
  async (data, context) => {
    const job = data.job

    let query = GeoFirestore.collection("jobs").doc(job).collection("listings")

    if (data.location) {
      // if location exists, filter by location
      const center = data.location.center
      const radius = data.location.radius
      query = query.near({
        center: new admin.firestore.GeoPoint(center.latitude, center.longitude),
        radius: radius,
      })
    }

    return (await query.get()).docs.map(doc => {
      return { ...doc, data: doc.data() }
    })
  }
)
