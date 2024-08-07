const express = require('express');
const morgan = require('morgan');

const app = express();


// Middlewares
morgan.token('req-body', (req, res) => JSON.stringify(req.body));
const customFormat = ':method :url :status :res[content-length] - :response-time ms :req-body';

app.use(morgan(customFormat));

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

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    });
  }

  const existingPerson = notes.find(person => person.name === body.name);
  if (existingPerson) {
    return response.status(400).json({
      error: 'name already exists in the phonebook'
    });
  }

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    name: body.name,
    number: body.number,
    content: body.content,
    important: Boolean(body.important) || false,
    id: Math.floor(Math.random() * 10000),
  }

  notes = notes.concat(note)
  response.json(notes);
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
})