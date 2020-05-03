import { createMedia } from "@artsy/fresnel";

export const breakpoints = {
  xs: 0,
  sm: 768,
  md: 1000,
  lg: 1200,
  xl: 1400,
};

const AppMedia = createMedia({ breakpoints });

export const mediaStyles = AppMedia.createMediaStyle();

export const { Media, MediaContextProvider } = AppMedia;
