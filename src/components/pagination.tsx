import { useState } from 'react'

interface Props {
  nPages: number,
  currentPage: number,
  setCurrentPage: any,
};

const Pagination: React.FC<Props> = (props) => {
  const pageNumbers = [...Array(props.nPages + 1).keys()].slice(1)

  const nextPage = () => {
    if(props.currentPage !== props.nPages) {
      props.setCurrentPage(props.currentPage + 1)
    } else {

    }
  }

  const prevPage = () => {
    if(props.currentPage !== 1) {
      props.setCurrentPage(props.currentPage - 1)
    } else {

    }
  }

  return (
    <div className="pagination">
      <div id="pagination-prev" className="prev-next">
        <a href="#" onClick={prevPage} >PREVIOUS</a>
      </div>
      <div className="page-controls">
        <div className="pages">
          {pageNumbers.map(page =>{
            return(
              <div className={`page-number ${props.currentPage === page ? "active-page" : ""}`}>
                <a className="page" onClick={() => props.setCurrentPage(page)} href="#">
                  {page}
                </a>
              </div>
            )
          })
          }
        </div>
      </div>
      <div id="pagination-next" className="prev-next">
        <a href="#" onClick={nextPage} >NEXT</a>
      </div>
    </div>
  )
}

export default Pagination
