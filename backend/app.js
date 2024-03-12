const express = require('express');
const app = express();
const fs = require('fs');
const { body, validationResult } = require('express-validator');

app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const validateNewScore = [
    body('name').notEmpty().withMessage('Name is required'),
    body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
];


function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

app.get('/api/highscores', (req, res) => {
    try {
        const rawHighscores = fs.readFileSync('highscores.json', 'utf8');
        const highscores = JSON.parse(rawHighscores);
       
        res.json(highscores);
    } catch (error) {
        console.error('Error reading highscores.json:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.post('/api/highscores', validateNewScore, handleValidationErrors, (req, res) => {
    const newScore = req.body;

    try {
        const rawHighscores = fs.readFileSync('highscores.json', 'utf8');
        const highscores = JSON.parse(rawHighscores);

        highscores.push(newScore);
        highscores.sort((a, b) => b.score - a.score);
        highscores.splice(5);

        fs.writeFile('highscores.json', JSON.stringify(highscores), (err) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'An error occurred' });
            } else {
                res.json({ message: 'Score added to list' });
            }
        });
    } catch (error) {
        console.error('Error with highscores.json:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.delete('/api/highscores/reset', (req, res) => {
    const initialHighscores = [
        { name: 'Spelare 1', score: 0 },
        { name: 'Spelare 2', score: 0 },
        { name: 'Spelare 3', score: 0 },
        { name: 'Spelare 4', score: 0 },
        { name: 'Spelare 5', score: 0 }
    ];

    fs.writeFile('highscores.json', JSON.stringify(initialHighscores), (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
            return;
        }
        res.json({ message: 'Highscorelist updated' });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});