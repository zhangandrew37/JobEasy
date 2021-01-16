import React from "react"

const Button = ({ link, text }) => (
  <button
    style={{
      backgroundColor: "#4895EF",
      color: "white",
      padding: "14px",
      borderRadius: "10px",
      fontSize: "16px",
      outline: "none",
      boxShadow: "0px 4px 4px rgba(72, 149, 239, 0.25)",
      fontWeight: "500",
    }}
  >
    {text}
  </button>
)

export default Button
