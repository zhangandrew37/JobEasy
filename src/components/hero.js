import React from "react"

import { Box, Heading, SimpleGrid, Image, Flex, Button } from "@chakra-ui/react"
import { FaArrowRight } from "react-icons/fa"

import HeroImage from "../images/undraw_Co_workers_re_1i6i.svg"

const Hero = () => (
  <Box>
    <Heading size="4xl" mb={10}>
      Put some hero text here
    </Heading>
    <Flex
      direction="row"
      wrap={{ base: "wrap", md: "nowrap" }}
      justify="center"
      pb={10}
    >
      <Box>
        <Heading size="xl" mb={10}>
          A simple job finder for those who need it most
        </Heading>
        <Button size="lg" rightIcon={<FaArrowRight />} colorScheme="blue">
          Get Started
        </Button>
      </Box>
      <Image h="auto" flexBasis={{ base: "sm", md: "xl" }} as={HeroImage} />
      {/* <Image
        as={HeroImage}
        objectFit="fill"
        p={{ base: 10, md: 0 }}
        w={{ base: "lg", md: "xl" }}
      /> */}
    </Flex>

    <SimpleGrid columns={2} spacing={6}>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
    </SimpleGrid>
  </Box>
)

export default Hero
