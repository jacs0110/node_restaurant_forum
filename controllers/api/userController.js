const bcrypt = require('bcrypt-nodejs')
const db = require('../../models')
const User = db.User

const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const userService = require('../../services/userService')

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

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      return res.json({ status: 'error', message: 'Passwords are inconsistent' })
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return res.json({ status: 'error', message: 'Please use another email to register!' })
        } else {
          User.create({
            name: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ status: 'success', message: 'Sign up successfully!' })
          })
        }
      })
    }
  },

  getTopUser: (req, res) => {
    console.log('getTopUser')
    userService.getTopUser(req, res, data => {
      return res.json(data)
    })
  },
}

module.exports = userController