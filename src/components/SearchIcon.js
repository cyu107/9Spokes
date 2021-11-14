import React from "react"
import { useContext } from "react"
import { FilteringContext } from "./FIlterableList"
import { MdSearch, MdClose } from "react-icons/md"

export default function SearchIcon({
  additionalAction,
  className = "w-5 h-5",
}) {
  const { searchIsOpen, setSearchIsOpen } = useContext(FilteringContext)
  return (
    <>
      {!searchIsOpen && (
        <MdSearch
          onClick={() => {
            setSearchIsOpen(true)
            additionalAction && additionalAction()
          }}
          className={className}
        />
      )}
      {searchIsOpen && (
        <MdClose
          onClick={() => {
            setSearchIsOpen(false)
          }}
          className={className}
        />
      )}
    </>
  )
}
