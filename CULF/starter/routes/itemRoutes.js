const express = require('express');
const itemController = require('./../controllers/itemControllers');
const authController = require('../controllers/authController');

const router = express.Router();

//particular routes for most frequent API Calls (newest item found)
router
  .route('/top-1-newest')
  .get(itemController.aliasTopTours, itemController.getAllItems);

router.route('/item-stats').get(itemController.getItemStats);
router.route('/month-found/:year').get(itemController.monthsFound);
router
  .route('/:id')
  .get(authController.protect, itemController.getItem)
  .delete(authController.protect, itemController.delete)
  .patch(authController.protect, itemController.patch);
router
  .route('/')
  .get(authController.protect, itemController.getAllItems)
  .post(authController.protect, itemController.createItem);

module.exports = router;
