import React, { useState, useEffect, useRef } from "react"
import { css } from "@emotion/core"
import { MdShare } from "react-icons/md"
import { FaFacebookSquare, FaLinkedin, FaTwitterSquare } from "react-icons/fa"
export default function Share({
  title = "",
  via = "9Spokes",
  summary = "",
  text = "",
  className,
}) {
  const elRef = useRef()
  return (
    <div
      className="share-element"
      css={css`
        .share-button.open {
          display: none;
        }
        .share-button + div {
          display: none;
        }
        .share-button.open + div {
          display: flex;
        }
      `}
    >
      <div
        ref={elRef}
        className="share-button  "
        onClick={(e) => {
          // CANCEL HANDLER IS IN LAYOUT
          elRef.current.classList.add("open")
        }}
      >
        <MdShare className={className} />
      </div>

      <div className="flex space-x-2">
        {" "}
        <FaFacebookSquare
          css={css`
            color: #3b5998;
          `}
          className={className}
          onClick={() => {
            typeof window !== "undefined" &&
              window.open(
                `https://www.facebook.com/sharer.php${objectToGetParams({
                  u: window.location.href,
                })}`,
                "_blank",
                "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600"
              )
          }}
        />
        <FaLinkedin
          className={className}
          onClick={() => {
            typeof window !== "undefined" &&
              window.open(
                `https://linkedin.com/shareArticle${objectToGetParams({
                  mini: "true",
                  url: window.location.href,
                  title,
                  summary,
                })}`,
                "_blank",
                "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600"
              )
          }}
          css={css`
            color: #0077b5;
          `}
        />
        <FaTwitterSquare
          className={className}
          onClick={() => {
            typeof window !== "undefined" &&
              window.open(
                `https://twitter.com/share${objectToGetParams({
                  url: window.location.href,
                  text,
                  via,
                })}`,
                "_blank",
                "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=400,width=600"
              )
          }}
          style={{ fill: "#38A1F3" }}
        />
      </div>
    </div>
  )
}
function objectToGetParams(object) {
  const params = Object.keys(object).filter((key) => !!object[key])

  if (!params.length) {
    return ""
  }

  return (
    "?" +
    params.map((key) => `${key}=${encodeURIComponent(object[key])}`).join("&")
  )
}
