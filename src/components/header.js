import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Button from "./Button"

const Header = ({ siteTitle }) => (
  <header
    style={{
      backgroundColor: "white",
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0, fontWeight: "700", fontSize: "32px" }}>
        <Link
          to="/"
          style={{
            color: `#4895EF`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          minWidth: "200px",
        }}
      >
        <h1 style={{ fontWeight: "500" }}>Home</h1>
        <h1 style={{ fontWeight: "500" }}>About</h1>
      </div>
      <Link to="/page-2/">
        <Button text="Contact Us" />
      </Link>{" "}
      <br />
    </div>
  </header>
)
Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
