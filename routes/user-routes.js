import express from "express";
import * as userController from './../controllers/user-controller.js';
import { userAuth } from '../services/user-authentication-service.js';

const router = express.Router();
router.route('/')
    .post(userController.userCreate)
    .all(userController.badMethod)
    .head(userController.badMethod);

router.route('/self')
    .get(userAuth, userController.getUser)
    .put(userAuth, userController.userUpdate)
    .all(userController.badMethod)
    .head(userController.badMethod);

export default router;