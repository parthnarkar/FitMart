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
        imageUrl: "https://content.jdmagicbox.com/v2/comp/mumbai/g8/022pxx22.xx22.241202211656.u3g8/catalogue/powerpulse-gym-mumbai-gyms-AG5UMLrynU.jpg",
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
        imageUrl: "https://ind.5bestincity.com/profileimages/india/charus-gym-gym-vikhroli-mumbai-maharashtra/57223-99cha-3.jpg",
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
        imageUrl: "https://movementsyoga.com/wp-content/uploads/1-Hot-Pilates-Main-img.jpg",
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
        imageUrl: "https://img.fitimg.in/studio-profile-F56CABB1B4D359.jpg",
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
        imageUrl: "https://img.freepik.com/free-photo/strong-man-training-gym_1303-23478.jpg?semt=ais_hybrid&w=740&q=80",
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
        imageUrl: "https://www.shutterstock.com/image-photo/bodybuilder-pumping-his-biceps-dumbbell-260nw-2471712207.jpg",
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
        imageUrl: "https://www.verywellhealth.com/thmb/Nux1ov0gbgO3j4tzLd31aHPq6S0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-2155324511-b3e15462c6dc46e0b6060656638f04dd.jpg",
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
        imageUrl: "https://www.popsci.com/wp-content/uploads/2025/10/Pilates-started-in-a-WWI-prisoner-of-war-camp.png",
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
        imageUrl: "https://thumbs.dreamstime.com/b/fitness-class-exercising-studio-gym-60910552.jpg",
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
        imageUrl: "https://media.gettyimages.com/id/1183038884/photo/view-of-a-row-of-treadmills-in-a-gym-with-people.jpg?s=612x612&w=gi&k=20&c=-udh0-LUuB1Mr1rF7D4nbuaUOJ_x6JvZCYoLdfOJF3w=",
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
