

const CLICK_INTERVAL = 10;

$(function () {
    var player = {}
    var size = 0;
    var map = [];
    var pre_move = '';
    var finish = false;

    $('#create').on('click', function () {
        player = { row: 1, clm: 1 };
        finish = false;
        size = Number($('#size').val()) + 1;
        map = makeLoad(size);
        displayLoad(size, map, player);
        showBtn();
    });

    $('.move').on('click', function () {
        const btn = this.id;
        player = movePlayer_btn(map, player, btn);
        displayLoad(size, map, player);
        judgeGoal(player, size);
    });

    $('html').keyup(function (e) {
        const key = e.which;
        if (key === 37 || key === 38 || key === 39 || key === 40) {
            player = movePlayer_key(map, player, key);
            displayLoad(size, map, player);
            judgeGoal(player, size);
        }
    });

    // $('#check').on('click', function () {

    // });

    $('#btn_auto').on('click', function () {
        auto();
    });

    function auto() {
        if (!finish) {
            const parm = movePlayer_auto(map, player, pre_move, btn);
            player = parm.player;
            pre_move = parm.pre_move;
            displayLoad(size, map, player);
            finish = judgeGoal(player, size);
        }
        setTimeout(function () { auto() }, CLICK_INTERVAL);
    }
});

function judgeGoal(player, size) {
    if (player.row === size - 2 && player.clm === size - 2) {
        console.log('GameClear');
        return true;
    };
    return false;
}

function movePlayer_auto(map, player, pre_move, btn) {
    var move = '';
    const movelist = checkDirection(map, player, pre_move);
    if (movelist.length !== 1) {
        switch (pre_move) {
            case 'up':
                for (var i = 0; i < movelist.length; i++) {
                    if (movelist[i] === 'right') {
                        move = 'right';
                        break;
                    }
                }
                if (move !== '') {
                    break;
                }
                for (var i = 0; i < movelist.length; i++) {
                    if (movelist[i] === 'up') {
                        move = 'up';
                        break;
                    }
                }
                break;
            case 'right':
                for (var i = 0; i < movelist.length; i++) {
                    if (movelist[i] === 'down') {
                        move = 'down';
                        break;
                    }
                }
                if (move !== '') {
                    break;
                }
                for (var i = 0; i < movelist.length; i++) {
                    if (movelist[i] === 'right') {
                        move = 'right';
                        break;
                    }
                }
                break;
            case 'down':
                for (var i = 0; i < movelist.length; i++) {
                    if (movelist[i] === 'left') {
                        move = 'left';
                        break;
                    }
                }
                if (move !== '') {
                    break;
                }
                for (var i = 0; i < movelist.length; i++) {
                    if (movelist[i] === 'down') {
                        move = 'down';
                        break;
                    }
                }

                break;
            case 'left':
                for (var i = 0; i < movelist.length; i++) {
                    if (movelist[i] === 'up') {
                        move = 'up';
                        break;
                    }
                }
                if (move !== '') {
                    break;
                }
                for (var i = 0; i < movelist.length; i++) {
                    if (movelist[i] === 'left') {
                        move = 'left';
                        break;
                    }
                }
                break;
            default:
            move = movelist[0];
        }
    } else {
        move = movelist[0];
    }
    switch (move) {
        case 'up':
            player.row = player.row - 1;
            break;
        case 'right':
            player.clm = player.clm + 1;
            break;
        case 'down':
            player.row = player.row + 1;
            break;
        case 'left':
            player.clm = player.clm - 1;
            break;
        default:
            console.log('Error btn= ' + btn);
    }
    const parm = { "player": player, "pre_move": move }
    return parm;
};

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
        switch (pre_move) {
            case 'up':
                movelist.push('down');
                break;
            case 'right':
                movelist.push('left');
                break;
            case 'down':
                movelist.push('up');
                break;
            case 'left':
                movelist.push('right');
                break;
            default:
                console.log('Error btn= ' + btn);
        }
    }
    return movelist;
}


function movePlayer_btn(map, player, btn) {
    switch (btn) {
        case 'up':
            if (map[player.row - 1][player.clm] === 0) {
                player.row = player.row - 1;
            }
            break;
        case 'left':
            if (map[player.row][player.clm - 1] === 0) {
                player.clm = player.clm - 1;
            }
            break;
        case 'right':
            if (map[player.row][player.clm + 1] === 0) {
                player.clm = player.clm + 1;
            } break;
        case 'down':
            if (map[player.row + 1][player.clm] === 0) {
                player.row = player.row + 1;
            } break;
        default:
            console.log('error btn= ' + btn);
    }
    return player;
};

function movePlayer_key(map, player, key) {
    switch (key) {
        case 38: // Key[↑]
            if (map[player.row - 1][player.clm] === 0) {
                player.row = player.row - 1;
            }
            break;
        case 37: // Key[←]
            if (map[player.row][player.clm - 1] === 0) {
                player.clm = player.clm - 1;
            }
            break;
        case 39: // Key[→]
            if (map[player.row][player.clm + 1] === 0) {
                player.clm = player.clm + 1;
            }
            break;
        case 40: // Key[↓]
            if (map[player.row + 1][player.clm] === 0) {
                player.row = player.row + 1;
            }
            break;
        default:
            console.log('値がおかしい key= ' + key);
    }
    return player;
};

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
        'height': size * 10 + 'px',
        'width': (size * 10) + 'px'
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


function displayLoad(size, map, player) {
    $('#meiro').empty();
    var str = "";
    for (var i = 0; i < size; i++) {
        const line = map[i];
        const length = line.length;
        for (var n = 0; n < length; n++) {
            if (line[n] === 1) {
                str += '<div class="w">';
            } else if (i === 1 && n === 1) { //startポジション
                str += '<div class="p s">';
            } else if (i + 2 === size && n + 2 === length) { //endポジション
                str += '<div class="p e">';
            } else {
                str += '<div class="p">';
            }
            //playerがいる場所
            if (i === player.row && n === player.clm) {
                str += '◎'
            }
            str += '</div>';
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