const functions = require("firebase-functions")
var admin = require("firebase-admin")
var geofirestore = require("geofirestore")

admin.initializeApp()

const firestore = admin.firestore()
const GeoFirestore = geofirestore.initializeApp(firestore)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.getMatchingJobs = functions.https.onCall(async (data, context) => {
  const jobListings = GeoFirestore.collection("job-listings")
  const qualifications = data.qualifications
  const center = data.center
  const radius = data.radius

  const query = jobListings.near({
    center: new admin.firestore.GeoPoint(
      center.latitude,
      center.longitude
    ),
    radius: radius,
  })

  return query.get().then(value => {
    return value.docs.map(doc => {
      return { distance: doc.distance, id: doc.id, data: doc.data() }
    })
  })
})
