import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import { Heading, Text, Link } from "@chakra-ui/react"

const ContactPage = () => (
  <Layout>
    <SEO title="Contact" />
    <Heading>Contact Us</Heading>
    <Text>
      If there's anything wrong with the app, please email the following address: zhang.andrew@gmail.com
    </Text>
  </Layout>
)

export default ContactPage
