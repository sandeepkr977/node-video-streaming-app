const jwt = require('jsonwebtoken');

const secretKey = '!2#cgcsxi6t876jbsknlknasdahsv&^(&9vvdchsavh';

module.exports = {
    gennerateJwtToken: (user) => {
        return jwt.sign(user, secretKey, {
            algorithm: "HS256"
        });
    },
    verifyJwtToken: (jwtToken) => {
        return jwt.verify(jwtToken, secretKey);
    }
}