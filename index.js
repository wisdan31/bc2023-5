const express = require("express")
const fs = require("fs")
const multer = require("multer")
const app = express();
const port = 8000;

app.use(express.static("static"));
app.use(express.json());

app.listen(port, () => {
    console.log("Server is running on http://localhost:" + port);
})

app.get("/notes", (req, res) => {
    res.sendFile("notes.json", {root: __dirname});
})

app.get("/UploadForm.html", (req, res) => {
    res.sendFile("UploadForm.html");
});

app.post("/upload", (req, res) => {
    let noteTitle = req.body.note_name;
    let noteBody = req.body.note;
    let notes = JSON.parse(fs.readFileSync("notes.json"));

    if (noteTitle in notes) {
        return res.status(400).send("Bad Request: note already exists");
    }

    return res.status(201).send("Note succesfully created");
})

