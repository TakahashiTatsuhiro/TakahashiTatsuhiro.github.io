//イベント
document.getElementById('btnGu').addEventListener('click', gameGu);
document.getElementById('btnCho').addEventListener('click', gameCho);
document.getElementById('btnPa').addEventListener('click', gamePa);
window.addEventListener('load', function () { setInterval(displayTime, 10) });

//(個別関数)グーを出す--------------------------------------
function gameGu() {
    game("gu");
}

//(個別関数)チョキを出す------------------------------------
function gameCho() {
    game("cho");
}

//(個別関数)パーを出す--------------------------------------
function gamePa() {
    game("pa");
}

//プレイヤーが出し手を選択した際の動作-----------------------------------
/**
 * プレイヤーが出し手を選択した際の動作
 * @param {string} pChoice  プレイヤーの出し手(gu,cho,paの３パターン)
 * @returns 
 */
function game(pChoice) {
    //時刻取得
    let now = new Date();

    //掛け金の成立判断
    if (!judgeMoney()) {
        return; //何もせず終わる
    }

    //じゃんけんの勝敗結果の決定
    const issue = decideIssue(now.getSeconds());

    //勝敗結果に基づきシステム側の出し手を表示
    let newImg = decideImg(pChoice, issue);

    //掛け金の清算
    liquidation(issue);

    //コンティニュー判断
    if (!canContinue()) {
        newImg = "imgs/gameover.jpg";
    }

    //画像の再表示
    let tgtImg = document.getElementById("targetImg");
    tgtImg.src = newImg;
}

//(個別関数)掛け金の成立判断---------------------------------
/**
* 掛け金の成立性を判断する
* @param {number} なし - なし
* @return {boolean} result - 成立ならtrue、そうでないならfalse
*/
function judgeMoney() {
    const own = Number(document.getElementById("money").value);
    const bet = Number(document.getElementById("bet").value);
    if (bet <= own) {
        return true;
    } else {
        return false;
    }
}

//(個別関数)じゃんけんの勝敗結果の決定------------------------
/**
* じゃんけんの勝敗結果の決定
* @param {number} sec - 勝負した瞬間の時刻秒
* @return {number} issue - プレイヤーの勝ちは０、あいこは１、負は２
*/
function decideIssue(sec) {
    //まず確率分布を定義 (keyは剰余,Valueは勝率)
    const dic = {
        "0": { "win": 5 / 9, "draw": 7 / 9, "lose": 9 / 9 },
        "1": { "win": 1 / 9, "draw": 5 / 9, "lose": 9 / 9 },
        "2": { "win": 1 / 9, "draw": 4 / 9, "lose": 9 / 9 }
    };

    //時刻秒の剰余を求める
    const surplus = Math.floor(sec % 3); //確実に整数にするためにfloorを実行

    //乱数を生成 (勝敗を決める)
    const rdm = Math.random();

    //勝敗を判断
    if (rdm < dic[surplus.toString()]["win"]) {
        console.log(`${sec}秒`, `剰余${surplus}`, `乱数${rdm}`, `勝ち閾値${dic[surplus.toString()]["win"]}`)
        return 0; //勝ちの確率未満なら勝ち
    } else if (rdm < dic[surplus.toString()]["draw"]) {
        console.log(`${sec}秒`, `剰余${surplus}`, `乱数${rdm}`, `あいこ閾値${dic[surplus.toString()]["draw"]}`)
        return 1; //あいこの確率未満ならあいこ
    } else {
        console.log(`${sec}秒`, `剰余${surplus}`, `乱数${rdm}`, `負け閾値${dic[surplus.toString()]["lose"]}`)
        return 2; //残りは負け
    }
}

//(個別関数)システム側の出し手の画像を決定-----------------------------
/**
* システム側の出し手を判断し出力する画像を決定する
* @param {string} pChoice - プレイヤーの出し手 gu,cho,pa
* @param {number} issue - じゃんけんの勝敗(プレイヤーの勝ちは０、あいこは１、負は２)
* @return {string} path - 表示すべき画像のパス
*/
function decideImg(pChoice, issue) {
    if (pChoice === "gu") {
        if (issue === 0) {
            return "imgs/2-0_cho.JPG"; //チョキ勝ち
        } else if (issue === 1) {
            return "imgs/1-1_gu.JPG"; //グーあいこ
        } else if (issue === 2) {
            return "imgs/3-2_pa.JPG"; //パー負け
        }
    } else if (pChoice === "cho") {
        if (issue === 0) {
            return "imgs/3-0_pa.JPG"; //パー勝ち
        } else if (issue === 1) {
            return "imgs/2-1_cho.JPG"; //チョキあいこ
        } else if (issue === 2) {
            return "imgs/1-2_gu.JPG"; //グー負け
        }
    } else if (pChoice === "pa") {
        if (issue === 0) {
            return "imgs/1-0_gu.JPG"; //グー勝ち
        } else if (issue === 1) {
            return "imgs/3-1_pa.JPG"; //パーあいこ
        } else if (issue === 2) {
            return "imgs/2-2_cho.JPG"; //チョキ負け
        }
    }
}

//(個別関数)掛け金の清算----------------------------------------
/**
* 掛け金の清算
* @param {number} なし - なし
* @return {number} なし - なし
*/
function liquidation(issue) {
    const own = Number(document.getElementById("money").value);
    const bet = Number(document.getElementById("bet").value);

    if (issue === 0) {
        document.getElementById("money").value = Number(own) + Number(bet);
    } else if (issue === 1) {
        document.getElementById("money").value = Number(own) - Number(bet) / 2;
    } else if (issue === 2) {
        document.getElementById("money").value = own - bet;
    }
}

//(個別関数)コンティニュー判断----------------------------------
/**
* コンティニュー判断
* @param {number} なし - なし
* @return {boolean} result - なし
*/
function canContinue() {
    const own = document.getElementById("money").value;
    return (0 < own);
}

//現在時刻を表示
function displayTime() {
    var now = new Date();

    var seconds = now.getSeconds(); // 秒を取得
    var minutes = now.getMinutes(); // 分を取得
    var hours = now.getHours(); // 時を取得

    // 1 桁の場合は 0 を補完
    hours = addZero(hours);
    seconds = addZero(seconds);
    minutes = addZero(minutes);

    document.getElementById('time').innerText = "時刻は " + hours + '時' + minutes + '分' + seconds + "秒だよ";
}

//数字一桁だったら十の位に0をつける
function addZero(num) {
    return ('0' + num.toString()).slice(-2); //https://gray-code.com/javascript/fill-numbers-with-zeros/
}
