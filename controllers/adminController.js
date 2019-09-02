const db = require('../models')
const fs = require('fs')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '9eed8735c675a97'
const adminService = require('../services/adminService')

let adminController = {
  getRestaurants: (req, res) => {
    // return Restaurant.findAll(
    //   { include: [Category] }
    // ).then(restaurants => {
    //   return res.render('admin/restaurants', { restaurants: restaurants })
    // })
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', { categories: categories })
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        return res.render('admin/create', {
          restaurant: restaurant,
          categories: categories
        })
      })
    })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "This restaurant exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
              .then((restaurant) => {
                req.flash('success_messages', 'Restaurant was successfully updated!')
                res.redirect('/admin/restaurants')
              })
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
            .then((restaurant) => {
              req.flash('success_messages', 'Restaurant was successfully updated!')
              res.redirect('/admin/restaurants')
            })
        })
    }
    // return Restaurant.findByPk(req.params.id)
    //   .then((restaurant) => {
    //     restaurant.update({
    //       name: req.body.name,
    //       tel: req.body.tel,
    //       address: req.body.address,
    //       opening_hours: req.body.opening_hours,
    //       description: req.body.description
    //     })
    //       .then((restaurant) => {
    //         req.flash('success_messages', 'Restaurant was successfully updated!')
    //         res.redirect('/admin/restaurants')
    //       })
    //   })
  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurant')
      }
    })
  },

  editUsers: (req, res) => {
    return User.findAll().then(users => {
      return res.render('admin/users', { users: users })
    })
  },

  putUsers: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      if (user.isAdmin) {
        user.update({
          isAdmin: 0
        })
          .then((user) => {
            req.flash('success_messages', 'User was successfully updated!')
            res.redirect('/admin/users')
          })
      } else {
        user.update({
          isAdmin: 1
        })
          .then((user) => {
            req.flash('success_messages', 'User was successfully updated!')
            res.redirect('/admin/users')
          })
      }
    })
  }
}

module.exports = adminController