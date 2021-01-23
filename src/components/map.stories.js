import React, { useEffect, useState } from "react"

import Map from "./map"
import { chakra } from "@chakra-ui/system"
import { Box, Spinner } from "@chakra-ui/react"

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
  const location = [0, 0]

  return <Map {...args} startingLocation={location} />
}
// Default.args = { siteTitle: "Title" }
