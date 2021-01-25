import React, { useRef, useState } from "react"
import { divIcon } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import { Box, Stack } from "@chakra-ui/react"
import ReactDOMServer from "react-dom/server"

import MapControls from "./mapControls"

const CurrentLocationMarker = ({ locRef }) => {
  const locationDot = divIcon({
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
