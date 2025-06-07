const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const farmProperties = require("./routes/farmPropertiesRoutes");
const cropRoutes = require('./routes/cropRoutes');
const axios = require('axios')
const adminRoutes = require("./routes/adminRoutes")
const reviewerRoutes = require("./routes/reviewerRoutes")
const app = express();
dotenv.config();

app.use(cors({
    origin:"*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// Add explicit OPTIONS handling
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/agent', reviewerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/farm', farmProperties);
app.use('/api/crops', cropRoutes);

// weather app
// Express example
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
  
    if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required' });
  
    
  
    // fetch and return weather data
    try {
        const apiKey = process.env.WEATHER_API_KEY;
        const weatherUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=1&alerts=yes`;
    
        const response = await axios.get(weatherUrl);
        const data = response.data;
    
        // Extract only what you need
        const weatherData = {
          location: `${data.location.name}, ${data.location.country}`,
          date: data.location.localtime,
          temperature: `${data.forecast.forecastday[0].day.mintemp_c}°C / ${data.forecast.forecastday[0].day.maxtemp_c}°C`,
          rainfall: data.forecast.forecastday[0].day.daily_chance_of_rain + '%',
          wind: `${data.current.wind_kph} km/h ${data.current.wind_dir}`,
          humidity: `${data.current.humidity}%`,
          sunlightDuration: `${data.forecast.forecastday[0].astro.sunrise} to ${data.forecast.forecastday[0].astro.sunset}`,
          dewPoint: `${data.current.dewpoint_c}°C`,
          alert: data.alerts?.alert?.[0]?.headline || 'No extreme weather alerts'
        };
    
        res.json(weatherData);
      } catch (error) {
        console.error('Weather fetch error:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
      }
  });
  

// Connect to MongoDB (function to be put later in /config/db.js)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
})
.catch(err => console.log(err));
