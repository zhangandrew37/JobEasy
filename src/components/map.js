import React from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Helmet } from "react-helmet"
import { Box } from "@chakra-ui/react"

const Map = ({ location }) => {
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
        center={[location.coords.latitude, location.coords.longitude]}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </Box>
    </>
  )
}

export default Map
