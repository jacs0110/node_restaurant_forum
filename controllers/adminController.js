const db = require('../models')
const Restaurant = db.Restaurant

let adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  }
}

module.exports = adminController