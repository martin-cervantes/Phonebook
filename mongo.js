const mongoose = require('mongoose')

const length = process.argv.length

if (length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.pzvwx.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (length == 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else if (length == 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: `${name}`,
    number: `${number}`,
  })

  person.save().then(result => {
    console.log('person saved!', result)
    mongoose.connection.close()
  })
}
