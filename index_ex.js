const express = require('express');
const app = express();
app.use(express.json());
const morgan = require('morgan');
// app.use(morgan('tiny'));
morgan.token('body', (req) => JSON.stringify(req.body));
// morgan.token('type',  req=>req.headers['content-type'])
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
const cors = require('cors');
app.use(cors());

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.send(persons);
});
app.get('/info', (req, res) => {
  const text = `<div><p>Phonebook has info for ${
    persons.length
  } people</p><br/><p>${new Date().toString()}</p></div>`;
  res.send(text);
});
app.get('/api/persons/:id', (req, res) => {
  const person = persons.find((n) => n.id === Number(req.params.id));
  person ? res.json(person) : res.status(404).end();
});
app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter((n) => n.id !== Number(req.params.id));
  res.status(204).end();
});
const err = (text) => {};
app.post('/api/persons/', (req, res) => {
  const body = req.body;
  if (!(body.name && body.number)) {
    return res.status(400).json({
      error: 'name or number missing',
    });
  }
  if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }
  body.id = Math.trunc(Math.random() * 10000);
  persons = persons.concat(body);
  res.json(body);
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
