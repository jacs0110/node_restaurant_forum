const db = require('../../models')
const fs = require('fs')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '9eed8735c675a97'

let adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll(
      { include: [Category] }
    ).then(restaurants => {
      return res.json({ restaurants: restaurants })
    })
  }
}

module.exports = adminController