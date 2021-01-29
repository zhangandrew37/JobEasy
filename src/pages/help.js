import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { Heading, Text, AspectRatio } from "@chakra-ui/react"

const HelpPage = () => (
  <Layout>
    <SEO title="Help" />
    <Heading>Help</Heading>
    <Text>
      Detailed user documentation has not been created yet, but here's a getting
      started video for now!
    </Text>
    <AspectRatio ratio={16 / 9}>
      <iframe
        title="Instructional Help Video"
        src="https://www.youtube-nocookie.com/embed/RRJZWIIyWbA"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </AspectRatio>
  </Layout>
)

export default HelpPage
