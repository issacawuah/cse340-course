import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 30) + '...' : 'UNDEFINED');

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define the application environment



// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const app = express();

/**
 * Configure Express middleware
 */


// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));
console.log('VIEWS DIRECTORY:', app.get('views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// Serve static files from the public directory




/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    console.log(organizations);

    const title = 'Our Partner Organizations';
    res.render('organizations', { title });
});

app.get('/projects', async (req, res) => {
    const projects = await getAllProjects();
    console.log(projects);

    const title = 'Service Projects';
    res.render('projects', { title, projects });
});


app.get('/categories', async (req, res) => {
    const categories = await getAllCategories();
    console.log(categories);

    const title = 'Service Project Categories';
    res.render('categories', { title, categories });
});

/**
 * Start the server
 */
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});