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
import AlgoliaPlaces from "algolia-places-react"

const MapControls = ({ mapRef, locRef, setLoc }) => {
  return (
    <Stack flex="0 0 400px">
      <Heading>Controls</Heading>
      <AlgoliaPlaces
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
        }}
        onError={({ message }) => {
          console.error(message)
        }}
        onLocate={async () => {
          try {
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
            console.log(loc)
            setLoc(loc)
            mapRef.current.flyTo(loc.latlng, mapRef.current.getZoom())
          } catch (err) {
            console.error(`Geolocate Failed: ${err}`)
          }
        }}
      ></AlgoliaPlaces>
    </Stack>
  )
}

const Map = ({ center, zoom, setMap, children }) => {
  return (
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
          circle
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
  const [map, _setMap] = useState(null)
  const [loc, _setLoc] = useState(null)

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

  // useMapEvents({
  //   locationfound(e) {
  //     e.accuracy
  //   }
  // })

  return (
    <Stack direction="row" width="100%" height="lg" spacing={4}>
      <MapControls mapRef={mapRef} locRef={locRef} setLoc={setLoc} />
      {typeof window !== "undefined" ? (
        <Map center={[43.5598, -79.7164]} zoom={13} setMap={setMap}>
          <CurrentLocationMarker locRef={locRef} />
          <Marker position={[43.5598, -79.7164]}>
            <Popup>A test location</Popup>
          </Marker>
        </Map>
      ) : null}
    </Stack>
  )
}
