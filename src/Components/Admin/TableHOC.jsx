import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import { useTable, useSortBy, usePagination } from "react-table";


function TableHOC(columns, data, containerClassname, heading, showPagination = false) {
    return function HOC() {
        const {
            getTableProps,
            getTableBodyProps,
            headerGroups,
            page,
            prepareRow,
            previousPage,
            nextPage,
            canNextPage,
            canPreviousPage,
            pageCount,
            state: { pageIndex },
        } = useTable(
            {
                columns,
                data,
                initialState: { pageSize: 6 },
            },
            useSortBy,
            usePagination
        );

        return (
            <div className={containerClassname}>
                <h2 className="heading">{heading}</h2>

                <table className="table" {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup, index) => {
                            const { key, ...restProps } = headerGroup.getHeaderGroupProps();
                            return (
                                <tr key={key || index} {...restProps}>
                                    {headerGroup.headers.map((column, colIndex) => {
                                        const { key: colKey, ...colProps } = column.getHeaderProps(column.getSortByToggleProps());
                                        return (
                                            <th key={colKey || colIndex} {...colProps}>
                                                {column.render("Header")}
                                                {column.isSorted && (
                                                    <span>
                                                        {column.isSortedDesc ? <AiOutlineSortDescending /> : <AiOutlineSortAscending />}
                                                    </span>
                                                )}
                                            </th>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {page.length > 0 ? (
                            page.map((row, rowIndex) => {
                                prepareRow(row);
                                const { key: rowKey, ...rowProps } = row.getRowProps();
                                return (
                                    <tr key={rowKey || rowIndex} {...rowProps}>
                                        {row.cells.map((cell, cellIndex) => {
                                            const { key: cellKey, ...cellProps } = cell.getCellProps();
                                            return (
                                                <td key={cellKey || cellIndex} {...cellProps}>
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={columns.length} style={{ textAlign: "center" }}>
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {showPagination && pageCount > 0 && (
                    <div className="table-pagination">
                        <button disabled={!canPreviousPage} onClick={previousPage}>
                            Prev
                        </button>
                        <span>{`Page ${pageIndex + 1} of ${pageCount}`}</span>
                        <button disabled={!canNextPage} onClick={nextPage}>
                            Next
                        </button>
                    </div>
                )}
            </div>
        );
    };
}

export default TableHOC;
