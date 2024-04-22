const express = require('express');
const userController = require('../controllers/userControllers');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.patch);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

module.exports = router;
