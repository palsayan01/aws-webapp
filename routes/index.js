import dbConnectRouter from './req-routes.js';
import { checkDbConnection } from '../services/db-check-sync.js';
import userRouter from './user-routes.js';
const initializeRoutes = (app) => {
    app.use('/healthz', dbConnectRouter);
    // app.use('/v1/user', checkDbConnection);
    app.use('/v1/user', userRouter);
    app.use((req, res, next) => {
        return res.status(404).send();
    });
}

export default initializeRoutes;