require('dotenv').config();
const Pool = require('pg').Pool;


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false 
  }
});




const createTableQuery = `
  DROP TABLE IF EXISTS mydatabase;
  CREATE TABLE mydatabase (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
  );
`;


pool.query(createTableQuery, (error) => {
  if (error) {
    console.error('Error creating table:', error);
  } else {
    console.log('Table created successfully.');

    // Retrieve PostgreSQL version separately
    pool.query('SELECT version()', (err, result) => {
      if (err) {
        console.error('Error retrieving PostgreSQL version:', err);
      } else {
        console.log('PostgreSQL version:', result.rows[0].version);
      }
    });
  }
});


  

const getUsers = (req, res) => {
  try {
    pool.query('SELECT * FROM mydatabase', (err, result) => {
      if (err) throw err;
      res.status(200).json(result.rows);
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      user: null
    });
  }
};

const createUser = (req, res) => {
    try {
      const { name, email } = req.body;
    //   console.log(req.body);
      if (!name || !email) {
        throw new Error("Name and email are required");
      }
  
      pool.query(
        "INSERT INTO mydatabase  (name, email) VALUES ($1, $2) RETURNING *",
        [name, email],
        (err, result) => {
          if (err) {
            throw err;
          }
          res.status(201).send(`User added with id: ${result.rows[0].id}`);
        }
      );
    } catch (err) {
        console.log(err);
      res.status(500).json({
        error: err.message,
        users: null
      });
    }
  };



    const deleteUser = (req, res) => {
        try {
          const { id } = req.params;
          pool.query("DELETE FROM mydatabase WHERE id=$1", [id], (err, data) => {
            if (err) throw err;
            res.status(200).json({
              error: null,
              message: `User deleted with id: ${id}`,
            });
          });
        } catch (error) {
          res.status(500).json({
            error: error.message,
            message: "Failed to delete User",
          });
        }
      };
      
      const updateUserById = (req, res) => {
          try {
            const { id } = req.params;
            const { name,email} = req.body;
           

        pool.query(
               "UPDATE mydatabase SET name = $1, email = $2 WHERE id = $3",
              [name,email, id],
              (err, data) => {
                if (err) throw err;
         
                res.status(201).json({
                  err: null,
                  message: "Updated note",
                });
              }
            );
          } catch (error) {
            // console.log(error);
            res.status(500).json({
              err: error.message,
              message: "Failed to update note",
            });
          }
        };

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUserById
};
