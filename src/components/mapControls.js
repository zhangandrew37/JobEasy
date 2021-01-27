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
  map,
  loc,
  handleLocChange,
  radius,
  setRadius,
  qualifications,
  handleJobsChange,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [locating, setLocating] = useState(false)
  const [queryRadius, setQueryRadius] = useState(radius)
  // move to parent component
  useEffect(() => {
    const asyncFunc = async () => {
      try {
        const getMatchingJobs = firebase
          .functions()
          .httpsCallable("getMatchingJobs")
        const getMatchingJobListings = firebase
          .functions()
          .httpsCallable("getMatchingJobListings")
        let tempJobs = (
          await getMatchingJobs({
            qualifications: qualifications?.keys(),
          })
        ).data
        console.log(tempJobs)
        await Promise.all(
          Object.keys(tempJobs).map(async key => {
            console.log(key)
            let data = {
              job: key,
            }
            if (loc && queryRadius) {
              data = {
                ...data,
                location: {
                  center: {
                    latitude: loc.latlng[0],
                    longitude: loc.latlng[1],
                  },
                  radius: queryRadius,
                },
              }
            }
            console.log(JSON.stringify(data))
            tempJobs[key] = {
              ...tempJobs[key],
              listings: (await getMatchingJobListings(data)).data,
            }
          })
        )
        handleJobsChange(tempJobs)
      } catch (err) {
        console.error(err)
      }
    }
    asyncFunc()
  }, [loc, queryRadius, qualifications, handleJobsChange])

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
              onClose()
              console.log(suggestion)
              const tmpLoc = {
                latlng: [suggestion.latlng.lat, suggestion.latlng.lng],
                accuracy: 0,
              }
              handleLocChange(tmpLoc)
              map.flyTo(tmpLoc.latlng, map.getZoom())
            }}
            onError={({ message }) => {
              console.error(message)
            }}
            onLocate={async () => {
              try {
                onClose()
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
                handleLocChange(tmpLoc)
                setLocating(false)
                map.flyTo(tmpLoc.latlng, map.getZoom())
              } catch (err) {
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
            maxW="100px"
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
    </Stack>
  )
}

export default MapControls
