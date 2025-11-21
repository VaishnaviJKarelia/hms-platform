import { Document } from 'mongoose';

export enum UserRole {
  GUEST = 'guest',
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export enum MembershipTier {
  REGULAR = 'regular',
  BUSINESS = 'business',
  FAMILY = 'family',
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  UPI = 'upi',
  CASH = 'cash',
  WALLET = 'wallet',
}

export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning',
}

export enum TaskType {
  CLEANING = 'cleaning',
  ROOM_SERVICE = 'room_service',
  MAINTENANCE = 'maintenance',
  LAUNDRY = 'laundry',
}

export enum TaskStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum OrderStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum CabBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  EN_ROUTE = 'en_route',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ParkingSlotStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  MAINTENANCE = 'maintenance',
}

export enum EventType {
  CONFERENCE = 'conference',
  WEDDING = 'wedding',
  WORKSHOP = 'workshop',
  PARTY = 'party',
  MEETING = 'meeting',
}

export enum NotificationType {
  BOOKING = 'booking',
  PAYMENT = 'payment',
  ORDER = 'order',
  TASK = 'task',
  EVENT = 'event',
  LOYALTY = 'loyalty',
  SYSTEM = 'system',
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  membershipTier?: MembershipTier;
  loyaltyPoints: number;
  isActive: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}
