"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/components/store";
import {
  fetchSliderImages,
  uploadSliderImage,
  updateSliderImage,
  deleteSliderImage,
  reorderSliderImages,
  selectSliderImages,
  selectSliderLoading,
  selectSliderError,
} from "@/components/store/sliderSlice";
import {
  Upload,
  Edit,
  Trash2,
  Move,
  X,
  Plus,
  Save,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

interface SliderManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SliderManager: React.FC<SliderManagerProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const images = useSelector(selectSliderImages);
  const loading = useSelector(selectSliderLoading);
  const error = useSelector(selectSliderError);

  const [isUploading, setIsUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchSliderImages() as any);
    }
  }, [isOpen, dispatch]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      await dispatch(
        uploadSliderImage({
          file,
          alt: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for alt text
          title: "",
          description: "",
        }) as any
      );
      toast.success("Image uploaded successfully");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditImage = async (imageId: string, updates: any) => {
    try {
      await dispatch(
        updateSliderImage({ id: imageId, imageData: updates }) as any
      );
      toast.success("Image updated successfully");
      setEditingImage(null);
    } catch (error) {
      toast.error("Failed to update image");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await dispatch(deleteSliderImage(imageId) as any);
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newImages = [...images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    const imageIds = newImages.map((img) => img.id);

    try {
      await dispatch(reorderSliderImages(imageIds) as any);
      toast.success("Images reordered successfully");
    } catch (error) {
      toast.error("Failed to reorder images");
    }

    setDragIndex(null);
    setDragOverIndex(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Manage Hero Slider
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Upload Section */}
          <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">
              Upload New Image
            </h3>
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
              </button>
              <p className="text-gray-400 text-sm">
                Supported: JPG, PNG, GIF (max 5MB)
              </p>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop(e, index)}
                className={`bg-gray-700 rounded-lg overflow-hidden border-2 transition-all ${
                  dragIndex === index
                    ? "border-red-500 opacity-50"
                    : dragOverIndex === index
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
              >
                <div className="relative">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    #{index + 1}
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => setEditingImage(image)}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-1 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <div className="bg-gray-600 text-white p-1 rounded cursor-move">
                      <Move className="h-3 w-3" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="text-white font-medium text-sm mb-1">
                    {image.title || image.alt}
                  </h4>
                  {image.description && (
                    <p className="text-gray-400 text-xs mb-2">
                      {image.description}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs">Alt: {image.alt}</p>
                </div>
              </div>
            ))}
          </div>

          {images.length === 0 && !loading && (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">📷</div>
              <p className="text-gray-400">No images uploaded yet</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
              <p className="text-gray-400">Loading images...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-4">
              <p className="text-red-400">Error: {error}</p>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingImage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Edit Image</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleEditImage(editingImage.id, {
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    alt: formData.get("alt") as string,
                  });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingImage.title}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingImage.description}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    name="alt"
                    defaultValue={editingImage.alt}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingImage(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderManager;
