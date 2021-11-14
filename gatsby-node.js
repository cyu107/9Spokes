const path = require(`path`)
const has = require("lodash.has")
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const template = path.resolve("./src/templates/page.js")
  const { data } = await graphql(
    `
      {
        allContentfulArticle {
          nodes {
            contentful_id
            slug
            category
            tags
          }
        }
      }
    `
  )
  has(data, "allContentfulArticle.nodes") &&
    data.allContentfulArticle.nodes.forEach((node) => {
      createPage({
        path: node.slug,
        component: template,
        context: {
          CID: node.contentful_id,
          tags: node.tags,
          category: node.category,
        },
      })
    })
}
