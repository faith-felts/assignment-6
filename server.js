const express = require("express"); 
const sqlite3 = require("sqlite3").verbose(); 
const app = express(); 
const port = 3000; 

// Middleware 
app.use(express.json());

// Simple validation helpers
function validateIdParam(req, res, next) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid id parameter' });
    }
    req.params.id = id;
    next();
}

function validateCourseBody(req, res, next) {
    const { courseCode, title, credits, description, semester } = req.body || {};
    const errors = [];
    if (!courseCode || typeof courseCode !== 'string') errors.push('courseCode is required and must be a string');
    if (!title || typeof title !== 'string') errors.push('title is required and must be a string');
    if (credits === undefined || !Number.isInteger(Number(credits))) errors.push('credits is required and must be an integer');
    if (semester === undefined || (typeof semester !== 'string' && typeof semester !== 'number')) errors.push('semester is required');
    if (errors.length) return res.status(400).json({ errors });
    req.body.credits = Number(credits);
    next();
}

// Connect to database 
const db = new sqlite3.Database('./database/university.db');

// API endpoint to get all courses
app.get('/api/courses', (req, res) => { 
    db.all('SELECT * FROM courses', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


// GET single course by id
app.get('/api/courses/:id', validateIdParam, (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM courses WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Course not found' });
        res.json(row);
    });
});

// POST new course 
app.post('/api/courses', validateCourseBody, (req, res) => {
    const { courseCode, title, credits, description, semester } = req.body;
    db.run(
        `INSERT INTO courses (courseCode, title, credits, description, semester) VALUES (?, ?, ?, ?, ?)`,
        [courseCode, title, credits, description, semester],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        }
    );
});

// PUT update course
app.put('/api/courses/:id', validateIdParam, validateCourseBody, (req, res) => {
    const id = req.params.id;
    const { courseCode, title, credits, description, semester } = req.body;
    db.run(
        `UPDATE courses SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ? WHERE id = ?`,
        [courseCode, title, credits, description, semester, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
            res.json({ message: 'Course updated' });
        }
    );
});

// DELETE course by id
app.delete('/api/courses/:id', validateIdParam, (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM courses WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Course not found' });
        res.json({ message: 'Course deleted' });
    });
});

// Start server
app.listen(port, () => { 
    console.log(`Server running on http://localhost:${port}`); 
});