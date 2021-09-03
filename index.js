const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(morgan('tiny'));
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

app.use(cors())

app.use(express.static('build'))

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    },
    {
      "name": "Martin Cervantes",
      "number": "(656) 123-45-67",
      "id": 5
    }
  ]

app.get('/', (request, response) => {
  const html = `
    <h1>Persons API</h1>
    <table>
      <tr>
        <th>URL</th>
        <th>verb</th>
        <th>functionality</th>
      </tr>

      <tr>
        <td><a href="api/persons">/api/persons</a></td>
        <td>GET</td>
        <td>fetch all resources in the collection</td>
      </tr>

      <tr>
        <td><a href="api/persons/1">/api/persons/:id</a></td>
        <td>GET</td>
        <td>fetch a single resource</td>
      </tr>

      <tr>
        <td><a href="#">/api/persons/:id</a></td>
        <td>DELETE</td>
        <td>remove the identified resource</td>
      </tr>

      <tr>
        <td><a href="api/info">/api/info</a></td>
        <td>GET</td>
        <td>show how many entries are in the collection</td>
      </tr>
    </table>
  `;
  response.send(html)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId + 1
}

const includesName = (newName) => {
  for (let i = 0; i < persons.length; i += 1)
    if (persons[i].name === newName)
      return true;

  return false
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  } else if (includesName(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

app.get('/api/info', (request, response) => {
  const currentdate = new Date();

  const datetime = "Last Sync: " + currentdate.getDate() + "/"+(currentdate.getMonth()+1)
  + "/" + currentdate.getFullYear() + " @ "
  + currentdate.getHours() + ":"
  + currentdate.getMinutes() + ":" + currentdate.getSeconds();

  response.send(`<p>Phonebook has info for ${persons.length} people</p><br>${datetime}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
