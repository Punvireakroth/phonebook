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


// app.get('/api/persons/:id', (req, res) => {
//   const id = req.params.id;
//   const person = notes.find(note => note.id === id);
//   if (person) {
//     res.json(person);
//   } else {
//     res.status(404).end();
//   }
// })


app.post('/api/persons', (request, response, next) => {
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
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const updatedPerson = {
    number: body.number,
    content: body.content,
  }

  PhoneBook.findByIdAndUpdate(request.params.id, updatedPerson, {new: true})
    .then(updatedPerson => {
      if(updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).json({ error: 'Person not found'});
      }
    })
    .catch(error => next(error));
})


app.delete('/api/persons/:id', (request, response, next) => {
  PhoneBook.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
})