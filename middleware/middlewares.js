/* eslint-disable no-unused-vars */
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
const { signUpvalidator, signinValidator, newPostValidator } = require("../validation/validator");
const { tokenError, validationError } = require("../utils/messages");

//signup validation 
const signupValidate = (req, res, next) => {
    const result = signUpvalidator.validate(req.body);
    if (result.error) {
        console.log(result.error.message);
        res.status(404).send(validationError);
    }
    else {
        next();
    }
};

//signIn validation
const signinValidate = (req, res, next) => {
    const result = signinValidator.validate(req.body);
    if (result.error) {
        console.log(result.error.message);
        res.status(404).send(validationError);
    }
    else {
        console.log("ok middleware");
        next();
    }
};


const verifyUser = (req, res) => {
    tokenData = jwt.verify(req.headers.token, secret);
    return tokenData;      
};

//authenticate user
const authenticateUser = (req, res,next) => {
    try {
        
        tokenData = jwt.verify(req.headers.token, secret);
        req.body = tokenData;
        next();
    }
    catch {
        res.send(tokenError);
    }
};


const postDataValidate = (req, res, next) => {
    const result = newPostValidator.validate(req.body);
    if (result.error) {
        console.log(result.error.message);
        res.status(404).send(validationError);
    }
    else {
        next();
    }
};


module.exports = { signupValidate, postDataValidate, signinValidate, verifyUser, authenticateUser };