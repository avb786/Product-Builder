const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/db');
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDbStoreSession = require('connect-mongodb-session')(session)
const errorController = require('./controllers/error');
const port = process.env.PORT || 3000;
const User = require('./models/user')

const app = express();
const store = new MongoDbStoreSession({
    uri: 'mongodb+srv://dbavb786:Avb@90333@taskmanager-e8bqy.mongodb.net/mono-examples?retryWrites=true&w=majority',
    collection: 'sessions'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'avb786',
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use((req, res, next) => {
    if(!req.session.user) return next();
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next()
    })
    .catch(err => {
        console.error('Error in find User', err);
    })
    // res.redirect('/')
})
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);


app.use(errorController.get404);
console.log('Port Started on', port);

// db.mongoConnect(() => {
//     console.log('Client DB');
// })
mongoose.connect('mongodb+srv://dbavb786:Avb@90333@taskmanager-e8bqy.mongodb.net/mono-examples?retryWrites=true&w=majority',{ useNewUrlParser: true })
.then(res => {
    User.findOne().then(user => {
        if(!user) {
            const user = new User({
                name: 'Aayush',
                email: 'avb@786@gmail.com',
                cart: {
                    items: []
                }
            })
            user.save();
        }
    })
 
    console.log("Mongo DB Connected");
})
.catch(err => {
    console.error('Error in connection to db', err);
})
app.listen(port);
