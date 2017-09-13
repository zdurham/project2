const db = require("../models")


module.exports = (app) => {

  // Displays all posts on the posts list page
  app.get('/posts', (req, res) => {
    db.Post.findAll().then(dbPost => {
      res.render('posts', {posts: dbPost})
    })    
  })

  // Display individual post page with comments
  app.get('/posts/:postid', (req, res) => {
    db.Post.findOne({
      where: {
        id: req.params.postid 
      },
      include: [{model: db.User}, {
        model: db.Comment,
        include: db.User
      }]
    }).then(post => {
      console.log(req.user)
      res.render('post', 
      {
        post: post,
        user: req.user ? true : false,
        comments: post.Comments
      })
    })
  })

  // Puts posts into DB and links them to the user that is logged in
  app.post('/create-post', (req, res) => {
    
    db.Post.create({
      title: req.body.title,
      category: req.body.category,
      body: req.body.body,
      image: req.body.image ? req.body.image : null,
      UserId: req.user.id
    }).then(res.redirect('/posts'))
  })

  //---------------------------------------------
  // Api route below
  //---------------------------------------------

  // Gets posts in json format
  app.get("/api/posts", (req, res) => {
    db.Post.findAll({include: [{model: db.User},{model: db.Comment, include: db.User}]}).then((results) => {
      res.json(results);
    })
  })

  
}