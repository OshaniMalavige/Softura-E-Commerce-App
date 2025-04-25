import { useState } from "react";

const DataTable = ({ data, columns, title }) => {
    const [search, setSearch] = useState("");
    const [sortColumn, setSortColumn] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Handle sorting
    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortOrder("asc");
        }
    };

    // Filter and sort data
    const filteredData = data
        .filter((item) =>
            columns.some((col) => {
                const value = item[col.accessor];
                if (typeof value === 'object' && value !== null) {
                    return JSON.stringify(value)
                        .toLowerCase()
                        .includes(search.toLowerCase());
                }
                return value?.toString().toLowerCase().includes(search.toLowerCase());
            })
        )
        .sort((a, b) => {
            if (!sortColumn) return 0;
            const valueA = a[sortColumn];
            const valueB = b[sortColumn];

            if (typeof valueA === "string") {
                return sortOrder === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
            }
            return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
        });

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 bg-white shadow-lg rounded-xl">
            <h2 className="text-xl font-semibold mb-4 text-[var(--primaryColor)]">{title}</h2>

            {/* Table */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-700">
                    <thead className="text-md text-blue-900 bg-[#F1EFEC]">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.accessor}
                                onClick={() => handleSort(col.accessor)}
                                className="px-6 py-3 text-left"
                            >
                                {col.label}{" "}
                                {sortColumn === col.accessor && (
                                    <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedData.map((row, index) => (
                        <tr key={index} className={"odd:bg-white even:bg-gray-50 border-b border-gray-200"}>
                            {columns.map((col) => (
                                <td key={col.accessor} className="px-6 py-4 border-b border-gray-300">
                                    {col.render ? col.render(row) : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <button
                    className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DataTable;