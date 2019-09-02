const db = require('../../models')
const fs = require('fs')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '9eed8735c675a97'
const adminService = require('../../services/adminService')

let adminController = {
  getRestaurants: (req, res) => {
    // return Restaurant.findAll(
    //   { include: [Category] }
    // ).then(restaurants => {
    //   return res.json({ restaurants: restaurants })
    // })
    adminService.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },

  editUsers: (req, res) => {
    adminService.editUsers(req, res, data => {
      return res.json(data)
    })
  },

  putUsers: (req, res) => {
    adminService.putUsers(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = adminController