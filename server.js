import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyMongo from '@fastify/mongodb'; // Import fastify-mongodb
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify();

// Enable CORS to allow frontend requests
fastify.register(cors, {
  origin: 'http://localhost:5173', // Allow only your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these methods
});

// Register MongoDB plugin
fastify.register(fastifyMongo, {
  forceClose: true,
  url: process.env.MONGO_URI, // Use your MongoDB URI from .env
});

// Test database connection
fastify.get('/check-db', async (request, reply) => {
  const client = fastify.mongo.client;
  try {
    const version = await client.db().admin().serverInfo();
    return { mongoVersion: version.version };
  } catch (err) {
    return { error: err.message };
  }
});

fastify.post('/new-run', async (request, reply) => {
  const { date, distance, time, checkpoints } = request.body;

  if(!distance || !time || !date) {
    return reply.code(400).send({ error: 'Date, distance and time are required' });
  }

  const collection = fastify.mongo.db.collection('runs');
  const result = await collection.insertOne({ date, distance, time, checkpoints });
  return { message: 'Run added', id: result.insertedId };
});

fastify.get('/runs', async (request, reply) => {
  const collection = fastify.mongo.db.collection('runs');
  const result = await collection.find().toArray();
  return result;
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

