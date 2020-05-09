import React from "react";
import { Link } from "rebass";

const OutgoingLink = ({ href, text }) => {
  return (
    <Link
      target="_blank"
      rel="noreferrer noopener"
      sx={{
        color: "primary",
        textDecoration: "none",
        "&:hover": { textDecoration: "underline" },
      }}
      href={href}
    >
      {text}
    </Link>
  );
};

export default OutgoingLink;
