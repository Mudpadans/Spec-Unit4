require('dotenv').config();
const express = require('express')
const cors = require('cors')
const http = require('http')
const app = express()
const PORT = process.env.PORT
const {sequelize} = require('./util/database')
const {User} = require('./models/user')
const {Post} = require('./models/post')

const server = http.createServer({ maxHeaderSize: 81820 }, app)

app.use(express.json())
app.use(cors())

const {getAllPosts, getCurrentUserPosts, addPost, editPost, deletePost} = require('./controllers/posts')
const {register, login} = require('./controllers/auth')
const {isAuthenticated} = require("./middleware/IsAuthenticated")

app.post('/register', register)
app.post('/login', login)

app.get('/posts', getAllPosts)

app.get('/posts/:id', getCurrentUserPosts)
app.post('/posts', isAuthenticated, addPost)
app.put('/posts/:id', isAuthenticated, editPost)
app.delete('/posts/:id', isAuthenticated, deletePost)

User.hasMany(Post)
Post.belongsTo(User)

sequelize.sync({ force: true })
.then(() => {
    server.listen(PORT, () => console.log(`db sync successful & server running on port ${PORT}`))
})
.catch(err => console.log(err))