const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.get('/list', fileController.listItems);
router.get('/file', fileController.getFileContent);
router.get('/download', fileController.downloadItem);

module.exports = router;
