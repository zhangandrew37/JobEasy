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
    // data exists, so filtering is needed

    // Throw an error if data is not a string
    if (typeof data !== "string") {
      throw new Error("data object is not a string!")
    }

    // filter the qualifications to only those that contain the string
    const filteredSnapshot = querySnapshot.docs.filter(snapshot => {
      return snapshot.data().name.toLowerCase().includes(data)
    })

    // get the data from the filtered snapshot
    filteredSnapshot.forEach(documentSnapshot => {
      formattedObject[documentSnapshot.id] = documentSnapshot.data()
    })
  } else {
    // get the data from the original snapshot
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

    // sort the docs by distance, and get the data from them
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
  let obj = {}
  await Promise.all(
    // get all the jobs
    (await firestore.collection("jobs").get()).docs.map(async doc => {
      // get the data from the function
      obj[doc.id] = doc.data()
      // get detailed data about each qualification to reduce number of function calls
      obj[doc.id].qualificationsData = await Promise.all(
        obj[doc.id].qualifications.map(async qualification =>
          (
            await firestore
              .collection("qualifications")
              .doc(qualification)
              .get()
          ).data()
        )
      )
    })
  )

  if (!qualifications) {
    // qualifications were not specified
    // just return all the jobs
    return obj
  } else if (Array.isArray(qualifications) && qualifications[0] !== null) {
    // qualifications were specified, filter them
    // convert the user qualifications into an object where the key is the
    // qualification id, and the value is the index
    var qualObj = {}

    qualifications.forEach((el, idx) => {
      qualObj[el] = idx
    })

    const filtered = Object.fromEntries(
      Object.entries(obj).filter(([id, data]) => {
        // loop through the job qualifications, and return true if the user
        // has all the qualifications needed
        return data.qualifications.every(el => {
          return qualObj[el] !== undefined
        })
      })
    )
    return filtered
  } else {
    throw Error("qualifications must be an array")
  }
})
