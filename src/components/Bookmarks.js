import React, { useState, useEffect } from "react"
import { MdBookmark, MdBookmarkBorder } from "react-icons/md"
import { BookmarksContext } from "../BookmarksContext"
import { useContext } from "react"
export default function Bookmarks({
  id,
  checked,
  className = "w-5 h-5 cursor-pointer",
  ...rest
}) {
  const context = useContext(BookmarksContext)
  const [init, setInit] = useState(false)
  useEffect(() => {
    setInit(true)
  }, [])

  return init ? (
    <>
      {context && context.data.indexOf(id) !== -1 ? (
        <MdBookmark
          onClick={() => {
            context.remove(id)
          }}
          {...rest}
          className={className}
        />
        
      ) : (
        <MdBookmarkBorder
          onClick={() => {
            context.add(id)
          }}
          {...rest}
          className={className}
        />
      )}
    </>
  ) : null
}
