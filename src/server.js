const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/elements', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'private_data', 'elements.json'));
});

app.use('/models', express.static(path.join(__dirname, '..', 'private_data', 'models')));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});