import React, { useEffect, useState } from "react"

import Map from "./map"
import { chakra } from "@chakra-ui/system"
import { Box, Spinner } from "@chakra-ui/react"

const getLocation = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        resolve(pos)
      })
    } else {
      reject()
    }
  })
}

export default {
  title: "Components/Map",
  component: Map,
  decorators: [
    StoryFn => (
      <chakra.div>
        <StoryFn />
      </chakra.div>
    ),
  ],
}

export const Default = args => {
  const [location, setLocation] = useState()

  useEffect(() => {
    getLocation().then(data => {
      setLocation(data)
    })
  }, [])

  return (
    <Box boxSize="md">
      {location ? <Map {...args} location={location} /> : <Spinner />}
    </Box>
  )
}
// Default.args = { siteTitle: "Title" }
