const express = require('express');
const cors = require('cors');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("./db");
const { verifySchema } = require("./types");

const app = express();
app.use(express.json()); 
app.use(cors());

const JWT_SECRET = "secret"; 

// ✅ **User Registration Route**
app.post("/api/register", async (req, res) => {
    const result = verifySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
    }

    const { username, email, password } = req.body;

    // ✅ Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
});

// ✅ **User Login Route**
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // ✅ Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
});

// ✅ **JWT Middleware**
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
};

// ✅ **Protected Route (Profile)**
app.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ **Start Server**
app.listen(5000, () => console.log("Server running on port 5000"));
