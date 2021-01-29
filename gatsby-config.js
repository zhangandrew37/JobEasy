module.exports = {
  siteMetadata: {
    title: `JobEasy`,
    description: `A simple job finder for recent immigrants to Canada`,
    author: `@jhthenerd`,
  },
  plugins: [
    {
      resolve: `@chakra-ui/gatsby-plugin`,
      options: {
        portalZIndex: 99999,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-react-svg`,
      options: {
        rule: {
          include: /images/,
        },
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyAcvYhDWjdm37gHG5JZZRnw1E1mXwowJUA",
          authDomain: "ics4u0-project.firebaseapp.com",
          projectId: "ics4u0-project",
          storageBucket: "ics4u0-project.appspot.com",
          messagingSenderId: "673612403722",
          appId: "1:673612403722:web:a64815ec5c08a2655c7bf3",
        },
      },
    },
    {
      resolve: `gatsby-plugin-react-leaflet`,
      options: {
        linkStyles: true,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
