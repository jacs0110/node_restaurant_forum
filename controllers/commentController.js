const db = require('../models')
const Comment = db.Comment
const commentService = require('../services/commentService')

let commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, data => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
      } else {
        req.flash('success_messages', data['message'])
      }
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  },

  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, data => {
      if (data['error'] === 'error') {
        req.flash('error_messages', data['message'])
      } else {
        req.flash('success_messages', data['message'])
      }
      return res.redirect(`back`)
    })
  }
}

module.exports = commentController