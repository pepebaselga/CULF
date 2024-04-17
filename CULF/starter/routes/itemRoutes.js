const express = require('express');
const itemController = require('./../controllers/itemControllers');

const router = express.Router();

//particular routes for most frequent API Calls (newest item found)
router
  .route('/top-1-newest')
  .get(itemController.aliasTopTours, itemController.getAllItems);

router.route('/item-stats').get(itemController.getItemStats);
router
  .route('/:id')
  .get(itemController.getItem)
  .delete(itemController.delete)
  .patch(itemController.patch);
router
  .route('/')
  .get(itemController.getAllItems)
  .post(itemController.createItem);

module.exports = router;
