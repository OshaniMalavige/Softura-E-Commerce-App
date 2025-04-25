import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Role from '@/models/Role';

const seedRoles = async () => {
    await dbConnect();

    const roles = ['admin', 'customer'];

    for (const role of roles) {
        const existingRole = await Role.findOne({ name: role });
        if (!existingRole) {
            await new Role({ name: role }).save();
        }
    }

    console.log('Roles seeded successfully!');
    mongoose.connection.close();
};

seedRoles().catch(err => console.error(err));
