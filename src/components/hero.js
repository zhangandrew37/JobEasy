import React from "react"

import { Box, Heading, SimpleGrid } from "@chakra-ui/react"

const Hero = () => (
  <Box>
    <Heading size="4xl" mb={10}>
      Put some hero text here
    </Heading>
    <Heading size="xl" mb={10}>
      Maybe a subheading too
    </Heading>
    <SimpleGrid columns={2} spacing={6}>
      <Box h="200px" bg="gray.400"></Box>
      <Box h="200px" bg="gray.400"></Box>
      <Box h="200px" bg="gray.400"></Box>
      <Box h="200px" bg="gray.400"></Box>
    </SimpleGrid>
  </Box>
)

export default Hero