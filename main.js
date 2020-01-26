/*
 * シンプルに四角が動く、ゲーム(?)
 */

phina.globalize(); // おまじない(phina.jsをグローバルに展開)


// 定数
const RECTANGLE_DIAMETER = 60; // 正方形の一辺の長さ
const DISPLAY_WIDTH = 640; // ゲーム画面の横幅
const DISPLAY_HEIGHT = 960; // ゲーム画面の縦幅
const ONE_SECOND_FPS = 30; //ゲーム画面を、一秒間に何回更新するか

var SCORE = 0; //スコアはグローバルで管理する(その方が簡単なので…)
var SPEED_X = 25;
var SPEED_Y = 3

/*
 * 四角の定義
 */
phina.define('Rec', {
    superClass: 'CircleShape',


    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.color = getRandomInt(4); // カラーコード
        if(this.color==0){
            this.fill = 'red'; // 四角の塗りつぶし色
            this.stroke = 'red'; // 四角のふちの色
        }
        else if(this.color==1){
            this.fill = 'blue'; // 四角の塗りつぶし色
            this.stroke = 'blue'; // 四角のふちの色
        }
        else if(this.color==2){
            this.fill = 'green'; // 四角の塗りつぶし色
            this.stroke = 'green'; // 四角のふちの色
        }
        else{
            this.fill = 'darkblue'; // 四角の塗りつぶし色
            this.stroke = 'darkblue'; // 四角のふちの色
        }

        this.width = RECTANGLE_DIAMETER; //四角の縦幅
        this.height = RECTANGLE_DIAMETER; //四角の横幅

        //オブジェクトをクリックできるようにする
        this.setInteractive(true); //四角をクリック可能に
        this.onpointstart = () => { //クリックが始まった瞬間の処理
            SCORE += 1; //スコアを1追加
            this.remove(); //自身を削除
        };
        this.down_flag = Boolean("true");
        this.right_flag = Boolean("true");
        this.speed_x = getRandomInt(40);
        this.speed_y = getRandomInt(40);
    },


    // update関数(毎フレームごとに、どうふるまうか)
    update: function(app) {

        if(this.right_flag){
            this.x += this.speed_x;
        }
        else{
            this.x -= this.speed_x;
        }

        if(this.x < 0){
            this.right_flag = 1;
        }

        if(this.x > DISPLAY_WIDTH){
            this.right_flag = 0 ;
        }

        if(this.down_flag){
            this.y += this.speed_y;
            console.log(this.down_flag);
        }
        else{
            this.y -= this.speed_y;
            console.log("up");

        }

        if(this.y < 0){
            this.down_flag = 1;
        }

        if(this.y > DISPLAY_HEIGHT){
            this.down_flag = 0;
        }

    },
});



/*
 * スコア表示用Labalの定義
 */
phina.define('scoreLabel', {
    superClass: 'Label',

    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.text = "0"; //最初のtextは 0
        this.fontsize = 64; //フォントの大きさ
        this.x = DISPLAY_WIDTH / 2; //表示位置(x座標)
        this.y = DISPLAY_HEIGHT - (DISPLAY_HEIGHT / 9); //表示位置(y座標)
        this.fill = '#111'; //文字の色
    },


    //毎フレームごとに、どうふるまうか
    update: function(app) {
        this.text = SCORE; //textに現在のSCOREを代入
    }
});






/*
 * ゲームのメインシーンの定義
 *      phina.jsは，シーンを作って，シーンの中で任意のオブジェクトを動かす
 *          タイトルシーン，メイン画面など，画面遷移をしたい
 */
phina.define("MainScene", {
    superClass: 'DisplayScene',

    // 初期化
    init: function() {
        this.superInit(); //初期化のおまじない

        this.backgroundColor = '#1ee'; // 背景色

        //score表示用Labelを、シーンに追加
        scoreLabel({}).addChildTo(this);

        // グループを生成
        this.recGroup = DisplayElement().addChildTo(this);
    },


    //毎フレームごとに、どう振る舞うか
    update: function(app) {
        if (app.frame % ONE_SECOND_FPS == 0) { //1秒に一回、四角を追加する

            var tempRec = Rec({}); //tempRecに四角を一旦代入し、初期値を設定する
            tempRec.x = getRandomInt(DISPLAY_WIDTH); //表示位置(x座標)を画面内でランダムに設定する
            tempRec.y = getRandomInt(DISPLAY_HEIGHT); //表示位置(y座標)を画面内でランダムに設定する

            tempRec.addChildTo(this.recGroup); //グループに追加する
        }
    },

    onkeydown: function(e) { //スペースキーが押されると、強制終了
        if (e.keyCode === 32) { //32がスペースキー
            this.app.stop();
        }
    },
});



/*
phina.define('MainScene', {
  superClass: 'CanvasScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit();
    // ボール
    var ball = CircleShape().addChildTo(this);
    ball.setPosition(0, this.gridY.center());
    // 速度設定、この時点でPhsicalクラスが適用される
    ball.physical.force(8, -4);
    // 重力
    ball.physical.gravity.set(0, 9.8 / 10);
    // 反射力（独自実装）
    ball.vy = -10;
    // 床
    var floor = RectangleShape({width: this.gridX.width}).addChildTo(this);
    floor.setPosition(this.gridX.center(), this.gridY.width);
    // 参照用
    this.ball = ball;
    this.floor = floor;
  },
  // 毎フレーム処理
  update: function() {
    // ボールが床に着いたら
    if (this.ball.hitTestElement(this.floor)) {
      // x方向の速度はキープして反射力をあてる
      var vx = this.ball.physical.velocity.x;
      this.ball.physical.force(vx, this.ball.vy);
      // めり込み防止
      this.ball.bottom = this.floor.top;
      // 摩擦
      this.ball.physical.friction = 0.97;
      // 反射力を減らす
      if (this.ball.vy < 0) this.ball.vy += 2;
    }  
  },
});





 */
















/*
 * メイン処理
 */
phina.main(function() {
    // アプリケーションを生成
    var app = GameApp({
        startLabel: 'main', // MainScene から開始
        width: DISPLAY_WIDTH, //画面の横幅
        height: DISPLAY_HEIGHT, //画面の縦幅
        fps: ONE_SECOND_FPS, //毎秒何回画面を更新するかの設定。
    });

    // 実行
    app.run();
});






// ランダムなint型の数を返す関数
// 0~maxの範囲で返す
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
