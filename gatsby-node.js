/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path')

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allMdx {
              edges {
                node {
                  id
                  frontmatter {
                    name
                    menu
                    title
                  }
                  parent {
                    ... on File {
                      name
                      sourceInstanceName
                    }
                  }
                  code {
                    scope
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        result.data.allMdx.edges.filter(edge => edge.node.frontmatter.name)
        .forEach(async ({ node }) => {
          createPage({
            path: `/${node.frontmatter.menu.toLowerCase()}/${node.parent.name.toLowerCase()}`,
            component: path.resolve('./src/layouts/module-components.js'),
            context: {
              id: node.id,
              name: node.frontmatter.name,
            },
          })
        })
      })
    )
  })
}
