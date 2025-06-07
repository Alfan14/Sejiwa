import pool from "../db/index.mjs";

    const  totalUsers = (req, res, next) => {
    pool.query('SELECT COUNT(*) AS total_users FROM users', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })
    };

    const  totalSchedules = (req, res, next) => {
    pool.query('SELECT COUNT(*) AS total_schedules FROM schedules', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })
    };

    const  totalAssessment = (req, res, next) => {
    pool.query('SELECT COUNT(*) AS total_schedules FROM assessments', (error, results) => {
            if (error) {
                throw error
            }
            res.status(200).json(results.rows)
        })
    };

    export default {
        totalUsers,
        totalSchedules,
        totalAssessment
    }