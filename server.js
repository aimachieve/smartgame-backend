const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')
const path = require('path')

const users = require('./routes/api/users')
const game = require('./routes/api/game')

const app = express()

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(bodyParser.json())
app.use(cors())

// DB Config
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err))

// Passport middleware
app.use(passport.initialize())

// Passport config
require('./config/passport')(passport)

//  Define the route to read the files of the server from the client
app.use('/uploads/', express.static('uploads'))
app.use(cors())

// app.use(express.static(path.join(__dirname, '../client/build')))
// app.get('*', function (req, res) {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
// })

// For heroku test
app.get('/', (req,res) => {
  res.send('Hello from Express!')
})

// Routes
app.use('/api/account', users)
app.use('/api/game', game)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server up and running on port ${port} !`))
