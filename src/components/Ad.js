import React from "react"
import get from "lodash.get"

export default function Ad({ ad }) {
  return !ad ? null : (
    <div className="container flex justify-center">
      {ad.showAdOnDesktop && (
        <div className="hidden lg:block">
          <a href={get(ad, "link")} target="_blank">
            <img src={get(ad, "desktopImage.file.url")} />
          </a>
        </div>
      )}
      {ad.showAdOnMobile && (
        <div className="lg:hidden">
          <a href={get(ad, "link")} target="_blank">
            <img src={get(ad, "mobileImage.file.url")} />
          </a>
        </div>
      )}
    </div>
  )
}
