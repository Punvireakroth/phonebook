const express = require('express');
const app = express();

app.use(express.json());

let notes = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (req, res) => {
  res.json(notes);
})

app.get('/info', (req, res) => {
  const numEntries = notes.length;
  const currentDate = new Date();

  const response = `<p>Phone book has info for ${numEntries} people</p> <br /> <p>${currentDate}</p>`;

  res.send(response);
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = notes.find(note => note.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  notes = notes.filter(note => note.id !== id);

  res.status(204).end();
})

app.post('/api/persons', (request, response) => {
  body = request.body;

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: Math.random(1, 10000),
  }

  notes = notes.concat(note)
  response.json(notes);
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
})