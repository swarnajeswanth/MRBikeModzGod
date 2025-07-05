import ImageKit from "imagekit";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_API_KEY!,
  privateKey: process.env.PRIVATE_API_KEY!,
  urlEndpoint: process.env.URL_ENDPOINT!,
});

/**
 * Delete a file from ImageKit by file ID
 * @param fileId - The ImageKit file ID
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export const deleteImageFromImageKit = async (
  fileId: string
): Promise<boolean> => {
  try {
    if (!fileId) {
      console.warn("No file ID provided for ImageKit deletion");
      return false;
    }

    await imagekit.deleteFile(fileId);
    console.log("Image deleted from ImageKit successfully:", fileId);
    return true;
  } catch (error) {
    console.error("Failed to delete image from ImageKit:", error);
    return false;
  }
};

/**
 * Delete multiple files from ImageKit
 * @param fileIds - Array of ImageKit file IDs
 * @returns Promise<{success: string[], failed: string[]}> - Results of deletion attempts
 */
export const deleteMultipleImagesFromImageKit = async (
  fileIds: string[]
): Promise<{ success: string[]; failed: string[] }> => {
  const results = { success: [] as string[], failed: [] as string[] };

  for (const fileId of fileIds) {
    try {
      await imagekit.deleteFile(fileId);
      results.success.push(fileId);
      console.log("Image deleted from ImageKit:", fileId);
    } catch (error) {
      results.failed.push(fileId);
      console.error("Failed to delete image from ImageKit:", fileId, error);
    }
  }

  return results;
};

/**
 * Upload a file to ImageKit
 * @param buffer - File buffer
 * @param fileName - Name of the file
 * @param folder - Optional folder path
 * @returns Promise<ImageKit.UploadResponse>
 */
export const uploadImageToImageKit = async (
  buffer: Buffer,
  fileName: string,
  folder?: string
): Promise<any> => {
  const uploadOptions: any = {
    file: buffer,
    fileName: fileName,
  };

  if (folder) {
    uploadOptions.folder = folder;
  }

  return await imagekit.upload(uploadOptions);
};

/**
 * Get file information from ImageKit
 * @param fileId - The ImageKit file ID
 * @returns Promise<ImageKit.FileObject | null>
 */
export const getImageFromImageKit = async (
  fileId: string
): Promise<any | null> => {
  try {
    const result = await imagekit.getFileDetails(fileId);
    return result;
  } catch (error) {
    console.error("Failed to get image from ImageKit:", error);
    return null;
  }
};

/**
 * List files from ImageKit
 * @param options - List options
 * @returns Promise<ImageKit.FileObject[]>
 */
export const listImagesFromImageKit = async (
  options: any = {}
): Promise<any[]> => {
  try {
    const result = await imagekit.listFiles(options);
    return result;
  } catch (error) {
    console.error("Failed to list images from ImageKit:", error);
    return [];
  }
};

export default imagekit;
