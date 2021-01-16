import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Stack, Heading, Spacer, Button } from "@chakra-ui/react"

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
    <Heading as={Link} to="/" color="blue.400">
      {siteTitle}
    </Heading>
    <Spacer />
    <Heading size="md">Home</Heading>
    <Heading size="md">About</Heading>
    <Button as={Link} to="/contact" colorScheme="blue">
      Contact Us
    </Button>
  </Stack>
)
Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
