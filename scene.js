/*
 * アドバイス
 */

var comment_list = [ 
                "スライムにぶつかると食べられます．",
                "shitキーでダッシュできます．",
                "スライムは8秒に一回分裂します．",
                "スライムは分裂前に赤く光ります．",
                "スライムは分裂前に減速します．",
                "上階層ほどスライムは増えやすくなります．",
                "上階層のスライムは少し素早く動きます．",
                "wasdキーでも操作できます．",
                "Enterキーで次の画面に進むことができます．",
                "迷路は毎回ランダムに生成されます．"
              ];

/*
 * スタートシーンの定義
 */
phina.define("StartScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function() {
        // 親クラス初期化
        this.superInit();
        // 背景色
        this.backgroundColor = 'teal';
        // ラベル
        Label({
            text: '迷路',
            fontSize: 48,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() - 70);
        Label({
            text: '敵を避けて，右下のゴールを目指します．',
            fontSize: 30,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() + 55);
        Label({
            text: 'タッチ，矢印キーで操作できます．',
            fontSize: 30,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() + 55 + 45);

        Label({
            text: 'タッチして進む',
            fontSize: 48,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() + 200);

    },
    // タッチで次のシーンへ
    onpointstart: function() {
        this.exit();  
    },
    update: function(app) {
        // エンターで次のシーンへ
        var key = app.keyboard;
        if (key.getKey('return')){
            this.exit();  
        }
    },

});

/*
 * ゴールシーンの定義
 */
phina.define("GoalScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function() {
        // 親クラス初期化
        this.superInit();
        // 背景色
        this.backgroundColor = 'maroon';
        // ラベル
        Label({
            text: maze_count+"つの迷路をクリアしました．",
            fontSize: 40,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() - 70);
        Label({
            text: comment_list[getRandomInt(comment_list.length)],
            fontSize: 25,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() +50);

        Label({
            text: '次の迷路に進む',
            fontSize: 48,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() + 200);

    },
    // タッチで次のシーンへ
    onpointstart: function() {
        this.exit();  
    },
    update: function(app) {
        // エンターで次のシーンへ
        var key = app.keyboard;
        if (key.getKey('return')) {
            this.exit();  
        }
    },
});


/*
 * gameoverシーンの定義
 */
phina.define("GameOverScene", {
    // 継承
    superClass: 'DisplayScene',
    // 初期化
    init: function() {
        // 親クラス初期化
        this.superInit();
        // 背景色
        this.backgroundColor = 'olive';
        // ラベル
        Label({
            text: 'G A M E   O V E R',
            fontSize: 60,
            fill: 'purple',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() - 70);
        Label({
            text: maze_count+"つの迷路をクリアしました．",
            fontSize: 35,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() +50);
        Label({
            text: comment_list[getRandomInt(comment_list.length)],
            fontSize: 25,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() + 55 + 45*2);

        Label({
            text: 'リスタート',
            fontSize: 48,
            fill: 'white',
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center() + 250);
        // カウントの初期化
        maze_count = 0;

    },
    // タッチで次のシーンへ
    onpointstart: function() {
        this.exit();  
    },
    update: function(app) {
        // エンターで次のシーンへ
        var key = app.keyboard;
        if (key.getKey('return')) {
            this.exit();  
        }
    },


});



