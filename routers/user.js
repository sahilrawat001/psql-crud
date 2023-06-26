const express = require("express");
const {  userController} = require("../controller/UserFunctions");
const { signinValidate, signupValidate } = require("../middleware/middlewares");
const router = express.Router(); 

// //user signup 
// router.route("/signup").post(, signUp);

// //user signin
// router.route("/signin").post(signinValidate, signIn);

router.route("/getTutorials").patch(userController.getTutorials);
router.route("/createTutorial").post(userController.createTutorial);
router.route("/updateTutorial").put(userController.updateTutorial);
router.route("/deleteTutorial").delete(userController.deleteTutorial);



module.exports = router;