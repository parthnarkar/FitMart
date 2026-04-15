// seedFitnessCenters.js
require("dotenv").config();
const mongoose = require("./db");
const FitnessCenter = require("./models/FitnessCenter");

async function seed() {
  try {
    const count = await FitnessCenter.countDocuments();
    if (count > 0) {
      console.log("Fitness centers already seeded — exiting.");
      process.exit(0);
    }

    const centers = [
      {
        name: "Vikhroli Strength & Wellness",
        type: "gym",
        address: "Shop 12, Near Vikhroli Station, LBS Marg",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.082,
        lng: 72.957,
        rating: 4.6,
        imageUrl: "https://images.unsplash.com/photo-1558611848-73f7eb4001d8",
        contact: "+91 98200 00001",
        isOpen: true,
      },
      {
        name: "Powai Yoga Collective",
        type: "yoga",
        address: "Studio 4, Hiranandani Gardens, Powai",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.119,
        lng: 72.897,
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a",
        contact: "+91 98200 00002",
        isOpen: true,
      },
      {
        name: "Ghatkopar Pilates Studio",
        type: "pilates",
        address: "2nd Floor, Gautam Complex, Ghatkopar East",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.071,
        lng: 72.899,
        rating: 4.4,
        imageUrl: "https://images.unsplash.com/photo-1526403224742-2f9f2b0ccc2d",
        contact: "+91 98200 00003",
        isOpen: false,
      },
      {
        name: "Andheri Fitness Studio",
        type: "fitness_studio",
        address: "Near Metro, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.118,
        lng: 72.829,
        rating: 4.2,
        imageUrl: "https://images.unsplash.com/photo-1583454110550-6c0b4ff67d15",
        contact: "+91 98200 00004",
        isOpen: true,
      },
      {
        name: "BKC Powerhouse Gym",
        type: "gym",
        address: "Bandra Kurla Complex, Near MCA",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.066,
        lng: 72.87,
        rating: 4.7,
        imageUrl: "https://images.unsplash.com/photo-1541150095237-5a3b6f8a6b7a",
        contact: "+91 98200 00005",
        isOpen: true,
      },
      {
        name: "Powai Strength Lab",
        type: "gym",
        address: "Hiranandani Estate, Powai",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.1195,
        lng: 72.8967,
        rating: 4.3,
        imageUrl: "https://images.unsplash.com/photo-1534367612699-9b8d9d7b5a70",
        contact: "+91 98200 00006",
        isOpen: true,
      },
      {
        name: "Vibe Yoga Studio - Andheri",
        type: "yoga",
        address: "JVLR Road, Andheri East",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.110,
        lng: 72.879,
        rating: 4.5,
        imageUrl: "https://images.unsplash.com/photo-1554284126-aa88f22d8d1a",
        contact: "+91 98200 00007",
        isOpen: true,
      },
      {
        name: "Ghatkopar Core Pilates",
        type: "pilates",
        address: "Linking Road, Ghatkopar",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.070,
        lng: 72.900,
        rating: 4.1,
        imageUrl: "https://images.unsplash.com/photo-1527251590076-6f6ec0f9b9b6",
        contact: "+91 98200 00008",
        isOpen: false,
      },
      {
        name: "Zen Fitness Studio - Vikhroli",
        type: "fitness_studio",
        address: "Near Powai Road, Vikhroli",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.080,
        lng: 72.958,
        rating: 4.0,
        imageUrl: "https://images.unsplash.com/photo-1526403224742-2f9f2b0ccc2d",
        contact: "+91 98200 00009",
        isOpen: true,
      },
      {
        name: "Urban Flex Gym - Lower Parel",
        type: "gym",
        address: "Near Kamala Mills, Lower Parel",
        city: "Mumbai",
        state: "Maharashtra",
        lat: 19.017,
        lng: 72.836,
        rating: 4.55,
        imageUrl: "https://images.unsplash.com/photo-1558611848-73f7eb4001d8",
        contact: "+91 98200 00010",
        isOpen: true,
      },
    ];

    await FitnessCenter.insertMany(centers);
    console.log("Inserted fitness centers:", centers.length);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
