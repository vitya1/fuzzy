var mysql = require('mysql');
var con = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	//database: 'bingo',
	port: 3307 //@todo any port
});
con.query('use bingo;');
con.query('show tables;', function(err, data) {
	console.log(err);
	console.log('Data received from Db:\n');
	console.log(data);
});