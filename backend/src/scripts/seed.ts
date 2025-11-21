import dotenv from 'dotenv';
dotenv.config();

import { connectDatabase, disconnectDatabase } from '../config/database';
import {
  User, HotelChain, HotelProperty, RoomCategory, Room, Booking,
  EmployeeTask, MenuItem, Order, Event, ParkingSlot, CabBooking,
  LoyaltyTransaction, Feedback, InventoryItem
} from '../models';
import { UserRole, MembershipTier, RoomStatus, TaskType, TaskStatus, EventType, ParkingSlotStatus } from '../types';

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      HotelChain.deleteMany({}),
      HotelProperty.deleteMany({}),
      RoomCategory.deleteMany({}),
      Room.deleteMany({}),
      Booking.deleteMany({}),
      EmployeeTask.deleteMany({}),
      MenuItem.deleteMany({}),
      Order.deleteMany({}),
      Event.deleteMany({}),
      ParkingSlot.deleteMany({}),
      CabBooking.deleteMany({}),
      LoyaltyTransaction.deleteMany({}),
      Feedback.deleteMany({}),
      InventoryItem.deleteMany({}),
    ]);

    // Create Hotel Chains
    console.log('🏨 Creating hotel chains...');
    const chains = await HotelChain.create([
      {
        name: 'Grand Luxury Hotels',
        description: 'Premium luxury hotel chain offering world-class hospitality',
        headquarters: 'Mumbai, India',
        contactEmail: 'contact@grandluxury.com',
        contactPhone: '+91-22-12345678',
        isActive: true,
      },
      {
        name: 'EcoStay Resorts',
        description: 'Sustainable and eco-friendly resort chain',
        headquarters: 'Bangalore, India',
        contactEmail: 'hello@ecostay.com',
        contactPhone: '+91-80-87654321',
        isActive: true,
      },
    ]);

    // Create Hotel Properties
    console.log('🏢 Creating hotel properties...');
    const properties = await HotelProperty.create([
      {
        chain: chains[0]._id,
        name: 'Grand Luxury Mumbai Central',
        description: 'Iconic luxury hotel in the heart of Mumbai',
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
        address: {
          street: '123 Marine Drive',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          zipCode: '400001',
          coordinates: { lat: 18.9432, lng: 72.8234 },
        },
        contactEmail: 'mumbai@grandluxury.com',
        contactPhone: '+91-22-11111111',
        amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Conference Hall', 'WiFi', 'Parking'],
        wifiCredentials: { ssid: 'Grand_Luxury_Guest', password: 'Welcome@2024' },
        checkInTime: '14:00',
        checkOutTime: '11:00',
        starRating: 5,
        isActive: true,
      },
      {
        chain: chains[0]._id,
        name: 'Grand Luxury Delhi',
        description: 'Premier hotel near Delhi airport and business district',
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
        address: {
          street: '456 Connaught Place',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          zipCode: '110001',
          coordinates: { lat: 28.6139, lng: 77.2090 },
        },
        contactEmail: 'delhi@grandluxury.com',
        contactPhone: '+91-11-22222222',
        amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Ballroom', 'WiFi', 'Valet Parking'],
        wifiCredentials: { ssid: 'Grand_Luxury_Guest', password: 'Welcome@2024' },
        checkInTime: '14:00',
        checkOutTime: '11:00',
        starRating: 5,
        isActive: true,
      },
      {
        chain: chains[1]._id,
        name: 'EcoStay Goa Beach Resort',
        description: 'Eco-friendly beach resort in beautiful Goa',
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'],
        address: {
          street: '789 Calangute Beach Road',
          city: 'Goa',
          state: 'Goa',
          country: 'India',
          zipCode: '403516',
          coordinates: { lat: 15.5467, lng: 73.7597 },
        },
        contactEmail: 'goa@ecostay.com',
        contactPhone: '+91-832-3333333',
        amenities: ['Beach Access', 'Organic Restaurant', 'Yoga', 'Spa', 'WiFi', 'Bicycle Rental'],
        wifiCredentials: { ssid: 'EcoStay_Guest', password: 'Green@2024' },
        checkInTime: '13:00',
        checkOutTime: '10:00',
        starRating: 4,
        isActive: true,
      },
      {
        chain: chains[1]._id,
        name: 'EcoStay Bangalore',
        description: 'Urban eco-hotel in Bangalore IT corridor',
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'],
        address: {
          street: '321 MG Road',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          zipCode: '560001',
          coordinates: { lat: 12.9716, lng: 77.5946 },
        },
        contactEmail: 'bangalore@ecostay.com',
        contactPhone: '+91-80-4444444',
        amenities: ['Co-Working Space', 'Organic Cafe', 'Rooftop Garden', 'Gym', 'WiFi'],
        wifiCredentials: { ssid: 'EcoStay_Guest', password: 'Green@2024' },
        checkInTime: '14:00',
        checkOutTime: '11:00',
        starRating: 4,
        isActive: true,
      },
    ]);

    // Create Room Categories
    console.log('🛏️  Creating room categories...');
    const categories = await RoomCategory.create([
      // Mumbai property
      {
        property: properties[0]._id,
        name: 'Deluxe Room',
        description: 'Elegant room with city view',
        basePrice: 5000,
        maxOccupancy: 2,
        bedType: 'King',
        size: 350,
        amenities: ['Air Conditioning', 'Mini Bar', 'Smart TV', 'Coffee Maker'],
        images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427'],
        isActive: true,
      },
      {
        property: properties[0]._id,
        name: 'Executive Suite',
        description: 'Spacious suite with living area and premium amenities',
        basePrice: 10000,
        maxOccupancy: 3,
        bedType: 'King + Sofa Bed',
        size: 650,
        amenities: ['Air Conditioning', 'Mini Bar', 'Smart TV', 'Coffee Maker', 'Work Desk', 'Sofa'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'],
        isActive: true,
      },
      // Delhi property
      {
        property: properties[1]._id,
        name: 'Standard Room',
        description: 'Comfortable room with modern amenities',
        basePrice: 4000,
        maxOccupancy: 2,
        bedType: 'Queen',
        size: 300,
        amenities: ['Air Conditioning', 'TV', 'Work Desk'],
        images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32'],
        isActive: true,
      },
      {
        property: properties[1]._id,
        name: 'Business Suite',
        description: 'Perfect for business travelers',
        basePrice: 8000,
        maxOccupancy: 2,
        bedType: 'King',
        size: 500,
        amenities: ['Air Conditioning', 'Mini Bar', 'Smart TV', 'Large Work Desk', 'Meeting Table'],
        images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304'],
        isActive: true,
      },
      // Goa property
      {
        property: properties[2]._id,
        name: 'Beach View Room',
        description: 'Room with stunning beach view',
        basePrice: 6000,
        maxOccupancy: 2,
        bedType: 'King',
        size: 400,
        amenities: ['Air Conditioning', 'Balcony', 'Mini Fridge', 'Beach Chairs'],
        images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'],
        isActive: true,
      },
      // Bangalore property
      {
        property: properties[3]._id,
        name: 'Eco Room',
        description: 'Sustainable room with eco-friendly amenities',
        basePrice: 3500,
        maxOccupancy: 2,
        bedType: 'Queen',
        size: 320,
        amenities: ['Natural Ventilation', 'Organic Toiletries', 'Recycled Furnishings'],
        images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39'],
        isActive: true,
      },
    ]);

    // Create Rooms
    console.log('🚪 Creating rooms...');
    const rooms: any[] = [];
    for (const category of categories) {
      const propertyRooms = [];
      for (let floor = 1; floor <= 5; floor++) {
        for (let roomNum = 1; roomNum <= 4; roomNum++) {
          propertyRooms.push({
            property: category.property,
            category: category._id,
            roomNumber: `${floor}0${roomNum}`,
            floor,
            status: RoomStatus.AVAILABLE,
            isActive: true,
          });
        }
      }
      const createdRooms = await Room.create(propertyRooms);
      rooms.push(...createdRooms);
    }
    console.log(`✅ Created ${rooms.length} rooms`);

    // Create Users
    console.log('👥 Creating users...');
    const users = await User.create([
      // Guests
      {
        email: 'guest@demo.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+91-98765432 10',
        role: UserRole.GUEST,
        membershipTier: MembershipTier.REGULAR,
        loyaltyPoints: 500,
        isActive: true,
      },
      {
        email: 'business@demo.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+91-9876543211',
        role: UserRole.GUEST,
        membershipTier: MembershipTier.BUSINESS,
        loyaltyPoints: 2000,
        isActive: true,
      },
      {
        email: 'family@demo.com',
        password: 'password123',
        firstName: 'Robert',
        lastName: 'Johnson',
        phone: '+91-9876543212',
        role: UserRole.GUEST,
        membershipTier: MembershipTier.FAMILY,
        loyaltyPoints: 1500,
        isActive: true,
      },
      // Employees
      {
        email: 'employee@demo.com',
        password: 'password123',
        firstName: 'Maria',
        lastName: 'Garcia',
        phone: '+91-9876543213',
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
      {
        email: 'housekeeping@demo.com',
        password: 'password123',
        firstName: 'Raj',
        lastName: 'Kumar',
        phone: '+91-9876543214',
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
      // Manager
      {
        email: 'manager@demo.com',
        password: 'password123',
        firstName: 'David',
        lastName: 'Wilson',
        phone: '+91-9876543215',
        role: UserRole.MANAGER,
        isActive: true,
      },
      // Admin
      {
        email: 'admin@demo.com',
        password: 'password123',
        firstName: 'Sarah',
        lastName: 'Anderson',
        phone: '+91-9876543216',
        role: UserRole.ADMIN,
        isActive: true,
      },
    ]);

    // Create Sample Bookings
    console.log('📅 Creating bookings...');
    const bookings = await Booking.create([
      {
        property: properties[0]._id,
        room: rooms[0]._id,
        guest: users[0]._id,
        checkInDate: new Date('2024-12-01'),
        checkOutDate: new Date('2024-12-05'),
        numberOfGuests: 2,
        totalPrice: 20000,
        status: 'confirmed',
        bookingSource: 'direct',
      },
      {
        property: properties[1]._id,
        room: rooms[20]._id,
        guest: users[1]._id,
        checkInDate: new Date('2024-12-10'),
        checkOutDate: new Date('2024-12-15'),
        numberOfGuests: 1,
        totalPrice: 40000,
        status: 'confirmed',
        bookingSource: 'direct',
      },
    ]);

    // Create Employee Tasks
    console.log('📋 Creating employee tasks...');
    await EmployeeTask.create([
      {
        property: properties[0]._id,
        employee: users[4]._id,
        room: rooms[0]._id,
        type: TaskType.CLEANING,
        title: 'Clean Room 101',
        description: 'Standard cleaning required',
        status: TaskStatus.ASSIGNED,
        priority: 'high',
        dueDate: new Date(),
      },
      {
        property: properties[0]._id,
        type: TaskType.MAINTENANCE,
        title: 'Fix AC in Room 205',
        description: 'AC not cooling properly',
        status: TaskStatus.PENDING,
        priority: 'medium',
      },
    ]);

    // Create Menu Items
    console.log('🍽️  Creating menu items...');
    const menuCategories = ['Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Desserts'];
    const menuItems = [];
    
    for (const property of properties) {
      menuItems.push(
        {
          property: property._id,
          name: 'Continental Breakfast',
          description: 'Toast, butter, jam, eggs, juice, coffee',
          category: 'Breakfast',
          price: 500,
          isAvailable: true,
          preparationTime: 15,
          allergens: ['Gluten', 'Eggs', 'Dairy'],
        },
        {
          property: property._id,
          name: 'Chicken Biryani',
          description: 'Aromatic basmati rice with spiced chicken',
          category: 'Lunch',
          price: 450,
          isAvailable: true,
          preparationTime: 30,
          allergens: ['Gluten', 'Dairy'],
        },
        {
          property: property._id,
          name: 'Grilled Salmon',
          description: 'Fresh salmon with vegetables',
          category: 'Dinner',
          price: 850,
          isAvailable: true,
          preparationTime: 25,
          allergens: ['Fish'],
        },
        {
          property: property._id,
          name: 'Fresh Juice',
          description: 'Choice of orange, apple, or mixed fruit',
          category: 'Beverages',
          price: 150,
          isAvailable: true,
          preparationTime: 5,
        },
        {
          property: property._id,
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake slice',
          category: 'Desserts',
          price: 250,
          isAvailable: true,
          preparationTime: 5,
          allergens: ['Gluten', 'Eggs', 'Dairy'],
        }
      );
    }
    
    await MenuItem.create(menuItems);

    // Create Events
    console.log('🎉 Creating events...');
    await Event.create([
      {
        property: properties[0]._id,
        title: 'Annual Business Summit 2024',
        description: 'Join top industry leaders for networking and insights',
        type: EventType.CONFERENCE,
        startDate: new Date('2024-12-20'),
        endDate: new Date('2024-12-22'),
        location: 'Grand Ballroom',
        capacity: 200,
        bookedSeats: 45,
        price: 5000,
        images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87'],
        isActive: true,
      },
      {
        property: properties[2]._id,
        title: 'Beach Wedding Package',
        description: 'Beautiful beach-side wedding venue',
        type: EventType.WEDDING,
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-01-15'),
        location: 'Beach Lawn',
        capacity: 150,
        bookedSeats: 0,
        price: 150000,
        images: ['https://images.unsplash.com/photo-1519167758481-83f29da8ee31'],
        isActive: true,
      },
    ]);

    // Create Parking Slots
    console.log('🅿️  Creating parking slots...');
    const parkingSlots = [];
    for (const property of properties.slice(0, 2)) {
      for (let level = 1; level <= 3; level++) {
        for (let slot = 1; slot <= 20; slot++) {
          parkingSlots.push({
            property: property._id,
            slotNumber: `L${level}-${slot.toString().padStart(2, '0')}`,
            level: `Level ${level}`,
            status: ParkingSlotStatus.AVAILABLE,
            qrCode: `QR-${property._id}-L${level}-${slot}`,
          });
        }
      }
    }
    await ParkingSlot.create(parkingSlots);

    // Create Inventory Items
    console.log('📦 Creating inventory items...');
    const inventoryItems = [];
    for (const property of properties) {
      inventoryItems.push(
        {
          property: property._id,
          name: 'Bed Linen',
          category: 'Housekeeping',
          quantity: 200,
          unit: 'sets',
          minQuantity: 50,
          supplier: 'Hotel Supplies Co',
        },
        {
          property: property._id,
          name: 'Towels',
          category: 'Housekeeping',
          quantity: 300,
          unit: 'pieces',
          minQuantity: 100,
          supplier: 'Hotel Supplies Co',
        },
        {
          property: property._id,
          name: 'Shampoo Bottles',
          category: 'Amenities',
          quantity: 500,
          unit: 'bottles',
          minQuantity: 200,
          supplier: 'Amenity Distributors',
        },
      );
    }
    await InventoryItem.create(inventoryItems);

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Demo Credentials:');
    console.log('┌─────────────┬─────────────────────┬──────────────────┐');
    console.log('│ Role        │ Email               │ Password         │');
    console.log('├─────────────┼─────────────────────┼──────────────────┤');
    console.log('│ Guest       │ guest@demo.com      │ password123      │');
    console.log('│ Business    │ business@demo.com   │ password123      │');
    console.log('│ Family      │ family@demo.com     │ password123      │');
    console.log('│ Employee    │ employee@demo.com   │ password123      │');
    console.log('│ Manager     │ manager@demo.com    │ password123      │');
    console.log('│ Admin       │ admin@demo.com      │ password123      │');
    console.log('└─────────────┴─────────────────────┴──────────────────┘');
    console.log('\n🎯 Summary:');
    console.log(`- Hotel Chains: ${chains.length}`);
    console.log(`- Hotel Properties: ${properties.length}`);
    console.log(`- Room Categories: ${categories.length}`);
    console.log(`- Rooms: ${rooms.length}`);
    console.log(`- Users: ${users.length}`);
    console.log(`- Menu Items: ${menuItems.length}`);
    console.log(`- Parking Slots: ${parkingSlots.length}`);

    await disconnectDatabase();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
