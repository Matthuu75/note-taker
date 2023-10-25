const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const dbFilePath = path.join(__dirname, 'db', 'db.json');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(dbFilePath));
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync(dbFilePath));
    const lastNoteId = notes.length > 0 ? notes[notes.length - 1].id : 0;
    const newNoteId = lastNoteId + 1;
    newNote.id = newNoteId;
    notes.push(newNote);
    fs.writeFileSync(dbFilePath, JSON.stringify(notes));
    res.json(newNote);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const notes = JSON.parse(fs.readFileSync(dbFilePath));
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        fs.writeFileSync(dbFilePath, JSON.stringify(notes));
        res.json({ success: true, message: 'Note deleted successfully' });
    } else {
        res.status(404).json({ success: false, message: 'Note not found' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
