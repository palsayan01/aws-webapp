import express from "express";
import * as dbConnectController from './../controllers/db-connect-controller.js';

const router = express.Router();
router.route('/')
    .get(dbConnectController.dbConnect)
    .all(dbConnectController.badMethod)
    .head(dbConnectController.badMethod);

export default router;