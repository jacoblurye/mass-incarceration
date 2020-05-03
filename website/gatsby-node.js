/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const fs = require("fs")
const papa = require("papaparse")

exports.onCreateNode = ({ node, actions }) => {
  if (node.internal.type === "File" && node.ext === ".csv") {
    console.log(`creating csvData node field for ${node.relativePath}`)
    const csvStream = fs.createReadStream(node.absolutePath)
    return new Promise((resolve, reject) => {
      papa.parse(csvStream, {
        header: true,
        dynamicTyping: true,
        complete: ({ data }) => {
          actions.createNodeField({
            node,
            name: "csvData",
            value: data,
          })
          resolve()
        },
        error: reject,
      })
    })
  }
}
