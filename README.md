# Cloud Native Web Application
This branch has branch protection rule activated. Please run the status checks before PR merge.
This branch has packer template to create AMI for EC2 instance

## Pre-requisites:
- Install latest Node.js. Verify the versions using below commands:
    - node -v
    - npm -v
- Install latest PostgreSQL

## Installation:
- Clone the repository using git command: `git clone git@github.com:csye6225-palsayan/webapp.git`
- Navigate to `webapp` directory using git CLI (git bash): `cd webapp`
- Install dependencies (dotenv, express, sequelize, pg, pg-hstore, bcryptjs) using git command: `npm install`
- Create `.env` file and set below paramaters:
    -   HOST=localhost
    -   PORT=<db_server_port>
    -   DATABASE=<database_name>
    -   USER=<your_db_username>
    -   DIALECT=postgres
    -   PASSWORD=<your_db_password>
    -   BCRYPT_SALT_ROUNDS=<no_of_salt_rounds>
- Run the app using command: `npm run dev`

## Public API endpoints:
    -   URL: /healthz
    -   Method: GET
    -   Description: This healthcheck implements database connectivity and returns below responses:
        -   Database connection is successful: 200 OK
        -   Database connection fails: 503 Service Unavailable
        -   Request contains an unexpected payload: 400 Bad Request
        -   Methods apart from GET (e.g., POST, PUT) while requesting endpoint: 405 Method Not Allowed

    -   URL: /v1/user
    -   Method: POST
    -   Description: Allows a user to create an account by providing the following information:
        -   Email Address (used as the username)
        -   Password (hashed using BCrypt with salt)
        -   First Name
        -   Last Name
        -   The account_created field is automatically set to the current time upon successful user creation.
        
    

## Authenticated API Endpoints (Basic Auth Required)
    -   URL: /v1/user/self
    -   Method: GET
    -   Description: Retrieves the user's account information. The response payload will include all fields for the user except for the password.

    -   URL: /v1/user/self
    -   Method: PUT
    -   Description: Allows a user to update their account information. Only the following fields can be updated:
        -   First Name
        -   Last Name
        -   Password
        -   The account_updated field is updated automatically upon successful update.

## To create AMI from packer template:
- Install Packer and run below commands
    - `packer init .`
    - `packer fmt .`
    - `packer validate .`
    - `packer build csye6225-aws.pkr.hcl`

