import React, { useState, useMemo } from "react";

const invoiceTemplatesData = [
  {
    id: 1,
    invoiceTemplateName: "Invoice Template 1",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice1.png",
    description: "Clean and professional invoice template with blue accents.",
  },
  {
    id: 2,
    invoiceTemplateName: "Invoice Template 2",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice2.png",
    description: "Modern invoice template with green highlights and detailed layout.",
  },
  {
    id: 3,
    invoiceTemplateName: "Invoice Template 3",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice3.png",
    description: "Classic invoice template with red headers and simple design.",
  },
  {
    id: 4,
    invoiceTemplateName: "Invoice Template 4",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice4.png",
    description: "Minimalist invoice template with black and white theme.",
  },
  {
    id: 5,
    invoiceTemplateName: "Invoice Template 5",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice5.png",
    description: "Elegant invoice template with purple accents and clean sections.",
  },
  {
    id: 6,
    invoiceTemplateName: "Invoice Template 6",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice6.png",
    description: "Bold invoice template with orange highlights and structured layout.",
  },
  {
    id: 7,
    invoiceTemplateName: "Invoice Template 7",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice7.png",
    description: "Creative invoice template with teal colors and modern typography.",
  },
  {
    id: 8,
    invoiceTemplateName: "Invoice Template 8",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice8.png",
    description: "Simple invoice template with gray tones and classic structure.",
  },
  {
    id: 9,
    invoiceTemplateName: "Invoice Template 9",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice9.png",
    description: "Professional invoice template with navy blue and clean lines.",
  },
  {
    id: 10,
    invoiceTemplateName: "Invoice Template 10",
    invoiceTemplateImage: "https://dreamspos.dreamstechnologies.com/html/template/assets/images/invoice/invoice10.png",
    description: "Stylish invoice template with gold accents and modern feel.",
  },
];

const ITEMS_PER_PAGE = 5;

export default function InvoiceTemplates() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return invoiceTemplatesData;
    return invoiceTemplatesData.filter((item) =>
      item.invoiceTemplateName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">Invoice Templates</h1>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        {/* Search Input */}
        <div className="flex items-center space-x-2">
          <label htmlFor="search" className="sr-only">
            Search Invoice Templates
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search Invoice Templates"
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-64"
          />
          <button
            onClick={handleRefresh}
            title="Refresh"
            className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-indigo-100 transition"
            aria-label="Refresh Search"
            type="button"
          >
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <i className="fas fa-file-alt mr-2"></i> Report
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <i className="fas fa-save mr-2"></i> Save
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-indigo-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold text-indigo-700 uppercase tracking-wider"
              >
                #
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold text-indigo-700 uppercase tracking-wider"
              >
                Invoice Template Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold text-indigo-700 uppercase tracking-wider"
              >
                Preview
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left font-semibold text-indigo-700 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center font-semibold text-indigo-700 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No invoice templates found.
                </td>
              </tr>
            ) : (
              paginatedData.map((template, idx) => (
                <tr key={template.id} className="hover:bg-indigo-50">
                  <td className="px-6 py-4 whitespace-nowrap">{(currentPage - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-700">
                    {template.invoiceTemplateName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={template.invoiceTemplateImage}
                      alt={`${template.invoiceTemplateName} preview`}
                      className="h-16 w-auto rounded border border-gray-300"
                      loading="lazy"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-normal">{template.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      type="button"
                      title="Edit"
                      className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      className="text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav
        className="mt-6 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-md shadow"
        aria-label="Pagination"
      >
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center space-x-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="Go to first page"
            className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
              currentPage === 1
                ? "text-indigo-600 bg-indigo-100 cursor-default"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <i className="fas fa-angle-double-left"></i>
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
            className={`relative inline-flex items-center border-t border-b border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
              currentPage === 1
                ? "text-indigo-600 bg-indigo-100 cursor-default"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <i className="fas fa-angle-left"></i>
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              aria-current={pageNum === currentPage ? "page" : undefined}
              className={`relative inline-flex items-center border-t border-b border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
                pageNum === currentPage
                  ? "text-indigo-600 bg-indigo-100 cursor-default"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Go to next page"
            className={`relative inline-flex items-center border-t border-b border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
              currentPage === totalPages || totalPages === 0
                ? "text-indigo-600 bg-indigo-100 cursor-default"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <i className="fas fa-angle-right"></i>
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            aria-label="Go to last page"
            className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
              currentPage === totalPages || totalPages === 0
                ? "text-indigo-600 bg-indigo-100 cursor-default"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <i className="fas fa-angle-double-right"></i>
          </button>
        </div>
      </nav>
    </div>
  );
}