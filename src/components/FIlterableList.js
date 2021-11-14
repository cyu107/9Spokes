import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from "react"

import get from "lodash.get"
import matchSorter from "match-sorter"
import { css } from "@emotion/core"
import tw from "tailwind.macro"
import { MdSearch } from "react-icons/md"
import ArticleCard from "./ArticleCard"
import { navigate, Link, useStaticQuery, graphql } from "gatsby"
import Ad from "./Ad"
import SearchIcon from "./SearchIcon"
import { BookmarksContext } from "../BookmarksContext"

export const FilteringContext = createContext({})

export function List({ ad, allArticles }) {
  const context = useContext(FilteringContext)
  const bookmarked = useContext(BookmarksContext)
  const { articles, activeFilter, term } = context
  return (
    <>
      <section className="my-12" id="filtered-articles">
        <div className="container">
          <div className="row  lg:flex-no-wrap">
            <div
              className="col w-full  space-y-6"
              css={css`
                max-width: 850px;
              `}
            >
              {term && term.trim() !== "" ? (
                <>
                  {articles &&
                    matchSorter(articles, term, {
                      keys: ["title", "subtitle", "excerpt.excerpt"],
                    }).map((article, i) => {
                      return (
                        <ArticleCard
                          slug={article.slug}
                          key={i}
                          subtitle={article.subtitle}
                          image={article.featuredImage}
                          title={article.title}
                          id={article.contentful_id}
                          timeToRead={article.timeToRead}
                          date={article.published}
                          description={get(article, "excerpt.excerpt")}
                        />
                      )
                    })}
                  {articles &&
                    matchSorter(articles, term, {
                      keys: ["title", "subtitle", "excerpt.excerpt"],
                    }).length === 0 && (
                      <div className="prose prose-lg">
                        <p>No articles match searched term.</p>
                      </div>
                    )}
                </>
              ) : (
                (() => {
                  switch (activeFilter) {
                    case "Home":
                      return (
                        <>
                          {" "}
                          {articles &&
                            articles.slice(0, 4).map((article, i) => {
                              return (
                                <ArticleCard
                                  slug={article.slug}
                                  key={i}
                                  subtitle={article.subtitle}
                                  image={article.featuredImage}
                                  title={article.title}
                                  id={article.contentful_id}
                                  timeToRead={article.timeToRead}
                                  date={article.published}
                                  description={get(article, "excerpt.excerpt")}
                                />
                              )
                            })}
                        </>
                      )
                    case "Bookmark":
                      return (
                        <>
                          {bookmarked && bookmarked.data == "" && (
                            <div>No bookmarked articles.</div>
                          )}
                          {bookmarked &&
                            bookmarked.data !== "" &&
                            bookmarked.data
                              .split(",")
                              .filter(Boolean)
                              .map((id) => {
                                const article = allArticles.filter(
                                  (a) => a.contentful_id == id
                                )[0]
                                return article ? (
                                  <ArticleCard
                                    slug={article.slug}
                                    subtitle={article.subtitle}
                                    image={article.featuredImage}
                                    title={article.title}
                                    id={article.contentful_id}
                                    timeToRead={article.timeToRead}
                                    date={article.published}
                                    description={get(
                                      article,
                                      "excerpt.excerpt"
                                    )}
                                  />
                                ) : null
                              })}
                        </>
                      )
                    default:
                      return (
                        <>
                          {" "}
                          {articles &&
                            articles
                              .filter((a) => {
                                return a.category == activeFilter
                              })
                              .map((article, i) => {
                                return (
                                  <ArticleCard
                                    slug={article.slug}
                                    key={i}
                                    subtitle
                                    image={article.featuredImage}
                                    title={article.title}
                                    id={article.contentful_id}
                                    timeToRead={article.timeToRead}
                                    date={article.published}
                                    description={get(
                                      article,
                                      "excerpt.excerpt"
                                    )}
                                  />
                                )
                              })}
                        </>
                      )
                  }
                })()
              )}
            </div>
            <div className="col w-full lg:w-auto ml-auto order-first lg:order-2 ">
              <Ad ad={ad} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function Bar() {
  const {
    articles,
    activeFilter,
    setActiveFilter,
    term,
    setTerm,
    reset,
    searchIsOpen,
    setSearchIsOpen,
  } = useContext(FilteringContext)
  const searchRef = useRef()
  var f = new Set()
  articles &&
    articles.forEach((element) => {
      f.add(element.category)
    })
  useEffect(() => {
    typeof window !== "undefined" &&
      searchIsOpen &&
      searchRef &&
      searchRef.current &&
      searchRef.current.focus()
    return () => {}
  }, [])
  useEffect(() => {
    function handler(e) {}
    if (typeof window !== "undefined") {
      document.addEventListener("click", handler)
    }
    return () => {
      if (typeof window !== "undefined") {
        document.removeEventListener("click", handler)
      }
    }
  }, [])
  var filters = Array.from(f)
  filters = filters.sort()
  return (
    <>
      <div
        id="filter-bar-trigger"
        css={css`
          &.open {
            @media (min-width: 1024px) {
              height: 70px;
            }
          }
        `}
      ></div>
      <div
        id={"filter-bar"}
        className="border-b  "
        css={css`
          transition: all 300ms;
          border-color: transparent;
          z-index: 10;
          ${tw`bg-transparent`}
          /* @lg */
          @media (max-width: 1023px) {
            border-color: #ebebeb;
            top: 57px;
            ${tw`fixed w-full bg-white border-b`}
            overflow-x: scroll;
            li {
              white-space: nowrap;
            }
          }
          @media (min-width: 1024px) {
            &.stick {
              border-color: #ebebeb;
              ${tw`bg-white w-full shadow
             fixed `}

              top: 92px;
              & > div {
                border-color: transparent;
              }
            }
          }
        `}
      >
        <div
          className="container  border-b pt-2 lg:pt-6  pb-2 lg:pb-4 flex items-center justify-between"
          css={css`
            @media (min-width: 1024px) {
              border-color: #ebebeb;
            }
          `}
        >
          {!searchIsOpen && (
            <ul
              className="flex"
              css={css`
                li {
                  ${tw`text-gray-100 text-lg mr-6 cursor-pointer`}
                  &.active {
                    ${tw`font-bold text-gray-900   `}
                    border-bottom: 2px solid #00bf99;
                  }
                }
              `}
            >
              {["Home", ...filters, "Bookmark"].map((filter, i) => (
                <li
                  className={filter == activeFilter ? "active" : ""}
                  onClick={(e) => {
                    setActiveFilter(filter)

                    if (window.location.pathname === "/") {
                      const el = document.getElementById("filtered-articles")
                      el &&
                        window.scrollTo({
                          top: el.offsetTop - 190,
                          behavior: "smooth",
                        })
                    }
                  }}
                  key={i}
                >
                  {filter}
                </li>
              ))}
            </ul>
          )}
          {searchIsOpen && (
            <div>
              <input
                ref={searchRef}
                type="text"
                value={term}
                onChange={(e) => {
                  setTerm(e.target.value)
                }}
                className="bg-transparent focus:outline-none"
                placeholder="Search articles"
              />
            </div>
          )}

          <SearchIcon
            className="w-5 h-5 text-gray-100 cursor-pointer hidden lg:block"
            additioanalAction={() => {
              typeof window !== "undefined" &&
                window.setTimeout(() => {
                  searchRef && searchRef.current && searchRef.current.focus()
                }, 100)
            }}
          />
        </div>
      </div>
    </>
  )
}

export function DataProvider({ children }) {
  const [init, setInit] = useState(false)
  const [activeFilter, setActiveFilter] = useState("Home")
  const [term, setTerm] = useState("")
  const [searchIsOpen, setSearchIsOpen] = useState(false)

  useEffect(() => {
    if (
      init &&
      term.trim() !== "" &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/"
    ) {
      navigate("/")
    }
    setInit(true)
  }, [term])
  useEffect(() => {
    if (init && typeof window !== "undefined") {
      window.location.pathname !== "/" && navigate(`/?category=${activeFilter}`)
    }

    setInit(true)
  }, [activeFilter])
  const {
    page: { articles },
  } = useStaticQuery(graphql`
    {
      page: contentfulHomepage {
        articles {
          ...ArticleCard
        }
      }
    }
  `)
  function reset() {
    setTerm("")
    setSearchIsOpen(false)
  }

  return (
    <FilteringContext.Provider
      value={{
        articles,
        activeFilter,
        setActiveFilter,
        term,
        setTerm,
        searchIsOpen,
        setSearchIsOpen,
        reset,
      }}
    >
      {children}
    </FilteringContext.Provider>
  )
}
