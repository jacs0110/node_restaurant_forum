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

let userService = {
  getTopUser: (req, res, callback) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return callback({ users: users })
    })
  },

  getUser: (req, res, callback) => {
    let isSameUser = false
    if (req.user.id === Number(req.params.id)) {
      isSameUser = true
    }
    return User.findAndCountAll({
      where: { id: req.params.id },
      include: [
        { model: Comment, include: [Restaurant] },
        { model: Restaurant, as: "FavoriteRestaurants" },
        { model: User, as: "Followers" },
        { model: User, as: "Followings" },
      ]
    }).then(result => {
      // filter out unique restaurant id from those restaurants with comments
      const commentedRestaurants = [...new Set(result.rows[0].Comments.map(x => x.RestaurantId))]

      // query restaurant info with an array of uniqle restaurant id
      Restaurant.findAll({
        where: {
          id: {
            [Op.in]: commentedRestaurants
          }
        }
      }).then(Restaurants => {
        return callback({
          targetUser: result.rows[0],
          isSameUser: isSameUser,
          counts: result.count,
          Restaurants: Restaurants
        })
      })
    })
  },

  putUser: (req, res, callback) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            if (!user) {
              return callback({ status: 'error', message: 'User not found!' })
            }
            user.update({
              name: req.body.name,
              email: req.body.email,
              password: user.password,
              isAdmin: user.isAdmin,
              image: file ? img.data.link : user.image,
            }).then((user) => {
              return callback({ status: 'success', message: 'User has been updated successfully!' })
            })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          if (!user) {
            return callback({ status: 'error', message: 'User not found!' })
          }
          user.update({
            name: req.body.name,
            email: req.body.email,
            password: user.password,
            isAdmin: user.isAdmin,
            image: user.image,
          }).then(user => {
            return callback({ status: 'success', message: 'User has been updated successfully!' })
          })
        })
    }
  },
}

module.exports = userService