import User from '../models/user.model.js';
import bcrypt from 'bcryptjs'; //to hash passwords
import jwt from 'jsonwebtoken'; //to create tokens

export const register = async(req, res) => {
    try {
        let image_filename=`${req.file.filename}`;
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne ({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' ,success: false});
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user=await User.create({
            name,
            email,
            password: hashedPassword,
            image: image_filename});
        res.status(201).json({ message: 'User registered successfully', user, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found', success: false });
        }
        // Compare password if user exists
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }
        // Create JWT token for authenticated user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message:"login successfully",token,user, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
    
        };
