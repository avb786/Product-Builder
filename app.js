const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/db');

const errorController = require('./controllers/error');
const port = process.env.PORT || 3000;
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req , res, next) => {
    User.findById('606ddddd810655b3aa3ce49a')
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => {
        console.error('Error in find User', err);
    })
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);
console.log('Port Started on', port);

db.mongoConnect(() => {
    console.log('Client DB');
})

app.listen(port);
