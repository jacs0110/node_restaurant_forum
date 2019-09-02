const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService')

let categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.render('admin/categories', data)
    })
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'Please enter a name!')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      }).then(category => {
        req.flash('success_messages', 'Create a new category successfully!')
        res.redirect('/admin/categories')
      })
    }
  },

  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'Please enter a name!')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              req.flash('success_messages', 'Update a category successfully!')
              res.redirect('/admin/categories')
            })
        })
    }
  },

  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            req.flash('success_messages', 'Delete a category successfully!')
            res.redirect('/admin/categories')
          })
      })
  }
}

module.exports = categoryController