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

function noteExist(noteName, array){
    return array.some(obj => obj["title"] == noteName)
}

app.listen(port, () => {
    console.log("Server is running on http://localhost:" + port);
})

app.get("/notes", (req, res) => {
    if (!fs.existsSync("notes.json")){
        fs.writeFileSync("notes.json", "[]");
    }
    res.sendFile("notes.json", {root: __dirname});
})

app.post("/upload", (req, res) => {
    let noteTitle = req.body.note_name;
    let noteBody = req.body.note;
    let notes = JSON.parse(fs.readFileSync("notes.json"));

    if (noteExist(noteTitle, notes)){
        return res.status(400).send("Bad request: note already exists.")
    }
    
    notes.push({"title": noteTitle, "body": noteBody});
    let updatedNotes = JSON.stringify(notes);
    fs.writeFileSync("notes.json", updatedNotes);

    return res.status(201).send("Note was succesfully created");
})

app.get("/notes/:title", (req, res) => {
    let notes = JSON.parse(fs.readFileSync("notes.json"));
    let noteTitle = req.params.title;

    if (!noteExist(noteTitle, notes)){
        return res.status(404).send("Not found: such note doesn't exist.")
    }
    
    const note = notes.find(obj => obj["title"] == noteTitle);
    return res.status(200).send(note["body"]);
})

app.put("/notes/:title", (req, res) => {
    let notes = JSON.parse(fs.readFileSync("notes.json"));
    let noteTitle = req.params.title;
    let newNoteBody = req.body;

    if (!noteExist(noteTitle, notes)){
        return res.status(404).send("Not found: such note doesn't exist.")
    }

    const note = notes.find(obj => obj["title"] == noteTitle);
    console.log(note)
    console.log(notes)
    note["body"] = newNoteBody;
    console.log(note)
    console.log(notes)
    updatedNotes = JSON.stringify(notes);
    fs.writeFileSync("notes.json", updatedNotes);
    return res.status(200).send("Success: your note was changed.");
})

app.delete("/notes/:title", (req, res) => { 
    let notes = JSON.parse(fs.readFileSync("notes.json"));
    let noteTitle = req.params.title;

    if (!noteExist(noteTitle, notes)){
        return res.status(404).send("Not found: such note doesn't exist.")
    }

    let note = notes.find(obj => obj["title"] == noteTitle);
    let updatedNotes = JSON.stringify(notes.filter(obj => obj["title"] != note["title"]));
    fs.writeFileSync("notes.json", updatedNotes);

    return res.status(200).send("Success: your note was deleted");  
})

