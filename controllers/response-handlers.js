export const userResponse = (code, body, response) => {
        response.status(code).send(body);
}


export const dbConnectResponse = (code, response) => {
        response.status(code).send();
}

export const setError = (code, response) => {
        response.status(code).send();
}