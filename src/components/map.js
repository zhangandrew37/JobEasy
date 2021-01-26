import React, { useRef, useState } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
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
import ReactDOMServer from "react-dom/server"
import AlgoliaPlaces from "algolia-places-react"

const MapControls = ({ mapRef, locRef, setLoc, radiusRef, setRadius }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [locating, setLocating] = useState(false)

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
            maxW="150px"
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

const CurrentLocationMarker = ({ locRef }) => {
  const locationDot = L.divIcon({
    html: ReactDOMServer.renderToString(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="32"
        height="32"
        fill="none"
      >
        <circle
          r="8"
          cx="16"
          cy="16"
          style={{
            fill: "#3287ff",
            stroke: "white",
            strokeWidth: "2",
          }}
        />
      </svg>
    ),
    iconSize: [32, 32],
    className: "icon",
    iconAnchor: [16, 16],
  })
  return locRef.current ? (
    <>
      <Circle center={locRef.current.latlng} radius={locRef.current.accuracy} />
      <Marker position={locRef.current.latlng} icon={locationDot}>
        <Popup>You are here</Popup>
      </Marker>
    </>
  ) : null
}

/**
 * A component displaying a map and controls
 * @param {{qualifications: Qualification[]}} param0 An object with the required qualifications
 */
const MapComponent = ({ qualifications }) => {
  const [map, _setMap] = useState(null)
  const [loc, _setLoc] = useState(null)
  const [radius, _setRadius] = useState(10)

  const mapRef = useRef(map)
  const setMap = data => {
    mapRef.current = data
    _setMap(data)
  }

  const locRef = useRef(loc)
  const setLoc = data => {
    locRef.current = data
    _setLoc(data)
  }

  const radiusRef = useRef(radius)
  const setRadius = data => {
    radiusRef.current = data
    _setRadius(data)
  }

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      width="100%"
      height="700px"
      spacing={4}
    >
      <MapControls
        mapRef={mapRef}
        locRef={locRef}
        setLoc={setLoc}
        radiusRef={radiusRef}
        setRadius={setRadius}
      />
      {typeof window !== "undefined" ? (
        <Box
          as={MapContainer}
          w="100%"
          h="100%"
          center={[43.5598, -79.7164]}
          zoom={13}
          whenCreated={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CurrentLocationMarker locRef={locRef} />
          <Marker position={[43.5598, -79.7164]} riseOnHover={true}>
            <Popup>A test location</Popup>
          </Marker>
          {locRef.current ? (
            <Circle
              center={locRef.current.latlng}
              radius={radiusRef.current * 1000}
              color="#777777"
            />
          ) : null}
        </Box>
      ) : null}
    </Stack>
  )
}

export default MapComponent
