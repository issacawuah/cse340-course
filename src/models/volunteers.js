import db from './db.js';

/**
 * Adds a user as a volunteer for a project.
 * ON CONFLICT DO NOTHING means signing up twice is harmless.
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Removes a user as a volunteer from a project.
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await db.query(query, [userId, projectId]);
};

/**
 * Checks if a user is already volunteering for a specific project.
 */
const isVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rows.length > 0;
};

/**
 * Retrieves all projects a user has volunteered for.
 */
const getVolunteeredProjects = async (userId) => {
    const query = `
        SELECT
            project.project_id,
            project.title,
            project.location,
            project.project_date,
            organization.name AS organization_name
        FROM volunteer
        JOIN project ON volunteer.project_id = project.project_id
        JOIN organization ON project.organization_id = organization.organization_id
        WHERE volunteer.user_id = $1
        ORDER BY project.project_date;
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
};

export { addVolunteer, removeVolunteer, isVolunteering, getVolunteeredProjects };