import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Submission } from './types';

const app = express();
const PORT = 3000;
const DB_FILE = './src/db.json';

// Middleware
app.use(bodyParser.json());

// Ping endpoint
app.get('/ping', (req: Request, res: Response) => {
    res.json(true);
});

// Submit endpoint
app.post('/submit', (req: Request, res: Response) => {
    const { name, email, phone, github_link, stopwatch_time }: Submission = req.body;

    if (!name || !email || !phone || !github_link || !stopwatch_time) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    // Load existing submissions
    let submissions: Submission[] = [];
    try {
        submissions = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) {
        console.error('Error reading database file:', err);
    }

    // Add new submission
    const idx = submissions.length ;
    const newSubmission: Submission = {
        idx,
        name,
        email,
        phone,
        github_link,
        stopwatch_time
    };
    submissions.push(newSubmission);

    // Save to database file
    fs.writeFileSync(DB_FILE, JSON.stringify(submissions, null, 2));

    res.json({ message: 'Submission saved successfully' });
});

// Read endpoint
app.get('/read', (req: Request, res: Response) => {
    const { index } = req.query;

    if (typeof index !== 'string') {
        return res.status(400).json({ error: 'Invalid index parameter' });
    }

    // Load submissions
    let submissions: Submission[] = [];
    try {
        submissions = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (err) {
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
