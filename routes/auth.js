
const express = require('express');
const router = express.Router();
const {getLogin, postLogin, postLogout, postSignup, getSignup, getReset, postReset, getNewPassword, postNewPassword} = require('../controllers/auth')

router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.post('/signup', postSignup);

router.get('/signup', getSignup);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword);

router.post('/new-password', postNewPassword);

module.exports = router