import React from 'react'
import {Link} from "react-router-dom"

export default function TablePagination({currentPage,setCurrentPage,startPage,endPage,numberOfPages}) {
  return (
    <div className="pagination">
          {/* Previous Page Button */}
          {currentPage > 1 && (
            <Link
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`page_buttons`}
            >
              &laquo;
            </Link>
          )}

          {/* Page Buttons */}
          {numberOfPages.slice(startPage - 1, endPage).map((eachPage) => (
            <Link
              onClick={(e) => {
                e.preventDefault()
                setCurrentPage(eachPage)
                window.scrollTo(0,430)
              }}
              className={`page_buttons ${currentPage === eachPage ? 'active' : null} `}
              key={eachPage}
            >
              {eachPage}
            </Link>
          ))}

          {/* Next Page Button */}
          {currentPage < numberOfPages.length && (
            <Link
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`page_buttons`}
            >
              &raquo;
            </Link>
          )}
        </div>
  )
}
