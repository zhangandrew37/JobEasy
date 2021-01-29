# functions

This folder contains the serverless functions hosted on Firebase.

The API is located at https://us-central1-ics4u0-project.cloudfunctions.net

There are 3 functions exposed to the public:

1. getQualifications
1. getMatchingJobListings
1. getMatchingJobs

## How to call functions

The simplest way is to install the Firebase package for the platform you're developing on. Refer to Firebase's documentation for how to install the package and call functions.
https://firebase.google.com/docs/functions/callable

You can also call the API manually, following the specifications here: https://firebase.google.com/docs/functions/callable-reference

Simply append the function name to the API URL and send a POST request with json in the body. The json should contain one field named data, the contents of which will vary between functions.

## Interactive Documentation
If you want to test out the functions below, check out our interactive documentation on Stoplight.
https://jhthenerd.stoplight.io/docs/ics4u0-project/reference/jobeasy.v1.yaml

## getQualifications

getQualifications takes a single string as the data parameter, and returns an object with qualifications that include the string. This was originally intended to be used as an autocomplete function internally, but proved to be unnecessary. Thus, it was never developed further. The recommend way to use this function is to call it with the data object defined as null, to retrieve all the qualifications, and use a local autocomplete library.

### Example output

```js
output = {
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
}
```

## getMatchingJobListings

This function takes a data object containing a job id and an optional location object. This function uses serverside filtering to find the matching listings within a job within a certain radius.

### Example input

```js
input = {
  job: "1",
  location: {
    center: {
      latitude: 43.5598,
      longitude: -79.7164,
    },
    radius: 0,
  },
}
```

### Example output

```js
output = [
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
]
```

## getMatchingJobs

This function takes in an array of qualification ids, and finds jobs that will suit the qualifications provided. The searching tool will only select a job if all the qualifications that the job requires are met.

### Example input

```js
input = { qualifications: ["1", "2"] }
```

### Example output

```js
output = {
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
}
```
