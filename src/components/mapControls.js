import React, { useEffect, useState } from "react"
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
} from "@chakra-ui/react"
import AlgoliaPlaces from "algolia-places-react"
import firebase from "gatsby-plugin-firebase"

const MapControls = ({
  mapRef,
  locRef,
  setLoc,
  radiusRef,
  setRadius,
  qualifications,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    const asyncFunc = async () => {
      const getMatchingJobs = firebase
        .functions()
        .httpsCallable("getMatchingJobs")
      const getMatchingJobListings = firebase
        .functions()
        .httpsCallable("getMatchingJobListings")
      const jobs = await getMatchingJobs({
        qualifications: qualifications?.keys(),
      })
      console.log(jobs)
      Promise.all(
        Object.keys(jobs.data).map(async key => {
          console.log(key)
          let data = {
            job: key,
          }
          if (locRef.current && radiusRef.current) {
            data = {
              ...data,
              location: {
                center: {
                  latitude: locRef.current.latlng[0],
                  longitude: locRef.current.latlng[1],
                },
                radius: radiusRef.current,
              },
            }
          }
          const jobListings = await getMatchingJobListings(data)
          console.log(jobListings)
        })
      )
    }
    asyncFunc()
  }, [locRef, radiusRef, qualifications, radiusRef.current, locRef.current])

  return (
    <Stack flex="0 0 300px">
      <Heading>Controls</Heading>
      <Button onClick={onOpen} isLoading={locating} loadingText="Locating">
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
              console.log(suggestion)
              const loc = {
                latlng: [suggestion.latlng.lat, suggestion.latlng.lng],
                accuracy: 0,
              }
              setLoc(loc)
              mapRef.current.flyTo(loc.latlng, mapRef.current.getZoom())
              onClose()
            }}
            onError={({ message }) => {
              console.error(message)
            }}
            onLocate={async () => {
              try {
                onClose()
                setLocating(true)
                const loc = await new Promise((resolve, reject) => {
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
                setLoc(loc)
                setLocating(false)
                mapRef.current.flyTo(loc.latlng, mapRef.current.getZoom())
              } catch (err) {
                setLocating(false)
                console.error(`Geolocate Failed: ${err}`)
              }
            }}
          />
        </ModalContent>
      </Modal>
      <FormControl isDisabled={!locRef.current}>
        <FormLabel htmlFor="search-radius">Search Radius (km)</FormLabel>
        <Flex>
          <NumberInput
            maxW="100px"
            mr="2rem"
            onChange={valueString => setRadius(valueString)}
            value={radiusRef.current}
            isDisabled={!locRef.current}
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
            isDisabled={!locRef.current}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb></SliderThumb>
          </Slider>
        </Flex>
        {/* <FormHelperText>{radiusRef.current} km</FormHelperText> */}
      </FormControl>
    </Stack>
  )
}

export default MapControls
