import mongoose from "mongoose";
import 'dotenv/config';
import dbConnect from "../lib/dbConnect.js";
import Role from "../models/Role.js";

const seedRoles = async () => {
    try {
        await dbConnect();
        console.log("Connected to MongoDB");

        const roles = ["admin", "customer"];

        for (const role of roles) {
            const existingRole = await Role.findOne({ name: role });
            if (!existingRole) {
                await new Role({ name: role }).save();
                console.log(`Added role: ${role}`);
            }
        }

        console.log("Roles seeding completed!");
    } catch (error) {
        console.error("Seeding error:", error);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log("MongoDB connection closed");
        }
    }
};

// Run the script
seedRoles();
