const sequelize = require('../../config/connection');
const router = require('express').Router();
const {
    Post,
    User,
    Vote
} = require('../../models');

// get all users
router.get('/', (req, res) => {
    // retrieve all the posts in the application
    console.log('======================');
    Post.findAll({
            // query config: specify the information about the posts to populate
            attributes: ['id', 'post_url', 'title', 'created_at',
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
            // include property is expressed as array
            include: [{
                // way to define the object
                model: User,
                attributes: ['username']
            }]
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'post_url', 'title', 'created_at',
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
            include: [
                // retrieve usernmae in user table
                {
                    model: Post,
                    attributes: ['id', 'title', 'post_url', 'created_at']
                },
                {
                    model: Post,
                    attributes: ['title'],
                    through: Vote,
                    as: 'voted_posts'
                }
            ]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                // identifies a user error and will need a different request for a successful response.
                res.status(404).json({
                    message: 'No post found with this id'
                });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    Post.create({
            title: req.body.title,
            post_url: req.body.post_url,
            user_id: req.body.user_id
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// upvote involves two queries: using vote model to create a vote and querying on that post to get updated vote count
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, {
            Vote
        })
        .then(updatedPostData => res.json(updatedPostData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
            // Vote.create({
            //     user_id: req.body.user_id,
            //     post_id: req.body.post_id
            //   }).then(() => {
            //     // then find the post we just voted on
            //     return Post.findOne({
            //       where: {
            //         id: req.body.post_id
            //       },
            //       attributes: [
            //         'id',
            //         'post_url',
            //         'title',
            //         'created_at',
            //         // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
            //         [
            //           sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            //           'vote_count'
            //         ]
            //       ]
            //     })
            //     .then(dbPostData => res.json(dbPostData))
            //     .catch(err => {
            //       console.log(err);
            //       res.status(400).json(err);
            //     });

        });
});

router.put('/:id', (req, res) => {
    Post.update({
            title: req.body.title
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({
                    message: 'No post found with this id'
                });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// we want to assign the router once Express API endpoints have been defined
module.exports = router;