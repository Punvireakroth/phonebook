require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PhoneBook = require('./models/phonebook');

const app = express();


// Middlewares
morgan.token('req-body', (req, res) => JSON.stringify(req.body));
const customFormat = ':method :url :status :res[content-length] - :response-time ms :req-body';

app.use(morgan(customFormat));

app.use(express.json());

app.use(cors());

app.use(express.static('dist'))

// let notes = [];

app.get('/api/persons', (req, res) => {
  PhoneBook.find()
    .then(result => {
      if(result.length === 0) {
        return res.json({message: 'There is no information'})
      }
      res.json(result);
    })
})

// app.get('/info', (req, res) => {
//   const numEntries = notes.length;
//   const currentDate = new Date();

//   const response = `<p>Phone book has info for ${numEntries} people</p> <br /> <p>${currentDate}</p>`;

//   res.send(response);
// })

// app.get('/api/persons/:id', (req, res) => {
//   const id = req.params.id;
//   const person = notes.find(note => note.id === id);
//   if (person) {
//     res.json(person);
//   } else {
//     res.status(404).end();
//   }
// })

// app.delete('/api/persons/:id', (req, res) => {
//   const id = req.params.id;
//   notes = notes.filter(note => note.id !== id);

//   res.status(204).end();
// })

app.post('/api/persons', (request, response) => {
  body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    });
  } 


  const phoneBook = new PhoneBook({
    name: body.name,
    number: body.number,
    content: body.content
  })

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }


  phoneBook.save()
    .then(savePhoneBook => {
      response.json(savePhoneBook)
    })
    .catch(error => {
      response.status(500).json({error: error.message});
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
})