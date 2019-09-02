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
    restService.getFeeds(req, res, data => {
      return res.render('feeds', data)
    })
  },

  getDashboard: (req, res) => {
    restService.getDashboard(req, res, data => {
      return res.render('dashboard', data)
    })
  },

  getTopRestaurants: (req, res) => {
    restService.getTopRestaurants(req, res, data => {
      return res.render('topRestaurant', data)
    })
  }
}

module.exports = restController