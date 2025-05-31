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
    origin: '*', // Allow Next.js frontend
    credentials: true
  }));

// Middleware
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/agent', reviewerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/farm', farmProperties);
app.use('/api/crops', cropRoutes);

// weather app
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude are required' });
  
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&alerts=yes`;
  
    try {
        const response = await axios.get(url);
        const data = response.data;
    
        const weatherData = {
          location: `${data.location.name}, ${data.location.region}`,
          temperature: `${data.current.temp_c}°C`,
          condition: data.current.condition.text,
          icon: `https:${data.current.condition.icon}`,
          humidity: `${data.current.humidity}%`,
          wind: `${data.current.wind_kph} kph ${data.current.wind_dir}`,
          pressure: `${data.current.pressure_mb} mb`,
          visibility: `${data.current.vis_km} km`,
          uvIndex: data.current.uv,
          lastUpdated: data.current.last_updated,
          precip: `${data.current.precip_mm} mm`,
          feelsLike: `${data.current.feelslike_c}°C`,
          gust: `${data.current.gust_kph} kph`,
          airQuality: data.current.air_quality,
          dewPoint: `${data.current.dewpoint_c}°C`,
          alert: data.alerts?.alert?.[0]?.headline || 'No extreme weather alerts'
        };
    
        res.json(weatherData);
      } catch (error) {
        console.error('Weather fetch error:', error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
      }
  });
  
// Function to start the server and connect to DB
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error('Failed to start server or connect to MongoDB:', err);
    process.exit(1);
  }
};

// Start the server only if this file is run directly (not imported as a module)
// and not in a test environment
if (require.main === module && process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app; // Export the app for testing
