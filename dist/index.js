"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
const DB_FILE = './src/db.json';
// Middleware
app.use(body_parser_1.default.json());
// Ping endpoint
app.get('/ping', (req, res) => {
    res.json(true);
});
// Submit endpoint
app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: 'Missing parameters' });
    }
    // Load existing submissions
    let submissions = [];
    try {
        submissions = JSON.parse(fs_1.default.readFileSync(DB_FILE, 'utf8'));
    }
    catch (err) {
        console.error('Error reading database file:', err);
    }
    // Add new submission
    const idx = submissions.length;
    const newSubmission = {
        idx,
        name,
        email,
        phone,
        github_link,
        stopwatch_time
    };
    submissions.push(newSubmission);
    // Save to database file
    fs_1.default.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));
    res.json({ message: 'Submission saved successfully' });
});
// Read endpoint
app.get('/read', (req, res) => {
    const { index } = req.query;
    if (typeof index !== 'string') {
        return res.status(400).json({ error: 'Invalid index parameter' });
    }
    // Load submissions
    let submissions = [];
    try {
        submissions = JSON.parse(fs_1.default.readFileSync(DB_FILE, 'utf8'));
    }
    catch (err) {
        console.error('Error reading database file:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
    const idx = parseInt(index);
    console.log(idx);
    if (isNaN(idx) || idx < 0 || idx >= submissions.length) {
        return res.json();
    }
    const submission = submissions[idx];
    res.json(submission);
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
