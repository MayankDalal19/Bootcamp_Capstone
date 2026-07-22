const mongoose = require("mongoose");

// Connects to MongoDB using the URI from environment variables
const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://Capstone:cap123@ac-rgamfmq-shard-00-00.eltxqn6.mongodb.net:27017,ac-rgamfmq-shard-00-01.eltxqn6.mongodb.net:27017,ac-rgamfmq-shard-00-02.eltxqn6.mongodb.net:27017/?ssl=true&replicaSet=atlas-jcec1s-shard-0&authSource=admin&appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
