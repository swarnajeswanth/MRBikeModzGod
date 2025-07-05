// store/productSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type Product = {
  _id?: string;
  id: string;
  name: string;
  label: string;
  labelType: string;
  backgroundColor: string;
  category: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  discount: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  images: string[];
  inStock: boolean;
  stockCount: number;
  // Database fields
  brand?: string;
  stock?: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;
  // Individual operation loading states
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  fetchLoading: boolean;
};

// Async thunks for database operations
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { dispatch }) => {
    dispatch(setFetchLoading(true));
    try {
      console.log("Fetching products from API...");
      const response = await fetch("/api/products");
      console.log("API response status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      console.log("API response data:", data);

      // Handle different response formats
      let products = [];
      if (Array.isArray(data)) {
        products = data;
      } else if (data.products && Array.isArray(data.products)) {
        products = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        products = data.data;
      }

      console.log("Products array length:", products.length);
      return products;
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      throw error;
    } finally {
      dispatch(setFetchLoading(false));
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: Omit<Product, "id" | "_id">, { dispatch }) => {
    dispatch(setCreateLoading(true));
    try {
      console.log("Creating product with data:", productData);

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);
        throw new Error(
          errorData.message || `Failed to create product: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("API success response:", result);
      return result.product;
    } finally {
      dispatch(setCreateLoading(false));
    }
  }
);

export const updateProductById = createAsyncThunk(
  "products/updateProduct",
  async (
    {
      id,
      productData,
    }: {
      id: string;
      productData: Partial<Product>;
    },
    { dispatch }
  ) => {
    dispatch(setUpdateLoading(true));
    try {
      console.log("Updating product with ID:", id, "Data:", productData);

      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      console.log("Update API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Update API error response:", errorData);
        throw new Error(
          errorData.message || `Failed to update product: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Update API success response:", result);
      return result.product;
    } finally {
      dispatch(setUpdateLoading(false));
    }
  }
);

export const deleteProductById = createAsyncThunk(
  "products/deleteProduct",
  async (id: string, { dispatch }) => {
    dispatch(setDeleteLoading(true));
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to delete product: ${response.status}`
        );
      }

      return { id };
    } finally {
      dispatch(setDeleteLoading(false));
    }
  }
);

// Seed products async thunk
export const seedProducts = createAsyncThunk(
  "products/seedProducts",
  async () => {
    const response = await fetch("/api/seed-products", {
      method: "POST",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to seed products");
    }

    // Fetch the newly seeded products to update the store
    const productsResponse = await fetch("/api/products");
    if (!productsResponse.ok) {
      throw new Error("Failed to fetch seeded products");
    }

    const productsData = await productsResponse.json();
    return productsData;
  }
);

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  // Individual operation loading states
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  fetchLoading: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCreateLoading: (state, action) => {
      state.createLoading = action.payload;
    },
    setUpdateLoading: (state, action) => {
      state.updateLoading = action.payload;
    },
    setDeleteLoading: (state, action) => {
      state.deleteLoading = action.payload;
    },
    setFetchLoading: (state, action) => {
      state.fetchLoading = action.payload;
    },
    // Add new product
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },

    // Update existing product
    updateProduct: (state, action: PayloadAction<Product>) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(
        (p) => p.id === updatedProduct.id || p._id === updatedProduct._id
      );
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...updatedProduct };
      }
    },

    // Delete product
    deleteProduct: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.products = state.products.filter(
        (p) => p.id !== productId && p._id !== productId
      );
    },

    // Set all products (for initial load)
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },

    // Clear products
    clearProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        console.log("fetchProducts.fulfilled - payload:", action.payload);

        // Handle different response formats
        let products = [];
        if (Array.isArray(action.payload)) {
          products = action.payload;
        } else if (
          action.payload?.products &&
          Array.isArray(action.payload.products)
        ) {
          products = action.payload.products;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          products = action.payload.data;
        }

        console.log("Setting products array length:", products.length);
        state.products = products;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
        console.error("fetchProducts.rejected - error:", action.error);
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both direct product object and wrapped response
        const product = action.payload?.product || action.payload;
        if (product && (product.id || product._id)) {
          state.products.push(product);
        } else {
          console.warn(
            "CreateProduct: Invalid product data received",
            action.payload
          );
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      });

    // Update product
    builder
      .addCase(updateProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductById.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload?.product || action.payload;

        // Check if updatedProduct exists and has required properties
        if (updatedProduct && (updatedProduct.id || updatedProduct._id)) {
          const index = state.products.findIndex(
            (p) => p.id === updatedProduct.id || p._id === updatedProduct._id
          );
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
        } else {
          console.warn(
            "UpdateProductById: Invalid product data received",
            action.payload
          );
        }
      })
      .addCase(updateProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      });

    // Delete product
    builder
      .addCase(deleteProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (p) => p.id !== action.payload.id && p._id !== action.payload.id
        );
      })
      .addCase(deleteProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      });

    // Seed products
    builder
      .addCase(seedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(seedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(seedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to seed products";
      });
  },
});

export default productSlice.reducer;
export const {
  setLoading,
  setError,
  setCreateLoading,
  setUpdateLoading,
  setDeleteLoading,
  setFetchLoading,
  addProduct,
  updateProduct,
  deleteProduct,
  setProducts,
  clearProducts,
} = productSlice.actions;

export const selectAllProducts = (state: { product: ProductState }) =>
  state.product.products || [];

export const selectProductById = (
  state: { product: ProductState },
  productId: string
) =>
  state.product.products.find(
    (p) =>
      p.id === productId ||
      p._id === productId ||
      p.id?.toLowerCase() === productId.toLowerCase() ||
      p._id?.toLowerCase() === productId.toLowerCase()
  );

export const selectProductsByCategory = (
  state: { product: ProductState },
  category: string
) =>
  state.product.products.filter(
    (p) => p.category?.toLowerCase() === category.toLowerCase()
  );

export const selectUniqueCategories = (state: { product: ProductState }) => {
  const categories = state.product.products
    .map((p) => p.category)
    .filter(Boolean); // Filter out undefined/null categories
  return [...new Set(categories)].sort();
};

export const selectCategoriesWithCount = (state: { product: ProductState }) => {
  const categoryCounts = state.product.products.reduce((acc, product) => {
    if (product.category) {
      acc[product.category] = (acc[product.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
};

export const selectLoading = (state: { product: ProductState }) =>
  state.product.loading;

export const selectError = (state: { product: ProductState }) =>
  state.product.error;

export const selectCreateLoading = (state: { product: ProductState }) =>
  state.product.createLoading;

export const selectUpdateLoading = (state: { product: ProductState }) =>
  state.product.updateLoading;

export const selectDeleteLoading = (state: { product: ProductState }) =>
  state.product.deleteLoading;

export const selectFetchLoading = (state: { product: ProductState }) =>
  state.product.fetchLoading;
