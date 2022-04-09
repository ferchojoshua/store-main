import React from "react";
import { Pagination } from "@mui/material";

const PaginationComponent = ({ data, paginate, itemsperPage }) => {
  const pageNumber = [];

  for (let i = 0; i < Math.ceil(data.length / itemsperPage); i++) {
    pageNumber.push(i);
  }

  const handleChange = (event, value) => {
    paginate(value);
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <Pagination
        style={{ marginRight: 20 }}
        count={pageNumber.length}
        variant="outlined"
        color="primary"
        onChange={handleChange}
      />
    </div>
  );
};

export default PaginationComponent;
