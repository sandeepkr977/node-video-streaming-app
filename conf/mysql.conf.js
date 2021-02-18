var mysql = require('mysql2');

var config = {
    host: 'localhost',
    user: 'root',
    password: 'Sandeep@1993',
    database: 'streaming_app'
}


module.exports = {
    getConnection: () => {
        return mysql.createConnection(config);
    },
    closeConnection: (connection) => {
        if (!connection)
            console.log("Invalid Mysql conection : " + connection);
        else {
            connection.end();
            console.log("Connection is closed :" + connection.threadId);
        }
    }
}