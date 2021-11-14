import React, { useContext } from "react"
import GatsbyImage from "gatsby-image"
import get from "lodash.get"
import has from "lodash.has"
import { css } from "@emotion/core"
import tw from "tailwind.macro"
import { Link, navigate } from "gatsby"
import Share from "./Share"
import Bookmarks from "./Bookmarks"
import { FilteringContext } from "./FIlterableList"
export default function ArticleCard({
  featured,
  slug,
  flipped,
  date,
  thumb,
  timeToRead,
  title,
  description,
  image,
  id,
  subtitle,
  stackedLayout,
}) {
  const { reset } = useContext(FilteringContext)

  return (
    <div
      css={css`
        @media (min-width: 1024px) {
          ${featured && "max-height: 419px;"}
        }
      `}
      className={`  ${featured ? "h-full" : ""} w-full`}
    >
      <div
        className={`flex flex-col lg:flex-row ${
          stackedLayout ? "lg:flex-col h-full" : ""
        }  ${featured ? "border border-gray-100 bg-white h-full" : ""}`}
      >
        {has(image, "fluid") && (
          <div className={` flex-shrink-0 mb-4 ${!stackedLayout && "lg:mb-0"}`}>
            <GatsbyImage
              css={css`
                ${featured ? tw`border-r` : tw`border`}
                ${tw`border-gray-100`}
              `}
              className={
                featured
                  ? "h-full w-full lg:w-featured  "
                  : `w-full h-full ${
                      !stackedLayout
                        ? thumb
                          ? "lg:w-thumb"
                          : "lg:w-featured"
                        : ""
                    } ${flipped ? "lg:ml-4 h-full" : "lg:mr-4"}`
              }
              fluid={image.fluid}
            />
          </div>
        )}
        <div
          className={`flex flex-col items-stretch justify-between flex-grow ${
            featured ? "px-4 py-6" : ""
          } ${flipped ? "lg:order-first" : ""}`}
        >
          <div>
            <Link
              to={slug}
              onClick={(e) => {
                e.preventDefault()
                reset()
                navigate(slug)
              }}
            >
              <h3
                className={`${
                  featured ? "text-2xl " : flipped ? "text-base" : "text-lg"
                }
           font-bold leading-tight mb-1 mt-0`}
              >
                {title}
              </h3>
            </Link>
            {subtitle && (
              <h5
                className={`font-bold text-sm ${
                  !featured
                    ? "text-gray-100 font-semibold  mb-0 -mt-1"
                    : "mt-2 mb-2"
                }`}
              >
                {subtitle}
              </h5>
            )}
            <p
              className={`text-base opacity-75 mb-0 ${
                featured ? "leading-6" : "leading-tight"
              }`}
            >
              {description}
            </p>
          </div>
          <div
            className={`text-sm font-semibold flex items-center justify-between ${
              description ? " mt-4 " : "mt-0"
            }`}
          >
            <div>
              {" "}
              {date} . {timeToRead} {timeToRead && " Min Read"}
            </div>
            <div className="flex space-x-2">
              <Share
                title={title}
                text={`${title} - ${description}`}
                summary={description}
                className=" w-5 h-5 cursor-pointer"
              />
              <Bookmarks id={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
