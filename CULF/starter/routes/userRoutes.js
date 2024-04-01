const express = require('express');
const userController = require('../controllers/userControllers');
const router = express.Router();

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

module.exports = router;
