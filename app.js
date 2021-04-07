const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/db');
const User = require('./models/user');
const Product = require('./models/product');

const errorController = require('./controllers/error');
const port = process.env.PORT || 3000

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            console.log("User--------------", user);
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err)
        })
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorController.get404);
console.log('Port Started on', port);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

db.
    // sync({force:true})
    sync()
    .then(res => {
        console.log(res.models);
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Avb',
                email: 'avb@gmail.com'
            })
        }
        return user;
    })
    .then(user => console.log('User', user.dataValues))
    .catch((err) => {
        console.log("Error in DB", err);
    });


app.listen(port);
