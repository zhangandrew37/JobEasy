import React from "react"
import { Link as GatsbyLink } from "gatsby"

import { Box, Heading, Image, Flex, Button, Spacer } from "@chakra-ui/react"
import { FaArrowRight } from "react-icons/fa"

import HeroImage from "../images/undraw_Co_workers_re_1i6i.svg"

const Hero = () => (
  <Box>
    <Heading size="4xl" mb={10}>
      Find work that fits you.
    </Heading>
    <Flex
      direction="row"
      wrap={{ base: "wrap", md: "nowrap" }}
      justify="center"
      pb={10}
    >
      <Box>
        <Heading size="xl" mb={10}>
          A simple job finder for recent immigrants to Canada
        </Heading>
        <Button
          as={GatsbyLink}
          to="/search"
          size="lg"
          rightIcon={<FaArrowRight />}
          colorScheme="blue"
        >
          Get Started
        </Button>
      </Box>
      <Spacer />
      <Image h="auto" flexBasis={{ base: "sm", md: "xl" }} as={HeroImage} />
      {/* <Image
        as={HeroImage}
        objectFit="fill"
        p={{ base: 10, md: 0 }}
        w={{ base: "lg", md: "xl" }}
      /> */}
    </Flex>

    {/* <SimpleGrid columns={2} spacing={6}>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
    </SimpleGrid> */}
  </Box>
)

export default Hero
