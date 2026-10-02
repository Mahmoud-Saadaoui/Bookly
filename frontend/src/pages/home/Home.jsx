import React, { useState } from 'react';
import './home.css'
import Banner from '../../components/home/Banner';
import Books from '../../components/home/Books';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';

function Home() {
  const { books } = useSelector(state => state.book)

  const [currentPage, setCurrentPage] = useState(0)
  const handlePageClick = ({selected}) => {
    setCurrentPage(selected)
  }

  return (
    <div className='home'>
      <Banner/>
      <Books currentPage={currentPage}/>
      <ReactPaginate
        breakLabel = ".."
        nextLabel = "next"
        onPageChange = {handlePageClick}
        pageRangeDisplayed = {3}
         pageCount = {Number.isFinite(books?.pagination?.pages) ? books.pagination.pages : 0}
        previousLabel = "previous"
        renderOnZeroPageCount = {null}
        containerClassName = {'pagination'}
        nextClassName = {'page-item'}
        nextLinkClassName = {'page-link'}
        previousClassName = {'page-item'}
        previousLinkClassName = {'page-link'}
        breakClassName = {'page-item'}
        breakLinkClassName = {'page-link'}
        pageClassName = {'page-item'}
        pageLinkClassName = {'page-link'}
        activeClassName = {'active'}
      />
    </div>
  )
}

export default Home
