import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { Heading, Text, Link } from "@chakra-ui/react"

const ContactPage = () => (
  <Layout>
    <SEO title="Contact" />
    <Heading>Contact Us</Heading>
    <Text>
      If there's anything wrong with the app,{" "}
      <Link
        href="https://github.com/jhthenerd/ics4u0-project"
        color="blue.500"
        isExternal
      >
        please open an issue on our Github!
      </Link>
    </Text>
  </Layout>
)

export default ContactPage
