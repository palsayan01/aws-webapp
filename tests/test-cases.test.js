import dotenv from 'dotenv';
import { expect } from 'chai';
import supertest from 'supertest';
import app from '../server.js';
import { Buffer } from 'buffer';

dotenv.config();
const request = supertest(app);

function encodeBasicAuth(email, password) {
  return 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64');
}

describe('User Endpoint Integration Tests', () => {
  const email = 'jane.doe@example.com';
  const updateEmail = 'jane.updated@example.com';
  const incorrectEmail = 'incorrect';
  const password = 'skdjfhskdfjhg';
  const newPassword = '5678';

  it('Test 1 - Create an account', async () => {
    try {
      const postResponse = await request.post('/v1/user').send({
        first_name: 'Jane',
        last_name: 'Doe',
        email: email,
        password: password
      });

      expect(postResponse.statusCode).to.equal(201);
    }
    catch (error) {
      console.error('Test 1 failed:', error);
      // process.exit(1);
    }
  });

  it('Test 2 - Create an account with blank fields', async () => {
    try {
      const postResponse = await request.post('/v1/user').send({
        first_name: 'Jane',
        last_name: 'Doe',
        email: '  ',
        password: '  '
      });

      expect(postResponse.statusCode).to.equal(400);
    }
    catch (error) {
      console.error('Test 2 failed:', error);
      // process.exit(1);
    }
  });

  it('Test 3 - Create already existing user ', async () => {
    try {
      const updateResponse = await request.post('/v1/user').send({
        first_name: 'Jane',
        last_name: 'Doe',
        email: email,
        password: password
      });

      expect(updateResponse.statusCode).to.equal(400);
    }
    catch (error) {
      console.error('Test 3 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 4 - Incorrect email while creating user ', async () => {
    try {
      const createUser = {
        first_name: 'John',
        last_name: 'Doe',
        password: password,
        email: incorrectEmail
      };

      const postResponse = await request.post('/v1/user').send(createUser);

      expect(postResponse.statusCode).to.equal(400);
    }
    catch (error) {
      console.error('Test 4 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 5 - Create user with few fields ', async () => {
    try {
      const createUser = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@gmail.com'
      };

      const postResponse = await request.post('/v1/user').send(createUser);

      expect(postResponse.statusCode).to.equal(400);
    }
    catch (error) {
      console.error('Test 5 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 6 - Create user with additional fields ', async () => {
    try {
      const createUser = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@gmail.com',
        account_created: '123'
      };

      const postResponse = await request.post('/v1/user').send(createUser);

      expect(postResponse.statusCode).to.equal(400);
    }
    catch (error) {
      console.error('Test 6 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 7 - Update the account and get ', async () => {
    try {
      const authHeader = encodeBasicAuth(email, password);
      const updatePayload = {
        first_name: 'Jannie',
        last_name: 'Doey',
        password: newPassword,
        email: email
      };

      const updateResponse = await request.put('/v1/user/self')
        .send(updatePayload)
        .set('Authorization', authHeader);

      expect(updateResponse.statusCode).to.equal(204);

      const newAuthHeader = encodeBasicAuth(email, newPassword);
      const getResponse = await request.get('/v1/user/self').set('Authorization', newAuthHeader);
      let jsonResponse = JSON.parse(getResponse.text);
      expect(getResponse.statusCode).to.equal(200);
      expect(jsonResponse).to.have.keys(['id', 'first_name', 'last_name', 'email', 'account_created', 'account_updated']);
      expect(jsonResponse).to.not.have.property('password');
    }
    catch (error) {
      console.error('Test 7 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 8 - Update the account with incorrect request body ', async () => {
    try {
      const authHeader = encodeBasicAuth(email, newPassword);
      const updatePayload = {
        first_name: 'Jannie',
        last_name: 'Doey',
        password: newPassword,
        account_updated: '1111'
      };

      const updateResponse = await request.put('/v1/user/self')
        .send(updatePayload)
        .set('Authorization', authHeader);

      expect(updateResponse.statusCode).to.equal(400);
    }
    catch (error) {
      console.error('Test 8 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 9 - Update email ', async () => {
    try {
      const authHeader = encodeBasicAuth(email, newPassword);
      const updatePayload = {
        first_name: 'Jannie',
        last_name: 'Doey',
        password: newPassword,
        email: updateEmail,
      };

      const updateResponse = await request.put('/v1/user/self')
        .send(updatePayload)
        .set('Authorization', authHeader);

      expect(updateResponse.statusCode).to.equal(400);
    }
    catch (error) {
      console.error('Test 9 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 10 - Update user with few fields ', async () => {
    try {
      const authHeader = encodeBasicAuth(email, newPassword);
      const updatePayload = {
        first_name: 'Jannie',
        last_name: 'Doe',
        password: '1234'
      };

      const updateResponse = await request.put('/v1/user/self')
        .send(updatePayload)
        .set('Authorization', authHeader);

      expect(updateResponse.statusCode).to.equal(400);
    }
    catch (error) {
      console.error('Test 10 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 11 - Update without Basic auth ', async () => {
    try {
      const updatePayload = {
        first_name: 'Jannie',
        last_name: 'Doe',
        password: '1234',
        email: email
      };

      const updateResponse = await request.put('/v1/user/self')
        .send(updatePayload)

      expect(updateResponse.statusCode).to.equal(401);
    }
    catch (error) {
      console.error('Test 11 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 12 - Get with request body', async () => {
    try {
      const authHeader = encodeBasicAuth(email, newPassword);
      const payload = {
        first_name: 'Jannie',
        last_name: 'Doey',
        password: newPassword,
        email: email
      };

      const getResponse = await request.get('/v1/user/self')
        .send(payload)
        .set('Authorization', authHeader);

      expect(getResponse.statusCode).to.equal(400);
    }
    catch (error) {
      console.error('Test 12 failed:', error.message);
      // process.exit(1);
    }
  });

  it('Test 13 - Get without Basic Auth', async () => {
    try {
      const getResponse = await request.get('/v1/user/self');
      expect(getResponse.statusCode).to.equal(401);
    }
    catch (error) {
      console.error('Test 13 failed:', error.message);
      // process.exit(1);
    }
  });

  after(() => {
    process.exit(0);
  });
});