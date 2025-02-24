const express = require('express');
const request = require('request');

const app = express();
const PORT = 8080; // Change if needed

const RAPID_API_KEY = 'b7e5dbec67msh624e0fe461666c5p1035e5jsnf4a3a80cf43b';

app.use(express.json());

// Fetch a VPN IP and forward requests through it
app.all('*', async (req, res) => {
    try {
        // Fetch VPN server data
        const options = {
            method: 'GET',
            url: 'https://free-vpn.p.rapidapi.com/get_vpn_data',
            headers: {
                'x-rapidapi-key': RAPID_API_KEY,
                'x-rapidapi-host': 'free-vpn.p.rapidapi.com'
            }
        };

        request(options, (error, response, body) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to fetch VPN data' });
            }

            try {
                const data = JSON.parse(body);
                if (!Array.isArray(data) || data.length === 0) {
                    return res.status(500).json({ error: 'No VPN servers available' });
                }

                // Pick a random VPN server
                const vpnServer = data[Math.floor(Math.random() * data.length)];

                // Forward the request to the selected VPN IP
                const targetUrl = `http://${vpnServer.ip}${req.originalUrl}`;

                console.log(`Forwarding request to VPN: ${targetUrl}`);

                request({
                    method: req.method,
                    url: targetUrl,
                    headers: req.headers,
                    body: JSON.stringify(req.body)
                }).pipe(res);

            } catch (err) {
                return res.status(500).json({ error: 'Error parsing VPN response' });
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
