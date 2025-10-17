

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils');
const SuperAdmin = require('../models/SuperAdmin');


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by phone
        console.log(email, password)
        const user = await SuperAdmin.findOne({ email });
        console.log(user, "user")



        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                email: user.email,
                role: "Admin",
                token: generateToken("admin", user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        console.log("register")

        // Check if user already exists
        const existingUser = await SuperAdmin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await SuperAdmin.create({
            email,
            password: hashedPassword,
        });

        res.json({
            _id: user._id,
            email: user.email,
            role: "Admin",
            token: generateToken("admin", user._id),
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};




module.exports = { login, register };