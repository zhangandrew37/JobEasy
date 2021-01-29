var admin = require("firebase-admin")
var geofirestore = require("geofirestore")

var serviceAccount = require("./ics4u0-project-firebase-adminsdk-an5jr-97ac1ef7c1.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const firestore = admin.firestore()

const GeoFirestore = geofirestore.initializeApp(firestore)

const jobListings = GeoFirestore.collection("jobs")
  .doc("Iypx0t9rh51pRogzO2vi")
  .collection("listings")

jobListings.add({
  name: "JKL Developer",
  salary: 102304,
  company: "MiddleOfNowhere Inc",
  description: "You will have to drive pretty far...",
  links: ["https://goo.gl/maps/TsuLk4LfhJrqC6fs9"],
  coordinates: new admin.firestore.GeoPoint(44.424892, -79.717525),
})
