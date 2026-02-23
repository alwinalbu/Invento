const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const registerUser = async (req, res) => {
    try {
        let { firstName, lastName, email, password, phoneNumber, imageUrl } = req.body;

        // Trim values
        firstName = firstName?.trim();
        lastName = lastName?.trim();
        email = email?.trim().toLowerCase();
        password = password?.trim();
        phoneNumber = phoneNumber?.trim();

        // Basic required validation
        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Email format validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Password strength validation (minimum 6 characters)
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
            });
        }

        // Indian phone validation (change if needed)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({
                message: "Enter valid 10-digit Indian mobile number",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            imageUrl,
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Return the token and user info (excluding sensitive data)
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl,
            },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { registerUser,loginUser }