// //             V0
// console.log('Hello World!');

// //             V1
// const http = require('http');
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' });
//   response.end('Hello World!');
// });
// const PORT = 3001;
// app.listen(PORT);
// console.log(`listening on port ${PORT}`);

// //             V2
// const http = require('http');
let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Contet-Type': 'application/json' });
//   response.end(JSON.stringify(notes));
// });
// const PORT = 3001;
// app.listen(PORT);
// console.log(`The app is listening on ${PORT} port`);

////           V3
const express = require('express');
const app = express();
app.use(express.json());

// let notes = [
//   ...
// ]
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});
app.get('/api/notes', (request, response) => {
  response.json(notes);
});
app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const n = notes.find((n) => n.id === id);
  // n ? res.json(n) : res.send(`There is no note with id: ${id}`);
  n ? res.json(n) : res.status(404).end();
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);
  res.status(204).end();
});
const generateId = () => {
  return notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
};
app.post('/api/notes', (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };
  notes = notes.concat(note);
  response.json(note);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
