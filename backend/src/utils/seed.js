import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../../src/config/db.js';
import User from '../../src/models/User.js';
import Issue from '../../src/models/Issue.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Issue.deleteMany({});

    const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password: 'password', role: 'Admin' });
    const dev = await User.create({ name: 'Dev', email: 'dev@example.com', password: 'password', role: 'Developer' });
    const user = await User.create({ name: 'User', email: 'user@example.com', password: 'password', role: 'User' });

    await Issue.create([
      { title: 'Login authentication bug', description: 'Fix JWT expiration and refresh flow', priority: 'High', reporter: admin._id, assignee: dev._id },
      { title: 'Improve dashboard UI', description: 'Polish charts and animations', priority: 'Medium', reporter: admin._id, assignee: dev._id },
      { title: 'Mobile layout spacing', description: 'Tweak paddings and margins on small screens', priority: 'Low', reporter: user._id }
    ]);

    console.log('Seed completed.');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
};

seed();


