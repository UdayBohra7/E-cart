import React from "react";
import { Pagination } from "@mui/material";
import { Close, Inbox } from "@mui/icons-material";
import { TableLoader } from "../Spinner/TableLoader";

interface TableProps<T> {
  columns: {
    header: string;
    id?: string;
    cell: (row: T, index?: number) => React.ReactNode;
  }[];
  data: T[];
  pagination?: boolean;
  itemsPerPage?: number;
  totalPages?: number;
  enableSearch?: boolean;
  currentPage?: number;
  setCurrentPage?: (value: number) => void;
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
  loading?: boolean;
}

const Table = <T,>({ columns, data = [], pagination = true, itemsPerPage = 10, totalPages, currentPage = 1, setCurrentPage = () => { }, enableSearch = true, searchQuery = "", setSearchQuery = () => { }, loading = false }: TableProps<T>) => {


  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // const handleItemsPerPageChange = (_: React.ChangeEvent<HTMLSelectElement>) => {
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      {pagination && (
        <div className="d-flex justify-content-between pb-3 px-3 align-items-end">
          {/* <div className="d-flex align-items-center">
            Show
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="mx-2 form-control"
              style={{ padding: "0.175rem 0.75rem" }}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            entries
          </div> */}

          {enableSearch && (
            <div className="w-25 position-relative">
              <input
                value={searchQuery}
                onChange={handleSearch}
                className="form-control pr-4"
                placeholder="Search"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="position-absolute border-0 bg-transparent"
                  style={{ right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}
                >
                  <Close fontSize="small" className="text-muted" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <table className="table table-hover">
        <thead className="table-primary">
          <tr>
            {columns.map((column, index) => (
              <th key={column.id || index} scope="col"><p className="mb-0 w-max">{column.header}</p></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-0 border-0">
                <TableLoader />
              </td>
            </tr>
          ) : data?.length ? (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((column, colIndex) => (
                  <td key={column.id || colIndex}>{column.cell(row, colIndex)}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="w-full">
              <td className="w-full text-center" colSpan={columns.length}>
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                  <Inbox style={{ fontSize: '48px', color: '#ccc' }} />
                  <p className="text-muted mt-2">No Data Found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="d-flex p-3 justify-content-between align-items-end">
          <span>Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data?.length || 0)} of {data?.length || 0} entries</span>
          <Pagination
            color="primary"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </div>
      )}
    </div>
  );
};

export default Table;
