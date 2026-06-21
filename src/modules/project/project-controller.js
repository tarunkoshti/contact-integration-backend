import { ApiResponse } from "../../core/utils/ApiResponse.js";
import { ApiError } from "../../core/utils/ApiError.js";
import { projectService } from "./project-service.js";

const createProject = async (req, res) => {
    const { projectName } = req.body;

    if (!projectName) {
        throw new ApiError(400, "Project name is required");
    }

    const result = await projectService.createProject({ projectName });
    return res.json(new ApiResponse(200, result, "Project created successfully"));
};

const getAllProjects = async (req, res) => {
    const result = await projectService.getAllProjects();
    return res.json(new ApiResponse(200, result, "Projects fetched successfully"));
};

export const projectController = {
    createProject,
    getAllProjects
};