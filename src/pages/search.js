import React, { useState } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Search from "../components/search"
import Map from "../components/map"
import { Box } from "@chakra-ui/react"

const SecondPage = () => {
  // React hook to handle the qualifications state
  const [qualifications, setQualifications] = useState([])
  return (
    <Layout>
      <SEO title="Search" />
      <Search
        selectedItems={qualifications}
        setSelectedItems={setQualifications}
      />
      <Box height="180px">
        <Map
          startingLocation={[43.5598, -79.7164]}
          qualifications={qualifications}
        />
      </Box>
    </Layout>
  )
}

export default SecondPage
