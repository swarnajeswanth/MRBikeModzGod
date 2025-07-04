# Redux Products Integration Guide

## Overview

The application now uses Redux store for product management with persistence. All product data is stored in Redux and persists across browser sessions.

## Store Configuration

### Product Slice Features

- ✅ **CRUD Operations**: Add, Update, Delete, Read products
- ✅ **Loading States**: Track loading states for API calls
- ✅ **Error Handling**: Store and display error messages
- ✅ **Persistence**: Products persist across browser sessions
- ✅ **TypeScript Support**: Full type safety

### Redux Persist Setup

```typescript
// store/index.ts
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "product"], // Both user and product data persist
};
```

## Usage Examples

### 1. Using Products in Components

```typescript
import { useSelector } from "react-redux";
import {
  selectAllProducts,
  selectLoading,
  selectError,
} from "@/components/store/productSlice";

const MyComponent = () => {
  const products = useSelector(selectAllProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

### 2. Adding a New Product

```typescript
import { useDispatch } from "react-redux";
import { addProduct } from "@/components/store/productSlice";
import { productApi } from "@/components/lib/apiUtils";

const AddProductComponent = () => {
  const dispatch = useDispatch();

  const handleAddProduct = async (productData) => {
    const response = await productApi.add(productData);

    if (response.success) {
      // The product is automatically added to Redux store
      // via the API utility function
      console.log("Product added successfully!");
    }
  };

  return (
    <button
      onClick={() =>
        handleAddProduct({
          name: "New Product",
          description: "Product description",
          price: 99.99,
          category: "Electronics",
        })
      }
    >
      Add Product
    </button>
  );
};
```

### 3. Updating a Product

```typescript
import { useDispatch } from "react-redux";
import { updateProduct } from "@/components/store/productSlice";
import { productApi } from "@/components/lib/apiUtils";

const UpdateProductComponent = () => {
  const dispatch = useDispatch();

  const handleUpdateProduct = async (productId, updates) => {
    const response = await productApi.update(productId, updates);

    if (response.success) {
      // Product is automatically updated in Redux store
      console.log("Product updated successfully!");
    }
  };

  return (
    <button
      onClick={() =>
        handleUpdateProduct("product-id", {
          price: 149.99,
          name: "Updated Name",
        })
      }
    >
      Update Product
    </button>
  );
};
```

### 4. Deleting a Product

```typescript
import { useDispatch } from "react-redux";
import { deleteProduct } from "@/components/store/productSlice";
import { productApi } from "@/components/lib/apiUtils";

const DeleteProductComponent = () => {
  const dispatch = useDispatch();

  const handleDeleteProduct = async (productId) => {
    const response = await productApi.delete(productId);

    if (response.success) {
      // Product is automatically removed from Redux store
      console.log("Product deleted successfully!");
    }
  };

  return (
    <button onClick={() => handleDeleteProduct("product-id")}>
      Delete Product
    </button>
  );
};
```

### 5. Filtering Products

```typescript
import { useSelector } from "react-redux";
import { selectProductsByCategory } from "@/components/store/productSlice";

const CategoryProducts = ({ category }) => {
  const products = useSelector((state) =>
    selectProductsByCategory(state, category)
  );

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

### 6. Getting a Single Product

```typescript
import { useSelector } from "react-redux";
import { selectProductById } from "@/components/store/productSlice";

const ProductDetail = ({ productId }) => {
  const product = useSelector((state) => selectProductById(state, productId));

  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>${product.price}</span>
    </div>
  );
};
```

## Available Selectors

```typescript
// Get all products
const products = useSelector(selectAllProducts);

// Get products by category
const categoryProducts = useSelector((state) =>
  selectProductsByCategory(state, "Electronics")
);

// Get single product by ID
const product = useSelector((state) => selectProductById(state, "product-id"));

// Get loading state
const loading = useSelector(selectLoading);

// Get error state
const error = useSelector(selectError);
```

## Available Actions

```typescript
// Add product
dispatch(addProduct(newProduct));

// Update product
dispatch(updateProduct(updatedProduct));

// Delete product
dispatch(deleteProduct(productId));

// Set all products
dispatch(setProducts(productsArray));

// Set loading state
dispatch(setLoading(true / false));

// Set error state
dispatch(setError("Error message"));

// Clear products
dispatch(clearProducts());
```

## Product Data Structure

```typescript
type Product = {
  _id?: string; // Database ID
  id: string; // Frontend ID
  name: string; // Product name
  title: string; // Display title
  label: string; // Badge label (SALE, NEW, etc.)
  labelType: string; // Badge type
  backgroundColor: string; // Badge color
  category: string; // Product category
  rating: number; // Average rating
  reviews: number; // Number of reviews
  price: number; // Current price
  originalPrice?: number; // Original price (for discounts)
  discount?: string; // Discount percentage
  description: string; // Product description
  features: string[]; // Product features
  specifications: Record<string, string>; // Product specs
  images: string[]; // Product images
  inStock: boolean; // Stock availability
  stockCount: number; // Stock quantity
  brand?: string; // Product brand
  stock?: number; // Database stock field
  image?: string; // Database image field
  createdAt?: Date; // Creation date
  updatedAt?: Date; // Last update date
};
```

## Benefits

1. **Centralized State**: All product data in one place
2. **Persistence**: Data survives browser refreshes
3. **Real-time Updates**: Changes reflect immediately across components
4. **Type Safety**: Full TypeScript support
5. **Performance**: Efficient updates and re-renders
6. **Error Handling**: Centralized error management
7. **Loading States**: Better UX with loading indicators

## Migration from Local State

If you have components using local product data, simply:

1. Remove local product arrays/state
2. Import Redux selectors
3. Use `useSelector` to get products
4. Use `useDispatch` for product operations

The API utilities handle the Redux store updates automatically, so you don't need to manually dispatch actions in most cases.
