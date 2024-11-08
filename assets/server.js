require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const axios = require('axios');

app.use(cors());

const BASE_URL = `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`;


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'iframe.html')); 
});

async function fetchHanaData(ticketId) {
    console.log(`Fetching data from HANA by ticket ID: ${ticketId}`);
    try {
        const response = await axios.get(`${BASE_URL}/tickets/${ticketId}/audits.json`, {
            auth: {
                username: process.env.EMAIL,
                password: process.env.API_TOKEN
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: "Error retrieving data" }); 
    }
    // return { ticketId: ticketId, data: "Data from Hana DB" };
}

app.get('/getTicketData', async (req, res) => {
    console.log("A", req.query.ticket_id)
    const ticketId = req.query.ticket_id;
    if (!ticketId) {
        return res.status(400).json({ error: "ticket_id is required" });
    }
    try {
        const hanaData = await fetchHanaData(ticketId);
        res.json(hanaData);
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: "Error retrieving data" });
    }
});

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
        const msg = `${error_msg}`
        const client = ZAFClient.init()
        client.invoke("notify", msg, "error")
        console.error('Error fetching tickets:', msg);
    }
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'iframe.html')); 
});

app.get('/tickets', async (req, res) => {
    try {
        const tickets = await getTickets();
        res.json(tickets);
    } catch (error) {
        res.status(500).send('Error retrieving tickets');
    }
});


// Start the server
app.listen(8080, () => {
    console.log("Server is running on http://localhost:8080");
});
