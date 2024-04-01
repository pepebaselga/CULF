const express = require('express');
const itemController = require('./../controllers/itemControllers');

const router = express.Router();

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
