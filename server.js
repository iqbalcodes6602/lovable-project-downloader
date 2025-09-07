const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 4000;

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like jszip.min.js)
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

// Serve frontend page
app.get('/', (req, res) => {
    res.render('index');
});

// Proxy API for fetching project data
app.get('/project/:id', async (req, res) => {
    const { id } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Missing session token" });
    }

    const sessionToken = authHeader.split(' ')[1];

    try {
        const response = await fetch(`https://lovable-api.com/projects/${id}/source-code`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch project data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
