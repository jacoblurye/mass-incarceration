import React from "react";
import Theme from "./Theme";
import { MediaContextProvider } from "./Media";

export const Boot = ({ element }) => {
  return (
    <MediaContextProvider>
      <Theme element={element} />
    </MediaContextProvider>
  );
};
