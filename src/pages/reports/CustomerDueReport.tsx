 
import React, { useState, useEffect } from 'react';

// Sample JSON data for dynamic fields
const sampleData = [
  { id: 1, customerName: 'John Doe', dueAmount: 100.00, dueDate: '2023-01-01' },
  { id: 2, customerName: 'Jane Doe', dueAmount: 200.00, dueDate: '2023-02-01' },
  // Add more data here...
];

const CustomerDueReport = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [data, setData] = useState(sampleData);

  useEffect(() => {
    // Fetch data from API if needed
    // setData(fetchedData);
  }, []);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Customer Due Report</h1>

      {/* Section 1: Filters */}
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <label className="mr-2">Customer Name:</label>
          <input type="text" className="w-full max-w-xs rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div className="flex items-center">
          <label className="mr-2">Due Date:</label>
          <input type="date" className="w-full max-w-xs rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Refresh</button>
      </div>

      {/* Section 2: Table */}
      <table className="w-full text-left border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border border-gray-300">Customer Name</th>
            <th className="px-4 py-2 border border-gray-300">Due Amount</th>
            <th className="px-4 py-2 border border-gray-300">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2 border border-gray-300">{item.customerName}</td>
              <td className="px-4 py-2 border border-gray-300">{item.dueAmount}</td>
              <td className="px-4 py-2 border border-gray-300">{item.dueDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Section 3: Pagination */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </div>
        <div className="flex items-center">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`py-2 px-4 rounded ${currentPage === pageNumber ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        </div>
        <div className="flex items-center">
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDueReport; 