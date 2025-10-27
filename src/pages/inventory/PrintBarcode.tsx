import React, { useEffect, useState } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";

interface Product {
  id: number;
  productName: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  sku: string;
  code: string;
}

interface PrintQueueItem extends Product {
  printQuantity: number;
}

interface PrintOptions {
  paperSize: string;
  showProductName: boolean;
  showPrice: boolean;
  showSku: boolean;
}

export default function PrintBarcode() {
  const [products, setProducts] = useState<Product[]>([]);
  const [printQueue, setPrintQueue] = useState<PrintQueueItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [printOptions, setPrintOptions] = useState<PrintOptions>({
    paperSize: "",
    showProductName: true,
    showPrice: true,
    showSku: true,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<Product[]>("Products"); // Adjust endpoint
        if (response.status.code === "S") {
          setProducts(response.result);
          setError(null);
        } else {
          setError(response.status.description);
        }
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = products.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToQueue = (product: Product) => {
    const existingItem = printQueue.find((item) => item.id === product.id);
    if (existingItem) {
      setPrintQueue(
        printQueue.map((item) =>
          item.id === product.id
            ? { ...item, printQuantity: item.printQuantity + 1 }
            : item
        )
      );
    } else {
      setPrintQueue([...printQueue, { ...product, printQuantity: 1 }]);
    }
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setPrintQueue(
      printQueue.map((item) =>
        item.id === id
          ? { ...item, printQuantity: Math.max(1, item.printQuantity + delta) }
          : item
      )
    );
  };

  const handleRemoveFromQueue = (id: number) => {
    setPrintQueue(printQueue.filter((item) => item.id !== id));
  };

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setPrintOptions((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGenerateBarcode = () => {
    if (printQueue.length === 0) {
      setError("Please add at least one product to the print queue.");
      return;
    }
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    // Logic to trigger browser print, e.g., window.print() or generate PDF
    alert("Printing barcodes..."); // Placeholder
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setPrintQueue([]);
    setSearchTerm("");
    setPrintOptions({
      paperSize: "",
      showProductName: true,
      showPrice: true,
      showSku: true,
    });
  };

  return (
    <PageBase1
      title="Print Barcode"
      description="Select products and configure print options for barcodes"
      icon="fa fa-barcode"
    >
      <div className="w-full mx-auto mt-8 p-6 bg-card rounded shadow ">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Products Grid */}
        <section className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          {/* Search Filter */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product by code or name"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-12 h-12 rounded object-contain"
                      />
                      <span>{product.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 whitespace-nowrap">{product.category}</td>
                  <td className="px-4 whitespace-nowrap">{product.sku}</td>
                  <td className="px-4 whitespace-nowrap">{product.code}</td>
                  <td className="px-4 whitespace-nowrap">{product.status}</td>
                  <td className="px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleAddToQueue(product)}
                      className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                    >
                      <i className="fa fa-plus-square" aria-hidden="true"></i>
                      <span className="sr-only">Add</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Print Queue Grid */}
        <section className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm mt-3">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Print Queue
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {" "}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {printQueue.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 whitespace-nowrap">{item.productName}</td>
                  <td className="px-4 whitespace-nowrap">{item.sku}</td>
                  <td className="px-4 whitespace-nowrap">{item.code}</td>
                  <td className="px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="px-2 py-1 bg-gray-200"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.printQuantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="px-2 py-1 bg-gray-200"
                    >
                      +
                    </button>
                  </td>
                  <td className="px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleRemoveFromQueue(item.id)}
                      className="text-gray-700 border border-gray-700 hover:bg-red-500 hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                    >
                      <i
                        className="fa fa-trash-can-xmark"
                        aria-hidden="true"
                      ></i>
                      <span className="sr-only">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Print Options Form */}
          <section className="rounded shadow-sm p-2 my-5">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Print Options
            </h3>
            <div className="space-y-4">
              <select
                name="paperSize"
                value={printOptions.paperSize}
                onChange={handleOptionChange}
                className="px-4 py-2 border rounded-md w-full"
              >
                <option value="">Select Paper Size</option>
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showProductName"
                  checked={printOptions.showProductName}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
                />
                <label className="text-sm font-medium">Show Product Name</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showPrice"
                  checked={printOptions.showPrice}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
                />
                <label className="text-sm font-medium">Show Price</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showSku"
                  checked={printOptions.showSku}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-primary border-input rounded focus:ring-ring"
                />
                <label className="text-sm font-medium">Show SKU</label>
              </div>
            </div>
          </section>

          {/* Generate Barcode Button */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerateBarcode}
              className="px-6 py-2 border rounded-md bg-green-600 text-white"
              disabled={loading}
            >
              <i className="fa fa-barcode me-2" aria-hidden="true"></i>
              Generate Barcode
            </button>
          </div>
        </section>
      </div>

      {/* Popup Modal for Barcode Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Barcode Preview
            </h3>
            {/* Placeholder for barcode alignment preview */}
            <div className="border p-4 mb-4">
              <p>
                Preview of barcodes on {printOptions.paperSize || "selected"}{" "}
                paper size.
              </p>
              {/* Implement actual barcode generation here, e.g., using a library like react-barcode */}
              {printQueue.map((item) => (
                <div key={item.id} className="mb-2">
                  {/* Example barcode placeholder */}
                  <div className="bg-gray-200 p-2 text-center">
                    Barcode for {item.productName} (Qty: {item.printQuantity})
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border rounded-md bg-gray-200 text-gray-700"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 border rounded-md bg-green-600 text-white"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </PageBase1>
  );
}
