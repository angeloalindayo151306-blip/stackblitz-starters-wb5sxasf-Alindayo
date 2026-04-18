import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory storage
let students = [];
let courses = [];
let enrollments = [];

/* =======================
   STUDENTS CRUD
======================= */

// GET all students
app.get('/students', (req, res) => {
  res.json(students);
});

// GET student by ID
app.get('/students/:id', (req, res) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

// POST create student
app.post('/students', (req, res) => {
  const { name, email, yearLevel } = req.body;

  if (!name || !email || !yearLevel) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newStudent = {
    id: uuidv4(),
    name,
    email,
    yearLevel,
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT update student
app.put('/students/:id', (req, res) => {
  const student = students.find((s) => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });

  const { name, email, yearLevel } = req.body;

  if (name) student.name = name;
  if (email) student.email = email;
  if (yearLevel) student.yearLevel = yearLevel;

  res.json(student);
});

// DELETE student
app.delete('/students/:id', (req, res) => {
  const index = students.findIndex((s) => s.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: 'Student not found' });

  students.splice(index, 1);
  res.json({ message: 'Student deleted successfully' });
});

/* =======================
   COURSES CRUD
======================= */

app.get('/courses', (req, res) => {
  res.json(courses);
});

app.post('/courses', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newCourse = {
    id: uuidv4(),
    title,
    description,
  };

  courses.push(newCourse);
  res.status(201).json(newCourse);
});

app.put('/courses/:id', (req, res) => {
  const course = courses.find((c) => c.id === req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const { title, description } = req.body;

  if (title) course.title = title;
  if (description) course.description = description;

  res.json(course);
});

app.delete('/courses/:id', (req, res) => {
  const index = courses.findIndex((c) => c.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: 'Course not found' });

  courses.splice(index, 1);
  res.json({ message: 'Course deleted successfully' });
});

/* =======================
   ENROLLMENTS
======================= */

app.get('/enrollments', (req, res) => {
  res.json(enrollments);
});

app.post('/enrollments', (req, res) => {
  const { studentId, courseId } = req.body;

  const studentExists = students.find((s) => s.id === studentId);
  const courseExists = courses.find((c) => c.id === courseId);

  if (!studentExists || !courseExists) {
    return res.status(400).json({ message: 'Invalid student or course ID' });
  }

  const newEnrollment = {
    id: uuidv4(),
    studentId,
    courseId,
  };

  enrollments.push(newEnrollment);
  res.status(201).json(newEnrollment);
});

app.delete('/enrollments/:id', (req, res) => {
  const index = enrollments.findIndex((e) => e.id === req.params.id);
  if (index === -1)
    return res.status(404).json({ message: 'Enrollment not found' });

  enrollments.splice(index, 1);
  res.json({ message: 'Enrollment removed successfully' });
});

app.listen(PORT, () => {
  console.log(`Enrollment API running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Enrollment API running on port ${PORT}`);
});
