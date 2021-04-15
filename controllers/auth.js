const User = require('../models/user')
exports.getLogin = (req,res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuth: req.session.isAuth
      });
}

exports.postLogin = (req,res, next) => {
    // res.setHeader('Set-Cookie', 'isAuth=true') Cookie Set up
    User.findById('6071d67ca90e1541900a60b5')
    .then(user => {
        req.session.user = user;
        req.session.isAuth = true;
        req.session.save((err) => {
            console.log(err);
            res.redirect('/')
        })
        res.redirect('/')
    })
    .catch(err => {
        console.error('Error in find User', err);
    })
}

exports.postLogout = (req,res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    });
}