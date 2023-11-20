import fs from "fs";
import path from "path";

const currentModulePath = new URL(import.meta.url).pathname;
const coursesFilePath = path.join(
  path.dirname(currentModulePath),
  "../Database/courses.json"
);

function readCoursesFile() {
  try {
    const data = fs.readFileSync(coursesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Handle the case where the file does not exist
    console.error(`Error reading courses file: ${error.message}`);
    return [];
  }
}

function writeCoursesFile(courses) {
  fs.writeFileSync(coursesFilePath, JSON.stringify(courses, null, 2), "utf-8");
}

function createCoursesFileIfNotExists() {
  if (!fs.existsSync(coursesFilePath)) {
    // Create the file with an empty array as content
    writeCoursesFile([]);
    console.log(`courses file created at: ${coursesFilePath}`);
  }
}

function CoursesRoutes(app) {
  // Check and create courses file if not exists
  createCoursesFileIfNotExists();

  // Get a course
  app.get("/api/courses/:id", (req, res) => {
    const { id } = req.params;

    const courses = readCoursesFile();
    const course = courses.find((courses) => courses._id === id);

    res.json(course);
  });

  // Get all courses
  app.get("/api/courses", (req, res) => {
    const courses = readCoursesFile();
    res.json(courses);
  });

  // Add a new courses
  app.post("/api/courses", (req, res) => {
    const newAssignment = {
      ...req.body,
      _id: new Date().getTime().toString(),
    };

    const courses = readCoursesFile();
    courses.push(newAssignment);

    writeCoursesFile(courses);
    res.json(newAssignment);
  });

  // Update an courses
  app.put("/api/courses/:id", (req, res) => {
    const { id } = req.params;
    const updatedAssignment = req.body;

    const courses = readCoursesFile();
    const updatedCourses = courses.map((courses) =>
      courses._id === id ? { ...courses, ...updatedAssignment } : courses
    );

    writeCoursesFile(updatedCourses);
    res.sendStatus(204);
  });

  // Delete an courses
  app.delete("/api/courses/:id", (req, res) => {
    const { id } = req.params;

    const courses = readCoursesFile();
    const filteredCourses = courses.filter((courses) => courses._id !== id);

    writeCoursesFile(filteredCourses);
    res.sendStatus(204);
  });
}

export default CoursesRoutes;
