var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

router.get('/register', function (req, res) {
    res.render('register', {});
});

router.post('/register', function (req, res) {
    Account.register(new Account({username: req.body.username}), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {account: account});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login', {user: req.user});
});


router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});


router.get('/transfer/get', function (req, res) {
    res.render('bankTransferGET', {user: req.user});
});

router.get('/transfer/get/money', function (req, res) {
    console.log('account: ' + req.query['accountNum'] + ', amount: ' + req.query['amount']);
    res.send('Transfer by GET');
});

router.get('/transfer/post', function (req, res) {
    res.render('bankTransferPOST', {user: req.user});
});

router.post('/transfer/post/money', function (req, res) {
    console.log("amount: " + req.body.amount + ",  account number: " + req.body.accountNum);
    res.send("Transfer by POST");
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;