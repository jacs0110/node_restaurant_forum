const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const db = require('./models')
const session = require('express-session')
const flash = require('connect-flash')
const handlebars = require('express-handlebars')

const port = 3000

// set up view engine
app.engine('.hbs', handlebars({
  extname: '.hbs',
  defaultLayout: 'main'
}))
app.set('view engine', '.hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`Express app is listening on port ${port}...`)
})

require('./routes')(app)