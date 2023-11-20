const express = require("express")
const fs = require("fs")
const multer = require("multer")
const app = express();
const upload = multer();
const port = 8000;  

app.use(express.static("static"));
app.use(express.json());
app.use(upload.any());
app.use(express.text());

app.listen(port, () => {
    console.log("Server is running on http://localhost:" + port);
})

app.get("/notes", (req, res) => {
    res.sendFile("notes.json", {root: __dirname});
})

app.post("/upload", (req, res) => {
    let noteTitle = req.body.note_name;
    let noteBody = req.body.note;
    let notes = JSON.parse(fs.readFileSync("notes.json"));

    if (noteTitle in notes) {
        return res.status(400).send("Bad Request: note already exists");
    }
    notes[noteTitle] = noteBody;
    const updatedNotes = JSON.stringify(notes);

    fs.writeFileSync("notes.json", updatedNotes);

    return res.status(201).send("Note was succesfully created");
})

app.get("/notes/:title", (req, res) => {
    let notes = JSON.parse(fs.readFileSync("notes.json"));
    let noteTitle = req.params.title;

    if (!(noteTitle in notes)){
        return res.status(404).send("Not found: such note doesn't exist.")
    }

    return res.status(200).send(notes[noteTitle]);
})

app.put("/notes/:title", (req, res) => {
    let notes = JSON.parse(fs.readFileSync("notes.json"));
    let noteTitle = req.params.title;

    if (!(noteTitle in notes)){
        return res.status(404).send("Not found: such note doesn't exist.")
    }

    notes[noteTitle] = req.body;
    updatedNotes = JSON.stringify(notes);
    fs.writeFileSync("notes.json", updatedNotes);
    return res.status(200).send("Success: your note was changed.");
})

app.delete("/notes/:title", (req, res) => {
    let notes = JSON.parse(fs.readFileSync("notes.json"));
    let noteTitle = req.params.title;

    if (!(noteTitle in notes)){
        return res.status(404).send("Not found: such note doesn't exist.")
    }
    delete notes[noteTitle];
    updatedNotes = JSON.stringify(notes);
    fs.writeFileSync("notes.json", updatedNotes);

    return res.status(200).send("Success: your note was deleted");  
})

