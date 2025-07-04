# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory of your project with the following variables:

```env
# ImageKit Configuration
PUBLIC_API_KEY=public_ZFoiP6RZgIOPXH6oyKtvx30tsP0=
PRIVATE_API_KEY=private_edCsm3Wc184mIdfrXGgDyhYPq94=
URL_ENDPOINT=https://ik.imagekit.io/zuyq5smr3

# JWT Secret (for authentication)
JWT_SECRET=your_jwt_secret_here

# MongoDB Connection (if not already configured)
MONGODB_URI=your_mongodb_connection_string
```

## API Endpoints Created

### Authentication

- `POST /api/auth/login` - User login with role validation
- `POST /api/auth/signup` - User registration with role selection

### Product Management

- `POST /api/products/add` - Add new product
- `PUT /api/products/update/[id]` - Update existing product
- `DELETE /api/products/delete/[id]` - Delete product

### Image Upload

- `POST /api/upload` - Upload image to ImageKit
- `GET /api/upload` - List uploaded files

## Features Implemented

1. **Enhanced Error Handling**: All API routes now return consistent error responses with toast notifications
2. **Role-based Authentication**: Users can select between "customer" and "retailer" roles
3. **Product CRUD Operations**: Complete product management with validation
4. **Image Upload**: Integrated ImageKit for image storage and management
5. **Toast Notifications**: User-friendly feedback for all operations

## Usage Examples

### Adding a Product

```javascript
import { productApi } from "@/components/lib/apiUtils";

const result = await productApi.add({
  name: "Product Name",
  description: "Product Description",
  price: 99.99,
  category: "Electronics",
  image: "image_url",
  stock: 10,
  brand: "Brand Name",
});
```

### Uploading an Image

```javascript
const fileInput = document.getElementById("file");
const result = await productApi.uploadImage(fileInput.files[0]);
if (result.success) {
  console.log("Image URL:", result.data.url);
}
```

### Updating a Product

```javascript
const result = await productApi.update(productId, {
  name: "Updated Name",
  price: 149.99,
});
```

### Deleting a Product

```javascript
const result = await productApi.delete(productId);
```

## Error Handling

All API calls automatically show toast notifications for:

- Success operations
- Validation errors
- Server errors
- Network errors
- Authentication errors

The system provides user-friendly error messages for different scenarios.

## Railway Deployment Environment Variables

- `PORT`: Set automatically by Railway for the WebSocket server. No manual action needed.
- `NEXT_PUBLIC_WS_URL`: Set this in your Railway frontend service to the public WebSocket endpoint provided by Railway (e.g., `wss://your-railway-app.up.railway.app/sync`).

For local development, you can use a `.env` file with:

```
NEXT_PUBLIC_WS_URL=ws://localhost:3001/sync
```

No changes are needed to your code to switch between local and Railway deployments—just set the environment variable appropriately.
