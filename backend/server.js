const express = require("express");
const cors = require("cors");
const {pool} = require("pg");
require ("dotenv").config();


const app = express();
const port = process.env.PORT || 5000;

// setting up the postegres sql connection
const pool = new pool({
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database : process.env.DB_PASSWORD,
    port : process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

// Get all the task
app.get("/api/tasks", async(req,res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks");
        res.json(result.rows);
    }catch (error) {
        console.log(error);
        res.status(500).send("Error fetching tasks");
    }
});

// Add a new task
app.post("/api/tasks" , async (req, res) => {
    const {text, completed } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO tasks (text completed) VALUES ($1, $2) returning *",
            [text, completed]
        );  
        res.status(201).json(result.rows[0]);     
    }catch(error){
        console.error(error);
        res.status(500).send("Error adding tasks");
    }
});