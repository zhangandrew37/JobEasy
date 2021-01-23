import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet"
import { Helmet } from "react-helmet"
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  InputRightElement,
} from "@chakra-ui/react"
import { FaCrosshairs } from "react-icons/fa"

const MapControls = ({ map, locRef }) => {
  return (
    <Stack flex="0 0 250px">
      <Heading>Controls</Heading>
      <InputGroup size="md">
        <InputLeftElement>
          <Link
            color="gray.300"
            onClick={useCallback(() => {
              if (locRef.current) {
                map.flyTo(locRef.current, map.getZoom())
              } else {
                map.locate()
              }
            }, [map])}
          >
            <FaCrosshairs />
          </Link>
        </InputLeftElement>
        <Input placeholder="Address" />
        <InputRightElement>a</InputRightElement>
      </InputGroup>
    </Stack>
  )
}

const Map = ({ center, zoom, setMap, children }) => {
  return (
    <>
      <Helmet>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css"
        />
      </Helmet>
      <Box
        as={MapContainer}
        w="100%"
        h="100%"
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        whenCreated={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </Box>
    </>
  )
}

export default () => {
  const [map, setMap] = useState(null)
  const [loc, _setLoc] = useState(null)

  const locRef = useRef(loc)
  const setLoc = data => {
    locRef.current = data
    _setLoc(data)
  }

  useEffect(() => {
    if (map) {
      map.addEventListener("locationfound", e => {
        setLoc(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      })
    }
  })

  return (
    <Stack direction="row" width="100%" height="lg" spacing={4}>
      <MapControls map={map} locRef={locRef} />
      <Map center={[43.5598, -79.7164]} zoom={13} setMap={setMap}>
        {locRef.current ? <Marker position={locRef.current}></Marker> : null}
      </Map>
    </Stack>
  )
}
