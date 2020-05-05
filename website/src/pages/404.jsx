import React from "react";
import { navigate } from "gatsby";

const NotFoundPage = () => {
  if (typeof window !== "undefined") {
    navigate("/");
  }

  return null;
};

export default NotFoundPage;
