import { createMedia } from "@artsy/fresnel";

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1600,
};

const AppMedia = createMedia({ breakpoints });

export const mediaStyles = AppMedia.createMediaStyle();

export const { Media, MediaContextProvider } = AppMedia;
