// You can delete this file if you're not using it
import "./src/tailwind/global.css"

import React from "react"
import { DataProvider } from "./src/components/FIlterableList"
import BookmarksProvider from "./src/BookmarksContext"

export function wrapRootElement({ element }) {
  return (
    <BookmarksProvider>
      <DataProvider>{element}</DataProvider>
    </BookmarksProvider>
  )
}
