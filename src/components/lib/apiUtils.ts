import toast from "react-hot-toast";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export const handleApiResponse = async <T>(
  response: Response,
  successMessage?: string
): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();

    if (response.ok) {
      if (successMessage) {
        toast.success(successMessage);
      }
      return {
        success: true,
        message: data.message || successMessage || "Operation successful",
        data: data,
      };
    } else {
      // Handle different error status codes
      let errorMessage = data.message || "Something went wrong";

      switch (response.status) {
        case 400:
          errorMessage = data.message || "Invalid request data";
          break;
        case 401:
          errorMessage = data.message || "Unauthorized access";
          break;
        case 403:
          errorMessage = data.message || "Access forbidden";
          break;
        case 404:
          errorMessage = data.message || "Resource not found";
          break;
        case 409:
          errorMessage = data.message || "Conflict with existing data";
          break;
        case 422:
          errorMessage = data.message || "Validation failed";
          break;
        case 500:
          errorMessage = data.message || "Server error occurred";
          break;
        default:
          errorMessage = data.message || "An unexpected error occurred";
      }

      toast.error(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  } catch (error) {
    console.error("API Response Error:", error);
    const errorMessage = "Failed to process response";
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  successMessage?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    return await handleApiResponse<T>(response, successMessage);
  } catch (error) {
    console.error("API Request Error:", error);
    const errorMessage = "Network error occurred";
    toast.error(errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Product API functions
export const productApi = {
  add: async (productData: any) => {
    return apiRequest(
      "/api/products/add",
      {
        method: "POST",
        body: JSON.stringify(productData),
      },
      "Product added successfully!"
    );
  },

  update: async (id: string, productData: any) => {
    return apiRequest(
      `/api/products/update/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(productData),
      },
      "Product updated successfully!"
    );
  },

  delete: async (id: string) => {
    return apiRequest(
      `/api/products/delete/${id}`,
      {
        method: "DELETE",
      },
      "Product deleted successfully!"
    );
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      return await handleApiResponse(response, "Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
      return {
        success: false,
        message: "Failed to upload image",
      };
    }
  },

  getFiles: async (path?: string, type?: "all") => {
    const params = new URLSearchParams();
    if (path) params.append("path", path);
    if (type) params.append("type", type);

    const url = `/api/upload?${params.toString()}`;
    return apiRequest(url, { method: "GET" });
  },
};
