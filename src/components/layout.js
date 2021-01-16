/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import { Stack, VStack } from "@chakra-ui/react"

import Header from "./header"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <VStack>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <Stack as="main" m="0 auto" maxW="960" p={[0, 4, 6]}>
        {children}
      </Stack>
    </VStack>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
