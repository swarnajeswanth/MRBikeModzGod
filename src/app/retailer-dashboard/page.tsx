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
import AddProductModal, {
  ProductForm,
} from "@/components/Profile/AddProductModal"; // adjust path if needed
import { useSelector } from "react-redux";
import { selectAllProducts } from "@/components/store/productSlice"; // adjust path if needed
import { useDispatch } from "react-redux";
import { updateProduct } from "@/components/store/productSlice";

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

const RetailerDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const products = useSelector(selectAllProducts);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const dispatch = useDispatch();
  const [editProductId, setEditProductId] = useState<string | null>(null);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    title: "",
    category: "",
    price: "",
    originalPrice: "",
    discount: "",
    stockCount: "",
    inStock: true,
    rating: "",
    reviews: "",
    description: "",
    features: [], // ✅ initialize as array
    specifications: {}, // ✅ initialize as object
    label: "",
    labelType: "",
    backgroundColor: "",
    images: [], // ✅ initialize as array
  });

  const [productList, setProductList] = useState(products); // start with default products

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (product: any) => {
    setForm({
      name: product.name || "",
      title: product.title || "",
      category: product.category || "",
      price: product.price?.toString() || "",
      originalPrice: product.originalPrice?.toString() || "",
      discount: product.discount?.toString() || "",
      stockCount: product.stockCount?.toString() || "0",
      inStock: product.inStock ?? true,
      rating: product.rating?.toString() || "",
      reviews: product.reviews?.toString() || "",
      description: product.description || "",
      features: product.features || [],
      specifications: product.specifications || {},
      label: product.label || "",
      labelType: product.labelType || "",
      backgroundColor: product.backgroundColor || "",
      images: product.images || [],
    });

    setEditProductId(product.id); // Track editing product
    setIsModalOpen(true);
  };

  const handleDelete = (productName: string) => {
    console.log("Delete product:", productName);
  };

  const handleAddProduct = (formData: ProductForm) => {
    const parsedProduct = {
      ...formData,
      id: editProductId ?? formData.name.toLowerCase().replace(/\s+/g, "-"),
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      rating: parseFloat(formData.rating),
      reviews: parseInt(formData.reviews),
      stockCount: parseInt(formData.stockCount),
    };

    if (editProductId) {
      dispatch(updateProduct(parsedProduct));
    } else {
      // You can dispatch(addProduct(parsedProduct)) if you have an `addProduct` action
      console.log("Add product logic here", parsedProduct);
    }

    // Reset state
    setIsModalOpen(false);
    setEditProductId(null);
    setForm({
      name: "",
      title: "",
      category: "",
      price: "",
      originalPrice: "",
      discount: "",
      stockCount: "",
      inStock: true,
      rating: "",
      reviews: "",
      description: "",
      features: [],
      specifications: {},
      label: "",
      labelType: "",
      backgroundColor: "",
      images: [],
    });
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
            onClick={() => {
              // 🔑 Clear form and editing state
              setEditProductId(null);
              setForm({
                name: "",
                title: "",
                category: "",
                price: "",
                originalPrice: "",
                discount: "",
                stockCount: "",
                inStock: true,
                rating: "",
                reviews: "",
                description: "",
                features: [],
                specifications: {},
                label: "",
                labelType: "",
                backgroundColor: "",
                images: [],
              });
              setIsModalOpen(true);
            }}
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
        <div className="overflow-x-auto h-[400px]   ">
          {/* Product Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative">
            {paginatedProducts.map((p, i) => (
              <div
                key={i}
                className="bg-[#1e293b] p-4 rounded-lg shadow-md flex flex-col items-center text-center"
              >
                {/* Product Image (placeholder) */}
                <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-white text-xl">
                  IMG
                </div>

                {/* Product Details */}
                <h3 className="text-lg font-semibold mb-1">{p.name}</h3>
                <p className="text-sm text-gray-400 mb-1">{p.category}</p>
                <p className="text-green-400 font-bold mb-1">{p.price}</p>
                <p className="text-sm text-gray-300 mb-4">
                  Stock: {p.stockCount}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 bg-white text-black rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(p.name)}
                    className="p-2 bg-red-600 text-white rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-center items-center gap-2    absolute bottom-[-10%] lg:bottom-[-30%] lg:left-[40%] p-4 ">
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
