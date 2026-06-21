import { projectRepository } from "./project-repository.js";

const createProject = async ({ projectName }) => {
    const result = await projectRepository.createProject({ projectName });
    return result;
};

const getAllProjects = async () => {
    const projects = await projectRepository.getAllProjects();
    return projects;
};

export const projectService = {
    createProject,
    getAllProjects
};