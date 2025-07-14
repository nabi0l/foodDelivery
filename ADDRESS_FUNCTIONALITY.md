# Address Functionality for Food Delivery App

## Overview
This document describes the address functionality implemented in the hero section of the home page, allowing users to search for restaurants based on their delivery address.

## Features Implemented

### 1. Address Input with Autocomplete
- **Location**: `client/src/components/home/HeroSection.jsx`
- **Features**:
  - Address input field with map marker icon
  - Recent addresses stored in localStorage
  - Address suggestions dropdown
  - Location button to get current address

### 2. Address Search Functionality
- **Backend Routes**: `server/routes/RestaurantRoutes.js`
  - `GET /api/restaurants/search/by-address` - Search restaurants by address
  - `GET /api/restaurants/search/by-location` - Search restaurants by coordinates

### 3. Search Results Display
- **Location**: `client/src/pages/RestaurantListing.jsx`
- **Features**:
  - Displays search results with address context
  - Shows number of restaurants found
  - Clear search functionality
  - Maintains all existing filtering and sorting

## How It Works

### Address Input Flow
1. User enters address in the hero section
2. System shows recent addresses as suggestions
3. User can click location button to get current address
4. On form submission, address is saved to recent addresses
5. System searches for restaurants based on address
6. User is navigated to restaurant listing with search results

### Address Storage
- Recent addresses are stored in browser localStorage
- Maximum of 5 recent addresses
- Addresses are automatically deduplicated

### Restaurant Search
- Text-based search across restaurant name, cuisine, and location
- Filters to only show open restaurants
- Returns up to 20 restaurants per search

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the `client` directory:

```env
# Google Maps API Key for address geocoding and autocomplete
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Backend API URL
REACT_APP_API_URL=http://localhost:5000
```

### 2. Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Geocoding API
   - Places API
4. Create credentials (API Key)
5. Add the API key to your `.env` file

### 3. Backend Setup
The backend routes are already implemented in `RestaurantRoutes.js`. Make sure your server is running:

```bash
cd server
npm install
npm start
```

### 4. Frontend Setup
The frontend components are already implemented. Make sure your client is running:

```bash
cd client
npm install
npm run dev
```

## API Endpoints

### Search by Address
```
GET /api/restaurants/search/by-address?address={address}&radius={radius}
```

**Parameters:**
- `address` (required): The delivery address
- `radius` (optional): Search radius in km (default: 10)

**Response:**
```json
[
  {
    "_id": "restaurant_id",
    "name": "Restaurant Name",
    "cuisine": "Italian",
    "rating": 4.5,
    "deliveryTime": 25,
    "isOpen": true,
    "location": "123 Main St, City",
    "image": "restaurant_image_url"
  }
]
```

### Search by Location
```
GET /api/restaurants/search/by-location?lat={latitude}&lng={longitude}&radius={radius}
```

**Parameters:**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in km (default: 10)

## Future Enhancements

### 1. Google Places Autocomplete
To implement full Google Places autocomplete:

```javascript
// In HeroSection.jsx
import { GooglePlacesAutocomplete } from 'react-google-places-autocomplete';

// Replace the input field with:
<GooglePlacesAutocomplete
  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
  selectProps={{
    value: address,
    onChange: setAddress,
    placeholder: "Enter your delivery address"
  }}
/>
```

### 2. Geospatial Queries
For more accurate location-based searches, implement MongoDB geospatial queries:

```javascript
// In Restaurant model
const restaurantSchema = new Schema({
  // ... existing fields
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

// Add geospatial index
restaurantSchema.index({ location: '2dsphere' });

// In search route
const restaurants = await Restaurant.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      $maxDistance: radius * 1000 // Convert km to meters
    }
  },
  isOpen: true
});
```

### 3. Address Validation
Add address validation using a service like Google Maps Geocoding API:

```javascript
const validateAddress = async (address) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  return data.results.length > 0;
};
```

## Error Handling

The implementation includes comprehensive error handling:

- **Invalid addresses**: Shows error message to user
- **Network errors**: Graceful fallback with user-friendly messages
- **Location permission denied**: Clear instructions for manual entry
- **API failures**: Retry mechanism and fallback options

## Browser Compatibility

- **Geolocation**: Works in all modern browsers
- **localStorage**: Supported in all modern browsers
- **Fetch API**: Supported in all modern browsers

## Performance Considerations

- Recent addresses are cached in localStorage
- Search results are limited to 20 restaurants
- Address suggestions are filtered client-side for better performance
- Loading states provide user feedback during API calls 