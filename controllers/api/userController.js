require('dotenv').config()
const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

let userController = {

  signIn: (req, res) => {

    if (!req.body.email || !req.body.password) {
      return res.json({ status: 'error', message: 'Require both email and password' })
    }

    let username = req.body.email
    let password = req.body.password

    User.findOne({
      where: {
        email: username
      }
    }).then(user => {

      if (!user) { return res.status(401).json({ status: 'error', message: 'User not found' }) }

      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Wrong password' })
      }

      let payload = { id: user.id }
      let token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          idAdmin: user.isAdmin
        }
      })
    })
  },
}

module.exports = userController