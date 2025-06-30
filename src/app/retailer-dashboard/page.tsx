"use client";
import React, { useState } from "react";
import {
  FaBox,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import AddProductModal, { ProductForm } from "@/components/AddProductModal"; // adjust path if needed

const summaryCards = [
  {
    label: "Total Products",
    value: "1,234",
    icon: <FaBox className="text-blue-400 text-2xl" />,
  },
  {
    label: "Total Orders",
    value: "856",
    icon: <FaUsers className="text-green-400 text-2xl" />,
  },
  {
    label: "Revenue",
    value: "$45,670",
    icon: <FaDollarSign className="text-yellow-400 text-2xl" />,
  },
  {
    label: "Growth",
    value: "+12.5%",
    icon: <FaChartLine className="text-purple-400 text-2xl" />,
  },
];

const products = [
  {
    name: "Performance Air Filter",
    category: "Engine Parts",
    price: "$89.99",
    stock: 25,
  },
  {
    name: "Performance Air Filter",
    category: "Engine Parts",
    price: "$89.99",
    stock: 25,
  },
  {
    name: "Performance Air Filter",
    category: "Engine Parts",
    price: "$89.99",
    stock: 25,
  },
  {
    name: "Performance Air Filter",
    category: "Engine Parts",
    price: "$89.99",
    stock: 25,
  },
  {
    name: "Performance Air Filter",
    category: "Engine Parts",
    price: "$89.99",
    stock: 25,
  },
  {
    name: "Performance Air Filter",
    category: "Engine Parts",
    price: "$89.99",
    stock: 25,
  },
  {
    name: "Performance kumar Filter",
    category: "Engine Parts",
    price: "$89.99",
    stock: 25,
  },
  {
    name: "Performance harsh Filter",
    category: "Engine Parts",
    price: "$89.99",
    stock: 25,
  },
];

const RetailerDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [productList, setProductList] = useState(products); // start with default products

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleEdit = (product: any) => {
    console.log("Edit product:", product);
  };

  const handleDelete = (productName: string) => {
    console.log("Delete product:", productName);
  };

  const handleAddProduct = (newProduct: ProductForm) => {
    const formatted = {
      name: newProduct.name,
      category: newProduct.category,
      price: `$${parseFloat(newProduct.price).toFixed(2)}`,
      stock: parseInt(newProduct.stock),
    };
    setProductList((prev) => [...prev, formatted]);
    setIsModalOpen(false);
    setForm({ name: "", category: "", price: "", stock: "", description: "" }); // reset
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // reset to first page on new search
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Retailer Dashboard</h1>
        <p className="text-gray-400">
          Manage your products and track your business
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-[#1D2939] p-5 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      {/* Product Management */}
      <div className="bg-[#1D2939] p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <h2 className="text-xl font-bold">Product Management</h2>
          <button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus />
            Add Product
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-[#1e293b] text-white border border-gray-700 px-4 py-2 rounded mb-4"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto h-[338px] ">
          <table className="w-full text-left text-sm relative">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2">Product Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Price</th>
                <th className="py-2">Stock</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p, i) => (
                <tr key={i} className="border-b border-gray-800 ">
                  <td className="py-3 font-semibold">{p.name}</td>
                  <td>{p.category}</td>
                  <td className="text-green-400">{p.price}</td>
                  <td>{p.stock}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 bg-white rounded"
                    >
                      <FaEdit className="text-black" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.name)}
                      className="p-2 bg-red-600 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center gap-2 mt-4 absolute bottom-[-50px] right-[45%]  p-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddProduct}
        form={form}
        setForm={setForm}
      />
    </div>
  );
};

export default RetailerDashboard;
