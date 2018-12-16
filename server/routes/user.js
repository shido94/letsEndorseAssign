const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const async = require('async');
const jwt = require('jsonwebtoken');
mongoose.Promise = Promise;
const process = require('../../keys/jwt');
const multer = require('multer');



const User = require('../model/registration'); // path to user data
const Blog = require('../model/blogdata'); // path to blog Schema



// for roles Authentication
const isAuthenticated = require('../middleware/check-roles');
// check for token authentication
const checkAuth = require('../middleware/check-auth');

// define destination to store the image
const upload = multer({ dest: 'uploads/' });


// registration for user
router.post('/registration', (req,res) => {
  const data = req.body;
  console.log(data);
  User.findOne({username: data.username})
      .then(user => {
        if(user) {
          return res.status(404).json({message: "Username already exist"});
        }

        // default role will be user if role will not defined
        let role = 'user';
        if(data.role){
          role = data.role;
        }
          const userData = new User({
              username: data.username,
              password: data.password,
              role: role
          });

          //save the user data
          userData.save((err,result) => {
              if(err){
                throw new Error(err);
              }
              return res.status(200).json({
                  result: result,
                  message: "Successfully registered"});
          })

      })
      .catch(err => res.status(404).json({err: err}));
});

// user logedIn
router.post('/login', (req,res) => {
    const data = req.body;

    User.findOne({username: data.username, password: data.password})
        .then(user => {
            if (!user) {
                return res.status(404).json({message: "User Does'nt exist"});
            }

            // make token for non essential data
            const token = jwt.sign({
                    userId: user._id,
                    role: user.role,
                    isAdmin: user.isAdmin
                }, process.env.JWT_KEYS,
                {
                    expiresIn: "1 days"
                });
            res.status(200).json({
                success: true,
                token: token
            });
        })
        .catch(err => res.status(404).json({err: err}))
});

// upload blog data
router.post('/uploadData',checkAuth ,isAuthenticated(['user', 'admin', 'superAdmin']) , upload.single('image'), (req,res) => {
    const image = req.file;
    const data = req.body;

    const blog = new Blog({
        user_id: req.userData.userId,
        title: data.title,
        content: data.content,
        author_name: data.author_name,
        image_url: image.path
    });

    blog.save((err, blogData) => {
      if(err){
        res.status(404).json({err: err});
      }
      return res.status(200).json({data: blogData, message: "Successfully updated, Please wait for approval of admin"})
    })
});

// show approved blog list
router.get('/blog-list', (req,res) => {
  Blog.find({isApproved: true})
      .sort({date: -1})
      .then(blogList => {
        if(typeof blogList === 'undefined' || blogList.length < 1) {
          return res.status(404).json({message: "Blog list is empty"});
        }
        return Promise.all(blogList.map(blogData => {
          let o = Object.assign({}, blogData._doc);

          return relatedUser(blogData.user_id, blogData.approvedBy)
              .then(user => {
                let username = user.user.username;
                let adminname = user.admin.username;

                o.writername =  username;
                o.approvedAdminName = adminname;
                return o;
              })
        }));
      })
      .then(blogDatas => {
        return res.status(200).json({blogList: blogDatas})
      })
      .catch(error => res.status(200).json({err: error, message: "Error in fetching data"}));
});

// function to find related username and adminname from their Id's
function relatedUser(userId, adminId) {
    return new Promise((resolve, reject) => {

        async.parallel({
            user: function (callback) {
                User.findOne({_id: userId})
                    .then(userData => {
                        callback(null, userData)
                    })
                    .catch(error => callback(null, error));
            },
            admin: function (callback) {
                User.findOne({_id: adminId})
                    .then(adminData => {
                        callback(null, adminData)
                    })
                    .catch(error => callback(null, error));
            }
        }, function (err, results) {
            if (err) {
                reject(err);
            }
            resolve(results);
        });

    });
}


// approve blog List
router.put('/approve-blog',checkAuth ,isAuthenticated(['admin', 'superAdmin']) ,(req,res) => {
  const data = req.body;

  Blog.updateOne({_id: data.blogId, isApproved: false}, {
    $set: {
        isApproved: data.isApproved,
        approvedBy: req.userData.userId
    }
  }, (err,update) => {
    if(err) {
      return res.status(404).json({err: err, message: "Error in Approval"});
    }
    if(update.nModified === 0){
        return res.status(404).json({message: "Blog not found"});
    }
    return res.status(200).json({message: "Successfully Approved"});
  })
});

// API to approve ADMIN
router.put('/approve-admin', checkAuth, isAuthenticated(['superAdmin']), (req,res) => {
  const data = req.body;

    User.updateOne({_id: data.adminId, isAdmin: false}, {
        $set: {
          isAdmin: data.isAdmin
        }
    }, (err,update) => {
        if(err) {
            return res.status(404).json({err: err, message: "Error in Approval"});
        }
        if(update.nModified === 0){
            return res.status(404).json({message: "Admin not found"});
        }
        return res.status(200).json({message: "Successfully Approved"});
    })
});

router.get('/getlist', (req,res) => {
    const BLOG_ID = req.query.blogId;

    Blog.findOne({_id: BLOG_ID})
        .then(Blog => {
            if(!Blog) {
                return res.status(404).json({message: "Blog not found"});
            }
            return res.status(200).json({blog: Blog});
        })
        .catch(error => res.status(404).json({err: error, message: "Server error"}));
});




module.exports = router;
