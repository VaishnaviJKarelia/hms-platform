import mongoose, { Schema, Document } from 'mongoose';
import { BookingStatus, PaymentStatus, PaymentMethod } from '../types';

export interface IBooking extends Document {
  property: mongoose.Types.ObjectId;
  room: mongoose.Types.ObjectId;
  guest: mongoose.Types.ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  status: BookingStatus;
  specialRequests?: string;
  bookingSource: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment extends Document {
  booking: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'HotelProperty',
      required: true,
      index: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    guest: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    checkInDate: {
      type: Date,
      required: true,
      index: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
      index: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      index: true,
    },
    specialRequests: String,
    bookingSource: {
      type: String,
      default: 'direct',
    },
  },
  {
    timestamps: true,
  }
);

const paymentSchema = new Schema<IPayment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    transactionId: String,
    paymentDate: Date,
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ property: 1, checkInDate: 1, status: 1 });
bookingSchema.index({ guest: 1, status: 1 });
bookingSchema.index({ room: 1, checkInDate: 1, checkOutDate: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
