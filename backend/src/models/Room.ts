import mongoose, { Schema, Document } from 'mongoose';
import { RoomStatus } from '../types';

export interface IRoomCategory extends Document {
  property: mongoose.Types.ObjectId;
  name: string;
  description: string;
  basePrice: number;
  maxOccupancy: number;
  bedType: string;
  size: number; // in sq ft
  amenities: string[];
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoom extends Document {
  property: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  roomNumber: string;
  floor: number;
  status: RoomStatus;
  lastCleaned?: Date;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roomCategorySchema = new Schema<IRoomCategory>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'HotelProperty',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    maxOccupancy: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    bedType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    amenities: [String],
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const roomSchema = new Schema<IRoom>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'HotelProperty',
      required: true,
      index: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'RoomCategory',
      required: true,
      index: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RoomStatus),
      default: RoomStatus.AVAILABLE,
      index: true,
    },
    lastCleaned: Date,
    notes: String,
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
roomSchema.index({ property: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ property: 1, status: 1, isActive: 1 });
roomSchema.index({ category: 1, status: 1 });

roomCategorySchema.index({ property: 1, isActive: 1 });

export const RoomCategory = mongoose.model<IRoomCategory>('RoomCategory', roomCategorySchema);
export const Room = mongoose.model<IRoom>('Room', roomSchema);
