import React, { useEffect, useState, useRef } from "react";
import { apiService } from "@/services/ApiService";
import { PageBase1 } from "@/pages/PageBase1";
import { Pagination } from "@/components/Pagination/Pagination";
import { STOCK_STATUSES } from "@/constants/constants"; // Using for status if relevant
import { renderStatusBadge } from "@/utils/tableUtils";

interface Product {
  id: number;
  productName: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  status: (typeof STOCK_STATUSES)[number];
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

interface EditForm {
  printQuantity: number;
}

// Child component for Print Options
const PrintOptionsForm = ({
  options,
  onChange,
}: {
  options: PrintOptions;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}) => (
  <div className="w-full flex flex-wrap gap-4 items-center">
    <select
      name="paperSize"
      value={options.paperSize}
      onChange={onChange}
      className="px-4 py-2 border rounded-md grow"
    >
      <option value="">Select Paper Size</option>
      <option value="A4">A4</option>
      <option value="Letter">Letter</option>
      <option value="Legal">Legal</option>
    </select>
    <div className="flex items-center space-x-2 grow">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="showProductName"
          checked={options.showProductName}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Show Product Name
        </span>
      </label>
    </div>
    <div className="flex items-center space-x-2 grow">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="showPrice"
          checked={options.showPrice}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Show Price
        </span>
      </label>
    </div>
    <div className="flex items-center space-x-2 grow">
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="showSku"
          checked={options.showSku}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Show SKU
        </span>
      </label>
    </div>
  </div>
);

// Modal Form Component for Preview
const PreviewModalForm = ({
  printQueue,
  printOptions,
  previewRef,
}: {
  printQueue: PrintQueueItem[];
  printOptions: PrintOptions;
  previewRef;
}) => (
  <div className="border p-1 mb-4">
    <p>
      Preview of barcodes on {printOptions.paperSize || "selected"} paper size.
    </p>
    <div ref={previewRef}>
      {printQueue.map((item) => (
        <div key={item.id} className="mb-2">
          <div className="bg-gray-100 p-1 text-left">
            <h4 className="font-semibold text-lg">
              {item.productName} ({item.printQuantity})
            </h4>
            <p></p>
          </div>
          <div className="flex flex-wrap  gap-2 p-2">
            {/* Iterate the quantity times to display barcodes */}
            {[...Array(item.printQuantity)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col  flex-wrap items-center justify-center p-2 border border-gray-800"
              >
                <div className="font-semibold">{item.productName}</div>
                {printOptions.showPrice && (
                  <div className="text-sm">₹ {item.price}</div>
                )}
                <div className="font-2dbarcode text-5xl">{item.sku}</div>
                {printOptions.showSku && (
                  <div className="text-sm">{item.sku}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

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
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formMode, setFormMode] = useState<"editQuantity" | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ printQuantity: 1 });
  const [selectedItem, setSelectedItem] = useState<PrintQueueItem | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

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

  const filteredProducts = products.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

  const handleEditQuantity = (item: PrintQueueItem) => {
    setSelectedItem(item);
    setEditForm({ printQuantity: item.printQuantity });
    setFormMode("editQuantity");
  };

  const handleQuantitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      setPrintQueue(
        printQueue.map((item) =>
          item.id === selectedItem.id
            ? { ...item, printQuantity: Math.max(1, editForm.printQuantity) }
            : item
        )
      );
    }
    setFormMode(null);
    setSelectedItem(null);
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
    setIsPreviewModalOpen(true);
  };

  const handlePrint = () => {
    if (previewRef.current) {
      const printContents = previewRef.current.innerHTML;
      const newWindow = window.open("", "", "height=800,width=1000");
      if (newWindow) {
        newWindow.document.write(`
        <html>
          <head>
            <title>Print Barcode Preview</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              .font-2dbarcode { font-family: "Libre Barcode 39", "monospace", sans-serif; font-size: 2em; letter-spacing: 3px; }
              /* Add other styles used in PreviewModalForm if needed */
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
        newWindow.document.close();
        newWindow.focus();
        newWindow.print();
        // Optional: Close after print
        // setTimeout(() => newWindow.close(), 100);
      }
    }
    // Optionally close the modal after print
    setIsPreviewModalOpen(false);
  };

  const handleRefresh = () => {
    setPrintQueue([]);
    setSearchTerm("");
    setPrintOptions({
      paperSize: "",
      showProductName: true,
      showPrice: true,
      showSku: true,
    });
    setCurrentPage(1);
    setItemsPerPage(10);
    loadData();
  };

  const quantityModalForm = () => (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label
          htmlFor="printQuantity"
          className="block text-sm font-medium mb-1"
        >
          Print Quantity <span className="text-destructive">*</span>
        </label>
        <input
          type="number"
          id="printQuantity"
          name="printQuantity"
          min={1}
          value={editForm.printQuantity}
          onChange={(e) =>
            setEditForm({ printQuantity: Math.max(1, Number(e.target.value)) })
          }
          className="w-full border border-input rounded px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          required
          aria-label="Enter print quantity"
        />
      </div>
    </div>
  );

  return (
    <PageBase1
      title="Print Barcode"
      description="Select products and configure print options for barcodes"
      icon="fa fa-barcode"
      onRefresh={handleRefresh}
      formMode={formMode}
      setFormMode={setFormMode}
      modalTitle="Edit Quantity"
      modalForm={quantityModalForm}
      onFormSubmit={handleQuantitySubmit}
    >
      <div className="w-full mx-auto mt-8 p-6 bg-card rounded shadow">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Products Grid with Pagination */}
        <section className=" border border-gray-200 rounded-lg bg-white shadow-sm py-4">
          {/* Search Filter */}
          <div className="px-4 mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product by code or name"
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider">
                  Product Name
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedData.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                >
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.productName}
                        className="w-12 h-12 rounded object-contain"
                      />
                      <span>{product.productName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    {product.category}
                  </td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    {product.sku}
                  </td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    {product.code}
                  </td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    {renderStatusBadge(product.status)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right space-x-2">
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
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredProducts.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setItemsPerPage}
          />
        </section>

        {/* Print Queue Grid */}
        <section className="border border-gray-200 rounded-lg bg-white shadow-sm mt-3 p-1">
          <h3 className="text-lg font-medium  mb-1 p-3 text-primary">
            Products marked for bar-code generation
          </h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider">
                  Product Name
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider">
                  SKU
                </th>
                <th className="px-4 py-3 text-sm font-medium text-muted-foreground tracking-wider">
                  Code
                </th>
                <th className="px-4 py-2 text-sm text-sm font-medium text-muted-foreground tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-2 text-sm text-sm font-medium text-muted-foreground tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {printQueue.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors text-sm text-gray-500"
                >
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    {item.productName}
                  </td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    {item.sku}
                  </td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    {item.code}
                  </td>
                  <td className="px-4 py-2 text-sm whitespace-nowrap">
                    {item.printQuantity}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right space-x-2  ">
                    <button
                      onClick={() => handleEditQuantity(item)}
                      className="text-gray-700 border border-gray-700 hover:bg-primary hover:text-white focus:ring-4 rounded-lg text-xs p-2 text-center inline-flex items-center me-1"
                    >
                      <i className="fa fa-edit" aria-hidden="true"></i>
                      <span className="sr-only">Edit</span>
                    </button>
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

          <hr className="my-4 border-t border-gray-300" />

          {/* Print Options Form */}
          <section className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Print Options
            </h3>
            <PrintOptionsForm
              options={printOptions}
              onChange={handleOptionChange}
            />
            <div className="flex justify-end mt-6">
              <button
                onClick={handleGenerateBarcode}
                className="px-6 py-2 border rounded-md bg-green-600 text-white flex items-center"
                disabled={loading}
              >
                <i className="fa fa-barcode me-2" aria-hidden="true"></i>
                Generate Barcode
              </button>
            </div>
          </section>
        </section>
      </div>

      {/* Popup Modal for Barcode Preview */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6  w-full max-w-4xl max-h-full overflow-y-auto overflow-x-hidden outline-none">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Barcode Preview
            </h3>

            <PreviewModalForm
              printQueue={printQueue}
              printOptions={printOptions}
              previewRef={previewRef}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-6 py-2 border rounded-md bg-gray-200 text-gray-700"
              >
                <i className="fa fa-times" aria-hidden="true"></i> Close
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 border rounded-md bg-green-600 text-white"
              >
                <i className="fa fa-print me-2" aria-hidden="true"></i>Print
              </button>
            </div>
          </div>
        </div>
      )}
    </PageBase1>
  );
}
