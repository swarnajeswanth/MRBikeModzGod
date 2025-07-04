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
  originalPrice: number;
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
};

// Async thunks for database operations
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await fetch("/api/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return response.json();
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: Omit<Product, "id" | "_id">) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Failed to create product");
    }
    return response.json();
  }
);

export const updateProductById = createAsyncThunk(
  "products/updateProduct",
  async ({
    id,
    productData,
  }: {
    id: string;
    productData: Partial<Product>;
  }) => {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    return response.json();
  }
);

export const deleteProductById = createAsyncThunk(
  "products/deleteProduct",
  async (id: string) => {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete product");
    }
    return { id };
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
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
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
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload.product);
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
        const updatedProduct = action.payload.product;
        const index = state.products.findIndex(
          (p) => p.id === updatedProduct.id || p._id === updatedProduct._id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
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
  addProduct,
  updateProduct,
  deleteProduct,
  setProducts,
  clearProducts,
} = productSlice.actions;

export const selectAllProducts = (state: { product: ProductState }) =>
  state.product.products;

export const selectProductById = (
  state: { product: ProductState },
  productId: string
) =>
  state.product.products.find((p) => p.id === productId || p._id === productId);

export const selectProductsByCategory = (
  state: { product: ProductState },
  category: string
) => state.product.products.filter((p) => p.category === category);

export const selectLoading = (state: { product: ProductState }) =>
  state.product.loading;

export const selectError = (state: { product: ProductState }) =>
  state.product.error;
