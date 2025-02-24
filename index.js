const request = require('request');

const options = {
    method: 'GET',
    url: 'https://free-vpn.p.rapidapi.com/get_vpn_data',
    headers: {
        'x-rapidapi-key': 'b7e5dbec67msh624e0fe461666c5p1035e5jsnf4a3a80cf43b',
        'x-rapidapi-host': 'free-vpn.p.rapidapi.com'
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    try {
        const data = JSON.parse(body);

        if (Array.isArray(data) && data.length > 0) {
            // Select a random VPN server
            const randomServer = data[Math.floor(Math.random() * data.length)];
            console.log('Selected VPN Server:', randomServer);
        } else {
            console.log('No VPN servers found in response.');
        }
    } catch (err) {
        console.error('Error parsing response:', err.message);
    }
});
