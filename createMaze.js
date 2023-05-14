
/* 穴掘り方による迷路配列生成
 * 通路=0; 壁=1
 *
 * Cf.https://algoful.com/Archive/Algorithm/MazeDig 
 */
function createMaze(width, height){
    // 配列の定義と初期化(全て壁で埋める)
    var x, y;
    maze = new Array(width);
    for(y = 0; y < height; y++) {
        maze[y] = new Array(height);
        for(x = 0; x < width; x++) {
            maze[y][x] = "wall";
        }
    }

    // 迷路の外周を通路とする
    for(x=0; x<width;x++){
        maze[0][x] = "path";         // 上端
        maze[height-1][x] = "path";  // 下端
    }
    for(y=0; y<height;y++){
        maze[y][0] = "path";         // 右
        maze[y][width-1] = "path";   // 左
    }

    // 穴掘り開始座標(x,y共に奇数となる任意の座標)を指定
    var start_x = 1;
    var start_y = 1;

    // 穴掘り
    dig(start_y, start_x);
    // 外周を壁に戻す
    // 迷路の外周を通路とする
    for(x=0; x<width;x++){
        maze[0][x] = "wall";         // 上端
        maze[height-1][x] = "wall";  // 下端
    }
    for(y=0; y<height;y++){
        maze[y][0] = "wall";         // 右
        maze[y][width-1] = "wall";   // 左
    }

}


function dig(y, x){
    // 掘り進められる場合は，掘り進める
    while(true){

        // 掘り進めることができる方向のリストを作成
        var direction_list = new Array();
        if(maze[y-1][x]=="wall" && maze[y-2][x]=="wall"){
            direction_list.push("up");
        }
        if(maze[y+1][x]=="wall" && maze[y+2][x]=="wall"){
            direction_list.push("down");
        }
        if(maze[y][x+1]=="wall" && maze[y][x+2]=="wall"){
            direction_list.push("right");
        }
        if(maze[y][x-1]=="wall" && maze[y][x-2]=="wall"){
            direction_list.push("left");
        }
        // 掘り進められない場合，ループを抜ける
        if (direction_list.length==0)
            break;
        // 指定座標を通路にする
        setPath(x,y);

        // 次に進む方向をランダムで決める
        var direction_num = getRandomInt(direction_list.length);
        // 2セル先まで通路にする
        switch(direction_list[direction_num]){
            case "up":
                setPath(x, --y);
                setPath(x, --y);
                break;
            case "down":
                setPath(x, ++y);
                setPath(x, ++y);

                break;
            case "right":
                setPath(++x, y);
                setPath(++x, y);

                break;
            case "left":
                setPath(--x, y);
                setPath(--x, y);
                break;
        }
    }
    // 四方どこにも進めなくなった場合
    // すでに通路となった座標をランダムに取得し，掘り直し
    if (start_points_x.length != 0){
        // ランダムにスタート地点を決定
        var random = getRandomInt(start_points_x.length);
        // 配列から要素を抜き出して，10進数でintに変換
        var restart_x = parseInt(start_points_x.splice(random,1),10);   
        var restart_y = parseInt(start_points_y.splice(random,1),10);
        dig(restart_y, restart_x);
    }
}


// 座標を通路(0)とする
function setPath(x,y){
    maze[y][x]="path"; 
    if(x%2 == 1 && y%2 ==1) // 奇数座標の場合は，dig開始座標候補に追加
    {
        start_points_x.push(x);
        start_points_y.push(y);
    }
}

