const db = require('../../models')
const fs = require('fs')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const restService = require('../../services/restService')

let restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },
}

module.exports = restController