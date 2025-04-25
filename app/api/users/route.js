import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Role from '@/models/Role';

export async function GET() {
    await dbConnect();

    try {
        const users = await User.find()
            .select('-password')
            .populate('role', 'name');

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (err) {
        console.error("Failed to fetch users:", err);
        return new Response(JSON.stringify({ error: 'Failed to fetch users' }), { status: 500 });
    }
}