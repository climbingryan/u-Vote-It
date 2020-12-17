const express = require('express');
const inputCheck = require('./utils/inputCheck');
    // Modularized
const db = require('./db/database');
const apiRoutes = require('./routes/apiRoutes');
    // Port
const PORT = process.env.PORT || 3001;
const app = express();
    // Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

    // Imported routes
app.use('./api', apiRoutes);

    // displays ALL parties
app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    const params = [];

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ arror: err.message });
            return;
        }
        res.json({
            message: 'successful',
            data: rows
        });
    });
});

    // displays SINGLE PARTY
app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }   
        res.json({
            message: 'success',
            data: row
        });
    });
});

    // deletes party based on ID
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];

    db.run(sql, params, function(err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
        res.json({ 
          message: 'successfully deleted', 
          changes: this.changes 
        });
    });
});



    // Default response for any other request \ (NOT FOUND) Catch all
app.use((req, res) => {
    res.status(400).end();
});

    // Start server after DB connection
db.on('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})