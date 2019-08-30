const db = require('../models')
const Category = db.Category
const Comment = db.Comment
const Favorite = db.Favorite
const Restaurant = db.Restaurant
const User = db.User
const pageLimit = 9

let restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      // pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: req.user.FavoriteRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll().then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })

    })
  },

  getRestaurant: (req, res) => {

    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] },
        { model: User, as: 'LikedUsers' },
      ],
    }).then(restaurant => {
      return restaurant.increment('viewCount', { by: 1 })
    }).then(restaurant => {
      console.log(restaurant)
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      return res.render('restaurant', {
        restaurant: restaurant,
        isLiked: isLiked
      })
    })
  },

  getFeeds: (req, res) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
        })
      })
    })
  },

  getDashboard: (req, res) => {
    return Restaurant.findAndCountAll({
      where: { id: req.params.id },
      include: [Comment, Category]
    }).then(result => {
      return res.render('dashboard', {
        restaurant: result.rows[0],
        numComments: result.count
      })
    })
  },

  getTopRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoriteUsers' }
      ]
    }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,
        isFavorited: req.user.FavoriteRestaurants.map(d => d.id).includes(r.id)
      }))

      // sort restaurants
      let sortedRestaurants = data.sort((a, b) => b.FavoriteUsers.length - a.FavoriteUsers.length)

      // filter out restauratns with zero FavoriteUsers
      sortedRestaurants = sortedRestaurants.filter(restaurants => {
        return restaurants.FavoriteUsers.length > 0
      })

      // select top 10 restauants
      let topRestaurants = sortedRestaurants.slice(0, 10)
      return res.render('topRestaurant', { topRestaurants: topRestaurants })
    })
  }
}

module.exports = restController