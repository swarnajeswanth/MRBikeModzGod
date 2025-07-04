import mongoose, { Schema, Document } from "mongoose";

export interface ISliderImage extends Document {
  id: string;
  url: string;
  alt: string;
  title?: string;
  description?: string;
  order: number;
  imageKitId?: string;
  imageKitUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SliderImageSchema = new Schema<ISliderImage>(
  {
    id: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    alt: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
    imageKitId: { type: String },
    imageKitUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

// Generate unique ID before saving
SliderImageSchema.pre("save", function (next) {
  if (!this.id) {
    this.id = `slider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

const SliderImage =
  mongoose.models.SliderImage ||
  mongoose.model<ISliderImage>("SliderImage", SliderImageSchema);

export default SliderImage;
