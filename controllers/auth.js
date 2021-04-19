const User = require('../models/user');
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer');
const crypto = require('crypto')
const sendGridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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'
    }
}))
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuth: req.session.isAuth,
        errorMessage: req.flash('error')
    });
}

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'isAuth=true') Cookie Set up
    const loginData = {
        email: req.body.email,
        password: req.body.password
    }
    console.log("USERS", loginData);
    User.findOne({ email: loginData.email })
        .then(user => {
            console.log('user', user);
            if (!user) {
                req.flash('error', 'Invalid Email or Password. Please Re-enter your login details')
                return res.redirect('/login')
            }
            bcrypt.compare(loginData.password, user.password)
                .then(doMatchPass => {
                    console.log('bcrypt', doMatchPass);
                    if (doMatchPass) {
                        req.session.user = user;
                        req.session.isAuth = true;
                        return req.session.save((err) => {
                            console.log(err);
                            return res.redirect('/')
                        })

                    }
                    res.redirect('/login')

                })
                .catch(err => {
                    console.error(err);
                    return res.redirect('/login')
                })

        })
        .catch(err => {
            console.error('Error in find User', err);
        })
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuth: req.session.isAuth,
        errorMessage: req.flash('error')
    });
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.flash('error', 'Email Already Exists!')
                return res.redirect('/signup')
            }
            return bcrypt.hash(password, 12).then(hashPass => {
                const userSignup = new User({
                    email: email,
                    password: hashPass,
                    cart: { items: [] }
                })
                return userSignup.save();
            });
        })

        .then(response => {
            let currentYear = new Date().getFullYear();
            transporter.sendMail({
                to: email,
                from: 'task.port@20minutemail.it',
                subject: 'Signup Success',
                html: `<!DOCTYPE html><html><head><title>SCIKEY</title><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style type="text/css">body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}img{-ms-interpolation-mode:bicubic}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none}table{border-collapse:collapse !important}body{height:100% !important;margin:0 !important;padding:0 !important;width:100% !important}a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}@media screen and (max-width: 600px){.mobile-hide{display:none !important}.mobile-center{text-align:center !important}.mobile-table{width:100% !important}}div[style*="margin: 16px 0;"]{margin:0 !important}</style></head><body style="margin: 0 !important; padding: 0 !important; background-color: #fff;" bgcolor="#fff"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" style="background-color: #fff;" bgcolor="#fff"><table align="center" border="0" cellpadding="0" cellspacing="0" width="600" class="mobile-table" style="border: 1px solid #ccc;"><tr><td align="center" valign="top" style="font-size: 0; padding: 15px;"><table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="mobile-table"><tr><td align="left" valign="top" class="mobile-center" style="text-align: center; border: solid 1px maroon;"><span style="color:orange;font-size: 30px;">Task-</span><span style="color:lightseagreen;font-size: 30px;">Port</span></td></tr></table></td></tr><tr><td align="center" style="padding: 15px; background-color: #ffffff;" bgcolor="#ffffff"><table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 10px;"><p style="font-size: 16px; line-height: 15px; color: #333333; margin: 0; text-align: left"> Dear ${email},</p><p style="color: #333333;"> You have successfully Registered with Task-Port.<br> Explore our portal by Login :- <a href="https://task-webapp-ui.herokuapp.com/task-port/login" target="_blank" rel="Login">Click Here</a></p></td></tr><tr><td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 18px; padding-top: 30px;"><p style="font-size: 14px; line-height: 20px; color: #333333; margin: 0; text-align: left;"> Thank You</p></td></tr><tr><td style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 18px;"><p style="font-size: 14px; line-height: 20px; color: #333333; margin: 0; text-align: left;"> Team Task-Port</p></td></tr></table></td></tr><tr><td align="center" style="padding: 15px 0px 0px 0px; background-color: #ffffff;" bgcolor="#ffffff"><table align="" border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; background-color: #f2f2f2;" colspan="2"><p style="font-size: 14px; font-weight: 400; color: #444544; text-align: center; padding: 10px;"><br> Copyright @ ${currentYear} Task-Port.</p></td></tr></table></td></tr></table></td></tr></table></body></html>`, // html body

            }).then(res => {
                console.log('Send Grid Email Success', res);
            })
                .catch(err => {
                    console.error('Error i sendig mail', err);
                })
            res.redirect('/login')
        })
        .catch(err => {
            console.error('Error in post Sigup', err);
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/')
    });
}

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset',
        errorMessage: req.flash('error'),
        isAuth: req.session.isAuth,
    });
}

exports.postReset = (req, res, next) => {
    console.log('POSTTTTTT');
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No Account with that Email');
                    return res.redirect('/reset');
                }
                console.log('USER', user);
                user.resetToken = token;
                user.resetTokenExpiry = Date.now() + 3600000;
                return user.save();
            }).then(result => {
                transporter.sendMail({
                    to: req.body.email,
                    from: 'task.port@20minutemail.it',
                    subject: 'Password Reset',
                    html: `
            <p>You Requested for password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">Reset Password</a></p>
            `, // html body
                }).then(() => {
                    res.redirect('/login')
                }).catch(err => {
                    console.error('Error in Reset ', err);
                })
            }).catch(err => {
                console.error('Error in Reset ', err);
            })
    })
}


exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } })
        .then(user => {
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: req.flash('error'),
                isAuth: req.session.isAuth,
                userId: user._id.toString(),
                passwordToken: token
            })
        }).catch(err => {
            console.error(err);
        })

}


exports.postNewPassword = (req, res, next) => {
    const newPass = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({ resetToken: passwordToken, resetTokenExpiry: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPass, 12);
        })
        .then(hashPass => {
            resetUser.password = hashPass;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiry = undefined;
            return resetUser.save();
        })
        .then(result => {
            transporter.sendMail({
                to: resetUser.email,
                from: 'task.port@20minutemail.it',
                subject: 'Password Reset',
                html: `
    <h1>Password Reset Successfully</h1>
    `, // html body
            })
            res.redirect('/login');
        })
        .catch(err => {
            console.error('Error in postNewPassword', err);
        })

}