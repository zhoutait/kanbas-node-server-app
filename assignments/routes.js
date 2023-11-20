import fs from "fs";
import path from "path";

const currentModulePath = new URL(import.meta.url).pathname;
const assignmentsFilePath = path.join(
  path.dirname(currentModulePath),
  "../Database/assignments.json"
);

function readAssignmentsFile() {
  try {
    const data = fs.readFileSync(assignmentsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Handle the case where the file does not exist
    console.error(`Error reading assignments file: ${error.message}`);
    return [];
  }
}

function writeAssignmentsFile(assignments) {
  fs.writeFileSync(
    assignmentsFilePath,
    JSON.stringify(assignments, null, 2),
    "utf-8"
  );
}

function createAssignmentsFileIfNotExists() {
  if (!fs.existsSync(assignmentsFilePath)) {
    // Create the file with an empty array as content
    writeAssignmentsFile([]);
    console.log(`Assignments file created at: ${assignmentsFilePath}`);
  }
}

function AssignMentRoutes(app) {
  // Check and create assignments file if not exists
  createAssignmentsFileIfNotExists();

  // Get all assignments
  app.get("/api/assignments", (req, res) => {
    const assignments = readAssignmentsFile();
    res.json(assignments);
  });

  // Get a assignment with specific assignmentId
  app.get("/api/assignments/:assignmentId", async (req, res) => {
    const { assignmentId } = req.params;
    const assignments = readAssignmentsFile();
    let assignment = null;
    for await (const element of assignments) {
      if (String(element._id) === assignmentId) {
        assignment = element;
      }
    }
    res.json(assignment);
  });

  // Get all assignments with specific courseId
  app.get("/a5/assignment/course/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const assignments = readAssignmentsFile();
    const scoreAssignments = [];
    for await (const assignment of assignments) {
      if (String(assignment.course) === courseId) {
        scoreAssignments.push(assignment);
      }
    }
    res.json(scoreAssignments);
  });

  // Get all assignments with specific score
  app.get("/a5/assignment/score/:score", async (req, res) => {
    const { score } = req.params;
    const assignments = readAssignmentsFile();
    const scoreAssignments = [];
    for await (const assignment of assignments) {
      if (assignment.score === score) {
        scoreAssignments.push(assignment);
      }
    }
    res.json(scoreAssignments);
  });

  // Get all assignments (completed = true)
  app.get("/a5/assignment/completed/:completed", async (req, res) => {
    const { completed } = req.params;
    const assignments = readAssignmentsFile();
    const scoreAssignments = [];
    for await (const assignment of assignments) {
      if (Boolean(assignment.completed) === Boolean(completed)) {
        scoreAssignments.push(assignment);
      }
    }
    res.json(scoreAssignments);
  });

  // Add a new assignment
  app.post("/api/assignments", (req, res) => {
    const newAssignment = {
      ...req.body,
      _id: new Date().getTime().toString(),
      completed: false,
    };

    const assignments = readAssignmentsFile();
    assignments.push(newAssignment);

    writeAssignmentsFile(assignments);
    res.json(newAssignment);
  });

  // Update an assignment
  app.put("/api/assignments/:id", (req, res) => {
    const { id } = req.params;
    const updatedAssignment = req.body;

    const assignments = readAssignmentsFile();
    const updatedAssignments = assignments.map((assignment) =>
      assignment._id === id
        ? { ...assignment, ...updatedAssignment }
        : assignment
    );

    writeAssignmentsFile(updatedAssignments);
    res.sendStatus(204);
  });

  // Delete an assignment
  app.delete("/api/assignments/:id", (req, res) => {
    const { id } = req.params;

    const assignments = readAssignmentsFile();
    const filteredAssignments = assignments.filter(
      (assignment) => assignment._id !== id
    );

    writeAssignmentsFile(filteredAssignments);
    res.sendStatus(204);
  });
}

export default AssignMentRoutes;
