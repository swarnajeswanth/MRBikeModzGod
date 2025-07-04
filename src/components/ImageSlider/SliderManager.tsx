"use client";

import React, { useState } from "react";

interface SlideImage {
  id: string;
  url: string;
  alt: string;
  title?: string;
}

interface SliderManagerProps {
  images: SlideImage[];
  onImagesChange: (images: SlideImage[]) => void;
  onClose: () => void;
}

const SliderManager: React.FC<SliderManagerProps> = ({
  images,
  onImagesChange,
  onClose,
}) => {
  const [editingImage, setEditingImage] = useState<SlideImage | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const availableImages = [
    {
      id: "photo-1649972904349-6e44c42644a7",
      alt: "Premium Auto Parts Display",
      title: "Premium Auto Parts",
    },
    {
      id: "photo-1488590528505-98d2b5aba04b",
      alt: "Car Electronics",
      title: "Latest Car Electronics",
    },
    {
      id: "photo-1518770660439-4636190af475",
      alt: "Performance Components",
      title: "Performance Components",
    },
    {
      id: "photo-1486312338219-ce68d2c6f44d",
      alt: "Professional Installation",
      title: "Professional Installation",
    },
    {
      id: "photo-1581091226825-a6a2a5aee158",
      alt: "Customer Service",
      title: "Expert Customer Service",
    },
    {
      id: "photo-1517022812141-23620dba5c23",
      alt: "Quality Parts",
      title: "Quality Guaranteed",
    },
    {
      id: "photo-1582562124811-c09040d0a901",
      alt: "Auto Accessories",
      title: "Premium Accessories",
    },
    {
      id: "photo-1721322800607-8c38375eef04",
      alt: "Showroom Display",
      title: "Visit Our Showroom",
    },
  ];

  const handleAddImage = (img: { id: string; alt: string; title: string }) => {
    const newImage: SlideImage = {
      id: Date.now().toString(),
      url: img.id,
      alt: img.alt,
      title: img.title,
    };
    onImagesChange([...images, newImage]);
    setIsAddingNew(false);
  };

  const handleRemoveImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  const handleUpdateImage = (img: SlideImage) => {
    onImagesChange(images.map((i) => (i.id === img.id ? img : i)));
    setEditingImage(null);
  };

  const IconX = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  const IconPlus = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );

  const IconEdit = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
      <path d="M13 13l-6 6H3v-4l6-6" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-slate-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Image Slider</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-2 rounded-full"
          >
            <IconX />
          </button>
        </div>

        {/* Existing images */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Images ({images.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div
                key={img.id}
                className="bg-slate-700 rounded-lg overflow-hidden"
              >
                <img
                  src={`https://images.unsplash.com/${img.url}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                  alt={img.alt}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <p className="text-white text-sm font-medium">
                    {img.title || img.alt}
                  </p>
                  <p className="text-xs text-gray-400">Position: {i + 1}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => setEditingImage(img)}
                      className="text-xs px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-500 flex items-center"
                    >
                      <IconEdit />
                      <span className="ml-1">Edit</span>
                    </button>
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 flex items-center"
                    >
                      <IconX />
                      <span className="ml-1">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add new image */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Add New Image</h3>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="text-xs px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-500 flex items-center"
            >
              <IconPlus />
              <span className="ml-1">Add Image</span>
            </button>
          </div>

          {isAddingNew && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableImages
                .filter(
                  (img) => !images.some((existing) => existing.url === img.id)
                )
                .map((img) => (
                  <div
                    key={img.id}
                    className="bg-slate-700 rounded-lg overflow-hidden hover:bg-slate-600 transition cursor-pointer"
                  >
                    <img
                      src={`https://images.unsplash.com/${img.id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                      alt={img.alt}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <p className="text-white text-sm font-medium">
                        {img.title}
                      </p>
                      <button
                        onClick={() => handleAddImage(img)}
                        className="mt-2 w-full text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        Add to Slider
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Edit modal */}
        {editingImage && (
          <div className="fixed inset-0 z-60 bg-black/50 flex justify-center items-center p-4">
            <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold text-white mb-4">
                Edit Image
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Title
                  </label>
                  <input
                    value={editingImage.title || ""}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter image title"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 mb-1 block">
                    Alt Text
                  </label>
                  <input
                    value={editingImage.alt}
                    onChange={(e) =>
                      setEditingImage({ ...editingImage, alt: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Enter alt text"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateImage(editingImage)}
                    className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingImage(null)}
                    className="flex-1 px-3 py-2 border border-slate-500 text-white rounded hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SliderManager;
