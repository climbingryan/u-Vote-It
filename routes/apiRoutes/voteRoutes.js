const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const inputCheck = require('../../utils/inputCheck');

router.post('/vote', ({ body }, res) => {
        // DATA Validation
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
        // Prepare statement
    const sql = `INSERT INTO votes (voter_id, candidate_id) VALUES (?, ?)`;
    params = [body.voter_id, body.candidate_id];
        // EXECUTE
    db.run(sql, params, function(err, row) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body,
            id: this.lastID
        });
    });
});

router.get('/votes', (req, res) => {
    const sql = `SELECT candidates.*, parties.name AS party_name, COUNT(candidate_id) AS count
    FROM votes
    LEFT JOIN candidates ON votes.candidate_id = candidates.id
    LEFT JOIN parties ON candidates.party_id = parties.id
    GROUP BY candidate_id ORDER BY count DESC`;
    const params = [];

    db.all(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message })
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

module.exports = router;