const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passportLocal = require('passport-local').Strategy;
const user = "daniel_pineros";
const pass = "Daniel@12345";

//Settings
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

//Settings Segurity-Login
app.use(cookieParser('admin@12345'));
app.use(session({
    secret: 'admin@12345',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(function (username, password, done) {
    if (username === user && password === pass) {
        return done(null, { id: 1, name: "Administrador" });
    }
    else {
        return done(null, false);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    done(null, { id: 1, name: "Administrador" });
})
//Routes
app.use(require('./routes/routes'));

//Statics
app.use(express.static(path.join(__dirname, 'public')));

//404 Error
app.use((req, res, next) => {
    res.status(404).send('404 NOT FOUND');
});

module.exports = app;