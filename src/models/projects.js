import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT project.project_id, project.title, project.description, project.location, 
               project.project_date, organization.name AS organization_name 
        FROM project 
        JOIN organization ON project.organization_id = organization.organization_id 
        ORDER BY project.project_date;
    `;
    const result = await db.query(query);
    return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// new code added models functions (team w3)
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            project.project_id,
            project.title,
            project.description,
            project.project_date AS date,
            project.location,
            project.organization_id,
            organization.name AS organization_name
        FROM project
        JOIN organization ON project.organization_id = organization.organization_id
        WHERE project.project_date >= CURRENT_DATE
        ORDER BY project.project_date ASC
        LIMIT $1;
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            project.project_id,
            project.title,
            project.description,
            project.project_date AS date,
            project.location,
            project.organization_id,
            organization.name AS organization_name
        FROM project
        JOIN organization ON project.organization_id = organization.organization_id
        WHERE project.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows.length > 0 ? result.rows[0] : null;
};

const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            category.category_id,
            category.name
        FROM category
        JOIN project_category ON category.category_id = project_category.category_id
        WHERE project_category.project_id = $1;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getCategoriesByProjectId };