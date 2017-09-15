const db = require("../models")

const secret = process.env.PUBLISHABLE_KEY

module.exports = (app) => {

  //-------------------------------------------
  //
  // GET ROUTES
  //
  //-------------------------------------------


  // Displays all posts on the posts list page
  app.get('/posts', (req, res) => {
    db.Post.findAll().then(dbPost => {
      res.render('posts', {posts: dbPost, user: req.user})
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

  // Display all causes
  app.get('/causes', (req, res) => {
    db.Cause.findAll({include: {model: db.User}}).then(causes => res.render('causes', {causes: causes, user: req.user}))
  })

  // Display one cause
  app.get('/causes/:cause', (req, res) => {
    db.Cause.findOne({
      where: {
        id: req.params.cause
      },
      include: db.User
    }).then(cause => res.render('cause', {cause: cause, user: req.user, keyPublish: process.env.PUBLISHABLE_KEY}))
  })



  //-------------------------------------------
  //
  // POST ROUTES
  //
  //-------------------------------------------


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


  app.post('/create-cause', (req, res) => {
    db.Cause.create({
      title: req.body.title,
      body: req.body.body,
      goal: req.body.goal,
      progress: 0,
      UserId: req.user.id
    }).then(results => res.redirect('/causes'))
  })

  
  //-------------------------------------------
  //
  // API ROUTES
  //
  //-------------------------------------------

  // Gets posts in json format
  app.get("/api/posts", (req, res) => {
    db.Post.findAll({include: [{model: db.User},{model: db.Comment}]}).then((results) => {
      res.json(results);
    })
  })

  app.get('/api/causes', (req, res) => {
    db.Cause.findAll({include: db.User}).then(results => res.json(results));
  })
  
}