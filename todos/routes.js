import fs from "fs";
import path from "path";

const currentModulePath = new URL(import.meta.url).pathname;
const assignmentsFilePath = path.join(
  path.dirname(currentModulePath),
  "../Database/todos.json"
);

function readAssignmentsFile() {
  try {
    const data = fs.readFileSync(assignmentsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Handle the case where the file does not exist
    console.error(`Error reading todos file: ${error.message}`);
    return [];
  }
}

function writeAssignmentsFile(todos) {
  fs.writeFileSync(
    assignmentsFilePath,
    JSON.stringify(todos, null, 2),
    "utf-8"
  );
}

function createAssignmentsFileIfNotExists() {
  if (!fs.existsSync(assignmentsFilePath)) {
    // Create the file with an empty array as content
    writeAssignmentsFile([]);
    console.log(`todos file created at: ${assignmentsFilePath}`);
  }
}

function TodoRoutes(app) {
  // Check and create todos file if not exists
  createAssignmentsFileIfNotExists();

  // Get all todos
  app.get("/api/todos", (req, res) => {
    const todos = readAssignmentsFile();
    res.json(todos);
  });

  // Add a new todo
  app.post("/api/todos", (req, res) => {
    const newAssignment = {
      ...req.body,
      _id: new Date().getTime().toString(),
      completed: false,
    };

    const todos = readAssignmentsFile();
    todos.push(newAssignment);

    writeAssignmentsFile(todos);
    res.json(newAssignment);
  });

  // Update an todo
  app.put("/api/todos/:id", (req, res) => {
    const { id } = req.params;
    const updatedAssignment = req.body;

    const todos = readAssignmentsFile();
    const updatedAssignments = todos.map((todo) =>
      String(todo._id) === id ? { ...todo, ...updatedAssignment } : todo
    );

    writeAssignmentsFile(updatedAssignments);
    res.sendStatus(204);
  });

  // Get a todo (completed = true)
  app.get("/a5/todos/:id/completed/:completed", async (req, res) => {
    const { id, completed } = req.params;
    const todos = readAssignmentsFile();
    let todo = null;
    for await (const element of todos) {
      if (
        Boolean(element.completed) === Boolean(completed) &&
        String(element._id) === String(id)
      ) {
        todo = element;
      }
    }
    res.json(todo);
  });

  // Get description
  app.get("/a5/todos/:id/description", async (req, res) => {
    const { id } = req.params;
    const todos = readAssignmentsFile();
    let todo = null;
    for await (const element of todos) {
      if (String(element._id) === String(id)) {
        todo = element;
      }
    }
    res.json({
      description: todo.description,
    });
  });

  // Delete an todo
  app.delete("/api/todos/:id", (req, res) => {
    const { id } = req.params;

    const todos = readAssignmentsFile();
    const filteredAssignments = todos.filter((todo) => todo._id !== id);

    writeAssignmentsFile(filteredAssignments);
    res.sendStatus(204);
  });
}

export default TodoRoutes;
