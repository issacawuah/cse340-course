-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');



-- ========================================
-- Project Table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

-- ========================================
-- Insert sample data: Projects (5 per organization = 15 total)
-- ========================================
INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Habitat Build Weekend', 'Helping construct affordable housing for a local family in need.', '123 Elm Street', '2026-06-20'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Community Center Renovation', 'Repairing and repainting the neighborhood community center.', 'Downtown Community Center', '2026-04-11'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Wheelchair Ramp Build', 'Constructing accessibility ramps for elderly residents.', 'Maple Street Homes', '2026-08-02'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Playground Restoration', 'Rebuilding safety equipment at the public playground.', 'Riverside Park', '2026-05-16'),
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 'Storm Shelter Construction', 'Building a storm shelter for a low-income housing complex.', 'Willow Creek Apartments', '2026-09-27'),

((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Community Garden Planting', 'Planting vegetables in the shared neighborhood garden plots.', 'Sunnyvale Community Garden', '2026-03-14'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Urban Composting Workshop', 'Teaching residents how to compost food waste at home.', 'GreenHarvest Learning Center', '2026-04-30'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Farmers Market Setup', 'Volunteers help set up and run the weekly farmers market.', 'Town Square', '2026-06-06'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'School Garden Build', 'Building a teaching garden at a local elementary school.', 'Lincoln Elementary', '2026-05-09'),
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 'Seed Distribution Day', 'Handing out free vegetable seed packets to families.', 'GreenHarvest Farm Stand', '2026-02-21'),

((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Winter Coat Drive', 'Collecting and distributing warm coats to families in need.', 'City Hall', '2026-11-10'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Senior Center Visit Day', 'Spending time with residents at a local senior living facility.', 'Sunrise Senior Living', '2026-03-22'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Blood Donation Drive', 'Partnering with the Red Cross to collect blood donations.', 'First Baptist Church', '2026-07-05'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Backpack Packing Event', 'Assembling school supply backpacks for students in need.', 'UnityServe Warehouse', '2026-08-01'),
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 'Holiday Meal Delivery', 'Delivering hot meals to homebound seniors during the holidays.', 'Various Locations', '2026-12-20');




-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
('Construction & Housing'),
('Food & Hunger Relief'),
('Environment & Sustainability'),
('Education & Youth'),
('Health & Wellness');

-- ========================================
-- Project_Category Junction Table
-- (Many-to-Many: a project can have many categories,
--  a category can have many projects)
-- ========================================
CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id),
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
);

-- ========================================
-- Insert sample data: Associate each project with at least 1 category
-- ========================================
INSERT INTO project_category (project_id, category_id)
VALUES
-- BrightFuture Builders projects
((SELECT project_id FROM project WHERE title = 'Habitat Build Weekend'), (SELECT category_id FROM category WHERE name = 'Construction & Housing')),
((SELECT project_id FROM project WHERE title = 'Community Center Renovation'), (SELECT category_id FROM category WHERE name = 'Construction & Housing')),
((SELECT project_id FROM project WHERE title = 'Wheelchair Ramp Build'), (SELECT category_id FROM category WHERE name = 'Construction & Housing')),
((SELECT project_id FROM project WHERE title = 'Wheelchair Ramp Build'), (SELECT category_id FROM category WHERE name = 'Health & Wellness')),
((SELECT project_id FROM project WHERE title = 'Playground Restoration'), (SELECT category_id FROM category WHERE name = 'Construction & Housing')),
((SELECT project_id FROM project WHERE title = 'Playground Restoration'), (SELECT category_id FROM category WHERE name = 'Education & Youth')),
((SELECT project_id FROM project WHERE title = 'Storm Shelter Construction'), (SELECT category_id FROM category WHERE name = 'Construction & Housing')),

-- GreenHarvest Growers projects
((SELECT project_id FROM project WHERE title = 'Community Garden Planting'), (SELECT category_id FROM category WHERE name = 'Environment & Sustainability')),
((SELECT project_id FROM project WHERE title = 'Community Garden Planting'), (SELECT category_id FROM category WHERE name = 'Food & Hunger Relief')),
((SELECT project_id FROM project WHERE title = 'Urban Composting Workshop'), (SELECT category_id FROM category WHERE name = 'Environment & Sustainability')),
((SELECT project_id FROM project WHERE title = 'Farmers Market Setup'), (SELECT category_id FROM category WHERE name = 'Food & Hunger Relief')),
((SELECT project_id FROM project WHERE title = 'School Garden Build'), (SELECT category_id FROM category WHERE name = 'Education & Youth')),
((SELECT project_id FROM project WHERE title = 'School Garden Build'), (SELECT category_id FROM category WHERE name = 'Environment & Sustainability')),
((SELECT project_id FROM project WHERE title = 'Seed Distribution Day'), (SELECT category_id FROM category WHERE name = 'Food & Hunger Relief')),

-- UnityServe Volunteers projects
((SELECT project_id FROM project WHERE title = 'Winter Coat Drive'), (SELECT category_id FROM category WHERE name = 'Food & Hunger Relief')),
((SELECT project_id FROM project WHERE title = 'Senior Center Visit Day'), (SELECT category_id FROM category WHERE name = 'Health & Wellness')),
((SELECT project_id FROM project WHERE title = 'Blood Donation Drive'), (SELECT category_id FROM category WHERE name = 'Health & Wellness')),
((SELECT project_id FROM project WHERE title = 'Backpack Packing Event'), (SELECT category_id FROM category WHERE name = 'Education & Youth')),
((SELECT project_id FROM project WHERE title = 'Holiday Meal Delivery'), (SELECT category_id FROM category WHERE name = 'Food & Hunger Relief'));
