const mysql = require('mysql');

module.exports=function(db){
    var db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'gameproject'
    });
    db.connect();
};

//
// exports.login = function (req, res) {
//     var login_id = req.body.login_id;
//     var password = req.body.password;
//     connection.query('SELECT * FROM users WHERE login_id = ?', [login_id],
//         function (error, results, fields) {
//             if (error) {
//                 // console.log("error ocurred", error);
//                 res.send({
//                     "code": 400,
//                     "failed": "error ocurred"
//                 })
//             } else {
//                 // console.log('The solution is: ', results);
//                 if (results.length > 0) {
//                     if (results[0].password == password) {
//                         res.send({
//                             "code": 200,
//                             "success": "login sucessfull"
//                         });
//                     } else {
//                         res.send({
//                             "code": 204,
//                             "success": "id and password does not match"
//                         });
//                     }
//                 } else {
//                     res.send({
//                         "code": 204,
//                         "success": "id does not exists"
//                     });
//                 }
//             }
//         })
// }