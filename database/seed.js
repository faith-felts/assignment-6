const sqlite3 = require('sqlite3').verbose();

// Connect to database file
const db = new sqlite3.Database('./database/university.db');

// Insert sample courses
db.run(`
  INSERT INTO courses (courseCode, title, credits, description, semester)
  VALUES 
('CS101', 'Introduction to Programming', 3, 'Learn Python basics', 'Fall 2024'),
    ('BIO120', 'General Biology', 3, 'Introduction to biological principles and processes', 'Fall 2024'),
    ('MATH150', 'Calculus I', 4, 'Basic calculus', 'Fall 2024'),
    ('ENG101', 'Composition I', 3, 'Academic writing and critical thinking', 'Spring 2025'),
    ('ME210', 'Thermodynamics', 3, 'Principles of thermodynamics and heat transfer', 'Spring 2025'),
    ('CS301', 'Database Systems', 3, 'Design and implementation of database systems', 'Fall 2024'),
    ('PYS201', 'Physics II', 4, 'Electricity, magnetism, and modern physics', 'Spring 2025'),
    ('CS201', 'Data Structures', 4, 'Study of fundamental data structures and algorithms', 'Spring 2025')
`);

console.log('Sample data inserted');

db.all('SELECT * FROM courses', (err, rows) => { 
    console.log(rows); 
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});