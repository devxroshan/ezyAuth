import express from "express";
import {
  CreateProject,
  DeleteProject,
  GetProject,
  GetProjectUsers,
} from "../controllers/project.controller";

const router = express.Router();

router.post("/", CreateProject);
router.get("/", GetProject);
router.get("/:project_id/users", GetProjectUsers);

router.delete("/:project_id", DeleteProject);

export default router;
