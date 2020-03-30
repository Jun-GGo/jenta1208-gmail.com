var mysql = require('mysql');
const Web3 = require("web3");
const axios = require('axios');
var Tx = require('ethereumjs-tx').Transaction;
const ethNetwork = 'https://ropsten.infura.io/v3/a0a975e16b6846af9c7af6b28767f23d';
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gameproject'
});
db.connect();
module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('main.html');
    });
    app.get('/signup', function (req, res) {
        res.render('sign_up.html');
    });
    app.get('/login', function (req, res) {
        res.render('login.html');
    })
    app.post('/signup_success', function (req, res) {
        console.log(req.body);

        var users = {
            "name": req.body.name,
            "login_id": req.body.login_id,
            "password": req.body.password,
            "birth_date": req.body.birth_date,
            "phone_number": req.body.phone_number,
            "email": req.body.email,
            "address": req.body.address
        }
        let sql2=`insert into bank(money) values(0)`
        db.query(sql2, function (error) {
            if (error) {
                console.log(error);
            }
        });


        var sql = `insert into users(name,login_id,password,birth_date,phone_number,email,address) values('${users.name}','${users.login_id}','${users.password}','${users.birth_date}','${users.phone_number}','${users.email}','${users.address}')`;
        db.query(sql, users, function (error) {
            if (error) {
                res.send('회원가입 실패 다시 시도주세요');
                console.log(error);
            } else
                res.render('signup_success.html');
        });
    });


    app.post('/login_success', function (req, res) {
        var users = {
            "login_id": req.body.login_id,
            "password": req.body.password
        }
        var sql = `select idx,password from users where login_id='${users.login_id}'`;
        db.query(sql, users, function (error, results, field) {
            if (users.password == results[0].password) {
                var id = results[0].idx;//로그인한 아이디의 인덱스 어떻게 전해줄것인가?
                res.redirect(`http://localhost:5000/game?id=${id}`);

            }
            else{
                res.redirect(`http://localhost:5000/login_error`)
            }
        });
    });
    app.get('/login_error',function (req,res) {
        res.render('login_error.html')
    })
    app.get('/checkoverlap', function (req, res) {

        var users = {
            "login_id": req.query.login_id,
        }
        console.log(users.login_id);

        var sql = `select idx from users where login_id='${users.login_id}'`;
        db.query(sql, users, function (error, results) {
            if (results >= 0)
                res.send('0');
            else
                res.send('1');


        })

    })
    app.get('/getallranking', async function (req, res) {
        function returnResult(sql) {
            return new Promise(function (resolve, reject) {
                db.query(sql, function (error, results) {
                    if (error) reject(error);
                    resolve(results);
                })
            });
            debug:true;
        }

        let data1 = null;
        let data2 = null;

        let sql1 = `select answer_idx from answer order by answer_idx DESC LIMIT 1`;
        await returnResult(sql1)
            .then(function (data) {
                data1 = data[0].answer_idx;
            })
        let sql2 = `select 1th,2th,3th from ranking_results where answer_idx=${data1}`
        await returnResult(sql2)
            .then((function (data) {
                res.send(data);
            }))
    })


    app.get('/game', function (req, res) {
        res.render('game.html');
    });

    app.get('/answer', function (req, res) {

        var sqlR = `select * from answer order by answer_idx DESC LIMIT 1`
        db.query(sqlR, function (error, results) {
            if (error) {
                throw error;
            }
            res.send(results);
        })
    })

    app.get('/answer2', function (req, res) {

        var sqlR = `select * from answer order by answer_idx DESC LIMIT 5`

        db.query(sqlR, function (error, results) {
            if (error) {
                throw error;
            }
            res.send(results);
        })

    })
    app.get('/getBalance', function (req, res) {
        let id = req.query.id;
        let sql = `select money from bank where id=${id}`
        db.query(sql, function (error, result) {
            if (error) {
                throw error;
            }
            res.send(result);

        })

    })

    app.get('/distribute', async function (req, res) {
        function returnResult(sql) {
            return new Promise(function (resolve, reject) {
                db.query(sql, function (error, results) {
                    if (error) reject(error);
                    resolve(results);
                })
            });
            debug:true;
        }


        let id = req.query.id;

        let answer_idx = req.query.answer_idx - 1;
        let arrAll = req.query.arr;
        let arrMe = req.query.arr2;
        // console.log(arr);
        let data1 = null;
        let data2 = null;
        let data3 = null;
        let sql2 = '';
        let sql5 = '';
        let sql6 = '';
        let sql = `select money from bank where id = 1`;
        await returnResult(sql)
            .then(function (data) {
                if (arrAll[0] > 0) {
                    data1 = data[0].money / 10 * 7 / arrAll[0] * 1;
                    data1 = Math.round(data1);
                    console.log('data1:' + data1);
                    sql2 = `update bank set money = money-${data1 * arrMe[0]} where id=1`;
                }
                if (arrAll[1] > 0) {
                    data2 = data[0].money / 10 * 2 / arrAll[1] * 1;
                    data2 = Math.round(data2);
                    console.log('data2:' + data2);
                    sql5 = `update bank set money = money-${data2 * arrMe[1]} where id=1`;
                }
                if (arrAll[2] > 0) {
                    data3 = data[0].money / 10 * 1 / arrAll[2] * 1;
                    data3 = Math.round(data3);
                    console.log('data3:' + data3);
                    sql6 = `update bank set money = money-${data3 * arrMe[2]} where id=1`;
                }


            })
            .catch((err) => console.log(err));

        if (arrAll[0] > 0) {
            await returnResult(sql2);
        }
        if (arrAll[1] > 0)
            await returnResult(sql5);
        if (arrAll[2] > 0)
            await returnResult(sql6);
        // let sql6 = `insert into contracts(id,num) values(0,'[0,0,0,0,0,0]') `;
        let sql3 = '';
        for (let k = 0; k < arrMe[0]; k++) {
            sql3 = `insert into getmoney(answer_idx,id,score,money,completed) values('${answer_idx}','${id}','1','${data1}','1')`
            await returnResult(sql3);
        }
        for (let k = 0; k < arrMe[1]; k++) {
            sql3 = `insert into getmoney(answer_idx,id,score,money,completed) values('${answer_idx}','${id}','2','${data2}','1')`
            await returnResult(sql3);
        }
        for (let k = 0; k < arrMe[2]; k++) {
            sql3 = `insert into getmoney(answer_idx,id,score,money,completed) values('${answer_idx}','${id}','3','${data3}','1')`
            await returnResult(sql3);
        }


    })

    app.get('/getmoney2', function (req, res) {

        let id = req.query.id;
        let idx = req.query.idx;
        let money = req.query.money;
        db.query(`update getmoney set completed = 0 where idx=${idx}`, function (error) {
            if (error) {
                throw error;
            }
        })
        db.query(` update bank set money = money + ${money} where id = ${id}`, function (error) {
            if (error) {
                throw error;
            }
        })
    })

    app.get('/getmoney', function (req, res) {
        let id = req.query.id;
        db.query(`select * from getmoney where id=${id}`, function (error, result) {
            if (error) {
                throw error;
                console.log(error);
            }
            res.send(result);
        })
    })


    app.get('/sendcoin', function (req, res) {
        let from = req.query.from;
        let to = req.query.to;
        let money = req.query.money;
        db.query(`update bank set money = money-${money} where id=${from}`, function (error) {
            if (error) {
                throw error;
            }
        })
        db.query(`update bank set money = money+${money} where id=${to}`, function (error) {
            if (error) {
                throw error;
            }
        })
    })

    app.get('/getAccumulated', function (req, res) {
        let sql = `select money from bank where id=1`
        db.query(sql, function (error, result) {
            if (error) {
                throw error;
            }
            res.send(result);
        })

    })
    app.get('/truncate', function (req, res) {
        let sql5 = `truncate table contracts`;
        let sql6 = `insert into contracts(id,num) values(0,'[0,0,0,0,0,0]') `;
        db.query(sql5, function (error, result) {
            if (error) {
                throw error;
            }
        })

        db.query(sql6, function (error, result) {
            if (error) {
                throw error;
            }
        })


    })
    app.get('/happy2', async function (req, res) {
        function compareArray(a, b) {
            count = 0;
            for (let k = 0; k < 6; k++) {
                for (let u = 0; u < 6; u++) {
                    if (a[k] == b[u])
                        count++;
                }
            }
            return count;
        }

        function returnResult(sql) {
            return new Promise(function (resolve, reject) {
                db.query(sql, function (error, results) {
                    if (error) reject(error);
                    resolve(results);
                })
            });
        }

        let sql1 = `select * from answer order by answer_idx DESC LIMIT 1`;
        let sql3 = 'select * from contracts';

        let data1 = null;

        let data3 = null;
        await returnResult(sql1)
            .then(function (data) {
                data1 = data;
            })
            .catch((err) => console.log(err));


        await returnResult(sql3)
            .then(function (data) {
                data3 = data;
            })
            .catch((err) => console.log(err));

        let s = 0;
        let _1th = [];
        let _2th = [];
        let _3th = [];
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count = 0;
        let countarray = [[], []];

        for (s = 0; s < data3.length; s++) {
            count = compareArray(data1[0].num.split(','), data3[s].num.split(','));
            countarray[0][s] = data3[s].id;
            countarray[1][s] = count;

            if (count === 6) {
                _1th[count1++] = data3[s].id;
            } else if (count === 5) {
                _2th[count2++] = data3[s].id;
            } else if (count === 4) {
                _3th[count3++] = data3[s].id;
            }
        }
        await res.send(countarray);

    });


    app.get('/happy', async function (req, res) {


        function compareArray(a, b) {
            count = 0;
            for (let k = 0; k < 6; k++) {
                for (let u = 0; u < 6; u++) {
                    if (a[k] == b[u])
                        count++;

                }
            }
            return count;
        }

        function returnResult(sql) {
            return new Promise(function (resolve, reject) {
                db.query(sql, function (error, results) {
                    if (error) reject(error);
                    resolve(results);
                })
            });
        }

        let sql1 = `select * from answer order by answer_idx DESC LIMIT 1`;
        let sql2 = `select contracts_idx from contracts order by contracts_idx DESC LIMIT 1`;
        let sql3 = 'select * from contracts';
        // let answer_idx = returnResult(sql1);
        // let contracts_idx = returnResult(sql2);
        // let contracts=returnResult(sql3);
        let data1 = null;
        let data2 = null;
        let data3 = null;
        await returnResult(sql1)
            .then(function (data) {
                data1 = data;
            })
            .catch((err) => console.log(err));

        await returnResult(sql2)
            .then(function (data) {

                data2 = data;

            })
            .catch((err) => console.log(err));


        await returnResult(sql3)
            .then(function (data) {
                data3 = data;
            })
            .catch((err) => console.log(err));

        let s = 0;
        let _1th = [];
        let _2th = [];
        let _3th = [];
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count = 0;
        let countarray = [[], []];


        for (s = 0; s < data2[0].contracts_idx; s++) {
            count = compareArray(data1[0].num.split(','), data3[s].num.split(','));
            countarray[0][s] = data3[s].id;
            countarray[1][s] = count;

            if (count === 6) {
                _1th[count1++] = data3[s].id;
            } else if (count === 5) {
                _2th[count2++] = data3[s].id;
            } else if (count === 4) {
                _3th[count3++] = data3[s].id;
            }
        }
        _1th = _1th.toString();
        _2th = _2th.toString();
        _3th = _3th.toString();
        let data4 = null;
        let sql4 = `insert into ranking_results(answer_idx,1th,2th,3th) values('${data1[0].answer_idx}','${_1th}','${_2th}','${_3th}')`
        await returnResult(sql4)
            .then(function (data) {
                data4 = data;
            })
            .then(function (data) {
                res.send(countarray);
            })
            .catch((err) => console.log(err));

    });
    app.get('/timer2', function (req, res) {
        res.send((Math.floor(+new Date() / 1000) % 40).toString());
    })


    app.get('/timer', function (req, res) {
        res.send((Math.floor(+new Date() / 1000) % 40).toString());
        if (Math.floor(+new Date() / 1000) % 40 === 0) {
            function sameNum(n) {
                for (var i = 0; i < lotto.length; i++) {
                    if (n === lotto[i]) {
                        return true;
                    }
                }
                return false;
            }

            let lotto = [];
            let i = 0;
            while (i < 6) {
                let n = Math.floor(Math.random() * 20) + 1;
                if (!sameNum(n)) {
                    lotto.push(n);
                    i++;
                }
            }
            lotto.sort(function (a, b) {
                return a - b;
            });
            let answer = {
                "num": lotto
            }


            var sql = `insert into answer(num) values('${answer.num}')`;
            // var sql = `insert into answer(num) values('1,2,3,4,5,6')`
            db.query(sql, answer, function (error) {
                if (error) {
                    throw error;
                }
            });
        }
    })
    app.get('/makeOrder', function (req, res) {
        let id = req.query.id;
        let num = req.query.num;
        let contracts = {
            "id": id,
            "num": num
        }


        var sql = `insert into contracts(id,num) values('${contracts.id}','${contracts.num}')`;
        db.query(sql, contracts, function (error) {
            if (error) {
                throw error;
            }
        });
        var sqlR = `select * from contracts where id=${contracts.id} order by contracts_idx DESC`
        db.query(sqlR, contracts, function (error, result) {
            if (error) {
                throw error;
            }
            res.send(result);
        })
        var sqlC = `update bank set money = money-1000 where id=${id}`;
        db.query(sqlC, contracts, function (error) {
            if (error) {
                throw error;
            }
        });
        var sqlC2 = `update bank set money = money+1000 where id=1`;
        db.query(sqlC2, contracts, function (error) {
            if (error) {
                throw error;
            }
        });
    })


    app.get('/makeRandom', function (req, res) {
        function sameNum(n) {
            for (var i = 0; i < lotto.length; i++) {
                if (n === lotto[i]) {
                    return true;
                }
            }
            return false;
        }

        let lotto = [];
        let i = 0;
        while (i < 6) {
            let n = Math.floor(Math.random() * 20) + 1;
            if (!sameNum(n)) {
                lotto.push(n);
                i++;
            }
        }
        lotto.sort(function (a, b) {
            return a - b;
        });

        let id = req.query.id;
        let rnum = lotto;
        // console.log('id : ' + id);
        // console.log(lotto);
        let contracts = {
            "id": id,
            "num": rnum
        }

        var sql = `insert into contracts(id,num) values('${contracts.id}','${contracts.num}')`;
        db.query(sql, contracts, function (error) {
            if (error) {
                throw error;
            }
        });
        var sqlR = `select * from contracts where id=${contracts.id} order by contracts_idx DESC`
        db.query(sqlR, contracts, function (error, result) {
            if (error) {
                throw error;
            }
            res.send(result);
        })
        var sqlC = `update bank set money = money-1000 where id=${id}`;
        db.query(sqlC, contracts, function (error) {
            if (error) {
                throw error;
            }
        });
        var sqlC2 = `update bank set money = money+1000 where id=1`;
        db.query(sqlC2, contracts, function (error) {
            if (error) {
                throw error;
            }
        });


    });
    app.get('/checkInfoC', function (req, res) {

        let id = req.query.id;
        let contracts = {
            "id": id
        }
        var sqlC = `select * from contracts where id=${contracts.id} order by contracts_idx DESC`
        db.query(sqlC, contracts, function (error, result) {
            if (error) {
                throw error;
            }
            res.send(result);
        })


    })
    app.get('/checkInfoR', function (req, res) {
        let answers = {};
        var sqlR = `select * from answer order by answer_idx DESC LIMIT 5`
        db.query(sqlR, answers, function (error, results) {
            if (error) {
                throw error;
            }
            res.send(results);
        })
    })
    app.get('/checkRanking', function (req, res) {
        let answer_idx = req.query.answer_idx ;
        let sqlCR = `select 1th,2th,3th from ranking_results where answer_idx=${answer_idx}`
        db.query(sqlCR, function (error, results) {
            if (error) {
                throw error;
            }
            // console.log(results[0]['1th']);
            res.send(results);
        })
    })
    app.get('/checkInfoRR', function (req, res) {
        let answer_idx = req.query.answer_idx;
        var sqlR = `select num from answer where answer_idx=${answer_idx}`
        db.query(sqlR, function (error, results) {
            if (error) {
                throw error;
            }
            res.send(results);
        })
    })

    async function getBalance(address) {
        return new Promise((resolve, reject) => {
            web3.eth.getBalance(address, async (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(web3.utils.fromWei(result, "ether"));
            });
        });
    }


    app.get('/exchangetoken', async function (req, res) {
        let it = req.query.it;
        let id = req.query.id
        console.log(id);

        async function returnResult(sql) {
            return new Promise(function (resolve, reject) {
                db.query(sql, async function (error, results) {
                    if (error) reject(error);
                    resolve(results);
                })
            });
        }

        async function transferFund(sendersData, recieverData, amountToSend) {
            return new Promise(async (resolve, reject) => {
                await web3.eth.getBalance(sendersData.address, async (err, result) => {
                    if (err) {
                        return reject();
                    }
                    let balance = web3.utils.fromWei(result, "ether");
                    console.log(balance + " ETH");
                    if (balance < amountToSend) {
                        console.log('insufficient funds');
                        return reject();
                    }
                });
                let nonce = await web3.eth.getTransactionCount(sendersData.address);


                const txObject = {
                    nonce: web3.utils.toHex(nonce),
                    gasLimit: web3.utils.toHex(1000000),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                    to: recieverData.address,
                    value: web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                    chainId: 3
                };

                const tx = new Tx(txObject, {chain: 'ropsten'});
                tx.sign(sendersData.privateKey);

                const serializedTx = tx.serialize();
                const raw = '0x' + serializedTx.toString('hex');

                web3.eth.sendSignedTransaction(raw)
                    .once('transactionHash', (hash) => {
                        console.info('transactionHash', 'https://ropsten.etherscan.io/tx' + hash);
                    })
                    .once('receipt', (receipt) => {
                        console.info('receipt', receipt);
                    }).on('error', console.error);


            });
        }

        let sql1 = `select money from bank where id = ${id}`;
        await returnResult(sql1)
            .then(function (data) {
                if (data < it) {
                    res.send(false);
                }
            })
            .catch((err) => console.log(err));
        let sql2 = `update bank set money = money-${it} where id=${id}`;
        await returnResult(sql2);
        let sql3 = `select address from users where idx = ${id}`;
        let address = null;
        await returnResult(sql3)
            .then(function (data) {
                address = data[0].address;
            })
            .catch((err) => console.log(err));


        console.log(address);
        const send_account = '0xe22d47A2D82d3bE9B2aD8dfD9d900fa376De2B68';
        const privateKey = Buffer.from('B80AA9B617383758FF2CD7B2E11E2828E9A960AC5EF49E34D0391EFB7091B752', 'hex');
        await transferFund({
            address: send_account,
            privateKey: privateKey
        }, {address: address}, it / 10000);

    })
    app.get('/exchangeether', async function (req,res){
        let id = req.query.id

        async function returnResult(sql) {
            return new Promise(function (resolve, reject) {
                db.query(sql, async function (error, results) {
                    if (error) reject(error);
                    resolve(results);
                })
            });
        }
        let sql3 = `select address from users where idx = ${id}`;
        let address = null;
        await returnResult(sql3)
            .then(function (data) {
                address = data[0].address;
                res.send(address);

            })
            .catch((err) => console.log(err));
    })

    app.get('/exchangeether_process', async function (req, res) {
        let ie = req.query.ie;
        let priKey = req.query.privateKey;
        let id = req.query.id
        console.log(id);

        async function returnResult(sql) {
            return new Promise(function (resolve, reject) {
                db.query(sql, async function (error, results) {
                    if (error) reject(error);
                    resolve(results);
                })
            });
        }

        async function transferFund(sendersData, recieverData, amountToSend) {
            return new Promise(async (resolve, reject) => {
                await web3.eth.getBalance(sendersData.address, async (err, result) => {
                    if (err) {
                        return reject();
                    }
                    let balance = web3.utils.fromWei(result, "ether");
                    console.log(balance + " ETH");
                    if (balance < amountToSend) {
                        console.log('insufficient funds');
                        return reject();
                    }
                });
                let nonce = await web3.eth.getTransactionCount(sendersData.address);


                const txObject = {
                    nonce: web3.utils.toHex(nonce),
                    gasLimit: web3.utils.toHex(1000000),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                    to: recieverData.address,
                    value: web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                    chainId: 3
                };

                const tx = new Tx(txObject, {chain: 'ropsten'});
                tx.sign(sendersData.privateKey);

                const serializedTx = tx.serialize();
                const raw = '0x' + serializedTx.toString('hex');

                web3.eth.sendSignedTransaction(raw)
                    .once('transactionHash', (hash) => {
                        console.info('transactionHash', 'https://ropsten.etherscan.io/tx' + hash);
                    })
                    .once('receipt', (receipt) => {
                        console.info('receipt', receipt);
                    }).on('error', console.error);


            });
        }


        let sql3 = `select address from users where idx = ${id}`;
        let address = null;
        await returnResult(sql3)
            .then(function (data) {
                address = data[0].address;
            })
            .catch((err) => console.log(err));
        let sql2 = `update bank set money = money+${ie*10000} where id=${id}`;
        console.log('working')
        await returnResult(sql2);




        console.log('send_account:'+address);
        const receive_account = '0xe22d47A2D82d3bE9B2aD8dfD9d900fa376De2B68';
        const privateKey = Buffer.from(priKey, 'hex');
        await transferFund({
            address: address,
            privateKey: privateKey
        }, {address: receive_account}, ie);



    })


    app.get('/exchange', function (req, res) {
        res.render('exchange.html');
    })


    app.get('/sendtx', async function (req, res) {
        async function getBalance(address) {
            return new Promise((resolve, reject) => {
                web3.eth.getBalance(address, async (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(web3.utils.fromWei(result, "ether"));
                });
            });
        }


        async function transferFund(sendersData, recieverData, amountToSend) {
            return new Promise(async (resolve, reject) => {
                await web3.eth.getBalance(sendersData.address, async (err, result) => {
                    if (err) {
                        return reject();
                    }
                    let balance = web3.utils.fromWei(result, "ether");
                    console.log(balance + " ETH");
                    if (balance < amountToSend) {
                        console.log('insufficient funds');
                        return reject();
                    }
                });
                let nonce = await web3.eth.getTransactionCount(sendersData.address);


                const txObject = {
                    nonce: web3.utils.toHex(nonce),
                    gasLimit: web3.utils.toHex(1000000),
                    gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
                    to: recieverData.address,
                    value: web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                    chainId: 3
                };

                const tx = new Tx(txObject, {chain: 'ropsten'});
                tx.sign(sendersData.privateKey);

                const serializedTx = tx.serialize();
                const raw = '0x' + serializedTx.toString('hex');

                web3.eth.sendSignedTransaction(raw)
                    .once('transactionHash', (hash) => {
                        console.info('transactionHash', 'https://ropsten.etherscan.io/tx' + hash);
                    })
                    .once('receipt', (receipt) => {
                        console.info('receipt', receipt);
                    }).on('error', console.error);


            });
        }

        transferFund({
            address: send_account,
            privateKey: privateKey
        }, {address: receive_account}, 0.10);

    });
};




