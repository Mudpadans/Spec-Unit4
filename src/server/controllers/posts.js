const { Post } = require('../models/post')
const { User } = require('../models/user')



module.exports = {
    addPost: async (req, res) => {
        console.log(req.body)
        try {
            const {title, content, status, userId} = req.body
            await Post.create({
                title, 
                content, 
                privateStatus: status, 
                userId})
            res.sendStatus(200)
        } catch (error) {
            console.log(error, 'ERROR IN addPosts')
            res.sendStatus(400).send(error)
        }
    },
    getAllPosts: async (req, res) => {
        console.log("test");
        try {
            const posts = await Post.findAll({
                where: {privateStatus: false},
                include: [{
                    model: User,
                    required: true,
                    attributes: [`username`]
                }]
            })
            res.status(200).send(posts)
        } catch (error) {
            console.log(error, 'ERROR IN getAllPosts')
            res.sendStatus(400).send(error)
        }
            
    },
    getCurrentUserPosts: async (req, res) => {
        try {
            const {id} = req.params
            const posts = await Post.findAll({
                where: {userId: id},
                include: [{
                    model: User,
                    required: true,
                    attributes: [`username`]
                }]})
            res.status(200).send(posts)
        } catch (error) {
            console.log(error, 'ERROR IN getCurrentUserPosts')
            res.sendStatus(400).send(error)
        }
        
    },
    editPost: async (req, res) => {
        try {
            const {id} = req.params
            const {status} = req.body
            await Post.update({privateStatus: status}, {
                where: {id: +id}
            })
            res.sendStatus(200)
        } catch (error) {
            console.log(error, 'ERROR IN editPost')
            res.sendStatus(400).send(error)
        }
        
    }, 
    deletePost: async (req, res) => {
        try {
            const {id} = req.params
            await Post.destroy({where: {id: +id}})
            res.sendStatus(200)
        } catch (error) {
            console.log(error, 'ERROR in deletePost')
            res.sendStatus(400).send(error)
        }
    }
}