import React, { useEffect, useState } from "react";
import { Button, Pagination } from "react-bootstrap";


const MainPagination = ({
  items,
  itemsPerPage,
  handleNextBtn,
  handlePrevBtn,
  handlePageClick,
  currentPage,
  minPageNumberLimit,
  maxPageNumberLimit, 
}) => {
  //get number of pages based on orders passed/items per page defined
  const pages = [];
  for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
    pages.push(i);
  }
  //display pages/numbers within min -> max pages count set
  const renderPageNumbers = pages.map((number) => {
    if (number < maxPageNumberLimit + 1 && number > minPageNumberLimit) {
      return (
        <Pagination.Item
          key={number}
          id={number}
          onClick={handlePageClick}
          active={currentPage == number ? true : false}
        >
          {number}
        </Pagination.Item>
      );
    } else {
      return null; 
    }
  });

  //determine when to display ellipsis for max page count
  let pageIncrementBtn = null;
  if (pages.length > maxPageNumberLimit) {
    pageIncrementBtn = <Pagination.Ellipsis onClick={handleNextBtn} />;
  }
  //determine when to display ellipsis for min/left page count
  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = <Pagination.Ellipsis onClick={handlePrevBtn} />;
  }

  return (
    <Pagination size="sm">
      {items.length ? <Pagination.Prev
        onClick={handlePrevBtn}
        disabled={currentPage == pages[0] ? true : false}
      />: null}
      {pageDecrementBtn}
      {renderPageNumbers}
      {pageIncrementBtn}
      {items.length ? <Pagination.Next
        onClick={handleNextBtn}
        disabled={currentPage == pages[pages.length - 1] ? true : false}
      />: null}
    </Pagination>
  );
};

export default MainPagination;
