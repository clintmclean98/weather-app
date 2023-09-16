const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.WEATHER_API_KEY;
const positionstackApi = process.env.POSITIONSTACK_API_KEY;

// Set up Express
app.use(express.static('public'));

// Set up Express
app.get('/', (req, res) => {
  // Send the 'index.html' file as the response
  res.sendFile('index.html', { root: __dirname });
});

async function getWeatherData(city) {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(apiUrl);
    const weatherData = response.data;

    return weatherData;
  } catch (error) {
    throw error;
  }
}

app.get('/weather', async (req, res) => {
  const city = req.query.city; // Get the city from the query parameters

  if (!city) {
    return res.status(400).json({ error: 'City not provided' });
  }

  try {
    const weatherData = await getWeatherData(city);
    res.json(weatherData);
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status) {
      // Handle specific HTTP error codes
      res.status(error.response.status).json({ error: error.response.statusText });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});


app.get('/city-suggestions', async (req, res) => {
    const query = req.query.city;
    
    if (!query || query.length < 3) {
        return res.status(400).json({ error: 'Invalid query' });
    }

    try {
        const response = await axios.get('http://api.positionstack.com/v1/forward', {
            params: {
                access_key: positionstackApi,
                query: query,
                limit: 5 // You can adjust the limit as needed
            },
        });

        console.log(response.data);
        const suggestions = response.data.data.map(suggestion => suggestion.label);
        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching city suggestions' });
    }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
