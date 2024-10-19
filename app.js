import express from 'express';
import initializeRoutes from "./routes/index.js";
const initialize = (app) => {
    app.use(express.json());
    app.use(express.urlencoded());
    initializeRoutes(app);
}
export default initialize;