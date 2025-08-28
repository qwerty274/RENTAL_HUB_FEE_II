# HomeSpot - Rental Properties API

A comprehensive rental properties search platform focused on Punjab, India cities including Mohali, Ludhiana, Amritsar, and Jalandhar.

## Features

- 🏠 **City-based Property Search** - Search properties by specific cities
- 📱 **Phone Number Display** - Contact information appears on property hover
- 🖼️ **Indian House Images** - Authentic Indian residential property photos
- 🔍 **Advanced Search** - Filter by price, beds, property type, and more
- 📊 **RESTful API** - Complete backend API for property data
- 🌐 **Responsive Design** - Works on all devices

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the API Server
```bash
npm start
```

The API server will start on `http://localhost:3000`

### 3. Open the Website
Open `index.html` in your browser or navigate to `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:3000/api`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/cities` | GET | Get all available cities |
| `/properties` | GET | Get all properties |
| `/properties/:city` | GET | Get properties by city |
| `/property/:id` | GET | Get property by ID |
| `/search` | GET | Search properties with filters |

### Search Examples

```bash
# Get all properties in Mohali
GET /api/properties/mohali

# Search for properties with 3+ beds under ₹50,000
GET /api/search?beds=3&maxPrice=50000

# Search for villas in Ludhiana
GET /api/search?city=ludhiana&propertyType=villa

# Get property with ID 1
GET /api/property/1
```

## Search Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `city` | string | City name (mohali, ludhiana, amritsar, jalandhar) | `city=mohali` |
| `minPrice` | number | Minimum price in rupees | `minPrice=20000` |
| `maxPrice` | number | Maximum price in rupees | `maxPrice=50000` |
| `beds` | number | Minimum number of bedrooms | `beds=3` |
| `propertyType` | string | Type of property | `propertyType=villa` |

## Available Cities

### 🏙️ Mohali
- **5 Properties** - Luxury villas, modern apartments, townhouses
- **Price Range**: ₹18,000 - ₹85,000/month
- **Popular Areas**: Phase 8, Phase 9, Sector 67, Sector 70

### 🏘️ Ludhiana  
- **3 Properties** - Punjabi villas, bungalows, farmhouses
- **Price Range**: ₹32,000 - ₹45,000/month
- **Popular Areas**: Model Town, Model Town Extension

### 🕌 Amritsar
- **4 Properties** - City apartments, family homes, heritage properties
- **Price Range**: ₹35,000 - ₹48,000/month
- **Popular Areas**: Mall Road, Heritage Street

### 🏡 Jalandhar
- **4 Properties** - Family homes, cottages, duplexes, artistic villas
- **Price Range**: ₹22,000 - ₹28,000/month
- **Popular Areas**: Civil Lines

## Property Information

Each property includes:
- **Basic Details**: Name, address, price, beds, baths, square footage
- **Contact Info**: Phone number for direct contact
- **Images**: High-quality Indian house photos
- **Amenities**: Security, parking, garden, modern kitchen, etc.
- **Property Type**: Villa, Apartment, Bungalow, Cottage, etc.

## Frontend Features

### Search Section
- Dropdown city selector
- Instant search results
- Property cards with hover effects
- Phone numbers displayed on hover

### Property Cards
- High-quality images
- Detailed specifications
- Contact information
- Smooth hover animations

## Development

### Project Structure
```
RENTAL_HUB_FEE_II/
├── index.html          # Main homepage with search
├── listing.html        # Property listings page 1
├── listing2.html       # Property listings page 2  
├── listing3.html       # Property listings page 3
├── api/
│   └── properties.json # Property data API
├── api-server.js       # Node.js API server
├── package.json        # Dependencies
└── README.md           # This file
```

### Adding New Properties

1. Edit `api/properties.json`
2. Add new property objects with required fields
3. Restart the API server

### Customizing the Search

1. Modify the search form in `index.html`
2. Update the JavaScript search logic
3. Add new filter parameters as needed

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Data**: JSON API with RESTful endpoints
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License - See LICENSE file for details

## Support

For questions or support, please contact the development team.

---

**HomeSpot** - Making your search for the perfect rental home in Punjab simple and efficient! 🏠✨
