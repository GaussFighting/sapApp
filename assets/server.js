require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Set the base URL using the subdomain from the .env file
const BASE_URL = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`;

const axios = require('axios');

// Serve static files (e.g., CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Fetch tickets from the Zendesk API
async function getTickets() {
    try {
        const response = await axios.get(`${BASE_URL}/tickets.json`, {
            auth: {
                username: process.env.EMAIL,
                password: process.env.API_TOKEN
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }
}

// Route to serve the sidebar page with the button
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'iframe.html')); // Make sure your HTML file is named 'index.html'
});

// Route to handle the Zendesk API call
app.get('/tickets', async (req, res) => {
    try {
        const tickets = await getTickets();
        res.json(tickets); // Return the fetched tickets as JSON
    } catch (error) {
        res.status(500).send('Error retrieving tickets');
    }
});

// Start the server
app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});
