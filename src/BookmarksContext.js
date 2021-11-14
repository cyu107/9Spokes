import React, { useState, useEffect } from "react"
import { setCookie, getCookie } from "react-use-cookie"

export const BookmarksContext = React.createContext(null)

export default function BookmarksProvider({ children }) {
  const bookmarked = getCookie("bookmarked")
  const [data, setData] = useState(bookmarked || "")
  useEffect(() => {
    setCookie("bookmarked", data, {
      days: 4000,
    })
  }, [data])
  function remove(id) {
    const idReg = new RegExp(`${id}(,)?`, "g")
    setData(data.replace(idReg, ""))
  }
  function add(id) {
    setData(id + "," + data)
  }

  return (
    <BookmarksContext.Provider value={{ data, add, remove }}>
      {children}
    </BookmarksContext.Provider>
  )
}
