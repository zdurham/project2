const db = require("../models")

module.exports = (app) => {

  // Renders the create-post template
  app.get("/create-post", (req, res) => {
    res.render('create-post')
  })

  // Displays all posts on the posts list page
  app.get('/posts', (req, res) => {
    db.Post.findAll().then(dbPost => {
      res.render('post-list', {posts: dbPost})
    })    
  })

  // Display individual posts
  app.get('/posts/:postid', (req, res) => {
    db.Post.findOne({
      where: {
        id: req.params.postid 
      },
      include: [{model: db.User}, {model: db.Comment}]
    }).then(post => {
      console.log(post)
      res.render('post', 
      {
        post: post,
        user: req.user.id ? true : false
      })
    })
  })

  // Puts posts into DB and links them to the user that is logged in
  app.post('/create-post', (req, res) => {
    db.Post.create({
      title: req.body.title,
      subject: req.body.subject,
      body: req.body.body,
      image: req.body.image ? req.body.image : null,
      UserId: req.user.id
    })
  })

  //---------------------------------------------
  // Api route below
  //---------------------------------------------

  // Gets posts in json format
  app.get("/api/posts", (req, res) => {
    db.Post.findAll({include: [{model: db.User},{model: db.Comment}]}).then((results) => {
      res.json(results);
    })
  })
}