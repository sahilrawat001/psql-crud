const Joi = require("joi");

const signUpvalidator = Joi.object().keys({
    name: Joi.string().min(4).required(),
    mail: Joi.string().email({ tlds: { allow: ["com", "in", "net"] } }).lowercase().required(),
    password: Joi.string().regex(/^(?=.+\d)(?=.+[a-z])(?=.+[A-Z]).{6,20}$/).required()
   
});
 
const signinValidator = Joi.object().keys({
    mail: Joi.string().email({ tlds: { allow: ["com", "in", "net"] } }).lowercase(),
    password: Joi.string().regex(/^(?=.+\d)(?=.+[a-z])(?=.+[A-Z]).{6,20}$/),
});

const newPostValidator = Joi.object().keys({
    post: Joi.string().required(),
    likes: Joi.array().max(0).min(0).required(),
    comments: Joi.array().max(0).min(0).required(),

});

module.exports = { signUpvalidator, signinValidator ,newPostValidator};