import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { Heading, Text, Link } from "@chakra-ui/react"

const ContactPage = () => (
  <Layout>
    <SEO title="Contact" />
    <Heading>Contact Us</Heading>
    <Text>
      If there's anything wrong with the app, please open an issue on our
      Github!
    </Text>
    <Link href="https://github.com/jhthenerd/ics4u0-project" isExternal>
      GitHub Repository
    </Link>
  </Layout>
)

export default ContactPage
