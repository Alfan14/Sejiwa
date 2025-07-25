import pool from "../db/index.mjs";
import bcrypt from "bcrypt";

const getUsers = (async (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
});

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { username, email, password, role, profile_picture } = request.body

  pool.query('INSERT INTO users (username, email, password, role , profile_picture) VALUES ($1, $2, $3, $4, $5)',
    [username, email, password, role], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.insertId}`)
    })
};

const updateUser = (async (request, response) => {
  const id = parseInt(request.params.id)
  const { username, email, password, role, profile_picture } = request.body

  const passwordHash = await bcrypt.hash(password, 10)

  pool.query(
    'UPDATE users SET username = $1, email = $2 , password = $3 , role = $4 , profile_picture = $5 WHERE id = $6',
    [username, email, passwordHash, role, profile_picture, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
});

 const patchUser = async (request, response) => {
    const id = parseInt(request.params.id);
    const { username, email, password, role, profile_picture } = request.body;

    const fields = [];
    const values = [];
    let valueIndex = 1;

    if (username) {
      fields.push(`username = $${valueIndex++}`);
      values.push(username);
    }
    if (email) {
      fields.push(`email = $${valueIndex++}`);
      values.push(email);
    }
    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      fields.push(`password = $${valueIndex++}`);
      values.push(passwordHash);
    }
    if (role) {
      fields.push(`role = $${valueIndex++}`);
      values.push(role);
    }
    if (profile_picture) {
      fields.push(`profile_picture = $${valueIndex++}`);
      values.push(profile_picture);
    }

    if (fields.length === 0) {
      return response.status(400).json({ message: "No fields to update." });
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${valueIndex}`;

    pool.query(query, values, (error, results) => {
      if (error) {
        return response.status(500).json({ message: "Update failed.", error });
      }
      response.status(200).send(`User with ID: ${id} patched.`);
    });
  };


const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
}