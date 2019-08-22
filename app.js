const express = require('express')
const app = express()
const handlebars = require('express-handlebars')
const port = 3000

// set up view engine
app.engine('.hbs', handlebars({
  extname: '.hbs',
  defaultLayout: 'main'
}))
app.set('view engine', '.hbs')



app.listen(port, () => {
  console.log(`Express app is listening on port ${port}...`)
})

require('./routes')(app)