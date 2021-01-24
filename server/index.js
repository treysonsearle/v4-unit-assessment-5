require("dotenv").config();


const express = require('express');
const session = require('express-session');
const massive = require("massive");
const userCtrl = require('./controllers/user')
const postCtrl = require('./controllers/posts')

const PORT = process.env.SERVER_PORT


const { SESSION_SECRET, CONNECTION_STRING } = process.env;
    
const app = express();

app.use(express.json());



massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
    })
      .then(db => {
        app.set("db", db);
        console.log('im working')
      })
      .catch(err => console.log(err));

      app.use(
        session({
            resave: true,
            saveUninitialized: false,
            secret: SESSION_SECRET,
            cookie: {maxAge: 1000 * 60 * 60 * 24 * 365}
        })
    )

//Auth Endpoints
app.post('/api/auth/register', userCtrl.register_user);
app.post('/api/auth/login', userCtrl.login);
app.get('/api/auth/me', userCtrl.getUser);
app.post('/api/auth/logout', userCtrl.logout);

//Post Endpoints
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost)

app.listen(PORT, _ => console.log(`running on ${PORT}`));