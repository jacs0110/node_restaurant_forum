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
}

module.exports = commentService