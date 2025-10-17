const Mechanic = require('../models/Mechanic');

// Haversine formula to calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

// Find mechanics with filtering, search, and distance sorting
exports.findMechanics = async (req, res) => {
  try {
    const {
      search = '',
      rating = '',
      city = '',
      serviceType = '',
      openNow = '',
      distance = '',
      page = 1,
      limit = 20,
      userLat,
      userLng
    } = req.query;

    let query = { isActive: true };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { streetaddress: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { services: { $regex: search, $options: 'i' } }
      ];
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // City filter
    if (city) {
      query.city = city;
    }

    // Service type filter
    if (serviceType) {
      query.services = { $in: [serviceType] };
    }

    // Open now filter (assuming isActive represents shop status)
    if (openNow === 'true') {
      query.isActive = true;
    }

    const mechanics = await Mechanic.find(query)
      .select('-password -email')
      .sort({ rating: -1, totalbookings: -1 });

    // Calculate distances and transform data
    let transformedMechanics = mechanics.map(mechanic => {
      let distance = null;
      if (userLat && userLng) {
        distance = calculateDistance(
          parseFloat(userLat),
          parseFloat(userLng),
          parseFloat(mechanic.latitude),
          parseFloat(mechanic.longitude)
        );
      }

      // Calculate average rating from reviews
      const avgRating = mechanic.reviews.length > 0 
        ? (mechanic.reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / mechanic.reviews.length).toFixed(1)
        : mechanic.rating;

      return {
        id: mechanic._id,
        name: mechanic.name,
        contact: `+91 ${mechanic.phone}`,
        location: {
          city: mechanic.city,
          state: mechanic.state,
          area: mechanic.streetaddress,
          latitude: parseFloat(mechanic.latitude),
          longitude: parseFloat(mechanic.longitude),
          googleMapsLink: mechanic.mapsLink,
          fullAddress: `${mechanic.streetaddress}, ${mechanic.city}, ${mechanic.state} ${mechanic.zip}`,
          landmark: mechanic.streetaddress.split(',')[0] // Using first part of address as landmark
        },
        workingHours: "8:00 AM - 8:00 PM", // Default working hours
        rating: parseFloat(avgRating),
        serviceTypes: mechanic.services,
        openNow: mechanic.isActive,
        distance: distance,
        profilePic: mechanic.profile,
        totalBookings: mechanic.totalbookings,
        reviews: mechanic.reviews
      };
    });

    // Filter by distance if user location provided
    if (userLat && userLng && distance) {
      const maxDistance = parseFloat(distance);
      transformedMechanics = transformedMechanics.filter(mechanic => 
        mechanic.distance !== null && mechanic.distance <= maxDistance
      );
    }

    // Sort by distance if user location provided
    if (userLat && userLng) {
      transformedMechanics.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedMechanics = transformedMechanics.slice(startIndex, endIndex);

    // Get unique cities and service types for filters
    const uniqueCities = [...new Set(mechanics.map(m => m.city))];
    const uniqueServices = [...new Set(mechanics.flatMap(m => m.services))];

    res.json({
      mechanics: paginatedMechanics,
      totalCount: transformedMechanics.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(transformedMechanics.length / limit),
      filters: {
        cities: uniqueCities,
        services: uniqueServices
      }
    });

  } catch (error) {
    console.error('Error finding mechanics:', error);
    res.status(500).json({ message: 'Server error while fetching mechanics' });
  }
};

// Get mechanic details
exports.getMechanicDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const mechanic = await Mechanic.findById(id).select('-password -email');
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }

    // Calculate average rating
    const avgRating = mechanic.reviews.length > 0 
      ? (mechanic.reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0) / mechanic.reviews.length).toFixed(1)
      : mechanic.rating;

    const mechanicDetails = {
      id: mechanic._id,
      name: mechanic.name,
      contact: `+91 ${mechanic.phone}`,
      location: {
        city: mechanic.city,
        state: mechanic.state,
        area: mechanic.streetaddress,
        latitude: parseFloat(mechanic.latitude),
        longitude: parseFloat(mechanic.longitude),
        googleMapsLink: mechanic.mapsLink,
        fullAddress: `${mechanic.streetaddress}, ${mechanic.city}, ${mechanic.state} ${mechanic.zip}`,
        landmark: mechanic.streetaddress.split(',')[0]
      },
      workingHours: "8:00 AM - 8:00 PM",
      rating: parseFloat(avgRating),
      serviceTypes: mechanic.services,
      openNow: mechanic.isActive,
      profilePic: mechanic.profile,
      totalBookings: mechanic.totalbookings,
      reviews: mechanic.reviews,
      about: `Professional auto service center in ${mechanic.city} with ${mechanic.totalbookings} completed bookings.`
    };

    res.json(mechanicDetails);
  } catch (error) {
    console.error('Error fetching mechanic details:', error);
    res.status(500).json({ message: 'Server error while fetching mechanic details' });
  }
};