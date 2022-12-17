import { Pagination } from "react-bootstrap";


const CustomPagination = ({ page, pages, changePage }) => {
  let middlePagination;

  if (pages <= 5) {
    middlePagination = [...Array(pages)].map((_, idx) => (
      <Pagination.Item
        key={idx + 1}
        onClick={() => changePage(idx + 1)}
        disabled={page === idx + 1}
      >
        {idx + 1}
      </Pagination.Item>
    ));
  } else {
    const startValue = Math.floor((page - 1) / 5) * 5;

    middlePagination = (
      <>
        {[...Array(5)].map((_, idx) => (
          <Pagination.Item
            key={startValue + idx + 1}
            disabled={page === startValue + idx + 1}
            onClick={() => changePage(startValue + idx + 1)}
          >
            {startValue + idx + 1}
          </Pagination.Item>
        ))}

        <Pagination.Ellipsis />
        <Pagination.Item onClick={() => changePage(pages)}>
          {pages}
        </Pagination.Item>
      </>
    );

    if (page > 5) {
      if (pages - page >= 5) {
        middlePagination = (
          <>
            <Pagination.Item onClick={() => changePage(1)}>1</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item onClick={() => changePage(startValue)}>{startValue}</Pagination.Item>
            {[...Array(5)].map((_, idx) => (
              <Pagination.Item
                key={startValue + idx + 1}
                disabled={page === startValue + idx + 1}
                onClick={() => changePage(startValue + idx + 1)}
              >
                {startValue + idx + 1}
              </Pagination.Item>
            ))}

            <Pagination.Ellipsis />
            <Pagination.Item onClick={() => changePage(pages)}>{pages}</Pagination.Item>
          </>
        );
      } else {
        let amountLeft = pages - page + 5;
        middlePagination = (
          <>
            <Pagination.Item onClick={() => changePage(1)}>1</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item onClick={() => changePage(startValue)}>{startValue}</Pagination.Item>
            {[...Array(amountLeft)].map((_, idx) => (
              <Pagination.Item
                key={startValue + idx + 1}
                disabled={page === startValue + idx + 1}
                style={
                  pages < startValue + idx + 1 ? { display: "none" } : null
                }
                onClick={() => changePage(startValue + idx + 1)}
              >
                {startValue + idx + 1}
              </Pagination.Item>
            ))}
          </>
        );
      }
    }
  }
// &#171; prev arrows
//&#187; next arrows
  return (
    <Pagination size="sm">
      {pages > 1 && (
        <>
          <Pagination.Prev
            className="pagination__prev"
            onClick={() => changePage((page) => page - 1)}
            disabled={page === 1}
          />
          {middlePagination}
          <Pagination.Next
            className="pagination__next"
            onClick={() => changePage((page) => page + 1)}
            disabled={page === pages}
          />
        </>
      )}
    </Pagination>
  );
};

export default CustomPagination;
