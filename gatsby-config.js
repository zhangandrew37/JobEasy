module.exports = {
  siteMetadata: {
    title: `JobEasy`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
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
<<<<<<< HEAD
          include: /images/
        }
      } 
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
          appId: "1:673612403722:web:a64815ec5c08a2655c7bf3"
        }
      }
    }
=======
          include: /images/,
        },
      },
    },
    {
      resolve: `gatsby-plugin-react-leaflet`,
      options: {
        linkStyles: true,
      },
    },
>>>>>>> e00d628ebb40af01157c142dab106e914a5e0b02
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
