var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/mongoblog');

/* GET users listing. */
router.get('/add', function(req, res, next) {
    var cat = db.get('categories');

    cat.find({},{},function (err, categories) {
        if (err) 
            console.log('err');
        res.render('addpost', {
            "title": "Add Post",
            "categories": categories
        });
    });
});

router.get('/show/:id', function (req, res, next) {
    var posts = db.get('posts');
    posts.findById(req.params.id, function (err, post) {
        res.render('show', {
            "post" : post
        });
    });
});

router.post('/add', function(req, res, next) {

    var title       = req.body.title;
    var category    = req.body.category;
    var body        = req.body.body;
    var author      = req.body.author;
    var date        = new Date();

    
        if (req.files.length) {
            var img_Name  = req.files[0].filename;
         
     }
       else {
        var img_Name = 'default.png';
        console.log('else')
        }
    //validation

    req.checkBody('title', 'Title field is required').notEmpty();
    req.checkBody('body', 'Body field is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        res.render('addpost', {
            "errors": errors,
            "title" : title,
            "body"  : body
        });
    }
    
   else {
        var posts = db.get('posts');
        posts.insert({
            "title" : title,
            "body"  : body,
            "category": category,
            "date" : date,
            "author": author,
            "image": img_Name
        }, function (err, post) {
            if(err){
                res.send('There was an error')
            }
            else {
                req.flash('success','Post Submitted');
                res.location('/');
                res.redirect('/');
            }
        });
    }
});


router.post('/addcomment', function(req, res, next) {

    var name        = req.body.name;
    var email       = req.body.email;
    var postId      = req.body.postid;
    var body        = req.body.body;
    var commentdate = new Date(); 
    
    //validation

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'This must be email').isEmail();
    req.checkBody('body', 'Body field is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        var posts = db.get('posts');
        posts.findById(postId, function () {
             res.render('show', {
            "errors": errors,
            "post" : post
           });    
        });      
    }
   else {
        var comment = {
            "name": name,
            "email":email,
            "body": body, 
            "commentdate": commentdate
            }

        var posts = db.get('posts');
        posts.update(
                postId,
            {
                $push:{
                    "comments" : comment
                }
            },
            function (err, doc){
                if(err) {
                    throw err;
                }
                else {
                    req.flash('success','Comment Added')
                }
            }
        ); 
    }
    res.location('/posts/show/'+postId);
    res.redirect('/posts/show/'+postId);
});

module.exports = router;