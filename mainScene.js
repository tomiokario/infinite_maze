/*
 * メインシーンの定義
 */
phina.define("MainScene", {
    superClass: 'DisplayScene',

    // 初期化
    init: function() {
        this.finish_frame = -1;
        this.superInit(); //初期化のおまじない

        this.backgroundColor = 'silver'; // 背景色

        // グループを生成
        this.wallGroup = DisplayElement().addChildTo(this);
        this.enemyGroup = DisplayElement().addChildTo(this);

        // ブロック数
        var x_wall_num = Math.floor(DISPLAY_WIDTH  / WALL_SIZE);
        var y_wall_num = Math.floor(DISPLAY_HEIGHT / WALL_SIZE);
        // 外側のフレーム幅
        var frame_size_x = WALL_SIZE/2;
        var frame_size_y = WALL_SIZE/2;
        // 奇数にする
        if(x_wall_num%2==0){
            x_wall_num--;
            frame_size_x = WALL_SIZE;
        }
        if(y_wall_num%2==0){
            y_wall_num--;
            frame_size_y = WALL_SIZE;
        }

        // 迷路生成
        createMaze(x_wall_num,  y_wall_num);

        for(var i=0; i<x_wall_num; i++){
            for(var j=0; j<y_wall_num; j++){
                if(maze[j][i] == "wall"){
                    var tempRec = Wall({}); //tempRecに四角を一旦代入し、初期値を設定する
                    tempRec.x = frame_size_x + (i * WALL_SIZE); //表示位置(x座標)
                    tempRec.y = frame_size_y + (j * WALL_SIZE); //表示位置(y座標)
                    tempRec.addChildTo(this.wallGroup); //グループに追加する
                }
            }
        }


        // スタート地点生成
        this.start = Point().addChildTo(this);
        this.start.x = frame_size_x + WALL_SIZE;
        this.start.y = frame_size_y + WALL_SIZE;

        // ゴール地点生成
        this.goal = Point().addChildTo(this);
        this.goal.x = DISPLAY_WIDTH - frame_size_x - WALL_SIZE;
        this.goal.y = DISPLAY_HEIGHT - frame_size_y - WALL_SIZE;

        // 自機生成
        this.hero = Hero().addChildTo(this);
        this.hero.x = frame_size_x + WALL_SIZE;
        this.hero.y = frame_size_y + WALL_SIZE;

        // 敵の生成
        var tempEnemy = Enemy({}); //一時的なオブジェクトに一旦代入し，初期値設定
        tempEnemy.x = this.goal.x;
        tempEnemy.y = this.goal.y;
        tempEnemy.addChildTo(this.enemyGroup); //グループに追加する


    },


    // アップデート
    update: function(app) {
        // 敵を生成
        var enemy_timer = 8;   // 敵を5sに一回生成
        var enemy_num   = 1 + getRandomInt((maze_count - 1) / 5);    // 一度に生まれる敵の数
        // 分裂1s前に警告する
        if (app.frame % (ONE_SECOND_FPS * enemy_timer ) == (ONE_SECOND_FPS * (enemy_timer - 1))) {
            this.enemyGroup.children.first.shadow = "red";
            this.enemyGroup.children.first.speed_x = this.enemyGroup.children.first.speed_x / 2;
            this.enemyGroup.children.first.speed_y = this.enemyGroup.children.first.speed_y / 2;
        }
        // 定期的に分裂する
        if (app.frame % (ONE_SECOND_FPS * enemy_timer ) == 0) {
            this.enemyGroup.children.first.shadow = "white";
            this.enemyGroup.children.first.speed_x = this.enemyGroup.children.first.speed_x * 2;
            this.enemyGroup.children.first.speed_y = this.enemyGroup.children.first.speed_y * 2;
            for(var i=0; i< enemy_num; i++){
                var tempEnemy = Enemy({}); //一時的なオブジェクトに一旦代入し，初期値設定
                tempEnemy.x=this.enemyGroup.children.first.x;
                tempEnemy.y=this.enemyGroup.children.first.y;
                tempEnemy.addChildTo(this.enemyGroup); //グループに追加する
            }
        }


        // 自機移動

        // キーボード
        var speed = 10;
        var key = app.keyboard;
        // shiftを押すと加速
        if(key.getKey('shift')){
            speed = 17;
        }

        // 移動
        if (key.getKey('left') || key.getKey('a')) {
            this.hero.x -= speed; 
            if(this.hitTestWallHero()){
                this.hero.x += speed; 
            }
        }
        if (key.getKey('right') || key.getKey('d')) { 
            this.hero.x += speed; 
            if(this.hitTestWallHero()){
                this.hero.x -= speed; 
            }
        }
        if (key.getKey('up') || key.getKey('w')) { 
            this.hero.y -= speed; 
            if(this.hitTestWallHero()){
                this.hero.y += speed; 
            }
        }
        if (key.getKey('down') || key.getKey('s')) { 
            this.hero.y += speed; 
            if(this.hitTestWallHero()){
                this.hero.y -= speed; 
            }
        }

        // タッチ保持
        var speed = 20;
        this.onpointstay = function(e) {
            // down
            if(this.hero.y > e.pointer.y){
                this.hero.y -= speed; 
                if(this.hitTestWallHero()){
                    this.hero.y += speed; 
                }
            }
            // up
            if(this.hero.y < e.pointer.y){
                this.hero.y += speed; 
                if(this.hitTestWallHero()){
                    this.hero.y -= speed; 
                }
            }
            // right
            if(this.hero.x < e.pointer.x){
                this.hero.x += speed; 
                if(this.hitTestWallHero()){
                    this.hero.x -= speed; 
                }
            }
            // left
            if(this.hero.x > e.pointer.x){
                this.hero.x -= speed; 
                if(this.hitTestWallHero()){
                    this.hero.x += speed; 
                }
            }
        };

        // ゲームオーバ-判定
        if(this.hitEnemy()){
            this.hero.x = -100;
            this.hero.y = -100;
            this.finish_frame = app.frame + ONE_SECOND_FPS;
        }
        if(app.frame == this.finish_frame){
            this.hero.remove();
            this.exit("gameover");
        }

        // ゴール判定
        if (this.hero.hitTestElement(this.goal)){
            maze_count++;
            this.exit();  
        }

    },


    // プレイヤーと壁の当たり判定
    hitTestWallHero: function(){
        var hero = this.hero;
        var self = this;
        var onWall = false;
        // 壁をループ
        this.wallGroup.children.each(function(wall){
            if(wall.hitTestElement(hero)){
                onWall = true;
            }
        });
        return onWall;
    },

    // プレイヤーと敵の当たり判定
    hitEnemy: function(){
        var hero = this.hero;
        var self = this;
        var hitEnemy = false;
        // 壁をループ
        this.enemyGroup.children.each(function(enemy){
            if(enemy.hitTestElement(hero)){
                hitEnemy = true;
                enemy.shadow = "red";
                enemy.radius = WALL_SIZE * 7 / 10;
                enemy.speed_x = enemy.speed_x / 2;
                enemy.speed_y = enemy.speed_y / 2;
            }
        });
        return hitEnemy;
    },

});



