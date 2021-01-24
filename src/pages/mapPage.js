import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Map from "../components/map"
import { Box } from "@chakra-ui/react"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Box height="180px">
      <Map startingLocation={[43.5598, -79.7164]} />
    </Box>
  </Layout>
)

export default IndexPage
