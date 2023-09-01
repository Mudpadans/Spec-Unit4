require('dotenv').config();
const SECRET = process.env.SECRET;
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const bcrypt = require('bcryptjs');
const axios = require('axios');

const createToken = (username, id) => {
    return jwt.sign(
        {
            username,
            id
        },
        SECRET,
        {
            expiresIn: '2 days'
        }
    )
}

module.exports = {
    login: async (req, res) => {
        console.log(req.body)
        try {
            let {username, password} = req.body;
            let foundUser = await User.findOne({ where: { username: username } });
            console.log(foundUser)
            if (foundUser) {
                const isAuthenticated = bcrypt.compareSync(
                    password,
                    foundUser.hashedPass
                );
                console.log(isAuthenticated)
                if (isAuthenticated) {
                    let token = createToken(
                        foundUser.dataValues.username,
                        foundUser.dataValues.id
                    );
                    const exp = Date.now() + 1000 * 60 * 60 * 48;
                    const data = {
                        username: foundUser.dataValues.username,
                        userId: foundUser.dataValues.id,
                        token: token,
                        exp: exp,
                    };
                    console.log("data", data)
                    return res.status(200).send(data);
                } else {
                    res.status(403).send('incorrect password')
                }
            }
            const token = createToken(username, password)
            console.log('login')
            res.status(200).send(token)
        } catch (error) {
            console.error(error)
            res.status(400).send(error)
        }
    },
    register: async (req, res) => {
        console.log(req.body)
        try {
            let {username, password} = req.body
            let foundUser = await User.findOne({where: 
                {username}
            })
            if (foundUser) {
                res.status(400).send('Username is Taken!')
            } else {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password, salt)

                let newUser = await User.create({
                    username, 
                    hashedPass: hash
                })

                let token = createToken(
                    newUser.dataValues.username, 
                    newUser.dataValues.id
                )
                const exp = Date.now() + 1000 * 60 * 60 * 48

                const data = {
                    username: newUser.dataValues.username,
                    userId: newUser.dataValues.id,
                    token: token,
                    exp: exp
                    } 
                res.status(200).send(data)
                console.log(data);
            }
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    }
}