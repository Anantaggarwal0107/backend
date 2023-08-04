// const http = require('http')

// let notes = [  
//     {    id: 1,    content: "HTML is easy",    important: true  },
//     {    id: 2,    content: "Browser can execute only JavaScript",    important: false  },
//     {    id: 3,    content: "GET and POST are the most important methods of HTTP protocol",    important: true  }]
//     const app = http.createServer((request, response) => {  
//         response.writeHead(200, { 'Content-Type': 'application/json' })  
//         response.end(JSON.stringify(notes))
//     })
// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)
require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
// `mongodb+srv://anantaggarwal0107:${password}@cluster0.5kufo5h.mongodb.net/noteApp?retryWrites=true&w=majority`
`mongodb+srv://anantaggarwal0107:Anant123@cluster0.5kufo5h.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = require('./models/note')

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
let notes = [
  {    id: 2,    content: "Browser can execute only JavaScript",    important: false  },  
  {    id: 1,    content: "HTML is easy",    important: true  },
  {    id: 3,    content: "GET and POST are the most important methods of HTTP protocol",    important: true  }
]

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
// app.get('/api/notes', (request, response) => {
//   response.json(notes)
// })


app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
    response.json(note)
  })

  app.put('/api/notes/:id',(request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    note
    if (note) {
      note.important=!note.important;
    } else {
      response.status(404).end()
    }
    response.json(note)
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

  app.use(unknownEndpoint)
  // const PORT = process.env.PORT || 3001
  // app.listen(PORT, () => {
  //   console.log(`Server running on port ${PORT}`)
  // })