import React, { useState } from "react"
import {
  Box,
  Button,
  Heading,
  Stack,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  Modal,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Link,
  Text,
  Badge,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import AlgoliaPlaces from "algolia-places-react"

const Sidebar = ({
  map,
  loc,
  handleLocChange,
  radius,
  setRadius,
  setQueryRadius,
  jobs,
  popupRefs,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [locating, setLocating] = useState(false)

  const JobList = () => {
    let output = []
    if (jobs) {
      Object.keys(jobs).forEach(jobId => {
        output.push(
          <Stack borderWidth="1px" borderRadius="lg" p={4} spacing={3}>
            <Heading size="md" key={jobId}>
              {jobs[jobId].name}
            </Heading>
            <Wrap>
              {/* create a badge for each qualification */}
              {jobs[jobId].qualificationsData.map(data => {
                return (
                  <Badge
                    as={WrapItem}
                    borderRadius="full"
                    px="2"
                    colorScheme="blue"
                  >
                    {data.label}
                  </Badge>
                )
              })}
            </Wrap>

            {/* make a card for each listing */}
            {jobs[jobId].listings.map(listing => {
              return (
                <Box
                  key={listing.id}
                  padding={4}
                  borderWidth="1px"
                  borderRadius="lg"
                >
                  <Link
                    onClick={
                      popupRefs
                        ? () => {
                            console.log(popupRefs[listing.id])
                            map.openPopup(
                              popupRefs[listing.id].ref.current,
                              popupRefs[listing.id].coords
                            )
                          }
                        : null
                    }
                  >
                    <Heading size="sm">
                      {listing.data.name} &bull; {listing.data.company}
                    </Heading>
                  </Link>
                  <Text>{listing.data.description}</Text>
                  <Text>${listing.data.salary}</Text>
                  {listing.distance ? (
                    <Text>{listing.distance.toFixed(2)} km away</Text>
                  ) : null}
                  {listing.data.links.map((link, idx) => (
                    <Link href={link} key={idx}>
                      {link}
                    </Link>
                  ))}
                </Box>
              )
            })}
          </Stack>
        )
      })
    }
    return output
  }

  return (
    <Stack flex="0 0 400px" overflowY="scroll" pr={4}>
      <Heading>Controls</Heading>
      <Button
        onClick={onOpen}
        isLoading={locating}
        loadingText="Locating"
        flex="0 0 40px"
      >
        Set Location
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Box
            as={AlgoliaPlaces}
            placeholder="Write an address here"
            options={{
              appId: "plVXF13Y9ZDS",
              apiKey: "111642e29abbad7b099607607173a059",
              language: "en",
              aroundLatLngViaIP: true,
            }}
            onChange={({ query, rawAnswer, suggestion, suggestionIndex }) => {
              // close modal
              onClose()
              const tmpLoc = {
                latlng: [suggestion.latlng.lat, suggestion.latlng.lng],
                accuracy: 0,
              }
              // update location
              handleLocChange(tmpLoc)
              // go to location
              map.flyTo(tmpLoc.latlng, map.getZoom())
            }}
            onError={({ message }) => {
              console.error(message)
            }}
            onLocate={async () => {
              try {
                // close modal
                onClose()
                // try to locate user
                setLocating(true)
                const tmpLoc = await new Promise((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(
                    pos => {
                      resolve({
                        latlng: [pos.coords.latitude, pos.coords.longitude],
                        accuracy: pos.coords.accuracy,
                      })
                    },
                    err => reject(err)
                  )
                })
                // update location
                handleLocChange(tmpLoc)
                setLocating(false)
                // go to location
                map.flyTo(tmpLoc.latlng, map.getZoom())
              } catch (err) {
                // cancel geolocation
                setLocating(false)
                console.error(`Geolocate Failed: ${err}`)
              }
            }}
          />
        </ModalContent>
      </Modal>
      <FormControl isDisabled={!loc}>
        <FormLabel htmlFor="search-radius">Search Radius (km)</FormLabel>
        <Flex>
          <NumberInput
            maxW="75px"
            mr="2rem"
            onChange={valueString => setRadius(valueString)}
            value={radius}
            isDisabled={!loc}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Slider
            flex="1"
            aria-label="search-radius"
            defaultValue={10}
            max={80}
            step={0.5}
            onChange={number => setRadius(number)}
            onChangeEnd={number => setQueryRadius(number)}
            isDisabled={!loc}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
        </Flex>
        {/* <FormHelperText>{radiusRef.current} km</FormHelperText> */}
      </FormControl>
      <JobList />
    </Stack>
  )
}

export default Sidebar
