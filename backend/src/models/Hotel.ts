import mongoose, { Schema, Document } from 'mongoose';

export interface IHotelChain extends Document {
  name: string;
  description: string;
  logo?: string;
  headquarters: string;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHotelProperty extends Document {
  chain: mongoose.Types.ObjectId;
  name: string;
  description: string;
  images: string[];
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contactEmail: string;
  contactPhone: string;
  amenities: string[];
  wifiCredentials: {
    ssid: string;
    password: string;
  };
  checkInTime: string;
  checkOutTime: string;
  starRating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hotelChainSchema = new Schema<IHotelChain>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: String,
    headquarters: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
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

const hotelPropertySchema = new Schema<IHotelProperty>(
  {
    chain: {
      type: Schema.Types.ObjectId,
      ref: 'HotelChain',
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
    images: [String],
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true, index: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    amenities: [String],
    wifiCredentials: {
      ssid: String,
      password: String,
    },
    checkInTime: {
      type: String,
      default: '14:00',
    },
    checkOutTime: {
      type: String,
      default: '11:00',
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
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

hotelPropertySchema.index({ 'address.city': 1, isActive: 1 });
hotelPropertySchema.index({ chain: 1, isActive: 1 });

export const HotelChain = mongoose.model<IHotelChain>('HotelChain', hotelChainSchema);
export const HotelProperty = mongoose.model<IHotelProperty>('HotelProperty', hotelPropertySchema);
