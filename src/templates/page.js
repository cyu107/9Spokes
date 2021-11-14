import React, { useEffect } from "react"
import Layout from "../components/Layout"
import { graphql } from "gatsby"
import { css } from "@emotion/core"
import tw from "tailwind.macro"
import BackgroundImage from "gatsby-background-image"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import Ad from "../components/Ad"
import { MdShare, MdBookmarkBorder } from "react-icons/md"
import get from "lodash.get"
import has from "lodash.has"
import ArticleCard from "../components/ArticleCard"
import { Bar } from "../components/FIlterableList"
import Share from "../components/Share"
import Bookmarks from "../components/Bookmarks"
export default function Page({
  data: { page, relatedByTags, relatedByCategory },
}) {
  const related = [
    ...get(relatedByCategory, "nodes", []),
    ...get(relatedByTags, "nodes", []),
  ].slice(0, 2)

  const options = {
    renderNode: {
      [INLINES.ASSET_HYPERLINK]: (node) => {
        const url = get(node, 'data.target.fields.file["en-US"].url')
        const title = get(node, 'data.target.fields.title["en-US"]')
        const value = get(node, "content[0].value")

        return (
          <>
            <figure
              className={`w-full lg:max-w-sm lg:float-${
                value && value.slice(1, -1)
              } ${value && value.slice(1, -1)}`}
            >
              <img src={url} alt={title} />
              <figcaption className="text-sm">{title}</figcaption>
            </figure>
          </>
        )
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node) => {
        const EntryType = get(node, "data.target.sys.contentType.sys.id")
        switch (EntryType) {
          case "ad":
            const fields = get(node, "data.target.fields")
            const adData = {
              link: get(fields, 'link["en-US"]'),
              showAdOnDesktop: get(fields, 'showAdOnDesktop["en-US"]'),
              showAdOnMobile: get(fields, 'showAdOnMobile["en-US"]'),
              desktopImage: {
                file: {
                  url: get(
                    fields,
                    'desktopImage["en-US"].fields.file["en-US"].url'
                  ),
                },
              },
              mobileImage: {
                file: {
                  url: get(
                    fields,
                    'mobileImage["en-US"].fields.file["en-US"].url'
                  ),
                },
              },
            }
            return (
              <div>
                <Ad ad={adData} />
              </div>
            )

          default:
            return null
        }
      },
    },
  }
  useEffect(() => {
    // If there's no window there's nothing to do for us
    if (!window) {
      return
    }
    const document = window.document
    // In case our #commento container exists we can add our commento script
    if (document.getElementById("commento")) {
      insertScript(
        `https://cdn.commento.io/js/commento.js`,
        `commento-script`,
        document.body
      )
    }
    // Cleanup; remove the script from the page
    return () => removeScript(`commento-script`, document.body)
  }, [])

  return (
    <Layout single>
      <Bar />
      <div className=" container px-0 lg:px-4 mt-0">
        {" "}
        <BackgroundImage fluid={get(page, "featuredImage.fluid", [])}>
          <div style={{ height: "30vw", minHeight: "200px" }} />
        </BackgroundImage>
      </div>
      <div className="container pt-6 pb-20">
        <div className="row">
          <div className="col lg:w-3/4">
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold mb-1 leading-none">
                {page.title}
              </h1>

              <h5 className={`font-semibold text-lg text-gray-100 mt-0 mb-4`}>
                {page.subtitle}{" "}
                <span className="font-normal block lg:inline">
                  <span className="hidden lg:inline-block mr-1">-</span>
                  {page.published} . {page.timeToRead} Min Read
                </span>
              </h5>
              <div
                className="prose prose-xl max-w-none"
                css={css`
                  p:first-of-type {
                    ${tw`text-2xl `}
                  }
                  p {
                    ${tw`clearfix`}
                  }
                  figure {
                    ${tw`my-0`}
                    &.left {
                      ${tw`lg:mr-4`}
                    }
                    &.right {
                      ${tw`lg:ml-4`}
                    }
                    figcaption {
                      ${tw`text-sm font-medium mb-1`}
                      color: #686f73;
                    }
                  }
                `}
              >
                {documentToReactComponents(get(page, "content.json"), options)}
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between  mt-16 border-b border-gray-200  mb-8 space-y-8 lg:space-y-0">
                <div
                  className="lg:space-x-3"
                  css={css`
                    .tag {
                      border-radius: 3px;
                      border: 1px solid #979797;
                      background-color: #f3f3f3;
                      ${tw`py-2 px-4 font-medium text-lg inline-block mb-4 mr-4 lg:mr-0`}
                    }
                  `}
                >
                  {page.tags &&
                    page.tags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                </div>
                <div
                  className="flex"
                  css={css`
                    svg {
                      color: #7b8184;
                    }
                  `}
                >
                  <Bookmarks id={page.contentful_id} />
                  <Share />
                </div>
              </div>
              <div id="commento"></div>
            </div>
          </div>
          <div className="col lg:w-1/4 lg:border-l border-gray-500 space-y-5 mt-8 lg:mt-0">
            <h3 className="font-bold text-2xl">Related Stories</h3>
            {related &&
              related.map((item, i) => {
                return (
                  <ArticleCard
                    stackedLayout
                    title={item.title}
                    timeToRead={item.timeToRead}
                    date={item.published}
                    slug={item.slug}
                    description={get(item, "excerpt.excerpt")}
                    image={item.featuredImage}
                    key={i}
                  />
                )
              })}
            {get(page, "sidebarAd", null) && (
              <div className="lg:pt-20">
                <Ad ad={get(page, "sidebarAd", null)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
export const query = graphql`
  query($CID: String, $tags: [String], $category: String) {
    page: contentfulArticle(contentful_id: { eq: $CID }) {
      content {
        json
      }
      contentful_id
      title
      timeToRead
      subtitle
      published(formatString: "MMMM DD")
      tags
      category
      featuredImage {
        fluid(quality: 90, maxWidth: 1920) {
          ...GatsbyContentfulFluid_withWebp
        }
      }
      tags
      sidebarAd {
        ...Ad
      }
    }
    relatedByTags: allContentfulArticle(
      filter: { tags: { in: $tags }, contentful_id: { ne: $CID } }
      limit: 2
    ) {
      nodes {
        ...ArticleCard
      }
    }
    relatedByCategory: allContentfulArticle(
      filter: { category: { eq: $category }, contentful_id: { ne: $CID } }
      limit: 2
    ) {
      nodes {
        ...ArticleCard
      }
    }
  }
`
// Helper to add scripts to our page
const insertScript = (src, id, parentElement) => {
  const script = window.document.createElement("script")
  script.async = true
  script.src = src
  script.id = id
  parentElement.appendChild(script)
  return script
}
// Helper to remove scripts from our page
const removeScript = (id, parentElement) => {
  const script = window.document.getElementById(id)
  if (script) {
    parentElement.removeChild(script)
  }
}
