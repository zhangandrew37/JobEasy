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

exports.getQualification = functions.https.onCall(async (data, context) => {
  const qualification = data
  if (typeof qualification === "string") {
    return (
      await firestore.collection("qualifications").doc(qualification).get()
    ).data()
  }
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

    return (await query.get()).docs
      .sort((a, b) =>
        typeof a.distance === "number" && typeof b.distance === "number"
          ? a.distance - b.distance
          : 0
      )
      .map(doc => {
        return { ...doc, data: doc.data() }
      })
  }
)

exports.getMatchingJobs = functions.https.onCall(async (data, context) => {
  // the ID of the qualification
  const qualifications = data.qualifications
  if (!qualifications) {
    let object = {}
    const data = (await firestore.collection("jobs").get()).forEach(doc => {
      object[doc.id] = doc.data()
    })
    return object
    // qualifications were not specified
    // just return all the jobs
  } else if (Array.isArray(qualifications) && qualifications[0] !== null) {
    const data = await Promise.all(
      qualifications.map(async qualification => {
        const snapshot = await firestore
          .collection("jobs")
          .where("qualifications", "array-contains", qualification)
          .get()
        let object = {}
        snapshot.docs.forEach(doc => {
          object[doc.id] = doc.data()
        })
        return object
      })
    )
    const mergedData = data.reduce((r, c) => Object.assign(r, c), {})
    return mergedData
  } else {
    throw Error("qualifications must be an array")
  }
})
