import React from "react"
import { Link as GatsbyLink } from "gatsby"

<<<<<<< HEAD
import { Box, Heading, SimpleGrid, Image, Flex, Button, Link } from "@chakra-ui/react"
=======
import { Box, Heading, SimpleGrid, Image, Flex, Button, Spacer } from "@chakra-ui/react"
>>>>>>> e00d628ebb40af01157c142dab106e914a5e0b02
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
        <Link as={GatsbyLink} to="/page-2">
          <Button size="lg" rightIcon={<FaArrowRight />} colorScheme="blue">
            Get Started
          </Button>
        </Link>
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

    <SimpleGrid columns={2} spacing={6}>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
      <Box h="200px" bg="gray.50" rounded="md" boxShadow="md"></Box>
    </SimpleGrid>
  </Box>
)

export default Hero
