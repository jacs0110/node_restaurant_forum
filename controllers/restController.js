const db = require('../models')
const restService = require('../services/restService')
const Category = db.Category
const Comment = db.Comment
const Favorite = db.Favorite
const Restaurant = db.Restaurant
const User = db.User
const pageLimit = 9

let restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.render('restaurants', data)
    })
  },

  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, data => {
      return res.render('restaurant', data)
    })
  },

  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        })
      })
    })
  },

  getDashboard: (req, res) => {
    return Restaurant.findAndCountAll({
      where: { id: req.params.id },
      include: [Comment, Category]
    }).then(result => {
      return res.render('dashboard', {
        restaurant: result.rows[0],
        numComments: result.count
      })
    })
  },

  getTopRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoriteUsers' }
      ]
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,
        isFavorited: req.user.FavoriteRestaurants.map(d => d.id).includes(r.id)
      }))

      // sort restaurants
      let sortedRestaurants = data.sort((a, b) => b.FavoriteUsers.length - a.FavoriteUsers.length)

      // filter out restauratns with zero FavoriteUsers
      sortedRestaurants = sortedRestaurants.filter(restaurants => {
        return restaurants.FavoriteUsers.length > 0
      })

      // select top 10 restauants
      let topRestaurants = sortedRestaurants.slice(0, 10)
      return res.render('topRestaurant', { topRestaurants: topRestaurants })
    })
  }
}

module.exports = restController