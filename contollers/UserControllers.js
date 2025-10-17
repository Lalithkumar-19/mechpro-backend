const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils');
const Booking = require('../models/Bookings');





const registerUser = async (req, res) => {
    console.log(req.body)
    try {
        const { fullname, phone, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ phone });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this phone number' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            fullname,
            phone,
            password: hashedPassword,
            carbook: []
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                fullname: user.fullname,
                phone: user.phone,
                token: generateToken("user", user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};


const loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // Find user by phone
        const user = await User.findOne({ phone });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                fullname: user.fullname,
                phone: user.phone,
                email: user.email,
                role: "User",
                token: generateToken("User", user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid phone or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};



const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({})
            .select('fullname phone email pic carbook lastService createdAt isBlocked')
            .sort({ createdAt: -1 });

        // Get additional data for each customer
        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {
                // Get total bookings count
                const totalBookings = await Booking.countDocuments({ user: customer._id });

                // Get total spent (you might need to add amount field to your Booking schema)
                const bookings = await Booking.find({ user: customer._id });
                const totalSpent = bookings.reduce((sum, booking) => sum + (parseFloat(booking.amount) || 0), 0);

                // Get last service date
                const lastBooking = await Booking.findOne({ user: customer._id })
                    .sort({ createdAt: -1 })
                    .select('createdAt');

                return {
                    id: customer._id,
                    name: customer.fullname,
                    email: customer.email,
                    phone: customer.phone,
                    profilePic: customer.pic,
                    totalBookings: totalBookings,
                    totalSpent: totalSpent,
                    lastService: lastBooking ?
                        new Date(lastBooking.createdAt).toLocaleDateString('en-IN') : 'No services yet',
                    joinDate: new Date(customer.createdAt).toLocaleDateString('en-IN'),
                    isBlocked: customer.isBlocked,
                    cars: customer.carbook || []
                };
            })
        );

        res.status(200).json(customersWithStats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await User.findById(id)
            .select('fullname phone email pic carbook lastService createdAt');

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Get additional stats
        const totalBookings = await Booking.countDocuments({ user: customer._id });
        const bookings = await Booking.find({ user: customer._id });
        const totalSpent = bookings.reduce((sum, booking) => sum + (parseFloat(booking.amount) || 0), 0);
        const lastBooking = await Booking.findOne({ user: customer._id })
            .sort({ createdAt: -1 })
            .select('createdAt');

        const customerWithStats = {
            id: customer._id,
            name: customer.fullname,
            email: customer.email,
            phone: customer.phone,
            profilePic: customer.pic,
            totalBookings: totalBookings,
            totalSpent: totalSpent,
            lastService: lastBooking ?
                new Date(lastBooking.createdAt).toLocaleDateString('en-IN') : 'No services yet',
            joinDate: new Date(customer.createdAt).toLocaleDateString('en-IN'),
            isBlocked: false,
            cars: customer.carbook || []
        };

        res.status(200).json(customerWithStats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new customer
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if customer already exists
        const existingCustomer = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingCustomer) {
            return res.status(400).json({
                message: 'Customer with this email or phone already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new customer
        const newCustomer = new User({
            fullname: name,
            email,
            phone,
            password: hashedPassword,
            carbook: [],
            bookinga:[],
        });

        await newCustomer.save();

        const customerResponse = {
            id: newCustomer._id,
            name: newCustomer.fullname,
            email: newCustomer.email,
            phone: newCustomer.phone,
            profilePic: newCustomer.pic,
            totalBookings: 0,
            totalSpent: 0,
            lastService: 'No services yet',
            joinDate: new Date(newCustomer.createdAt).toLocaleDateString('en-IN'),
            isBlocked: false,
            cars: []
        };

        res.status(201).json(customerResponse);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update customer status (block/unblock)
const updateCustomerStatus = async (req, res) => {
    try {
        console.log(req.body, "h");
        const { customerId, isBlocked } = req.body;


        const customer = await User.findById(customerId)
            .select('fullname phone email pic carbook lastService createdAt');
        customer.isBlocked = isBlocked === true;
        await customer.save();
        console.log(customer, "customer");

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Get additional stats
        const totalBookings = await Booking.countDocuments({ user: customer._id });
        const bookings = await Booking.find({ user: customer._id });
        const totalSpent = bookings.reduce((sum, booking) => sum + (parseFloat(booking.amount) || 0), 0);
        const lastBooking = await Booking.findOne({ user: customer._id })
            .sort({ createdAt: -1 })
            .select('createdAt');

        const customerWithStats = {
            id: customer._id,
            name: customer.fullname,
            email: customer.email,
            phone: customer.phone,
            profilePic: customer.pic,
            totalBookings: totalBookings,
            totalSpent: totalSpent,
            lastService: lastBooking ?
                new Date(lastBooking.createdAt).toLocaleDateString('en-IN') : 'No services yet',
            joinDate: new Date(customer.createdAt).toLocaleDateString('en-IN'),
            isBlocked: isBlocked,
            cars: customer.carbook || []
        };

        res.status(200).json(customerWithStats);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await User.findByIdAndDelete(id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomerStatus,
    deleteCustomer
};
