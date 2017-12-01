var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', {user: req.user});
});

// register
router.get('/register', function (req, res) {
    res.render('register', {});
});

var csrf_token_counter = 1;
router.post('/register', function (req, res) {

    Account.register(new Account({username: req.body.username}),
        req.body.password, function (err, account) {
            if (err) {
                return res.render('register', {account: account});
            }
            csrf_token_counter += 1;
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
});


// login
router.get('/login', function (req, res) {
    res.render('login', {user: req.user});
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});


// regular transfer get
router.get('/transfer/get', function (req, res) {
    res.render('bankTransferGET', {user: req.user});
});

router.get('/transfer/get/money', function (req, res) {
    console.log('account: ' + req.query['accountNum'] + ', amount: ' + req.query['amount']);
    res.send('Transfer by GET');
});


// regular transfer post
router.get('/transfer/post', function (req, res) {
    res.render('bankTransferPOST', {user: req.user});
});

router.post('/transfer/post/money', function (req, res) {
    console.log("amount: " + req.body.amount + ",  account number: " + req.body.accountNum);
    res.send("Transfer by POST");
});


// protected transfer get
router.get('/transfer-protected/get', function (req, res) {
    res.render('protectedTransferGET', {user: req.user});
});

router.get('/transfer-protected/get/money', function (req, res) {
    var promise = getCsrfTokOf(req.user.username);
    promise.then(function (user) {
        console.log("csrfToker= " + user.csrfToken);
        var tok = user.csrfToken;
        if (req.query['csrfToken'] === tok) {
            console.log('account: ' + req.query['accountNum'] + ', amount: ' + req.query['amount']);
            res.send('Transfer by Protected GET');
        } else {
            res.send('Wrong Token!')
        }
    });
});


// protected transfer post
router.get('/transfer-protected/post', function (req, res) {
    res.render('protectedTransferPOST', {user: req.user});
});

router.post('/transfer-protected/post/money', function (req, res) {
    var promise = getCsrfTokOf(req.user.username);
    promise.then(function (user) {
        console.log("csrfToker= " + user.csrfToken);
        var tok = user.csrfToken;
        if (req.body.csrfToken === tok) {
            console.log("amount: " + req.body.amount + ",  account number: " + req.body.accountNum);
            res.send("Transfer by Protected POST");
        } else {
            res.send('Wrong Token!')
        }
    });
});


// logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

function getCsrfTokOf(username) {
    var promise = Account.findOne({ username: username }).exec();
    return promise;
}


module.exports = router;