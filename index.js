const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_employee_department_db');
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json()); //middleware - to parse the (JSON payload)body into JS objects
app.use(require('morgan')('dev')); //Log the requests as they come in with morgan


// APP ROUTES
// GET /api/employees - returns array of employees
app.get('/api/employees', async (req, res, next) => {
  try {
    const SQL = /*sql*/ 
      `
      SELECT * from emlpoyees
      `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex)
  }
});

// GET /api/departments - returns an array of departments
app.get('/api/departments', async (req, res, next) => {
  try {
    const SQL = /*sql*/ 
      `
      SELECT * from departments
      `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (ex) {
    next(ex)
  }
});

// POST /api/employees - payload: the employee to create, returns the created employee


// DELETE /api/employees/:id - the id of the employee to delete is passed in the URL, returns nothing
// PUT /api/employees/:id - payload: the updated employee returns the updated employee
// add an error handling route which returns an object with an error property.

// init function )create and run the express app)
const init = async () => {
  await client.connect();
  console.log('connected  to db');
  let SQL = /*sql*/
  `
  DROP TABLE IF EXISTS employees;
  DROP TABLE IF EXISTS departments;
  CREATE TABLE departments(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    name CHAR(55) NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now(),
    department_id INTEGER REFERENCES departments(id) NOT NULL
  );
  `;
  await client.query(SQL);
  console.log('tables created');
  SQL = /*sql*/
  `
  INSERT INTO departments(name) VALUES('Human Resources');
  INSERT INTO departments(name) VALUES('Sales');
  INSERT INTO departments(name) VALUES('Marketing');
  INSERT INTO departments(name) VALUES('Finance');
  INSERT INTO departments(name) VALUES('IT');
  INSERT INTO departments(name) VALUES('Shipping');
  INSERT INTO employees(name, department_id) VALUES('Juliette Yagi',
    (SELECT id FROM departments WHERE name='Sales'));
  INSERT INTO employees(name, department_id) VALUES('Gregg Gordon', 
    (SELECT id FROM departments WHERE name='Sales'));
  INSERT INTO employees(name, department_id) VALUES('Lisa Seliman',
    (SELECT id FROM departments WHERE name='Human Resources'));
  INSERT INTO employees(name, department_id) VALUES('Tyson Clark',
    (SELECT id FROM departments WHERE name='Human Resources'));
  INSERT INTO employees(name, department_id) VALUES('Lisette Condor',
    (SELECT id FROM departments WHERE name='Finance'));
  INSERT INTO employees(name, department_id) VALUES('Taylor Eddelman',
    (SELECT id FROM departments WHERE name='Marketing'));
  INSERT INTO employees(name, department_id) VALUES('Kenny Nivaro',
    (SELECT id FROM departments WHERE name='IT'));
  INSERT INTO employees(name, department_id) VALUES('Stanley Ringold',
    (SELECT id FROM departments WHERE name='Shipping'));
  `;
  await client.query(SQL);
  console.log('data seeded');
  app.listen(port, () => console.log(`Listening on port ${port}`));
};


// Dont forget to call init :D 
init();
