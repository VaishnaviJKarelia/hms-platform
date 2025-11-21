import mongoose, { Schema, Document } from 'mongoose';
import { TaskType, TaskStatus, OrderStatus, CabBookingStatus, ParkingSlotStatus, EventType, NotificationType } from '../types';

// Employee Task Model
export interface IEmployeeTask extends Document {
  property: mongoose.Types.ObjectId;
  employee?: mongoose.Types.ObjectId;
  room?: mongoose.Types.ObjectId;
  type: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeTaskSchema = new Schema<IEmployeeTask>({
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  employee: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  type: { type: String, enum: Object.values(TaskType), required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.PENDING, index: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  completedAt: Date,
}, { timestamps: true });

// Inventory Model
export interface IInventoryItem extends Document {
  property: mongoose.Types.ObjectId;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  supplier?: string;
  lastRestocked?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inventoryItemSchema = new Schema<IInventoryItem>({
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true },
  minQuantity: { type: Number, required: true, min: 0 },
  supplier: String,
  lastRestocked: Date,
}, { timestamps: true });

// Menu Item Model
export interface IMenuItem extends Document {
  property: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  preparationTime: number; // minutes
  allergens?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>({
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  image: String,
  isAvailable: { type: Boolean, default: true, index: true },
  preparationTime: { type: Number, required: true, min: 0 },
  allergens: [String],
}, { timestamps: true });

// Order Model
export interface IOrder extends Document {
  property: mongoose.Types.ObjectId;
  guest: mongoose.Types.ObjectId;
  room?: mongoose.Types.ObjectId;
  items: Array<{
    menuItem: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: OrderStatus;
  deliveryInstructions?: string;
  estimatedDeliveryTime?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  guest: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room' },
  items: [{
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING, index: true },
  deliveryInstructions: String,
  estimatedDeliveryTime: Date,
  deliveredAt: Date,
}, { timestamps: true });

// Event Model
export interface IEvent extends Document {
  property: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: EventType;
  startDate: Date;
  endDate: Date;
  location: string;
  capacity: number;
  bookedSeats: number;
  price: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>({
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  type: { type: String, enum: Object.values(EventType), required: true, index: true },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true, min: 0 },
  bookedSeats: { type: Number, default: 0, min: 0 },
  price: { type: Number, required: true, min: 0 },
  images: [String],
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

// Parking Slot Model
export interface IParkingSlot extends Document {
  property: mongoose.Types.ObjectId;
  slotNumber: string;
  level: string;
  status: ParkingSlotStatus;
  vehicleNumber?: string;
  guest?: mongoose.Types.ObjectId;
  checkInTime?: Date;
  checkOutTime?: Date;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const parkingSlotSchema = new Schema<IParkingSlot>({
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  slotNumber: { type: String, required: true, trim: true },
  level: { type: String, required: true },
  status: { type: String, enum: Object.values(ParkingSlotStatus), default: ParkingSlotStatus.AVAILABLE, index: true },
  vehicleNumber: String,
  guest: { type: Schema.Types.ObjectId, ref: 'User' },
  checkInTime: Date,
  checkOutTime: Date,
  qrCode: String,
}, { timestamps: true });

// Cab Booking Model
export interface ICabBooking extends Document {
  property: mongoose.Types.ObjectId;
  guest: mongoose.Types.ObjectId;
  pickupLocation: string;
  dropLocation: string;
  pickupTime: Date;
  cabType: string;
  estimatedFare: number;
  status: CabBookingStatus;
  driverDetails?: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const cabBookingSchema = new Schema<ICabBooking>({
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  guest: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  pickupTime: { type: Date, required: true, index: true },
  cabType: { type: String, required: true },
  estimatedFare: { type: Number, required: true, min: 0 },
  status: { type: String, enum: Object.values(CabBookingStatus), default: CabBookingStatus.PENDING, index: true },
  driverDetails: {
    name: String,
    phone: String,
    vehicleNumber: String,
  },
}, { timestamps: true });

// Loyalty Transaction Model
export interface ILoyaltyTransaction extends Document {
  user: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  points: number;
  type: 'earned' | 'redeemed';
  reason: string;
  relatedBooking?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const loyaltyTransactionSchema = new Schema<ILoyaltyTransaction>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  points: { type: Number, required: true },
  type: { type: String, enum: ['earned', 'redeemed'], required: true },
  reason: { type: String, required: true },
  relatedBooking: { type: Schema.Types.ObjectId, ref: 'Booking' },
}, { timestamps: true });

// Notification Model
export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: any;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: Object.values(NotificationType), required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false, index: true },
  data: Schema.Types.Mixed,
}, { timestamps: true });

// Feedback Model
export interface IFeedback extends Document {
  property: mongoose.Types.ObjectId;
  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  categories: {
    cleanliness?: number;
    service?: number;
    location?: number;
    facilities?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>({
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  booking: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  categories: {
    cleanliness: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
    location: { type: Number, min: 1, max: 5 },
    facilities: { type: Number, min: 1, max: 5 },
  },
}, { timestamps: true });

// AI Insight Model
export interface IAIInsight extends Document {
  property: mongoose.Types.ObjectId;
  type: 'forecast' | 'pricing' | 'sentiment' | 'recommendation';
  data: any;
  generatedAt: Date;
  validUntil?: Date;
  createdAt: Date;
}

const aiInsightSchema = new Schema<IAIInsight>({
  property: { type: Schema.Types.ObjectId, ref: 'HotelProperty', required: true, index: true },
  type: { type: String, enum: ['forecast', 'pricing', 'sentiment', 'recommendation'], required: true, index: true },
  data: { type: Schema.Types.Mixed, required: true },
  generatedAt: { type: Date, default: Date.now, index: true },
  validUntil: Date,
}, { timestamps: true });

// Export all models
export const EmployeeTask = mongoose.model<IEmployeeTask>('EmployeeTask', employeeTaskSchema);
export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', inventoryItemSchema);
export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
export const Order = mongoose.model<IOrder>('Order', orderSchema);
export const Event = mongoose.model<IEvent>('Event', eventSchema);
export const ParkingSlot = mongoose.model<IParkingSlot>('ParkingSlot', parkingSlotSchema);
export const CabBooking = mongoose.model<ICabBooking>('CabBooking', cabBookingSchema);
export const LoyaltyTransaction = mongoose.model<ILoyaltyTransaction>('LoyaltyTransaction', loyaltyTransactionSchema);
export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
export const AIInsight = mongoose.model<IAIInsight>('AIInsight', aiInsightSchema);

// Re-export from other model files
export { User } from './User';
export { HotelChain, HotelProperty } from './Hotel';
export { RoomCategory, Room } from './Room';
export { Booking, Payment } from './Booking';
