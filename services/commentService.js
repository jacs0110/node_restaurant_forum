const db = require('../models')
const Comment = db.Comment

let commentService = {
  postComment: (req, res, callback) => {
    if (!req.body.text || !req.body.restaurantId || !req.user.id) {
      return callback({ status: 'error', message: 'Data incomplete!' })
    }

    return Comment.create({
      text: req.body.text,
      UserId: req.user.id,
      RestaurantId: req.body.restaurantId
    }).then(comment => {
      return callback({ status: 'success', message: 'Comment was created successfully!' })
    })
  },

  deleteComment: (req, res, callback) => {
    return Comment.findByPk(req.params.id).then((comment) => {
      if (!comment) {
        return callback({ status: 'error', message: 'Comment id not found!' })
      }
      comment.destroy().then((comment) => {
        return callback({ status: 'success', message: 'Comment was deleted successfully!' })
      })
    })
  }
}

module.exports = commentService