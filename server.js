const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.WEATHER_API_KEY;

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

// Define a GET API endpoint to retrieve weather data
app.get('/weather', async (req, res) => {
  const city = 'New York'; // Example city

  try {
    const weatherData = await getWeatherData(city);
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
