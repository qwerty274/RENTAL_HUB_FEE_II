const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Load properties data
const propertiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'api', 'properties.json'), 'utf8'));

// API Routes

// Get all cities
app.get('/api/cities', (req, res) => {
    try {
        const cities = Object.keys(propertiesData.cities).map(cityKey => ({
            key: cityKey,
            name: propertiesData.cities[cityKey].cityName,
            state: propertiesData.cities[cityKey].state,
            country: propertiesData.cities[cityKey].country,
            propertyCount: propertiesData.cities[cityKey].properties.length
        }));
        
        res.json({
            success: true,
            data: cities,
            metadata: propertiesData.metadata
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch cities'
        });
    }
});

// Get properties by city
app.get('/api/properties/:city', (req, res) => {
    try {
        const city = req.params.city.toLowerCase();
        
        if (!propertiesData.cities[city]) {
            return res.status(404).json({
                success: false,
                error: 'City not found'
            });
        }
        
        res.json({
            success: true,
            data: {
                city: propertiesData.cities[city],
                properties: propertiesData.cities[city].properties
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch properties'
        });
    }
});

// Get all properties
app.get('/api/properties', (req, res) => {
    try {
        const allProperties = [];
        
        Object.keys(propertiesData.cities).forEach(cityKey => {
            const cityProperties = propertiesData.cities[cityKey].properties.map(property => ({
                ...property,
                city: propertiesData.cities[cityKey].cityName,
                cityKey: cityKey
            }));
            allProperties.push(...cityProperties);
        });
        
        res.json({
            success: true,
            data: allProperties,
            metadata: propertiesData.metadata
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch all properties'
        });
    }
});

// Search properties by criteria
app.get('/api/search', (req, res) => {
    try {
        const { city, minPrice, maxPrice, beds, propertyType, room } = req.query;
        let filteredProperties = [];
        
        // Get properties from specified city or all cities
        const citiesToSearch = city ? [city.toLowerCase()] : Object.keys(propertiesData.cities);
        
        citiesToSearch.forEach(cityKey => {
            if (propertiesData.cities[cityKey]) {
                const cityProperties = propertiesData.cities[cityKey].properties.map(property => ({
                    ...property,
                    city: propertiesData.cities[cityKey].cityName,
                    cityKey: cityKey
                }));
                filteredProperties.push(...cityProperties);
            }
        });
        
        // Apply filters
        if (minPrice) {
            const minPriceNum = parseInt(minPrice.replace(/[^\d]/g, ''));
            filteredProperties = filteredProperties.filter(property => {
                const propertyPrice = parseInt(property.price.replace(/[^\d]/g, ''));
                return propertyPrice >= minPriceNum;
            });
        }
        
        if (maxPrice) {
            const maxPriceNum = parseInt(maxPrice.replace(/[^\d]/g, ''));
            filteredProperties = filteredProperties.filter(property => {
                const propertyPrice = parseInt(property.price.replace(/[^\d]/g, ''));
                return propertyPrice <= maxPriceNum;
            });
        }
        
        if (beds) {
            const bedsNum = parseInt(beds);
            filteredProperties = filteredProperties.filter(property => property.beds >= bedsNum);
        }

        if (room) {
            const roomNum = parseInt(room);
            filteredProperties = filteredProperties.filter(property => property.beds >= roomNum);
        }
        
        if (propertyType) {
            filteredProperties = filteredProperties.filter(property => 
                property.propertyType.toLowerCase().includes(propertyType.toLowerCase())
            );
        }
        
        res.json({
            success: true,
            data: filteredProperties,
            filters: { city, minPrice, maxPrice, beds, propertyType, room },
            count: filteredProperties.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Search failed'
        });
    }
});

// Get properties by city and room number
app.get('/api/properties/search', (req, res) => {
    try {
        const { city, room } = req.query;
        let filteredProperties = [];
        
        // Get properties from specified city or all cities
        const citiesToSearch = city ? [city.toLowerCase()] : Object.keys(propertiesData.cities);
        
        citiesToSearch.forEach(cityKey => {
            if (propertiesData.cities[cityKey]) {
                const cityProperties = propertiesData.cities[cityKey].properties.map(property => ({
                    ...property,
                    city: propertiesData.cities[cityKey].cityName,
                    cityKey: cityKey
                }));
                filteredProperties.push(...cityProperties);
            }
        });
        
        // Apply room filter if specified
        if (room) {
            const roomNum = parseInt(room);
            filteredProperties = filteredProperties.filter(property => property.beds >= roomNum);
        }
        
        res.json({
            success: true,
            data: filteredProperties,
            filters: { city, room },
            count: filteredProperties.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Search failed'
        });
    }
});

// Get property by ID
app.get('/api/property/:id', (req, res) => {
    try {
        const propertyId = parseInt(req.params.id);
        let foundProperty = null;
        
        // Search through all cities
        Object.keys(propertiesData.cities).forEach(cityKey => {
            const property = propertiesData.cities[cityKey].properties.find(p => p.id === propertyId);
            if (property) {
                foundProperty = {
                    ...property,
                    city: propertiesData.cities[cityKey].cityName,
                    cityKey: cityKey
                };
            }
        });
        
        if (!foundProperty) {
            return res.status(404).json({
                success: false,
                error: 'Property not found'
            });
        }
        
        res.json({
            success: true,
            data: foundProperty
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch property'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'HomeSpot API is running',
        timestamp: new Date().toISOString(),
        version: propertiesData.metadata.apiVersion
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 HomeSpot API Server running on port ${PORT}`);
    console.log(`📊 Total Cities: ${propertiesData.metadata.totalCities}`);
    console.log(`🏠 Total Properties: ${propertiesData.metadata.totalProperties}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log(`📖 API Documentation:`);
    console.log(`   GET /api/health - Health check`);
    console.log(`   GET /api/cities - Get all cities`);
    console.log(`   GET /api/properties - Get all properties`);
    console.log(`   GET /api/properties/:city - Get properties by city`);
    console.log(`   GET /api/properties/search?city=mohali&room=3 - Search by city and room number`);
    console.log(`   GET /api/property/:id - Get property by ID`);
    console.log(`   GET /api/search?city=mohali&minPrice=20000&beds=3 - Advanced search`);
});

module.exports = app;
