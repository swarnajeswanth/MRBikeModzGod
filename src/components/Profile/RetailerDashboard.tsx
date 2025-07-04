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
  FaCog,
} from "react-icons/fa";
import AddProductModal, {
  ProductForm,
} from "@/components/Profile/AddProductModal";
import StoreSettings from "@/components/Profile/StoreSettings";
import { useSelector } from "react-redux";
import {
  selectAllProducts,
  selectLoading,
  selectError,
} from "@/components/store/productSlice";
import { useDispatch } from "react-redux";
import {
  updateProduct,
  createProduct,
  updateProductById,
  deleteProductById,
  fetchProducts,
} from "@/components/store/productSlice";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import SeedProductsButton from "./SeedProductsButton";

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

const RetailerDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("products");
  const itemsPerPage = 4;
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts() as any);
  }, [dispatch]);

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
    features: [],
    specifications: {},
    label: "",
    labelType: "",
    images: [],
  });

  const [productList, setProductList] = useState(products);

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
      images: product.images || [],
    });

    setEditProductId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    try {
      await dispatch(deleteProductById(productId) as any);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleAddProduct = async (formData: ProductForm) => {
    try {
      const productData = {
        name: formData.name,
        title: formData.title,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice
          ? parseFloat(formData.originalPrice)
          : 0,
        discount: formData.discount,
        stockCount: parseInt(formData.stockCount),
        inStock: formData.inStock,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        reviews: formData.reviews ? parseInt(formData.reviews) : 0,
        description: formData.description,
        features: formData.features,
        specifications: formData.specifications,
        label: formData.label,
        labelType: formData.labelType,
        backgroundColor: "#1f2937", // Default background color
        images: formData.images,
      };

      if (editProductId) {
        await dispatch(
          updateProductById({ id: editProductId, productData }) as any
        );
        toast.success("Product updated successfully");
      } else {
        await dispatch(createProduct(productData) as any);
        toast.success("Product created successfully");
      }

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
        images: [],
      });
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Tab configuration
  const tabs = [
    { id: "products", label: "Product Management", icon: FaBox },
    { id: "settings", label: "Store Settings", icon: FaCog },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-5 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-sm text-gray-400">{card.label}</p>
              <p className="text-2xl font-bold text-white">{card.value}</p>
            </div>
            {card.icon}
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-2 rounded-lg">
        <div className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-red-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "products" && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-bold text-white">Product Management</h2>
            <div className="flex gap-2">
              <SeedProductsButton />
              <button
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                onClick={() => {
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
                    images: [],
                  });
                  setIsModalOpen(true);
                }}
              >
                <FaPlus /> Add Product
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
            />
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="text-center py-8">
              <div className="text-white">Loading products...</div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-400">Error: {error}</div>
            </div>
          )}

          {/* Products Table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-gray-300">Product</th>
                    <th className="px-6 py-3 text-gray-300">Category</th>
                    <th className="px-6 py-3 text-gray-300">Price</th>
                    <th className="px-6 py-3 text-gray-300">Stock</th>
                    <th className="px-6 py-3 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-700 hover:bg-gray-700/30"
                    >
                      <td className="px-6 py-4 text-white">{product.name}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-white">${product.price}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {product.stockCount}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded ${
                          currentPage === i + 1
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === "settings" && <StoreSettings />}

      {/* Add/Edit Product Modal */}
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
