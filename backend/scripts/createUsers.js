const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
// Update this URI to match your MongoDB connection string
const MONGO_URI = "mongodb://localhost:27017/complaint-tracking";

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    return createUsers();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

async function createUsers() {
  try {
    // Customer (user) details
    const password="ananth";
    const hashedPassword = await bcrypt.hash(password, 10);
    const customerData = {
      name: "Ananth",
      email: "ananth@gmail.com",
      passwordHash: hashedPassword, // Replace with an actual hash in production
      role: "customer",
      profile: {
        avatar: "",
        phone: "1234567890",
      },
      settings: {
        emailNotifications: true,
      },
    };

    // Expert details
    const expertData = {
      name: "Ananth",
      email: "ananthakumar@example.com",
      passwordHash: hashedPassword, // Replace with an actual hash in production
      role: "expert",
      profile: {
        avatar: "",
        phone: "0987654321",
      },
      settings: {
        emailNotifications: true,
      },
      expertRating: 4.5,
    };

    // Check and create customer
    const existingCustomer = await User.findOne({ email: customerData.email });
    if (!existingCustomer) {
      const customer = await User.create(customerData);
      console.log("Customer created:", customer);
    } else {
      console.log("Customer already exists:", existingCustomer);
    }

    // Check and create expert
    const existingExpert = await User.findOne({ email: expertData.email });
    if (!existingExpert) {
      const expert = await User.create(expertData);
      console.log("Expert created:", expert);
    } else {
      console.log("Expert already exists:", existingExpert);
    }

    process.exit();
  } catch (error) {
    console.error("Error creating users:", error);
    process.exit(1);
  }
}