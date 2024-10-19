import bcrypt from "bcryptjs";
import { User } from '../models/users.js';

export const userAuth = async (request, response, next) => {
    const basicAuth = request.headers.authorization;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicAuth || !basicAuth.startsWith('Basic')) {
        return response.status(401).json({ message: 'User Unauthorized. Please provide Basic auth credentials' });
    }

    else {
        const userCredentials = Buffer.from(basicAuth.split(' ')[1], 'base64').toString('ascii').split(':');
        const email = userCredentials[0];
        const password = userCredentials[1];

        if (!email || email.trim()==='' || !password || password.trim()==='') {
            return response.status(400).json({ message: 'Please provide username and password both' });
        }

        else if (!emailRegex.test(email)) {
            return response.status(400).json({ message: 'Please provide valid email address' });
        }

        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (user) {
            const isPwdMatch = await validatePwd(password, user.dataValues.password);
            if (isPwdMatch) {
                console.log("User Authenticated Successfully");
                request.email = email;
                next();
            }
            else {
                console.log("Unauthenticated User");
                response.status(401).send({
                    message: "Unauthenticated User. Please provide correct user credentials"
                })
            }
        }

        else if (!user) {
            return response.status(401).json({ message: 'User not found.' });
        }

    }
}

const validatePwd = async (password, dbPassword) => {
    return await bcrypt.compare(password, dbPassword);
}