const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// GET all cards
app.get('/cards', (req, res) => {
    db.query('SELECT * FROM cards', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST add a new card
app.post('/cards', (req, res) => {
    const { question, answer } = req.body;
    db.query(
        'INSERT INTO cards (question, answer) VALUES (?, ?)',
        [question, answer],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, question, answer });
        }
    );
});

// DELETE a card
app.delete('/cards/:id', (req, res) => {
    db.query('DELETE FROM cards WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Card deleted' });
    });
});

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});