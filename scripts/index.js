var admin = require("firebase-admin")
var geofirestore = require("geofirestore")

var serviceAccount = require("./ics4u0-project-firebase-adminsdk-an5jr-97ac1ef7c1.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const firestore = admin.firestore()

const GeoFirestore = geofirestore.initializeApp(firestore)

const jobListings = GeoFirestore.collection("job-listings")

// jobListings.add({
//   name: "Sample Job Listing",
//   salary: "123456",
//   company: "Acme Corporation",
//   description: "A sample job listing",
//   links: ["https://jfss.ca"],
//   coordinates: new admin.firestore.GeoPoint(43.5598, -79.7164),
// })

const query = jobListings.near({
  center: new admin.firestore.GeoPoint(43.5598, -79.7164),
  radius: 1000,
})

query.get().then(value => {
  console.log(
    value.docs.map(doc => {
      return { distance: doc.distance, id: doc.id, data: doc.data() }
    })
  )
})
