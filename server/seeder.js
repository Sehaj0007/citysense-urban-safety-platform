const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const colors = require('colors'); 
const User = require('./models/User');
const Incident = require('./models/Incident');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Incident.deleteMany();

    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user',
      },
    ]);

    const adminUser = createdUsers[0]._id;
    const user1 = createdUsers[1]._id;

    const incidents = [
      {
        user: user1,
        type: 'harassment',
        description: 'Verbal harassment near the subway station.',
        location: {
          type: 'Point',
          coordinates: [-74.0060, 40.7128], // NYC
        },
        address: 'City Hall Park',
        upvotes: 5,
      },
      {
        user: adminUser,
        type: 'theft',
        description: 'Bag snatched while walking.',
        location: {
          type: 'Point',
          coordinates: [-73.9851, 40.7589], // Times Square
        },
        address: 'Times Square',
        upvotes: 2,
      },
      {
        type: 'unsafe_lighting',
        description: 'Street lights are broken in this alley.',
        location: {
          type: 'Point',
          coordinates: [-73.9654, 40.7829], // Central Park
        },
        isAnonymous: true,
        address: 'Central Park Path',
        upvotes: 8,
      },
    ];

    await Incident.insertMany(incidents);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Incident.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
