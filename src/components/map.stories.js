import React, { useEffect, useState } from "react"

import Map from "./map"
import { chakra } from "@chakra-ui/system"
import { Box, Spinner } from "@chakra-ui/react"
import { Helmet } from "react-helmet"

export default {
  title: "Components/Map",
  component: Map,
  decorators: [
    StoryFn => (
      <chakra.div>
        <Helmet>
          <link
            rel="stylesheet"
            href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css"
          />
        </Helmet>
        <StoryFn />
      </chakra.div>
    ),
  ],
}

export const Default = args => {
  const location = [43.5598, -79.7164]

  return <Map {...args} startingLocation={location} />
}
// Default.args = { siteTitle: "Title" }
