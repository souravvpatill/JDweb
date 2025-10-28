// api/book-appointment.js
const { MongoClient } = require('mongodb');

// Get the MongoDB URI from Vercel environment variables
const uri = process.env.MONGODB_URI;

// Check if the URI is set (Crucial for Vercel deployment)
if (!uri) {
    throw new Error('MONGODB_URI environment variable not set');
}

// Client variable to reuse connection
let cachedClient = null;

// Function to connect to MongoDB and cache the client
async function connectToDatabase() {
    if (cachedClient) {
        return cachedClient;
    }

    // 1. Connect to the MongoDB cluster
    const client = new MongoClient(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    
    await client.connect();
    
    // 2. Cache the client for future use
    cachedClient = client;
    return client;
}


module.exports = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    // Handle OPTIONS method for CORS preflight requests (common for Vercel)
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).send({ message: 'Method Not Allowed' });
    }

    try {
        const { childName, contactPhone, reasonForVisit } = req.body;

        if (!childName || !contactPhone || !reasonForVisit) {
            return res.status(400).send({ message: 'Missing required fields (Name, Phone, or Reason).' });
        }

        const client = await connectToDatabase();
        const db = client.db('pediatricianDB'); // Use your preferred DB name
        const collection = db.collection('appointments');

        const newAppointment = {
            childName,
            contactPhone,
            reasonForVisit,
            status: 'Pending',
            createdAt: new Date(),
        };

        // 3. Insert the document into the collection
        const result = await collection.insertOne(newAppointment);

        // 4. Send success response
        return res.status(201).send({ 
            message: 'Appointment successfully submitted! We will call to confirm your slot shortly.', 
            appointmentId: result.insertedId 
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).send({ 
            message: 'Failed to process appointment. Please call the clinic directly.', 
            detail: error.message 
        });
    }
};