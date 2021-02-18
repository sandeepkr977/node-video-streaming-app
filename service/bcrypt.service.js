const bcrypt = require('bcrypt');

const saltRounds = 10;

module.exports = {
    genderateHashPassword: (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(saltRounds, function(err, salt) {
                if (err) reject({ success: false, msg: err });
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) reject({ success: false, msg: err });
                    resolve({ success: true, hash });
                });
            });
        });
    },
    verifyHashPassword: (plainPassword, hashPassword) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, hashPassword, function(err, result) {
                if (err) return reject({ success: false, msg: err });
                return resolve({ success: true, result });;
            });
        });
    }
}