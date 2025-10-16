import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { Pagination } from "@/components/Pagination/Pagination";

function PrintBarcode() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const response = await apiService.get<[]>("PrintBarcode");
    if (response.status.code === "S") {
      setData(response.result);
      setError(null);
    } else {
      setError(response.status.description);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // States for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [printQuantity, setPrintQuantity] = useState(1);
  const [barcodeType, setBarcodeType] = useState("code128");
  const [priceType, setPriceType] = useState("selling");
  const [showPrice, setShowPrice] = useState(true);
  const [showProductName, setShowProductName] = useState(true);
  const [showProductCode, setShowProductCode] = useState(true);

  // Filtered data based on search
  const filteredData = data.filter(
    (item: any) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const toggleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedData.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedData.map((item) => item.id));
    }
  };

  // Dummy handlers for buttons (clear, save, report)
  const handleClear = () => {
    setSearchTerm("");
    setSelectedProducts([]);
    setCurrentPage(1);
  };

  const handleSave = () => {
    alert("Save functionality is not implemented in this demo.");
  };

  const handleReport = () => {
    alert("Report functionality is not implemented in this demo.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Title */}
      <h1 className="text-lg font-semibold mb-6">Print Barcode</h1>

      {/* Filters & Settings Section */}
      <section className="bg-card rounded shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium mb-1"
            >
              Search Product
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search by name or code"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Barcode Type */}
          <div>
            <label
              htmlFor="barcodeType"
              className="block text-sm font-medium mb-1"
            >
              Barcode Type
            </label>
            <select
              id="barcodeType"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={barcodeType}
              onChange={(e) => setBarcodeType(e.target.value)}
            >
              <option value="code128">Code 128</option>
              <option value="code39">Code 39</option>
              <option value="ean13">EAN 13</option>
              <option value="upc">UPC</option>
            </select>
          </div>

          {/* Price Type */}
          <div>
            <label
              htmlFor="priceType"
              className="block text-sm font-medium mb-1"
            >
              Price Type
            </label>
            <select
              id="priceType"
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
            >
              <option value="selling">Selling Price</option>
              <option value="purchase">Purchase Price</option>
              <option value="mrp">MRP</option>
            </select>
          </div>

          {/* Print Quantity */}
          <div>
            <label
              htmlFor="printQuantity"
              className="block text-sm font-medium mb-1"
            >
              Print Quantity
            </label>
            <input
              id="printQuantity"
              type="number"
              min={1}
              className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={printQuantity}
              onChange={(e) =>
                setPrintQuantity(Math.max(1, Number(e.target.value)))
              }
            />
          </div>

          {/* Show Product Name */}
          <div className="flex items-center space-x-2">
            <input
              id="showProductName"
              type="checkbox"
              checked={showProductName}
              onChange={() => setShowProductName(!showProductName)}
              className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
            />
            <label
              htmlFor="showProductName"
              className="text-sm font-medium"
            >
              Show Product Name
            </label>
          </div>

          {/* Show Product Code */}
          <div className="flex items-center space-x-2">
            <input
              id="showProductCode"
              type="checkbox"
              checked={showProductCode}
              onChange={() => setShowProductCode(!showProductCode)}
              className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
            />
            <label
              htmlFor="showProductCode"
              className="text-sm font-medium"
            >
              Show Product Code
            </label>
          </div>

          {/* Show Price */}
          <div className="flex items-center space-x-2">
            <input
              id="showPrice"
              type="checkbox"
              checked={showPrice}
              onChange={() => setShowPrice(!showPrice)}
              className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
            />
            <label
              htmlFor="showPrice"
              className="text-sm font-medium"
            >
              Show Price
            </label>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="bg-card rounded shadow py-6">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      paginatedData.length > 0 &&
                      selectedProducts.length === paginatedData.length
                    }
                    aria-label="Select all products on current page"
                    className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Product Code
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Barcode
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-4 py-6 text-muted-foreground italic"
                  >
                    No products found.
                  </td>
                </tr>
              )}
              {paginatedData.map((item: any) => (
                <tr
                  key={item.id}
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
                    selectedProducts.includes(item.id) ? "bg-muted/20" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(item.id)}
                      onChange={() => toggleSelectProduct(item.id)}
                      aria-label={`Select product ${item.productName}`}
                      className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.productName}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {item.productCode}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground font-mono">
                    {item.barcode}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
        />
      </section>

      {/* Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-save fa-light" aria-hidden="true"></i> Save
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-refresh fa-light" aria-hidden="true"></i> Clear
        </button>
        <button
          onClick={handleReport}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-4 py-2 rounded shadow focus:outline-none focus:ring-2 focus:ring-ring"
          type="button"
        >
          <i className="fa fa-file-text fa-light" aria-hidden="true"></i> Report
        </button>
      </div>
    </div>
  );
}

export default PrintBarcode;