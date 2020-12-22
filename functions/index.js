const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()

const db = admin.firestore()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.getQualifications = functions.https.onCall(async (data, context) => {
  const qualRef = db.collection("qualifications")
  if (data) {
    // do searching
  } else {
    const querySnapshot = await qualRef.get()
    const formattedObject = {}
    querySnapshot.forEach(documentSnapshot => {
      formattedObject[documentSnapshot.id] = documentSnapshot.data()
    })
    return formattedObject
  }
})
