import * as dbConnectService from './../services/db-connect-services.js';
import { dbConnectResponse } from './response-handlers.js';
import { setError } from './response-handlers.js';

export const dbConnect = async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    let status;

    const contentLength = request.get("content-type")? request.get("content-type").length: 0;
    if (contentLength> 0 ||
        Object.keys(request.body).length> 0 ||
        Object.keys(request.query).length> 0) {
            setError(400, response);
    }
    else {
        status = await dbConnectService.dbAuth();
        dbConnectResponse(status, response);
    }

}

export const badMethod = async (request, response) => {
    response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    setError(405, response);
}