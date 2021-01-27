import React, { useRef, useState, useCallback, useEffect } from "react"
import { divIcon } from "leaflet"
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet"
import { Box, Stack } from "@chakra-ui/react"
import ReactDOMServer from "react-dom/server"

import MapControls from "./mapControls"

const CurrentLocationMarker = ({ loc }) => {
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
  return loc ? (
    <>
      <Circle center={loc.latlng} radius={loc.accuracy} />
      <Marker position={loc.latlng} icon={locationDot}>
        <Popup>You are here</Popup>
      </Marker>
    </>
  ) : null
}

/**
 * A component displaying a map and controls
 * @param {{qualifications: {Qualification.}}} param0 An object with the required qualifications
 */
const MapComponent = ({ qualifications }) => {
  const [map, setMap] = useState(null)
  const [loc, setLoc] = useState(null)
  const [radius, setRadius] = useState(10)
  const [jobs, setJobs] = useState()
  const [markers, setMarkers] = useState([])

  const handleLocChange = newLoc => {
    setLoc(newLoc)
  }

  const handleJobsChange = useCallback(newJobs => {
    setJobs(newJobs)
  }, [])

  useEffect(() => {
    const tmpMarkers = []
    if (jobs) {
      Object.keys(jobs).forEach(key => {
        jobs[key].listings.forEach(item => {
          tmpMarkers.push(
            <Marker
              position={[
                item.data.coordinates._latitude,
                item.data.coordinates._longitude,
              ]}
              riseOnHover
            >
              <Popup>
                <b>
                  {item.data.name} - {item.data.company}
                </b>
              </Popup>
            </Marker>
          )
        })
      })
    }
    setMarkers(tmpMarkers)
  }, [jobs])

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      width="100%"
      height="700px"
      spacing={4}
    >
      <MapControls
        map={map}
        loc={loc}
        handleLocChange={handleLocChange}
        radius={radius}
        setRadius={setRadius}
        qualifications={qualifications}
        handleJobsChange={handleJobsChange}
      />
      {typeof window !== "undefined" ? (
        <Box
          as={MapContainer}
          w="100%"
          h="100%"
          center={[43.5598, -79.7164]}
          zoom={11}
          whenCreated={setMap}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CurrentLocationMarker loc={loc} />
          {loc ? (
            <Circle
              center={loc.latlng}
              radius={radius * 1000}
              color="#777777"
            />
          ) : null}
          {markers}
        </Box>
      ) : null}
    </Stack>
  )
}

export default MapComponent
