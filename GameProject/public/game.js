function S_GET(id) {
    var a = new RegExp(id + "=([^&#=]*)");
    return decodeURIComponent(a.exec(window.location.search)[1]);
}
let param3 = S_GET('id');

function getBalance() {
    let param = S_GET('id');
    $.ajax({
        url: "/getBalance",
        data: {id: param},
        method: "GET",

    })
        .done(function (result) {
            document.getElementById('mycoin').innerHTML = '내 코인:' + result[0].money
        })


}

getBalance();

function getAccumulated() {
    $.ajax({
        url: "/getAccumulated",
        data: {},
        method: "GET",

    })
        .done(function (result) {
            document.getElementById('accumulated').innerHTML = '모인 돈:' + result[0].money

        })

}

getAccumulated();

function orderMake() {
    let param = S_GET('id');
    let num = [];
    if (userInput() === false)
        return false
    else
        num = userInput();
    $.ajax({
        url: "/getBalance",
        data: {id: param},
        method: "GET",

    })
        .done(function (result) {
            if (result[0].money >= 1000) {
                $.ajax({
                    url: "/makeOrder",
                    data: {
                        id: param,
                        num: num
                    },
                    method: "GET",

                })
                    .done(function (result) {
                        let html = '';
                        for (var i = 0; i < result.length; i++) {
                            html += "<br>" + result[i].num + "<br>";
                        }
                        document.getElementById('result').innerHTML = html;
                        getBalance();
                        getAccumulated();
                    })
            } else {
                alert('돈이 부족합니다ㅜㅜ 돈을 충전해주세요!');
            }
        })


}

function randomMake() {
    let param = S_GET('id');
    $.ajax({
        url: "/getBalance",
        data: {id: param},
        method: "GET",

    })
        .done(function (result) {
            if (result[0].money >= 1000) {

                $.ajax({
                    url: "/makeRandom",
                    data: {id: param},
                    method: "GET",

                })
                    .done(function (result) {
                        let html = '';
                        for (var i = 0; i < result.length; i++) {
                            html += "<br>" + result[i].num + "<br>";
                        }
                        document.getElementById('result').innerHTML = html;
                        getBalance();
                        getAccumulated();

                    })

            } else {
                alert('돈이 부족합니다ㅜㅜ 돈을 충전해주세요!');
            }
        })


}

function initPageC() {
    let param = S_GET('id');
    $.ajax({
        url: "/checkInfoC",
        data: {
            id: param
        },
        method: "GET",

    })
        .done(function (result) {
            let html = '';
            for (var i = 0; i < result.length; i++) {
                html += "<br>" + result[i].num + "<br>";
            }
            document.getElementById('result').innerHTML = html;

        })


}

function initPageR() {
    $.ajax({
        url: "/checkInfoR",
        data: {},
        method: "GET",

    })
        .done(function (results) {
            let html = '';
            for (var i = 0; i < results.length; i++) {
                html += "<br>" + results[i].answer_idx + '회차:' + results[i].num + "<br>";
            }
            document.getElementById('resultA').innerHTML = html;
        })
}

initPageC();
initPageR();

function searchR() {
    let A = document.getElementById('a').value;

    $.ajax({
        url: "/checkInfoRR",
        data: {answer_idx: A},
        method: "GET",

    })
        .done(function (results) {
            document.getElementById('b').innerHTML = results[0].num;

        })
}

function checkRanking() {
    let param = S_GET('id');
    let C = document.getElementById('c').value;
    $.ajax({
        url: "/checkRanking",
        data: {answer_idx: C},
        method: "GET",

    })
        .done(function (results) {
            let count1 = 0;
            let count2 = 0;
            let count3 = 0;
            let _1th = results[0]['1th'].split(',');
            let _2th = results[0]['2th'].split(',');
            let _3th = results[0]['3th'].split(',');
            for (let i = 0; i < _1th.length; i++) {
                if (param == _1th[i])
                    count1++;
            }
            for (let i = 0; i < _2th.length; i++) {
                if (param == _2th[i])
                    count2++;
            }
            for (let i = 0; i < _3th.length; i++) {
                if (param == _3th[i])
                    count3++;
            }


            let html2 = '1등: ' + count1 + '개 2등: ' + count2 + '개 3등 ' + count3 + '개';
            document.getElementById('d').innerHTML = html2;

        })

}

function inNumber() {
    if (event.keyCode < 48 || event.keyCode > 57) {
        event.returnValue = false;
    }
}

function userInput() {
    var num = [];
    for (var i = 0; i < 6; i++) {
        num[i] = document.getElementById(i + 1).value;
    }
    num.sort(function (a, b) {
        return a - b;
    })


    for (var j = 0; j < 5; j++) {
        if (num[j] === num[j + 1]) {
            alert('중복되지 않는 숫자 6개를 골라주세요');
            return false;
        }
    }
    for (var k = 0; k < 6; k++) {
        if (num[5 - k] > 20) {
            alert('1~20사이의 숫자를 골라주세요');
            return false;
        } else if (num[5 - k] < 1) {
            alert('1~20사이의 숫자를 골라주세요');
            return false;
        }

    }
    return num;
}


$.ajax({
    url: "/answer",
    data: {},
    method: "GET",

})
    .done(function (results) {
        let html = '';
        html = results[0].answer_idx + '회차 당첨번호:' + results[0].num;
        document.getElementById('jk').innerHTML = html;
        let html2 = '';
        html2 = (results[0].answer_idx + 1) + '회차';
        document.getElementById('CLB').innerHTML = html2;

    })

$.ajax({
    url: "/getallranking",
    data: {},
    method: "GET",
})
    .done(function (data) {
        let param = S_GET('id');
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let mycount1 = 0;
        let mycount2 = 0;
        let mycount3 = 0;


        let _1th = data[0]['1th'].split(',');
        let _2th = data[0]['2th'].split(',');
        let _3th = data[0]['3th'].split(',');
        if (!_1th[0]) {
            count1 = 0;
            mycount1 = 0;
        } else {
            count1 = _1th.length;
            for (let i = 0; i < count1; i++) {
                if (param == _1th[i])
                    mycount1++;
            }
        }

        if (!_2th[0]) {
            count2 = 0;
            mycount2 = 0;
        } else {
            count2 = _2th.length;
            for (let i = 0; i < count2; i++) {
                if (param == _2th[i])
                    mycount2++;
            }
        }

        if (!_3th[0]) {
            count3 = 0;
            mycount3 = 0;
        } else {
            count3 = _3th.length;
            for (let i = 0; i < count3; i++) {
                if (param == _3th[i])
                    mycount3++;
            }
        }


        let html2 = '👆전체(1등: ' + count1 + '명 2등: ' + count2 + '명 3등: ' + count3 + '명)';
        document.getElementById('cr').innerHTML = html2;
        let html3 = '내 등수(1등: ' + mycount1 + ' 개 2등: ' + mycount2 + '개 3등 ' + mycount3 + ')';

        document.getElementById('resultRanking').innerHTML = html3;

    })


function getMoney(a, b) {
    let param = S_GET('id');
    console.log(ajk);
    if (++ajk > 3) {
        window.location.reload();
    }

    $.ajax({
        url: "/getmoney2",
        data: {
            id: param,
            idx: a,
            money: b
        },
        method: "GET",
    })
    getBalance()
    distribute();

}

let ajk = 0;

function distribute() {
    let param = S_GET('id');

    $.ajax({
        url: "/getmoney",
        data: {id: param},
        method: "GET",
    })
        .done(function (result) {
            let html = '';
            let html2 = '';
            for (let i = 0; i < result.length; i++) {
                if (result[i].completed == 1) {
                    html += "<br>" + result[i].answer_idx + "회차 " + result[i].score + '등 ' + result[i].money+'        '+ "<button style='text-align: right' onclick=" + "getMoney(" + result[i].idx + "," + result[i].money + ")>받기</button>" + '<br>'
                    // html += "<br>" + result[i].answer_idx + "회차 " + result[i].score + '등 ' + result[i].money + '<br>'
                    // html2 += "<br>" + "<button onclick=" + "getMoney(" + result[i].idx + "," + result[i].money + "," + result[i].answer_idx + "," + result[i].score + ")>받기</button>" + "<br>";

                }
            }
            document.getElementById('getmoney').innerHTML = html;
            document.getElementById('getmoney2').innerHTML = html2;
        })
}

distribute();
let param = S_GET('id');
$.ajax({
    url: "/happy2",
    data: {id: param},
    method: "GET",

})
    .done(function (results) {
        let array = results;
        let html = '';
        for (var i = 0; i < array[0].length; i++) {
            if (param == array[0][array[0].length-i]) {
                html += "<br>" + array[1][array[0].length - i] + "<br>";
            }
        }
        document.getElementById('resultN').innerHTML = html;
    })


//
// let time = (Math.floor(+new Date() / 1000) % 40).toString();
// if (time <= 10) {
//     $.ajax({
//         url: "/happy2",
//         data: {id: param},
//         method: "GET",
//
//     })
//         .done(function (results) {
//             let array = results;
//             let count4 = 0;
//             let count5 = 0;
//             let count6 = 0;
//             let _count4 = 0;
//             let _count5 = 0;
//             let _count6 = 0;
//
//             let html = '';
//             for (var i = 0; i < array[0].length; i++) {
//                 if (array[1][i] == 4) {
//                     _count4++
//                     //3등 배
//                 } else if (array[1][i] == 5) {
//                     _count5++;
//                 } else if (array[1][i] == 6) {
//                     _count6++;
//                 }
//
//                 if (param == array[0][i]) {
//                     html += "<br>" + array[1][i] + "<br>";
//                     if (array[1][i] == 4) {
//                         count4++
//                         //3등 배
//                     } else if (array[1][i] == 5) {
//                         count5++;
//                     } else if (array[1][i] == 6) {
//                         count6++;
//                     }
//
//                 }
//             }
//             document.getElementById('cr').innerHTML = '👆전체(1등: ' + _count6 + '명 2등: ' + count5 + '명 3등: ' + _count4 + '명)';
//             let html2 = '';
//             html2 = '내 등수(1등: ' + count6 + ' 개 2등: ' + count5 + '개 3등 ' + count4 + ')';
//             document.getElementById('resultRanking').innerHTML = html2;
//             let answer_idx = parseInt(document.getElementById('CLB').innerHTML);
//             let arr = [_count6, _count5, _count4];
//             let arr2 = [count6, count5, count4];
//
//             document.getElementById('resultN').innerHTML = html;
//             // console.log('html:'+html);
//             // console.log(html2);
//         })
// }


function func1() {
    $.ajax({
        url: "/answer2",
        data: {},
        method: "GET",

    })
        .done(function (results) {
            console.log(results)
            let html = '';
            for (var i = 0; i < results.length; i++) {
                html += "<br>" + results[i].answer_idx + '회차:' + results[i].num + "<br>";
            }
            document.getElementById('resultA').innerHTML = html;
        })

    $.ajax({
        url: "/answer",
        data: {},
        method: "GET",

    })
        .done(function (results) {
            let html = '';
            html = (results[0].answer_idx) + '회차 당첨번호:' + results[0].num;
            document.getElementById('jk').innerHTML = html;
            let html2 = '';
            html2 = (results[0].answer_idx + 1) + '회차';
            document.getElementById('CLB').innerHTML = html2;
        })
    let param = S_GET('id');
    $.ajax({
        url: "/happy",
        data: {id: param},
        method: "GET",

    })
        .done(function (results) {
            let array = results;
            let count4 = 0;
            let count5 = 0;
            let count6 = 0;
            let _count4 = 0;
            let _count5 = 0;
            let _count6 = 0;

            let html = '';
            for (var i = 0; i < array[0].length; i++) {
                if (array[1][i] == 4) {
                    _count4++
                    //3등 배
                } else if (array[1][i] == 5) {
                    _count5++;
                } else if (array[1][i] == 6) {
                    _count6++;
                }

                if (param == array[0][i]) {
                    html += "<br>" + array[1][array[0].length - i] + "<br>";
                    if (array[1][i] == 4) {
                        count4++
                        //3등 배
                    } else if (array[1][i] == 5) {
                        count5++;
                    } else if (array[1][i] == 6) {
                        count6++;
                    }

                }
            }
            document.getElementById('cr').innerHTML = '👆전체(1등: ' + _count6 + '명 2등: ' + count5 + '명 3등: ' + _count4 + '명)';
            let html2 = '';
            html2 = '내 등수(1등: ' + count6 + ' 개 2등: ' + count5 + '개 3등 ' + count4 + ')';
            document.getElementById('resultRanking').innerHTML = html2;
            let answer_idx = parseInt(document.getElementById('CLB').innerHTML);
            let arr = [_count6, _count5, _count4];
            let arr2 = [count6, count5, count4];

            $.ajax({
                url: "/distribute",
                data: {
                    id: param,
                    answer_idx: answer_idx,
                    arr: arr,
                    arr2: arr2
                },
                method: "GET",

            })


            document.getElementById('resultN').innerHTML = html;
            // console.log('html:'+html);
            // console.log(html2);
        })

}


function timer() {

    $.ajax({
        url: "/timer",
        data: {},
        method: "GET",

    })
        .done(function (results) {
            if (results <= 10) {
                document.getElementById('CL').innerHTML = '(준비) break time:' + (10 - results) + '초';
                document.querySelector('#change').style.visibility = 'hidden';
                document.querySelector('#resultRanking').style.visibility = 'visible'
                document.querySelector('#resultN').style.visibility = 'visible'


            } else if (results > 10) {
                document.getElementById('CL').innerHTML = '(진행중):' + (40 - results) + '초';
                document.querySelector('#change').style.visibility = 'visible';
                document.querySelector('#resultRanking').style.visibility = 'hidden'
                document.querySelector('#resultN').style.visibility = 'hidden'

            }
        })
        .done(function (results) {
            if (results == 0) {
                func1();
            } else if (results == 1) {
                distribute();
                getAccumulated();
            }
        })
        .done(function (results) {
            if (results == 8) {
                $.ajax({
                    url: "/truncate",
                    data: {},
                    method: "GET",

                })

            }
        })

        .done(function (results) {
            if (results == 11) {
                document.getElementById('result').innerHTML = '';
                document.getElementById('resultN').innerHTML = '';
            }

        })
}


function initTime() {
    setInterval(timer, 1000);
}

timer();
initTime();








