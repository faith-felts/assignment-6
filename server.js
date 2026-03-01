const express = require("express"); 
const sqlite3 = require("sqlite3").verbose(); 
const app = express(); 
const port = 3000; 

// Middleware 
app.use(express.json());

// Connect to database 
const db = new sqlite3.Database('./database/university.db');

// API endpoint to get all courses
app.get('/api/courses', (req, res) => { 
    db.all('SELECT * FROM courses', (err, rows) => { 
        res.json(rows); 
    }); 
});


// GET single course by id
app.get('/api/courses/:id', (req, res) => { 
    const id = req.params.id; 
    db.all('SELECT * FROM courses WHERE id = ?', [id], (err, row) => { 
        res.json(row); 
    }); 
});

// POST new course 
app.post('/api/courses', (req, res) => { 
    const { courseCode, title, credits, description, semester } = req.body; 
    db.run(` 
        INSERT INTO courses (courseCode, title, credits, description, semester) 
        VALUES (?, ?, ?, ?, ?) 
        `, [courseCode, title, credits, description, semester], 
        function(err) { 
            res.json({ id: this.lastID }); 
        }
    ); 
});

// PUT update course
app.put('/api/courses/:id', (req, res) => { 
    const id = req.params.id; 
    const { courseCode, title, credits, description, semester } = req.body; 
    db.run(` UPDATE courses SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ? WHERE id = ? 
        `, [courseCode, title, credits, description, semester, id], 
        function(err) { 
            res.json({ message: 'Course updated'
        }); 
        }
    ); 
});

// DELETE course by id
app.delete('/api/courses/:id', (req, res) => { 
    const id = req.params.id; 
    db.run('DELETE FROM courses WHERE id = ?', [id], 
        function(err) { 
            res.json({ message: 'Course deleted' }); 
        }
    ); 
});

// Start server
app.listen(port, () => { 
    console.log(`Server running on http://localhost:${port}`); 
});