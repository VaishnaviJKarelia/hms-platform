import { Router } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { UserRole } from '../types';
import { 
  HotelChain, HotelProperty, Room, RoomCategory, Booking,
  EmployeeTask, MenuItem, Order, Event, ParkingSlot,
  CabBooking, LoyaltyTransaction, Feedback, Notification
} from '../models';
import { aiService } from '../services/ai.service';

// Hotel Routes
export const hotelRouter = Router();

hotelRouter.get('/chains', async (req: AuthRequest, res) => {
  try {
    const chains = await HotelChain.find({ isActive: true });
    res.json(chains);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

hotelRouter.get('/properties', async (req: AuthRequest, res) => {
  try {
    const { city, chainId } = req.query;
    const filter: any = { isActive: true };
    if (city) filter['address.city'] = new RegExp(city as string, 'i');
    if (chainId) filter.chain = chainId;
    
    const properties = await HotelProperty.find(filter).populate('chain');
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

hotelRouter.get('/properties/:id', async (req, res) => {
  try {
    const property = await HotelProperty.findById(req.params.id).populate('chain');
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Room Routes
export const roomRouter = Router();

roomRouter.get('/', async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests, minPrice, maxPrice } = req.query;
    
    const filter: any = { isActive: true };
    if (propertyId) filter.property = propertyId;
    
    const categories = await RoomCategory.find({ 
      property: propertyId, 
      isActive: true,
      ...(minPrice && { basePrice: { $gte: Number(minPrice) } }),
      ...(maxPrice && { basePrice: { $lte: Number(maxPrice) } }),
      ...(guests && { maxOccupancy: { $gte: Number(guests) } })
    }).populate('property');
    
    // Get available rooms for each category
    const categoriesWithRooms = await Promise.all(
      categories.map(async (category) => {
        const availableRooms = await Room.find({
          category: category._id,
          status: 'available',
          isActive: true,
        });
        return {
          ...category.toObject(),
          availableRooms: availableRooms.length,
        };
      })
    );
    
    res.json(categoriesWithRooms);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Booking Routes
export const bookingRouter = Router();

bookingRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { property, roomId, checkInDate, checkOutDate, numberOfGuests, totalPrice, specialRequests } = req.body;
    
    // Check room availability
    const room = await Room.findById(roomId);
    if (!room || room.status !== 'available') {
      res.status(400).json({ error: 'Room not available' });
      return;
    }
    
    const booking = new Booking({
      property,
      room: roomId,
      guest: req.user!.userId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      specialRequests,
      status: 'confirmed',
    });
    
    await booking.save();
    
    // Update room status
    room.status = 'occupied';
    await room.save();
    
    // Award loyalty points (10% of booking value)
    const points = Math.floor(totalPrice * 0.1);
    await LoyaltyTransaction.create({
      user: req.user!.userId,
      property,
      points,
      type: 'earned',
      reason: 'Booking completed',
      relatedBooking: booking._id,
    });
    
    res.status(201).json({ booking, loyaltyPointsEarned: points });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

bookingRouter.get('/my-bookings', authenticate, async (req: AuthRequest, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user!.userId })
      .populate('property')
      .populate('room')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Employee Task Routes
export const employeeRouter = Router();

employeeRouter.get('/tasks', authenticate, authorize(UserRole.EMPLOYEE), async (req: AuthRequest, res) => {
  try {
    const tasks = await EmployeeTask.find({
      $or: [
        { employee: req.user!.userId },
        { status: 'pending', employee: null }
      ]
    }).populate('property').populate('room').sort({ priority: -1, dueDate: 1 });
    
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

employeeRouter.patch('/tasks/:id', authenticate, authorize(UserRole.EMPLOYEE), async (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const task = await EmployeeTask.findById(req.params.id);
    
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    
    // Assign task if accepting
    if (status === 'in_progress' && !task.employee) {
      task.employee = req.user!.userId as any;
    }
    
    task.status = status;
    if (status === 'completed') {
      task.completedAt = new Date();
    }
    
    await task.save();
    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Menu Routes
export const menuRouter = Router();

menuRouter.get('/', async (req, res) => {
  try {
    const { propertyId, category } = req.query;
    const filter: any = { isAvailable: true };
    if (propertyId) filter.property = propertyId;
    if (category) filter.category = category;
    
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Order Routes
export const orderRouter = Router();

orderRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { property, room, items, deliveryInstructions } = req.body;
    
    let totalAmount = 0;
    const orderItems = await Promise.all(
      items.map(async (item: any) => {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (!menuItem) throw new Error(`Menu item ${item.menuItem} not found`);
        totalAmount += menuItem.price * item.quantity;
        return {
          menuItem: item.menuItem,
          quantity: item.quantity,
          price: menuItem.price,
        };
      })
    );
    
    const order = new Order({
      property,
      guest: req.user!.userId,
      room,
      items: orderItems,
      totalAmount,
      deliveryInstructions,
      status: 'pending',
    });
    
    await order.save();
    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

orderRouter.get('/my-orders', authenticate, async (req: AuthRequest, res) => {
  try {
    const orders = await Order.find({ guest: req.user!.userId })
      .populate('property')
      .populate('items.menuItem')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Event Routes
export const eventRouter = Router();

eventRouter.get('/', async (req, res) => {
  try {
    const { propertyId } = req.query;
    const filter: any = { isActive: true, startDate: { $gte: new Date() } };
    if (propertyId) filter.property = propertyId;
    
    const events = await Event.find(filter).populate('property').sort({ startDate: 1 });
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Parking Routes
export const parkingRouter = Router();

parkingRouter.get('/slots', authenticate, authorize(UserRole.EMPLOYEE, UserRole.ADMIN), async (req: AuthRequest, res) => {
  try {
    const { propertyId } = req.query;
    const slots = await ParkingSlot.find({ property: propertyId }).populate('guest');
    res.json(slots);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Cab Routes
export const cabRouter = Router();

cabRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { property, pickupLocation, dropLocation, pickupTime, cabType, estimatedFare } = req.body;
    
    const booking = new CabBooking({
      property,
      guest: req.user!.userId,
      pickupLocation,
      dropLocation,
      pickupTime,
      cabType,
      estimatedFare,
      status: 'pending',
    });
    
    await booking.save();
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Loyalty Routes
export const loyaltyRouter = Router();

loyaltyRouter.get('/my-points', authenticate, async (req: AuthRequest, res) => {
  try {
    const transactions = await LoyaltyTransaction.find({ user: req.user!.userId })
      .populate('property')
      .sort({ createdAt: -1 });
    
    const totalPoints = transactions.reduce((sum, t) => {
      return t.type === 'earned' ? sum + t.points : sum - t.points;
    }, 0);
    
    res.json({ totalPoints, transactions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Feedback Routes
export const feedbackRouter = Router();

feedbackRouter.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { property, booking, rating, comment, categories } = req.body;
    
    const feedback = new Feedback({
      property,
      booking,
      user: req.user!.userId,
      rating,
      comment,
      categories,
    });
    
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Routes
export const aiRouter = Router();

aiRouter.post('/forecast', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), async (req, res) => {
  try {
    const forecast = await aiService.generateDemandForecast(req.body);
    res.json(forecast);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

aiRouter.post('/pricing', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), async (req, res) => {
  try {
    const pricing = await aiService.generateDynamicPricing(req.body);
    res.json(pricing);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

aiRouter.post('/recommend', authenticate, async (req, res) => {
  try {
    const recommendations = await aiService.generatePersonalizedRecommendations(req.body);
    res.json(recommendations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

aiRouter.post('/feedback-summary', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), async (req, res) => {
  try {
    const { propertyId } = req.body;
    const feedbacks = await Feedback.find({ property: propertyId }).limit(50);
    const sentiment = await aiService.analyzeFeedbackSentiment(
      feedbacks.map(f => ({ rating: f.rating, comment: f.comment }))
    );
    res.json(sentiment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

aiRouter.post('/attractions', authenticate, async (req, res) => {
  try {
    const { location, preferences } = req.body;
    const attractions = await aiService.generateAttractions(location, preferences);
    res.json(attractions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard Routes
export const dashboardRouter = Router();

dashboardRouter.get('/analytics', authenticate, authorize(UserRole.ADMIN, UserRole.MANAGER), async (req: AuthRequest, res) => {
  try {
    const { propertyId, startDate, endDate } = req.query;
    
    const bookings = await Booking.find({
      property: propertyId,
      createdAt: { $gte: new Date(startDate as string), $lte: new Date(endDate as string) }
    });
    
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalBookings = bookings.length;
    
    const rooms = await Room.find({ property: propertyId });
    const occupiedRooms = rooms.filter(r => r.status === 'occupied').length;
    const occupancyRate = (occupiedRooms / rooms.length) * 100;
    
    const adr = totalRevenue / totalBookings || 0; // Average Daily Rate
    const revPAR = totalRevenue / rooms.length || 0; // Revenue Per Available Room
    
    res.json({
      totalRevenue,
      totalBookings,
      occupancyRate: occupancyRate.toFixed(2),
      adr: adr.toFixed(2),
      revPAR: revPAR.toFixed(2),
      bookingTrend: bookings.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
