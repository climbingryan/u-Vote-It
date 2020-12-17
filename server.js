const express = require('express');
const db = require('./db/database');
    // Port
const PORT = process.env.PORT || 3001;
const app = express();

const apiRoutes = require('./routes/apiRoutes');

    // Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

    // USE API ROUTE
app.use('/api', apiRoutes);

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