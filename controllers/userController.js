const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const fs = require('fs')
const User = db.User
const Comment = db.Comment
const Like = db.Like
const Favorite = db.Favorite
const Followership = db.Followership
const Restaurant = db.Restaurant
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '9eed8735c675a97'
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const userService = require('../services/userService')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', "Passwords are not the same!")
      return res.redirect('/signup')
    } else {
      User.findOne({
        where: {
          email: req.body.email
        }.then(user => {
          if (user) {
            req.flash('error_messages', "This email has been registered!")
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(user => {
              return res.redirect('/signin')
            })
          }
        })
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', "Sign in successfully!")
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', "Log out successfully!")
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    userService.getUser(req, res, data => {
      return res.render('user', data)
    })
  },

  editUser: (req, res) => {
    if (req.user.id === Number(req.params.id)) {
      return User.findByPk(Number(req.params.id)).then(user => {
        return res.render('userEdit', { user: user })
      })
    } else {
      req.flash('error_messages', "You don't have the right to edit!")
      return res.redirect(`/users/${req.params.id}`)
    }
  },

  putUser: (req, res) => {
    const { file } = req
    console.log(file)
    console.log('file above')
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              email: req.body.email,
              password: user.password,
              isAdmin: user.isAdmin,
              image: file ? img.data.link : user.image,
            }).then((user) => {
              // console.log(user)
              req.flash('success_messages', 'User has been updated successfully !')
              res.redirect(`/users/${user.id}`)
            })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            email: req.body.email,
            password: user.password,
            isAdmin: user.isAdmin,
            image: user.image,
          }).then(user => {
            // console.log(user)
            req.flash('success_messages', 'User has been updated successfully !')
            res.redirect(`/users/${user.id}`)
          })
        })
    }
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => {
      return res.redirect('back')
    })
  },

  deleteFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then((favorite) => {
      favorite.destroy().then((restaurant) => {
        return res.redirect('back')
      })
    })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then((restaurant) => {
      return res.redirect('back')
    })
  },

  deleteLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(like => {
      like.destroy().then(restaurant => {
        return res.redirect('back')
      })
    })
  },

  getTopUser: (req, res) => {
    console.log('getTopUser')
    userService.getTopUser(req, res, data => {
      return res.render('topUser', data)
    })
  },

  addFollowing: (req, res) => {
    return Followership.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(followship => {
      return res.redirect('back')
    })
  },

  deleteFollowing: (req, res) => {
    return Followership.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy().then(followship => {
        return res.redirect('back')
      })
    })
  }
}
module.exports = userController