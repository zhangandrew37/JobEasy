import { Link as GatsbyLink } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Stack, Heading, Spacer, Link } from "@chakra-ui/react"

const Header = ({ siteTitle, maxWidth }) => (
  <Stack
    as="header"
    direction="row"
    w="100%"
    py={6}
    px={4}
    alignItems="center"
    spacing={4}
    maxW={maxWidth}
  >
    <Heading
      as={GatsbyLink}
      to="/"
      bgGradient="linear(to-r,blue.400,green.300)"
      bgClip="text"
    >
      {siteTitle}
    </Heading>
    <Spacer />
    <Link as={GatsbyLink} to="/about">
      <Heading size="md">About</Heading>
    </Link>
    <Link as={GatsbyLink} to="/help">
      <Heading size="md">Help</Heading>
    </Link>
    <Link as={GatsbyLink} to="/contact">
      <Heading size="md">Contact Us</Heading>
    </Link>
    {/* <Button as={GatsbyLink} to="/contact" colorScheme="blue">
      Contact Us
    </Button> */}
  </Stack>
)
Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
