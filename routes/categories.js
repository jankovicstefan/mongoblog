var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/mongoblog');


router.get('/add', function(req, res, next) {
  res.render('addcategory', {
      "title" : "Add Category"
  });
});

router.get('/show/:category', function (req, res, next) {
    var db = req.db;
    var posts = db.get('posts');
    posts.find({category: req.params.category},{},function (err, posts) {
        res.render('index', {
            "title": req.params.category,
            "posts": posts
        });
    });
    
});

router.post('/add', function(req, res, next) {

    var title       = req.body.title;

    //validation
    req.checkBody('title', 'Title field is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('addpost', {
            "errors": errors,
            "title" : title,
            "body"  : body
        });
    } 
   else {
        var categories = db.get('categories');
        categories.insert({
            "title" : title,
        }, function (err, category) {
            if(err){
                res.send('There was an error')
            }
            else {
                req.flash('success','Category Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});

module.exports = router;
