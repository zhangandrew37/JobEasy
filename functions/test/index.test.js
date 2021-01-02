const chai = require("chai")
const assert = chai.assert

const sinon = require("sinon")

const admin = require("firebase-admin")

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
  let myFunctions

  before(() => {
    myFunctions = require("../index")
  })

  after(() => {
    test.cleanup()
  })

  describe("getQualifications", () => {
    before(async () => {
      // Add some qualifications
      await admin.firestore().collection("qualifications").doc("1").set({
        name: "Sample Qualification 1",
        description: "The first sample qualification",
      })
      await admin.firestore().collection("qualifications").doc("2").set({
        name: "Sample Qualification 2",
        description: "The second sample qualification",
      })
      await admin.firestore().collection("qualifications").doc("3").set({
        name: "Sample Qualification 3",
        description: "The third sample qualification",
      })
    })

    after(async () => {
      await deleteCollection(admin.firestore(), "qualifications", 100)
    })

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

      output = await wrapped(data)
      assert.deepEqual(output, {
        1: {
          name: "Sample Qualification 1",
          description: "The first sample qualification",
        },
      })
    })
  })
})
