

const CLICK_INTERVAL = 10;

$(function () {
    var players = [];
    var size = 0;
    var map = [];
    var finish = false;
    var auto = false;
    var player_name = [];
    var rows = [];
    var clms = [];

    $('#create').on('click', function () {
        players = [];
        rows = [1];
        clms = [1];
        var new_rows = JSON.stringify(rows);
        var new_clms = JSON.stringify(clms);
        var player = { name: '', pre_move: '', row: 1, clm: 1, rows: new_rows, clms: new_clms };
        player.name = 'player1';
        players.push(player);
        finish = false;
        size = Number($('#size').val()) + 1;
        map = makeLoad(size);
        displayLoad(size, map, players);
        showBtn();
    });

    $('#check').on('click', function () {
        if (!finish) {
            var new_players = createAvatar();
            displayLoad(size, map, new_players);
            for (var i = 0; i < new_players.length; i++) {
                var new_player = new_players[i];
                finish = judgeGoal(new_player, size, map);
            }
        }
    });

    $('#auto').on('click', function () {
        auto = true;
        if (auto) {
            searchGoal();
        }
    });

    function searchGoal() {
        if (!finish) {
            var new_players = createAvatar();
            displayLoad(size, map, new_players);
            for (var i = 0; i < new_players.length; i++) {
                var new_player = new_players[i];
                // result = judgeGoal(new_player, size);
                finish = judgeGoal(new_player, size, map);
                if(finish === true){
                    break;
                }
            }
        }
        if (auto) {
            setTimeout(searchGoal , CLICK_INTERVAL);
        }
    }

    function createAvatar() {
        const new_players = [];
        for (var i = 0; i < players.length; i++) {
            const player = players[i];
            const movelist = checkDirection(map, player, player.pre_move);
            for (var n = 0; n < movelist.length; n++) {
                var new_player = { ...player };
                move = movelist[n];
                var new_rows = [];
                var new_clms = [];
                new_player = movePlayer(map, new_player, move);
                new_rows = JSON.parse(new_player.rows);
                new_clms = JSON.parse(new_player.clms);
                new_rows.push(new_player.row);
                new_clms.push(new_player.clm);
                new_player.rows = JSON.stringify(new_rows);
                new_player.clms = JSON.stringify(new_clms);
                new_players.push(new_player);
                new_player.name = 'player' + i;
            };
        }
        players = new_players;
        return new_players;
    }
});

function movePlayer(map, new_player, move) {
    switch (move) {
        case 'up':
            if (map[new_player.row - 1][new_player.clm] === 0) {
                new_player.row = new_player.row - 1;
            }
            break;
        case 'left':
            if (map[new_player.row][new_player.clm - 1] === 0) {
                new_player.clm = new_player.clm - 1;
            }
            break;
        case 'right':
            if (map[new_player.row][new_player.clm + 1] === 0) {
                new_player.clm = new_player.clm + 1;
            } break;
        case 'down':
            if (map[new_player.row + 1][new_player.clm] === 0) {
                new_player.row = new_player.row + 1;
            } break;
        default:
            console.log('error move= ' + move);
    }
    new_player.pre_move = move;
    return new_player;
};

function judgeGoal(player, size, map) {
    if (player.row === size - 2 && player.clm === size - 2) {
        console.log('GameClear');
        console.log(player);
        displayLoadtoGoal(player, size, map);
        return true;
    };
    return false;
}

function checkDirection(map, player, pre_move) {
    const movelist = [];
    if (map[player.row - 1][player.clm] === 0 && pre_move !== 'down') {
        movelist.push('up')
    }
    if (map[player.row][player.clm - 1] === 0 && pre_move !== 'right') {
        movelist.push('left')
    }
    if (map[player.row][player.clm + 1] === 0 && pre_move !== 'left') {
        movelist.push('right')
    }
    if (map[player.row + 1][player.clm] === 0 && pre_move !== 'up') {
        movelist.push('down')
    }
    if (movelist.length === 0) {
        // console.log('delete');
    }
    return movelist;
}


function showBtn() {
    $('#btn').css({ display: 'inline-block' });
    $('#btn_auto').css({ display: 'inline-block' });
}

function makeLoad(size) {
    if (size <= 10) {
        alert("10以上を入力してください");
        return;
    }
    $('#meiro').css({
        'height': size * 20 + 'px',
        'width': (size * 20) + 'px'
    });

    const map = [];
    for (var i = 0; i < size; i++) {
        const line = [];
        for (var n = 0; n < size; n++) {
            if (i === 0 || i === size - 1 || n === 0
                || n === size - 1 || n % 2 === 0 && i % 2 === 0) {
                line.push(1); //1が壁
            } else {
                line.push(0); //0が道    
            }
        }
        map.push(line);
    };
    // return map;

    //これ以降は棒倒し処理
    for (var r = 0; r < size; r++) { //rは行数
        if (r === 0 || (r + 1) === size) {
            continue;
        }
        if (r % 2 === 1) {
            continue;
        }

        const line = map[r];

        // 最初の行のみ、上下左右倒してOK（重なるのはNG）
        var direction = ['top', 'bottom', 'left', 'right'];
        if (r >= 4) {
            direction = direction.slice(1); //topを削除
        }
        for (var i = 0; i < line.length; i++) { //iは列数
            // 端っこは対象外
            if (i === 0 || (i + 1) === line.length || i % 2 === 1) {
                continue;
            }

            direction = shuffleList(direction);

            for (var j = 0; j < direction.length; j++) {
                if (direction[j] === "top") {
                    if (map[r - 1][i] === 0) {
                        map[r - 1][i] = 1;
                        break;
                    }
                }
                if (direction[j] === "left") {
                    if (map[r][i - 1] === 0) {
                        map[r][i - 1] = 1;
                        break;
                    }
                }
                if (direction[j] === "right") {
                    if (map[r][i + 1] === 0) {
                        map[r][i + 1] = 1;
                        break;
                    }
                }
                if (direction[j] === "bottom") {
                    if (map[r + 1][i] === 0) {
                        map[r + 1][i] = 1;
                        break;
                    }
                }
            }
        }
    }
    return map;
}

function displayLoadtoGoal(player, size, map) {
    var track_rows = [];
    var track_clms = [];
    track_rows = JSON.parse(player.rows);
    track_clms = JSON.parse(player.clms);
    var goal_player = {};
    const goal_players = [];
    for (var i = 0; i < track_rows.length; i++) {
        goal_player = {row:track_rows[i],clm:track_clms[i]};
        goal_players.push(goal_player);
    }
    displayLoad(size, map, goal_players);
}

function displayLoad(size, map, players) {
    $('#meiro').empty();
    var str = "";
    for (var i = 0; i < size; i++) {
        const line = map[i];
        const length = line.length;
        for (var n = 0; n < length; n++) {
            if (line[n] === 1) {
                str += '<div class="w"';
            } else if (i === 1 && n === 1) { //startポジション
                str += '<div class="p s"';
            } else if (i + 2 === size && n + 2 === length) { //endポジション
                str += '<div class="p e"';
            } else {
                str += '<div class="p"';
            }
            //playerがいる場所
            for (var j = 0; j < players.length; j++) {
                var player = players[j];
                if (i === player.row && n === player.clm) {
                    str += ' style="background-color:yellow" '
                }
            }
            str += '></div>';
        }
        $('#meiro').append(str);
        str = "";
    }
}

function shuffleList(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var r = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[r];
        array[r] = tmp;
    }
    return array;
};
