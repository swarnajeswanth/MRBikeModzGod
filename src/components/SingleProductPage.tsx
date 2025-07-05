"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RootState, AppDispatch } from "@/components/store";
import {
  selectProductById,
  selectProductsByCategory,
  selectAllProducts,
  fetchProducts,
} from "@/components/store/productSlice";
import { toggleWishlist } from "@/components/store/UserSlice";
import { toast } from "react-hot-toast";
import { selectIsCustomerExperienceEnabled } from "@/components/store/storeSettingsSlice";

const ProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const productId = params.productId as string;
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  // Get product from Redux store - try by ID first, then by title
  const product = useSelector((state: RootState) => {
    const productById = selectProductById(state, productId);
    if (productById) return productById;

    // If not found by ID, try to find by title or name
    const allProducts = state.product.products;
    const decodedProductId = decodeURIComponent(productId).toLowerCase();

    return allProducts.find(
      (p: any) =>
        p.title?.toLowerCase() === decodedProductId ||
        p.name?.toLowerCase() === decodedProductId ||
        p.id?.toLowerCase() === decodedProductId ||
        p._id?.toLowerCase() === decodedProductId
    );
  });

  // Get all products and wishlist state
  const products = useSelector(selectAllProducts);

  // Get related products from same category
  const relatedProducts = useSelector((state: RootState) =>
    product ? selectProductsByCategory(state, product.category) : []
  )
    .filter((p) => p.id !== productId)
    .slice(0, 3);

  // If product is not found, show a better error message
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🔍</div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Product Not Found
              </h1>
              <p className="text-gray-400 mb-6">
                Looking for product ID:{" "}
                <span className="text-red-400">{productId}</span>
              </p>
              <p className="text-gray-400 mb-8">
                Total products loaded: {products.length}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                The product you're looking for doesn't exist or may have been
                removed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/")}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Go to Homepage
                </button>
                <button
                  onClick={() => router.push("/product/allproducts")}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse All Products
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  const { wishlist, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  );
  const requireLoginForWishlist = useSelector(
    selectIsCustomerExperienceEnabled("requireLoginForWishlist")
  );
  const isInWishlist = product
    ? wishlist.some((item) => item.id === product.id)
    : false;

  // Load products if not already loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  // If product not found but products are loaded, try refreshing
  useEffect(() => {
    if (!product && products.length > 0) {
      // Try to find the product again after a short delay
      const timer = setTimeout(() => {
        dispatch(fetchProducts());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [product, products.length, dispatch]);

  // Handle wishlist toggle
  const handleToggleWishlist = () => {
    // Check if product exists
    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Check if login is required for wishlist and user is not logged in
    if (requireLoginForWishlist && !isLoggedIn) {
      toast.error("Please log in to use the wishlist.");
      router.push("/auth");
      return;
    }

    const wishlistItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        product.images && product.images.length > 0 ? product.images[0] : "",
      category: product.category,
    };

    dispatch(toggleWishlist(wishlistItem));

    const isInWishlist = wishlist.some((item) => item.id === product.id);
    if (isInWishlist) {
      toast.success("Removed from wishlist");
    } else {
      toast.success("Added to wishlist");
    }
  };

  // Handle quantity change
  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    toast.success(`Added ${quantity} ${product?.name} to cart`);
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Navigate to product
  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  // Navigate to category
  const navigateToCategory = (category: string) => {
    router.push(`/category/${category.toLowerCase()}`);
  };

  // If product not found, show loading or error
  if (!product) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-white text-xl">Product not found</div>
            <div className="text-gray-400 text-sm mt-2">
              Looking for product ID: {productId}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Total products loaded: {products.length}
            </div>
            <button
              onClick={() => router.back()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get unique categories from products for the shop by categories section
  const shopByCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
          <span>/</span>
          <button
            onClick={() => navigateToCategory(product.category)}
            className="hover:text-white transition-colors"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div
              className={`aspect-square rounded-lg overflow-hidden ${
                product.images && product.images.length > 0 ? "bg-gray-800" : ""
              }`}
              style={
                !product.images || product.images.length === 0
                  ? { background: product.backgroundColor }
                  : {}
              }
            >
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-white opacity-20">
                  {product.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-red-500"
                        : "border-gray-600"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Gradient Background Thumbnails (when no images) */}
            {(!product.images || product.images.length === 0) &&
              product.backgroundColor && (
                <div className="flex space-x-2">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg border-2 ${
                        selectedImage === index
                          ? "border-red-500"
                          : "border-gray-600"
                      }`}
                      style={{ background: product.backgroundColor }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-white opacity-20">
                        {product.name.charAt(0)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Label */}
            {product.label && (
              <span
                className="inline-block px-3 py-1 text-sm font-semibold text-white rounded"
                style={{ backgroundColor: product.backgroundColor }}
              >
                {product.label}
              </span>
            )}

            {/* Product Title */}
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-white">
                ₹{product.price}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm">
                      {product.discount}
                    </span>
                  </>
                )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.inStock ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-gray-400">
                {product.inStock
                  ? `${product.stockCount} in stock`
                  : "Out of stock"}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-600 rounded">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 hover:bg-gray-700 transition-colors"
                  >
                    <Minus className="h-4 w-4 text-white" />
                  </button>
                  <span className="px-4 py-2 text-white">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 hover:bg-gray-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className="p-3 border border-gray-600 hover:border-red-500 rounded-lg transition-colors"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      isInWishlist
                        ? "text-red-500 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 border border-gray-600 hover:border-red-500 rounded-lg transition-colors"
                >
                  <Share2 className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Specifications
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(
                      ([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400">{key}:</span>
                          <span className="text-white">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  onClick={() => navigateToProduct(relatedProduct.id)}
                  className="bg-gray-800/50 border border-gray-700 hover:border-red-500/30 transition-all duration-300 rounded-lg overflow-hidden cursor-pointer"
                >
                  <div
                    className={`aspect-square flex items-center justify-center ${
                      relatedProduct.images && relatedProduct.images.length > 0
                        ? "bg-gray-700"
                        : ""
                    }`}
                    style={
                      !relatedProduct.images ||
                      relatedProduct.images.length === 0
                        ? { background: relatedProduct.backgroundColor }
                        : {}
                    }
                  >
                    {relatedProduct.images &&
                    relatedProduct.images.length > 0 ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl font-bold text-white opacity-20">
                        {relatedProduct.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-white">
                        ₹{relatedProduct.price}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-gray-400 text-sm ml-1">
                          {relatedProduct.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
