import * as userService from './../services/user-service.js';
import { userResponse } from './response-handlers.js';
import { setError } from './response-handlers.js';
import dotenv from 'dotenv';
dotenv.config();

export const userCreate = async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const allowedFields = ["first_name", "last_name", "password", "email"];
    const requestFields = Object.keys(request.body);
    const hasExtraFields = requestFields.some(field => !allowedFields.includes(field));
    const email = request.body.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (request.headers['content-type'] && request.headers['content-type'] !== 'application/json') {
        setError(415, response);
        return;
    }

    else if (!emailRegex.test(email)) {
        setError(400, response);
        return;
    }

    else if (!request.headers['content-type'] || Object.keys(request.body).length == 0 || (request.headers['authorization'] && request.headers['authorization'].startsWith('Basic ')) || !request.body.first_name || !request.body.last_name || !request.body.email || !request.body.password
        || request.body.first_name === '' || request.body.last_name === '' || request.body.email === '' || request.body.password.trim() === ''
        || request.body.account_created || request.body.account_updated || request.body.id || hasExtraFields) {

        setError(400, response);
        return;
    }

    else {
        const body = await userService.userCreate(request.body);
        if (body) {
            userResponse(201, body, response);
        }
        else {
            setError(400, response);
        }
    }
}

export const getUser = async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const contentLength = request.get("content-type") ? request.get("content-type").length : 0;
    if (contentLength > 0 ||
        Object.keys(request.body).length > 0 ||
        Object.keys(request.query).length > 0) {
        setError(400, response);
    }

    else {
        const email = request.email;
        const user = await userService.getUser(email);
        if (user) {
            const body = JSON.stringify(user, null, 2);
            userResponse(200, body, response);
        }
    }
}

export const userUpdate = async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const allowedFields = ["first_name", "last_name", "password", "email"];
    const requestFields = Object.keys(request.body);
    const hasExtraFields = requestFields.some(field => !allowedFields.includes(field));

    if (request.headers['content-type'] && request.headers['content-type'] !== 'application/json') {
        setError(415, response);
        return;
    }

    else if (!request.headers['content-type'] || Object.keys(request.body).length== 0 || request.body.account_created || request.body.account_updated || request.body.id || request.body.password.trim() === ''
        || request.body.password == null || !request.body.email || (request.body.email && request.email!=request.body.email) || !request.body.first_name || !request.body.last_name
     || !request.body.password || hasExtraFields
    ) {
        setError(400, response);
        return;
    }

    else {
        const user = await userService.userUpdate(request);
        if (user) {
            userResponse(204, null, response);
        }
        else {
            setError(400, response);
        }
    }
}

export const badMethod = async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    setError(405, response);
}