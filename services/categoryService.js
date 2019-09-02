const db = require('../models')
const Category = db.Category

let categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            callback({ categories: categories, category: category })
          })
      } else {
        callback({ categories: categories })
      }
    })
  },

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'Please enter a name!' })
    } else {
      return Category.create({
        name: req.body.name
      }).then(category => {
        return callback({ status: 'success', message: 'Create a new category successfully!' })
      })
    }
  },

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'Please enter a name!' })
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              return callback({ status: 'success', message: 'Update a category successfully!' })
            })
        })
    }
  },
}

module.exports = categoryService