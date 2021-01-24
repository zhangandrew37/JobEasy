import React, { useCallback, useEffect, useRef, useState } from "react"
import L from "leaflet"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Circle,
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
import ReactDOMServer from "react-dom/server"

const MapControls = ({ map, locRef }) => {
  return (
    <Stack flex="0 0 250px">
      <Heading>Controls</Heading>
      <InputGroup size="md">
        <InputLeftElement>
          <Link
            color="gray.300"
            onClick={useCallback(() => {
              // if (locRef.current) {
              //   map.flyTo(locRef.current.latlng, map.getZoom())
              // } else {
              //   map.locate()
              // }
              map.locate()
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

const CurrentLocationMarker = ({ locRef }) => {
  const locationDot = L.divIcon({
    html: ReactDOMServer.renderToString(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="16"
        height="16"
        fill="none"
      >
        <circle
          circle
          r="5"
          cx="8"
          cy="8"
          style={{
            fill: "#3287ff",
            stroke: "white",
            strokeWidth: "2",
          }}
        />
      </svg>
    ),
    iconSize: [16, 16],
    className: "icon",
    iconAnchor: [8, 8],
  })
  console.log(locRef.current)
  return locRef.current ? (
    <>
      <Circle
        center={locRef.current.latlng}
        radius={locRef.current.accuracy}
      ></Circle>
      <Marker position={locRef.current.latlng} icon={locationDot}>
        <Popup>You are here</Popup>
      </Marker>
    </>
  ) : null
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
        setLoc(e)
        map.flyTo(e.latlng, map.getZoom())
      })
    }
  })
  // useMapEvents({
  //   locationfound(e) {
  //     e.accuracy
  //   }
  // })

  return (
    <Stack direction="row" width="100%" height="lg" spacing={4}>
      <MapControls map={map} locRef={locRef} />
      <Map center={[43.5598, -79.7164]} zoom={13} setMap={setMap}>
        <CurrentLocationMarker locRef={locRef} />
        <Marker position={[43.5598, -79.7164]}>
          <Popup>A test location</Popup>
        </Marker>
      </Map>
    </Stack>
  )
}
