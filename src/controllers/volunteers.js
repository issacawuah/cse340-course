import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

// Handles POST /volunteer/:projectId — signs the logged-in user up for a project
const processVolunteerSignup = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;

    await addVolunteer(userId, projectId);

    req.flash('success', 'You have signed up to volunteer for this project!');
    res.redirect(`/project/${projectId}`);
};

// Handles POST /remove-volunteer/:projectId — removes the logged-in user from a project
// Redirects back to wherever the request came from (project page or dashboard)
const processRemoveVolunteer = async (req, res) => {
    const projectId = req.params.projectId;
    const userId = req.session.user.user_id;

    await removeVolunteer(userId, projectId);

    req.flash('success', 'You have been removed as a volunteer.');

    const redirectTo = req.body.redirectTo || `/project/${projectId}`;
    res.redirect(redirectTo);
};

export { processVolunteerSignup, processRemoveVolunteer };