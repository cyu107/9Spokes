import React, { useState, useEffect, useContext } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import get from "lodash.get"
import IconPerson from "../images/icon-person.svg"
import IconArrowDown from "../images/icon-arrow-down.svg"
import IconBars from "../images/icon-bars.svg"
import { css } from "@emotion/core"
import tw from "tailwind.macro"
import { MdSearch, MdMenu } from "react-icons/md"
import { FilteringContext } from "./FIlterableList"
import SearchIcon from "./SearchIcon"
export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const FilterBarTrigger = document.getElementById("filter-bar-trigger")
      const FilterBar = document.getElementById("filter-bar")
      if (!FilterBar || !FilterBarTrigger) {
        return
      }
      const observer = new IntersectionObserver(stickTheBar, {
        rootMargin: "-92px 0px 0px 0px",
        threshold: 1,
      })
      observer.observe(FilterBarTrigger)
      function stickTheBar(e) {
        if (!e[0].isIntersecting) {
          FilterBar.classList.add("stick")
          FilterBarTrigger.classList.add("open")
        } else {
          FilterBar.classList.remove("stick")
          FilterBarTrigger.classList.remove("open")
        }
      }
    }

    return () => {}
  }, [])

  const { setSearchIsOpen } = useContext(FilteringContext)

  useEffect(() => {
    function handler(e) {
      if (!e.target.closest(".share-element")) {
        var el = document.querySelectorAll(".share-button.open")
        el &&
          el.forEach((e) => {
            e.classList.remove("open")
          })
      }
    }
    if (typeof window !== "undefined") {
      document.addEventListener("click", handler)
    }

    return () =>
      typeof window !== "undefined" &&
      document.removeEventListener("click", handler)
  }, [])
  const data = useStaticQuery(graphql`
    {
      main: contentfulHomepage {
        logo {
          title
          file {
            url
          }
        }
        navigation {
          label
          url
          openInNewTab
        }
        navigationSecondary {
          label
          url
          openInNewTab
          buttonStyles
        }
        footerLinks {
          label
          url
          openInNewTab
        }
        footerLegalText {
          footerLegalText
        }
      }
    }
  `)
  return (
    <>
      {" "}
      <div className="border-b border-gray-100 bg-white  lg:pt-10 pt-3 pb-3 z-30  w-full fixed top-0">
        <div className="container">
          <div className="flex items-center lg:items-end justify-between">
            <Link to="/">
              <img
                css={css`
                  /* @lg */
                  @media (max-width: 1023px) {
                    width: 100px;
                  }
                `}
                alt={get(data, "main.logo.file.title")}
                src={get(data, "main.logo.file.url")}
              />
            </Link>
            <nav className="hidden  lg:block">
              {get(data, "main.navigation", []).map((item, i) => {
                return (
                  <React.Fragment key={i}>
                    {item.url.startsWith("/") ? (
                      <Link
                        activeClassName={"active"}
                        partiallyActive={true}
                        css={LinkCSS}
                        to={item.url}
                      >
                        {item.label}{" "}
                      </Link>
                    ) : (
                      <a
                        css={LinkCSS}
                        href={item.url}
                        target={item.openInNewTab ? "_blank" : "_self"}
                      >
                        {item.label}
                      </a>
                    )}
                  </React.Fragment>
                )
              })}
            </nav>
            <div className="hidden lg:block w-40" />
            {/* MOBILE NAVIGATION CONTROLS */}
            <div className="flex lg:hidden items-center">
              {get(data, "main.navigationSecondary", []).map((item, i) => {
                return (
                  <React.Fragment key={i}>
                    {item.url.startsWith("/") ? (
                      <Link
                        activeClassName={"active"}
                        partiallyActive={true}
                        css={item.buttonStyles ? ButtonCSS : LinkCSS}
                        to={item.url}
                      >
                        {item.label}{" "}
                      </Link>
                    ) : (
                      <a
                        css={item.buttonStyles ? ButtonCSS : LinkCSS}
                        href={item.url}
                        target={item.openInNewTab ? "_blank" : "_self"}
                      >
                        {item.label}
                      </a>
                    )}
                  </React.Fragment>
                )
              })}
              <SearchIcon />
              <MdMenu
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen)
                }}
                className="ml-4 w-5 h-5"
              />
            </div>
            {/* MOBILE NAVIGATION */}
            <nav
              className="lg:hidden fixed right-0 bg-white border-l border-gray-200 shadow-lg flex flex-col py-20"
              css={css`
                height: 100vh;
                z-index: 50;
                top: 57px;
                > a + a {
                  margin-top: 20px;
                }
                transition: transform 300ms ease-in-out;
                transform: translateX(${isMenuOpen ? "0px" : "100%"});
              `}
            >
              {get(data, "main.navigation", []).map((item, i) => {
                return (
                  <React.Fragment key={i}>
                    {item.url.startsWith("/") ? (
                      <Link
                        activeClassName={"active"}
                        partiallyActive={true}
                        css={LinkCSS}
                        to={item.url}
                        onClick={() => {
                          setIsMenuOpen(false)
                        }}
                      >
                        {item.label}{" "}
                      </Link>
                    ) : (
                      <a
                        css={LinkCSS}
                        href={item.url}
                        target={item.openInNewTab ? "_blank" : "_self"}
                      >
                        {item.label}
                      </a>
                    )}
                  </React.Fragment>
                )
              })}
            </nav>
          </div>
        </div>
        <div
          className="   hidden lg:flex items-center justify-end absolute right-0"
          css={css`
            bottom: 12px;
          `}
        >
          {get(data, "main.navigationSecondary", []).map((item, i) => {
            return (
              <React.Fragment key={i}>
                {item.url.startsWith("/") ? (
                  <Link
                    activeClassName={"active"}
                    partiallyActive={true}
                    css={item.buttonStyles ? ButtonCSS : LinkCSS}
                    to={item.url}
                  >
                    {item.label}{" "}
                  </Link>
                ) : (
                  <a
                    css={item.buttonStyles ? ButtonCSS : LinkCSS}
                    href={item.url}
                    target={item.openInNewTab ? "_blank" : "_self"}
                  >
                    {item.label}
                  </a>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>
      <div
        className="overflow-x-hidden"
        onClick={(e) => {
          if (isMenuOpen) {
            setIsMenuOpen(false)
          }
        }}
        css={css`
          margin-top: 92px;
        `}
      >
        {children}
      </div>
      <footer
        css={css`
          background: #f3f3f3;
        `}
      >
        <div className="container pt-8 pb-8 lg:pb-16">
          <div className="mb-6 text-center lg:text-left space-x-4 lg:space-x-10">
            {get(data, "main.footerLinks", []).map((item, i) => {
              return (
                <React.Fragment key={i}>
                  {item.url.startsWith("/") ? (
                    <Link
                      className="text-sm lg:text-lg font-semibold "
                      to={item.url}
                    >
                      {item.label}{" "}
                    </Link>
                  ) : (
                    <a
                      className="text-sm lg:text-lg font-semibold "
                      href={item.url}
                      target={item.openInNewTab ? "_blank" : "_self"}
                    >
                      {item.label}
                    </a>
                  )}
                </React.Fragment>
              )
            })}
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
            <p
              className="text-xs text-center lg:text-left lg:text-sm"
              css={css`
                max-width: 800px;
              `}
            >
              {get(data, "main.footerLegalText.footerLegalText")}
            </p>
            <img
              css={css`
                width: 130px;
              `}
              alt={get(data, "main.logo.file.title")}
              src={get(data, "main.logo.file.url")}
            />
          </div>
        </div>
      </footer>
    </>
  )
}

const LinkCSS = css`
  ${tw`inline-block mx-5 text-base font-medium text-gray-100`}
  &.active {
    ${tw`text-gray-900 font-semibold lg:border-b border-gray-900 pb-3 -mb-3`}
  }
`

const ButtonCSS = css`
  ${tw`inline-block mx-5 text-base font-bold  rounded-full py-1 lg:py-2 px-4 lg:px-6`}
  background-color: #3ad3a6;
  color: #000;
`
