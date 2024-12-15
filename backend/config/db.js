const mysql = require('mysql2');

const pool = mysql.createPool({
    host:  'localhost',
    user: 'root',
    password:  '123456',
    database:  'user_product_db',
    
});

module.exports = pool.promise(); 
