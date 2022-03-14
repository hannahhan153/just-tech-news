const router = require('express').Router();
const {
    Post,
    User
} = require('../../models');

// get all users
router.get('/', (req, res) => {
    // retrieve all the posts in the application
    console.log('======================');
    Post.findAll({
            // query config: specify the information about the posts to populate
            attributes: ['id', 'post_url', 'title', 'created_at'],
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
            attributes: ['id', 'post_url', 'title', 'created_at'],
            include: [
                // retrieve usernmae in user table
                {
                    model: User,
                    attributes: ['username']
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