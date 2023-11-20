import fs from "fs";
import path from "path";

const currentModulePath = new URL(import.meta.url).pathname;
console.log(currentModulePath);
const modulesFilePath = path.join(
  path.dirname(currentModulePath),
  "../Database/modules.json"
);

function readModulesFile() {
  try {
    const data = fs.readFileSync(modulesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Handle the case where the file does not exist
    console.error(`Error reading modules file: ${error.message}`);
    return [];
  }
}

function writeModulesFile(modules) {
  fs.writeFileSync(modulesFilePath, JSON.stringify(modules, null, 2), "utf-8");
}

function createModulesFileIfNotExists() {
  if (!fs.existsSync(modulesFilePath)) {
    // Create the file with an empty array as content
    writeModulesFile([]);
    console.log(`modules file created at: ${modulesFilePath}`);
  }
}

function ModuleRoutes(app) {
  // Check and create modules file if not exists
  createModulesFileIfNotExists();

  // Get all modules
  app.get("/api/modules", (req, res) => {
    const modules = readModulesFile();
    res.json(modules);
  });

  // Get modules for a specific course
  app.get("/api/courses/:id/modules", (req, res) => {
    const { id } = req.params;
    const modules = readModulesFile();
    const module = modules.filter((module) => module.course === id);
    res.json(module);
  });

  // Get a specific module
  app.get("/api/modules/:id", (req, res) => {
    const { id } = req.params;
    const module = readModulesFile().find((module) => module._id === id);
    if (!module) {
      res.status(404).send("Module not found");
      return;
    }
    res.json(module);
  });

  // Add a new module
  app.post("/api/courses/:cid/modules", (req, res) => {
    const { cid } = req.params;
    const newModule = {
      ...req.body,
      course: cid,
      _id: new Date().getTime().toString(),
    };

    const modules = readModulesFile();
    modules.push(newModule);

    writeModulesFile(modules);
    res.json(newModule);
  });

  // Update a module
  app.put("/api/modules/:id", (req, res) => {
    const { id } = req.params;
    const updatedModule = req.body;

    const modules = readModulesFile();
    const updatedModules = modules.map((module) =>
      module._id === id ? { ...module, ...updatedModule } : module
    );

    writeModulesFile(updatedModules);
    res.sendStatus(204);
  });

  // Delete a module
  app.delete("/api/modules/:id", (req, res) => {
    const { id } = req.params;

    const modules = readModulesFile();
    const filteredModules = modules.filter((module) => module._id !== id);

    writeModulesFile(filteredModules);
    res.sendStatus(204);
  });
}

export default ModuleRoutes;
