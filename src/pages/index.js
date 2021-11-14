import React, { useState, useEffect, useContext } from "react"
import Layout from "../components/Layout"
import { graphql } from "gatsby"

import get from "lodash.get"
import has from "lodash.has"
import ArticleCard from "../components/ArticleCard"
import { css } from "@emotion/core"
import qs from "query-string"
import tw from "tailwind.macro"
import { Bar, List, FilteringContext } from "../components/FIlterableList"
import Ad from "../components/Ad"
const IndexPage = (props) => {
  const { data, location } = props
  const { term } = useContext(FilteringContext)
  const [allArticles, setAllArticles] = useState([])

  useEffect(() => {
    const art = [
      get(data, "page.featuredArticle", null),
      ...get(data, "page.heroArticles", []),
      ...get(data, "page.articles", []),
      ...get(data, "page.thirdArticlesSection", []),
      ...get(data, "page.fourthArticlesSection", []),
    ].filter(Boolean)
    setAllArticles(art)
    const category = get(qs.parseUrl(location.href).query, "category")
    if (typeof window !== "undefined" && (category || term.trim() !== "")) {
      const el = document.getElementById("filtered-articles")
      el && window.scrollTo({ top: el.offsetTop - 190, behavior: "smooth" })
    }
  }, [])

  return (
    <Layout>
      <pre>{JSON.st}</pre>
      {/* SECTION 1 */}
      <section className="py-10">
        <div className="container">
          <div className="row space-y-6 lg:space-y-0">
            <div className="col w-full lg:w-7/12 ">
              {has(data, "page.featuredArticle") && (
                <ArticleCard
                  slug={get(data, "page.featuredArticle.slug")}
                  id={get(data, "page.featuredArticle.contentful_id")}
                  featured
                  image={get(data, "page.featuredArticle.featuredImage")}
                  title={get(data, "page.featuredArticle.title")}
                  subtitle={get(data, "page.featuredArticle.subtitle")}
                  date={get(data, "page.featuredArticle.published")}
                  timeToRead={get(data, "page.featuredArticle.timeToRead")}
                  description={get(
                    data,
                    "page.featuredArticle.excerpt.excerpt"
                  )}
                />
              )}
            </div>

            <div className="col w-full lg:w-5/12 space-y-5">
              <h2 className="mt-0 font-bold text-2xl leading-none">
                {get(data, "page.heroSectionTitle")}
              </h2>
              {has(data, "page.heroArticles") &&
                get(data, "page.heroArticles").map((article, i) => {
                  return (
                    <ArticleCard
                      slug={article.slug}
                      key={i}
                      thumb
                      id={article.contentful_id}
                      image={article.featuredImage}
                      title={article.title}
                      date={article.published}
                      timeToRead={article.timeToRead}
                      description={get(article, "excerpt.excerpt")}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </section>
      {/* SECTION 2 */}
      <Bar />
      <List allArticles={allArticles} ad={get(data, "page.adSpaceSidebar")} />
      {/* SECTION 3 */}
      <section className="py-8 bg-white border-t border-b border-gray-100">
        <div className="container">
          <div className="row items-stretch space-y-5 lg:space-y-0">
            {" "}
            {has(data, "page.thirdArticlesSection") &&
              get(data, "page.thirdArticlesSection").map((article, i) => {
                return (
                  <div
                    className="col w-full lg:w-1/4 border-r  "
                    key={i}
                    css={css`
                      border-color: #e9e9e9;
                      &:last-of-type {
                        border: none;
                      }
                      > div {
                        height: 100%;
                      }
                    `}
                  >
                    {" "}
                    <ArticleCard
                      slug={article.slug}
                      id={article.contentful_id}
                      date={article.published}
                      timeToRead={article.timeToRead}
                      stackedLayout
                      image={article.featuredImage}
                      title={article.title}
                    />
                  </div>
                )
              })}
          </div>
        </div>
      </section>
      <div className="my-12">
        <Ad ad={get(data, "page.adSpaceContent")} />
      </div>
      {/* SECTION 4 */}
      <section>
        <div className="container my-16">
          <div className="row">
            {has(data, "page.fourthArticlesSection") &&
              get(data, "page.fourthArticlesSection")
                .slice(0, 2)
                .map((article, i) => {
                  return (
                    <div
                      className="col w-full lg:w-1/3 border-r border-gray-200 "
                      key={i}
                      css={css`
                        > div {
                          height: 100%;
                        }
                      `}
                    >
                      {" "}
                      <ArticleCard
                        slug={article.slug}
                        stackedLayout
                        id={article.contentful_id}
                        image={article.featuredImage}
                        title={article.title}
                        timeToRead={article.timeToRead}
                        date={article.published}
                        description={get(article, "excerpt.excerpt")}
                      />
                    </div>
                  )
                })}
            <div
              className="col w-full lg:w-1/3"
              css={css`
                > div + div {
                  ${tw`pt-4 pb-0 border-t border-gray-200`}
                }
              `}
            >
              {has(data, "page.fourthArticlesSection") &&
                get(data, "page.fourthArticlesSection")
                  .slice(2, 4)
                  .map((article, i) => {
                    return (
                      <div
                        className="  w-full pb-4"
                        key={i}
                        css={css`
                          > div {
                            height: 100%;
                          }
                        `}
                      >
                        <ArticleCard
                          slug={article.slug}
                          flipped
                          thumb
                          id={article.contentful_id}
                          image={article.featuredImage}
                          title={article.title}
                          timeToRead={article.timeToRead}
                          date={article.published}
                          description={get(article, "excerpt.excerpt")}
                        />
                      </div>
                    )
                  })}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  fragment ArticleCard on ContentfulArticle {
    slug
    subtitle
    timeToRead
    contentful_id
    published(formatString: "MMMM DD")
    title
    tags
    category
    excerpt {
      excerpt
    }
    featuredImage {
      fluid(maxWidth: 900, maxHeight: 500, quality: 90) {
        ...GatsbyContentfulFluid_withWebp
      }
    }
  }
  fragment Ad on ContentfulAd {
    link
    mobileImage {
      file {
        url
      }
    }
    desktopImage {
      file {
        url
      }
    }
    showAdOnMobile
    showAdOnDesktop
  }

  {
    page: contentfulHomepage {
      heroSectionTitle
      featuredArticle {
        ...ArticleCard
      }
      heroArticles {
        ...ArticleCard
      }
      articles {
        ...ArticleCard
      }
      thirdArticlesSection {
        ...ArticleCard
      }
      fourthArticlesSection {
        ...ArticleCard
      }
      adSpaceContent {
        ...Ad
      }
      adSpaceSidebar: adSpaceSIdebar {
        ...Ad
      }
    }
  }
`
