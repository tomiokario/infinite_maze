/*
 * 迷路を解くゲーム
 */

phina.globalize(); // phina.jsを使用する(グローバルに展開)


// 定数
const WALL_SIZE = 40; // 正方形の一辺の長さ
const DISPLAY_WIDTH = 640; // ゲーム画面の横幅
const DISPLAY_HEIGHT = 960; // ゲーム画面の縦幅
const ONE_SECOND_FPS = 30; //ゲーム画面を、一秒間に何回更新するか

// グローバル変数
var maze;           // 迷路生成用配列
var start_points_x = new Array();   // 穴掘り開始地点候補の配列
var start_points_y = new Array();   // 穴掘り開始地点候補の配列
var maze_count = 0;



/*
 * メイン処理
 */
phina.main(function() {
    // アプリケーション生成
    var app = GameApp({
        // シーン選択(mainから開始)
        startLabel: 'start',
        // 画面設定
        width: DISPLAY_WIDTH, //画面の横幅
        height: DISPLAY_HEIGHT, //画面の縦幅
        fps: ONE_SECOND_FPS, //毎秒何回画面を更新するかの設定。

        scenes: [
            {
                className: 'StartScene',
                label: 'start',
                nextLabel: 'main',
            },

            {
                className: 'MainScene',
                label: 'main',
                nextLabel: 'goal',
            },
            {
                className: 'GoalScene',
                label: 'goal',
                nextLabel: 'main',
            },
            {
                className: 'GameOverScene',
                label: 'gameover',
                nextLabel: 'start',
            },

        ],
    });

    // アプリケーション実行
    app.run();
});




// ランダムなint型の数を返す関数
// 0~maxの範囲で返す
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

