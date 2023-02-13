import { useState } from 'react'

export default function Pagination(props)  {
  const pageNumbers = [...Array(props.nPages + 1).keys()].slice(1)

  const nextPage = () => {
    if(currentPage !== nPages)
    setCurrentPage(currentPage + 1)
  }
  const prevPage = () => {
    if(currentPage !== 1)
    setCurrentPage(currentPage - 1)
  }

  return (
    <>
      <div id="pagination-prev" className="prev-next">
        <a href="#" onClick={prevPage} >Previous</a>
      </div>
      <div>
        {pageNumbers.map(page =>{
          return(
            <div>{page}</div>
          )
        })
        }
      </div>
      <div id="pagination-next" className="prev-next">
        <a href="#" onClick={nextPage} >Next</a>
      </div>
    </>
  )
}
