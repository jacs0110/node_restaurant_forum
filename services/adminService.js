const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll(
      { include: [Category] }
    ).then(restaurants => {
      callback({ restaurants: restaurants })
    })
  },
}

module.exports = adminService