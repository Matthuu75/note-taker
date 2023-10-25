const express = require('express');
const fs = require('fs');


const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Develop/public/index.html');
});

app.get('/notes', (req, res) => {
    res.sendFile(__dirname + '/Develop/public/notes.html');
});

app.get('/api/notes', (req, res) => {
    res.sendFile(__dirname + '/db/db.json');
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    const lastNoteId = notes.length > 0 ? notes[notes.length - 1].id : 0;
    const newNoteId = lastNoteId + 1;
    newNote.id = newNoteId;
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/Develop/public/index.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

