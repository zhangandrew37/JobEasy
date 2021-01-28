import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Search from "../components/search"

const SecondPage = () => (
  <Layout>
    <SEO title="Search" />
    <Search />
  </Layout>
)

export default SecondPage