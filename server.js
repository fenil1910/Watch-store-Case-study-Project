const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/watchStore')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));
// Use the Environment Variable from Render, or fallback to local for development
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/watchStore';

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));
// --- Database Schemas ---
const Watch = mongoose.model('Watch', {
    brand: String, model: String, price: Number, imageUrl: String
});

const User = mongoose.model('User', {
    name: String, email: String, pass: String, role: { type: String, default: 'user' }
});

// --- API Routes ---

// 1. Get All Watches
app.get('/api/watches', async (req, res) => {
    const watches = await Watch.find();
    res.json(watches);
});

// 2. Add New Watch (Admin)
app.post('/api/watches', async (req, res) => {
    const watch = new Watch(req.body);
    await watch.save();
    res.json(watch);
});

// 3. Update Watch Price (Admin)
app.put('/api/watches/:id', async (req, res) => {
    const updated = await Watch.findByIdAndUpdate(req.params.id, { price: req.body.price }, { new: true });
    res.json(updated);
});

// 4. Delete Watch (Admin)
app.delete('/api/watches/:id', async (req, res) => {
    await Watch.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// 5. User Registration
app.post('/api/register', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "Success" });
});

// 6. User Login
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email, pass: req.body.pass });
    if (user) res.json(user);
    else res.status(401).json({ message: "Invalid Credentials" });
});

// Serve HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
