import { Link as GatsbyLink } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Stack, Heading, Spacer, Button, Link } from "@chakra-ui/react"

const Header = ({ siteTitle }) => (
  <Stack
    as="header"
    direction="row"
    w="100%"
    p={[6, 4]}
    alignItems="center"
    spacing={4}
    maxW="960px"
  >
    <Heading as={GatsbyLink} to="/" color="blue.400">
      {siteTitle}
    </Heading>
    <Spacer />
    <Link as={GatsbyLink}>
      <Heading size="md">About</Heading>
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
