var admin = require("firebase-admin")
var geofirestore = require("geofirestore")

var serviceAccount = require("./ics4u0-project-firebase-adminsdk-an5jr-97ac1ef7c1.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const firestore = admin.firestore()

const GeoFirestore = geofirestore.initializeApp(firestore)

const jobListings = GeoFirestore.collection("jobs")
  .doc("ZMWLlLid8HSsgNfCnIMB")
  .collection("listings")

jobListings.add({
  name: "Sample Job Listing",
  salary: "123456",
  company: "Acme Corporation",
  description: "A sample job listing",
  links: ["https://jfss.ca"],
  coordinates: new admin.firestore.GeoPoint(43.5598, -79.7164),
})
