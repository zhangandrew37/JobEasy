import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { Heading, Text, Link } from "@chakra-ui/react"

const AboutPage = () => (
  <Layout>
    <SEO title="About" />
    <Heading pb="30px">About JobEasy</Heading>
    <Text>
      JobEasy is a charitable website that allows immigrants to find fair jobs
      for themselves based on their previous experience.
    </Text>
    <br></br>
    <Text>
      Please{" "}
      <Link href="/contact" color="blue.500">
        contact us{" "}
      </Link>
      for more information or to provide feedback on our app.
    </Text>
  </Layout>
)

export default AboutPage
