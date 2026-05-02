import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

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
app.get("/students", (req, res) => {
  res.json(students);
});

// GET student by ID
app.get("/students/:id", (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

// CREATE student
app.post("/students", (req, res) => {
  const { name, email, yearLevel } = req.body;

  if (!name || !email || !yearLevel) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newStudent = {
    id: uuidv4(),
    name,
    email,
    yearLevel
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// UPDATE student
app.put("/students/:id", (req, res) => {
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  const { name, email, yearLevel } = req.body;

  if (name !== undefined) student.name = name;
  if (email !== undefined) student.email = email;
  if (yearLevel !== undefined) student.yearLevel = yearLevel;

  res.json(student);
});

// DELETE student
app.delete("/students/:id", (req, res) => {
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Student not found" });

  students.splice(index, 1);

  // Also remove enrollments linked to this student
  enrollments = enrollments.filter(e => e.studentId !== req.params.id);

  res.json({ message: "Student deleted successfully" });
});

/* =======================
   COURSES CRUD
======================= */

// GET all courses
app.get("/courses", (req, res) => {
  res.json(courses);
});

// CREATE course
app.post("/courses", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newCourse = {
    id: uuidv4(),
    title,
    description
  };

  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// UPDATE course
app.put("/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const { title, description } = req.body;

  if (title !== undefined) course.title = title;
  if (description !== undefined) course.description = description;

  res.json(course);
});

// DELETE course
app.delete("/courses/:id", (req, res) => {
  const index = courses.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Course not found" });

  courses.splice(index, 1);

  // Remove related enrollments
  enrollments = enrollments.filter(e => e.courseId !== req.params.id);

  res.json({ message: "Course deleted successfully" });
});

/* =======================
   ENROLLMENTS CRUD
======================= */

// GET all enrollments
app.get("/enrollments", (req, res) => {
  res.json(enrollments);
});

// CREATE enrollment
app.post("/enrollments", (req, res) => {
  const { studentId, courseId } = req.body;

  const studentExists = students.find(s => s.id === studentId);
  const courseExists = courses.find(c => c.id === courseId);

  if (!studentExists || !courseExists) {
    return res.status(400).json({ message: "Invalid student or course ID" });
  }

  // Prevent duplicate enrollment
  const alreadyEnrolled = enrollments.find(
    e => e.studentId === studentId && e.courseId === courseId
  );

  if (alreadyEnrolled) {
    return res.status(400).json({ message: "Student already enrolled in this course" });
  }

  const newEnrollment = {
    id: uuidv4(),
    studentId,
    courseId
  };

  enrollments.push(newEnrollment);
  res.status(201).json(newEnrollment);
});

// ✅ UPDATE enrollment (NEW)
app.put("/enrollments/:id", (req, res) => {
  const enrollment = enrollments.find(e => e.id === req.params.id);
  if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

  const { studentId, courseId } = req.body;

  const studentExists = students.find(s => s.id === studentId);
  const courseExists = courses.find(c => c.id === courseId);

  if (!studentExists || !courseExists) {
    return res.status(400).json({ message: "Invalid student or course ID" });
  }

  enrollment.studentId = studentId;
  enrollment.courseId = courseId;

  res.json(enrollment);
});

// DELETE enrollment
app.delete("/enrollments/:id", (req, res) => {
  const index = enrollments.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Enrollment not found" });

  enrollments.splice(index, 1);
  res.json({ message: "Enrollment removed successfully" });
});

/* =======================
   START SERVER
======================= */

app.listen(PORT, () => {
  console.log(`Enrollment API running on port ${PORT}`);
});