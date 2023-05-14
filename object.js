

/*
 * ブロックの定義
 */
phina.define('Wall', {
    superClass: 'RectangleShape',


    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.fill = 'maroon'; // 四角の塗りつぶし色
        this.stroke = 'black'; // 四角のふちの色

        this.width = WALL_SIZE -5 ; //四角の縦幅
        this.height = WALL_SIZE -5 ; //四角の横幅

    },


    // アップデート
    update: function(app) {

    },
});




/*
 * 自機の定義
 */
phina.define('Hero', {
    superClass: 'RectangleShape',


    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.fill = 'black'; // 四角の塗りつぶし色
        this.stroke = 'blue'; // 四角のふちの色

        this.width = WALL_SIZE / 2 - 3; //四角の縦幅
        this.height = WALL_SIZE /2 - 3; //四角の横幅
        
    },


    // アップデート
    update: function(app) {
    },

});



/*
 * ポイントの定義
 */
phina.define('Point', {
    superClass: 'RectangleShape',


    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.fill = 'teal'; // 四角の塗りつぶし色
        this.stroke = 'yellow'; // 四角のふちの色

        this.width = WALL_SIZE / 2; //四角の縦幅
        this.height = WALL_SIZE /2; //四角の横幅
        
    },


    // アップデート
    update: function(app) {
    },

});



/*
 * 敵キャラの定義
 */
phina.define('Enemy', {
    superClass: 'CircleShape',


    //初期化
    init: function(options) {
        this.superInit(); //初期化のおまじない

        this.radius = WALL_SIZE * 3 / 5; // 半径

        this.fill = 'aqua';     // 塗りつぶし色
        this.stroke = 'purple'; // ふちの色
        this.shadow = 'white';    // 影
        this.shadowBlur = WALL_SIZE;



        //オブジェクトをクリックできるようにする
        this.setInteractive(true); //四角をクリック可能に
        this.onpointstart = () => { //クリックが始まった瞬間の処理
            // this.remove(); //自身を削除
            this.speed_x=0;
            this.speed_y=0;
        };
        this.x = getRandomInt(DISPLAY_WIDTH);
        this.y = getRandomInt(DISPLAY_HEIGHT);
        this.down_flag = Boolean("true");
        this.right_flag = Boolean("true");
        if(maze_count < 10){
            this.speed_x = getRandomInt(5) + 1;
            this.speed_y = getRandomInt(5) + 1;
        }
        else{
            this.speed_x = getRandomInt(maze_count/2) + 1;
            this.speed_y = getRandomInt(maze_count/2) + 1;
        }
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
        }
        else{
            this.y -= this.speed_y;
        }

        if(this.y < 0){
            this.down_flag = 1;
        }

        if(this.y > DISPLAY_HEIGHT){
            this.down_flag = 0;
        }

    },
});



