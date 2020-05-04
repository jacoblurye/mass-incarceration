module.exports = {
  siteMetadata: {
    title: `Mass. Incarceration`,
    description: `Monitoring Massachusetts' progress towards reducing its incarcerated population.`,
    author: `Jacob Lurye`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-theme-ui`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/../data`,
        ignore: [`**/\.*`], // ignore files starting with a dot
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `MA Incarceration`,
        short_name: `MA Incarceration`,
        start_url: `/`,
        background_color: `#000`,
        display: `minimal-ui`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
