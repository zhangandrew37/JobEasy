const chai = require("chai")
const assert = chai.assert

const sinon = require("sinon")

const admin = require("firebase-admin")
var geofirestore = require("geofirestore")

const projectConfig = {
  apiKey: "AIzaSyAuLuzmFGVOHUI0MBIT0vRstj_BiUkxCCw",
  authDomain: "ics4u0-test-project.firebaseapp.com",
  projectId: "ics4u0-test-project",
  storageBucket: "ics4u0-test-project.appspot.com",
  messagingSenderId: "852682573937",
  appId: "1:852682573937:web:f2331f59919155437c73d0",
}

const test = require("firebase-functions-test")(
  projectConfig,
  "./test/ics4u0-test-project-firebase-adminsdk-epzy6-21e06b9e99.json"
)

async function deleteCollection(db, collectionPath, batchSize) {
  const collectionRef = db.collection(collectionPath)
  const query = collectionRef.orderBy("__name__").limit(batchSize)

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject)
  })
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get()

  const batchSize = snapshot.size
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve()
    return
  }

  // Delete documents in a batch
  const batch = db.batch()
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref)
  })
  await batch.commit()

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve)
  })
}

describe("Cloud Functions", () => {
  let myFunctions, firestore, GeoFirestore

  before(async function () {
    this.timeout(10000)

    // add functions
    myFunctions = require("../index")

    firestore = admin.firestore()
    GeoFirestore = geofirestore.initializeApp(firestore)

    // Add qualifications
    await firestore.collection("qualifications").doc("1").set({
      name: "Sample Qualification 1",
      description: "The first sample qualification",
    })
    await firestore.collection("qualifications").doc("2").set({
      name: "Sample Qualification 2",
      description: "The second sample qualification",
    })
    await firestore.collection("qualifications").doc("3").set({
      name: "Sample Qualification 3",
      description: "The third sample qualification",
    })

    // Add jobs
    await firestore
      .collection("jobs")
      .doc("1")
      .set({
        name: "Sample Job 1",
        description: "The first sample job",
        avgSalary: 100000,
        qualifications: ["1"],
      })
    await firestore
      .collection("jobs")
      .doc("2")
      .set({
        name: "Sample Job 2",
        description: "The second sample job",
        avgSalary: 200000,
        qualifications: ["1", "2"],
      })
    await firestore
      .collection("jobs")
      .doc("3")
      .set({
        name: "Sample Job 3",
        description: "The third sample job",
        avgSalary: 300000,
        qualifications: ["1", "2", "3"],
      })

    // Add job listings
    await GeoFirestore.collection("jobs")
      .doc("1")
      .collection("listings")
      .doc("1")
      .set({
        name: "Sample Job Listing 1",
        description: "The first sample job listing",
        links: ["https://jfss.ca"],
        salary: "100000",
        coordinates: new admin.firestore.GeoPoint(43.5598, -79.7164),
      })
    await GeoFirestore.collection("jobs")
      .doc("2")
      .collection("listings")
      .doc("2")
      .set({
        name: "Sample Job Listing 2",
        description: "The second sample job listing",
        links: ["https://jfss.ca"],
        salary: "200000",
        coordinates: new admin.firestore.GeoPoint(44.5598, -80.7164),
      })
    await GeoFirestore.collection("jobs")
      .doc("3")
      .collection("listings")
      .doc("3")
      .set({
        name: "Sample Job Listing 3",
        description: "The third sample job listing",
        links: ["https://jfss.ca"],
        salary: "300000",
        coordinates: new admin.firestore.GeoPoint(42.5598, -78.7164),
      })
  })

  after(async function () {
    this.timeout(10000)
    await deleteCollection(firestore, "qualifications", 100)
    await deleteCollection(firestore, "jobs", 100)
    await deleteCollection(firestore, "jobs/1/listings", 100)
    await deleteCollection(firestore, "jobs/2/listings", 100)
    await deleteCollection(firestore, "jobs/3/listings", 100)
    test.cleanup()
  })

  describe("getQualifications", () => {
    it("should return a list of qualifications when given no data", async () => {
      const data = null

      const wrapped = test.wrap(myFunctions.getQualifications)

      output = await wrapped(data)
      assert.deepEqual(output, {
        1: {
          name: "Sample Qualification 1",
          description: "The first sample qualification",
        },
        2: {
          name: "Sample Qualification 2",
          description: "The second sample qualification",
        },
        3: {
          name: "Sample Qualification 3",
          description: "The third sample qualification",
        },
      })
    })

    it("should filter qualifications when given data", async () => {
      const data = "1"

      const wrapped = test.wrap(myFunctions.getQualifications)

      const output = await wrapped(data)
      assert.deepEqual(output, {
        1: {
          name: "Sample Qualification 1",
          description: "The first sample qualification",
        },
      })
    })
  })

  describe("getMatchingJobListings", () => {
    it("should return a list of matching listings, given the location", async () => {
      const data = {
        job: "1",
        location: {
          center: {
            latitude: 43.5598,
            longitude: -79.7164,
          },
          radius: 0,
        },
      }

      const wrapped = test.wrap(myFunctions.getMatchingJobListings)
      const output = await wrapped(data)
      // console.log(JSON.stringify(output, null, 2))
      assert.deepEqual(output, [
        {
          exists: true,
          id: "1",
          data: {
            coordinates: {
              _latitude: 43.5598,
              _longitude: -79.7164,
            },
            name: "Sample Job Listing 1",
            description: "The first sample job listing",
            links: ["https://jfss.ca"],
            salary: "100000",
            g: {
              geohash: "dpxrf1b61p",
              geopoint: {
                _latitude: 43.5598,
                _longitude: -79.7164,
              },
            },
          },
          distance: 0,
        },
      ])
    })
    it("should return an empty list, given there are no listings in range", async () => {
      const data = {
        job: "2",
        location: {
          center: {
            latitude: 43.5598,
            longitude: -79.7164,
          },
          radius: 0,
        },
      }

      const wrapped = test.wrap(myFunctions.getMatchingJobListings)
      const output = await wrapped(data)
      // console.log(output)
      assert.isEmpty(output)
    })
    it("should return an all data if no location is passed to it", async () => {
      const data = {
        job: "1",
      }

      const wrapped = test.wrap(myFunctions.getMatchingJobListings)
      const output = await wrapped(data)
      // console.log(output)
      assert.deepEqual(output, [
        {
          exists: true,
          id: "1",
          data: {
            coordinates: {
              _latitude: 43.5598,
              _longitude: -79.7164,
            },
            name: "Sample Job Listing 1",
            description: "The first sample job listing",
            links: ["https://jfss.ca"],
            salary: "100000",
            g: {
              geohash: "dpxrf1b61p",
              geopoint: {
                _latitude: 43.5598,
                _longitude: -79.7164,
              },
            },
          },
          distance: null,
        },
      ])
    })
  })

  describe("getMatchingJobs", () => {
    it("should return all jobs if qualifications were not specified", async () => {
      const data = {}

      const wrapped = test.wrap(myFunctions.getMatchingJobs)
      const output = await wrapped(data)
      assert.deepEqual(output, {
        1: {
          name: "Sample Job 1",
          description: "The first sample job",
          avgSalary: 100000,
          qualifications: ["1"],
          qualificationsData: [
            {
              description: "The first sample qualification",
              name: "Sample Qualification 1",
            },
          ],
        },
        2: {
          name: "Sample Job 2",
          description: "The second sample job",
          avgSalary: 200000,
          qualifications: ["1", "2"],
          qualificationsData: [
            {
              description: "The first sample qualification",
              name: "Sample Qualification 1",
            },
            {
              description: "The second sample qualification",
              name: "Sample Qualification 2",
            },
          ],
        },
        3: {
          name: "Sample Job 3",
          description: "The third sample job",
          avgSalary: 300000,
          qualifications: ["1", "2", "3"],
          qualificationsData: [
            {
              description: "The first sample qualification",
              name: "Sample Qualification 1",
            },
            {
              description: "The second sample qualification",
              name: "Sample Qualification 2",
            },
            {
              description: "The third sample qualification",
              name: "Sample Qualification 3",
            },
          ],
        },
      })
    })
    it("should return any jobs that match the search", async () => {
      const data = { qualifications: ["1", "2"] }

      const wrapped = test.wrap(myFunctions.getMatchingJobs)
      const output = await wrapped(data)
      assert.deepEqual(output, {
        1: {
          name: "Sample Job 1",
          description: "The first sample job",
          avgSalary: 100000,
          qualifications: ["1"],
          qualificationsData: [
            {
              description: "The first sample qualification",
              name: "Sample Qualification 1",
            },
          ],
        },
        2: {
          name: "Sample Job 2",
          description: "The second sample job",
          avgSalary: 200000,
          qualifications: ["1", "2"],
          qualificationsData: [
            {
              description: "The first sample qualification",
              name: "Sample Qualification 1",
            },
            {
              description: "The second sample qualification",
              name: "Sample Qualification 2",
            },
          ],
        },
      })
    })
  })
})
