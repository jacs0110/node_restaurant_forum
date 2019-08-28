const db = require('../models')
const Comment = db.Comment

let commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      UserId: req.user.id,
      RestaurantId: req.body.restaurantId
    }).then(comment => {
      res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  }
}

module.exports = commentController