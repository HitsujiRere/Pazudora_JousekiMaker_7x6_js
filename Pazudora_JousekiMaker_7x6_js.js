
// マウスが前フレーム時押していたか
let pmouseIsPressed = false;

// ドロップの表示サイズ
const dropDisplaySize = 64;
// ドロップの種類数
const dropCount = 6;
// ドロップの画像
const dropImages = new Array(dropCount);

// ボードのサイズ
const boardHeight = 6;
const boardWidth = 7;
// ボード
const board = Array.from(new Array(boardHeight),
    () => new Array(boardWidth));

// ドロップを押しているかどうか
let dropIsPressed = false;
// 押しているドロップの座標
let pressedDropY = 0;
let pressedDropX = 0;

// ボタンの表示テキスト
const buttonTexts = ['random', 'deploy', 'play']
// 選択しているボタン
let selectedButton = 2;

// 配置するドロップ
let deployDrop = 0;

// ドロップを動かしたかどうか
let dropIsMoved = false;

// 消しているかどうか
let isJudging = false;
// 消すボード
const boardErace = Array.from(new Array(boardHeight),
    () => new Array(boardWidth).fill(0));

function preload() {

    // ドロップの画像読込み
    for (let i = 0; i < dropCount; ++i) {
        dropImages[i] = loadImage('images/drop_' + i + '.png');
        //dropImages[i].resize(dropDisplaySize, dropDisplaySize);
    }
}

function setup() {
    createCanvas(dropDisplaySize * boardWidth,
        dropDisplaySize * (boardHeight + 2));

    textAlign(CENTER, CENTER);
    imageMode(CENTER);

    randomizeBoard();
}

function draw() {
    update();

    display();
}

function update() {

    if (isJudging) {

        judgeBoard()
    } else {

        dropUpdate();

        buttonUpdate();
    }

    pmouseIsPressed = mouseIsPressed;
}

function dropUpdate() {
    // ドロップ
    if (mouseIsPressed) {

        // 現在押しているドロップ
        let pressedDropYNow = -1;
        let pressedDropXNow = -1;

        // 現在どのドロップを押しているか判定する
        for (let y = 0; y < boardHeight; ++y) {
            for (let x = 0; x < boardWidth; ++x) {
                if (dist(mouseX, mouseY, dropDisplaySize * (x + 0.5), dropDisplaySize * (y + 0.5)) <= dropDisplaySize / 2) {
                    pressedDropYNow = y;
                    pressedDropXNow = x;
                }
            }
        }

        if (pressedDropYNow !== -1 && pressedDropYNow !== -1) {

            if (selectedButton === 1) {
                board[pressedDropYNow][pressedDropXNow] = deployDrop;
            }

            if (selectedButton === 2) {
                if (dropIsPressed && (pressedDropY !== pressedDropYNow || pressedDropX !== pressedDropXNow)) {
                    // 交換する
                    let tmp = board[pressedDropY][pressedDropX];
                    board[pressedDropY][pressedDropX] =
                        board[pressedDropYNow][pressedDropXNow];
                    board[pressedDropYNow][pressedDropXNow] = tmp;

                    pressedDropY = pressedDropYNow;
                    pressedDropX = pressedDropXNow;

                    dropIsMoved = true;
                } else {
                    dropIsPressed = true;
                    pressedDropY = pressedDropYNow;
                    pressedDropX = pressedDropXNow;
                }
            }
        }
    } else {
        if (dropIsPressed && dropIsMoved) {
            if (selectedButton === 2) {
                isJudging = true;
            }

            dropIsMoved = false;
        }

        dropIsPressed = false;
        pressedDropY = -1;
        pressedDropX = -1;
    }
}

// ボタンの更新
function buttonUpdate() {
    if (mouseIsPressed && !pmouseIsPressed) {

        // 今押しているボタン
        let pressedButtonNow = -1;

        for (let i = 0; i < 3; ++i) {
            if (width / 3 * i <= mouseX &&
                mouseX < width / 3 * (i + 1) &&
                dropDisplaySize * boardHeight <= mouseY &&
                mouseY < dropDisplaySize * (boardHeight + 1)) {
                pressedButtonNow = i;
            }
        }

        if (pressedButtonNow !== -1) {
            selectedButton = pressedButtonNow;

            if (selectedButton === 0) {
                randomizeBoard();
            }
        }
    }

    deploySelectUpdate();
}

// 配置の選択ドロップのアップデート
function deploySelectUpdate() {
    // 配置
    if (mouseIsPressed && selectedButton === 1) {

        // 今押しているボタン
        let pressedButtonNow = -1;

        for (let i = 0; i < dropCount; ++i) {
            if (dropDisplaySize * (i) <= mouseX &&
                mouseX < dropDisplaySize * (i + 1) &&
                dropDisplaySize * (boardHeight + 1) <= mouseY &&
                mouseY < dropDisplaySize * (boardHeight + 2)) {
                pressedButtonNow = i;
            }
        }

        if (pressedButtonNow !== -1) {
            deployDrop = pressedButtonNow;
        }
    }
}

function display() {

    background(40, 25, 20);

    // 背景
    noStroke();
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            if ((x + y) % 2 === 0) {
                fill(54, 32, 33);
            } else {
                fill(91, 49, 30);
            }
            rect(dropDisplaySize * x, dropDisplaySize * y,
                dropDisplaySize, dropDisplaySize);
        }
    }

    // ボタン
    for (let i = 0; i < 3; ++i) {

        // ボタン
        if (i === selectedButton) {
            fill(68, 157, 132);
            rect(width / 3 * i, dropDisplaySize * boardHeight,
                width / 3, dropDisplaySize, 10);
        }

        // 文字
        if (i === selectedButton) {
            fill(0);
        } else {
            fill(255);
        }
        textSize(20);
        text(buttonTexts[i],
            width / 3 * (i + 0.5), dropDisplaySize * (boardHeight + 0.5));

        // 編集ドロップ
        if (i === selectedButton && i === 1) {
            for (let i = 0; i < dropCount; ++i) {
                if (i !== deployDrop) {
                    tint(128);
                }
                image(dropImages[i],
                    dropDisplaySize * (i + 0.5),
                    dropDisplaySize * (boardHeight + 1.5),
                    dropDisplaySize, dropDisplaySize);
                noTint();
            }
        }
    }

    // ドロップ
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            if (y !== pressedDropY || x !== pressedDropX) {
                image(dropImages[board[y][x]],
                    dropDisplaySize * (x + 0.5),
                    dropDisplaySize * (y + 0.5),
                    dropDisplaySize, dropDisplaySize);
            }
        }
    }

    // 押しているドロップを拡大表示
    if (dropIsPressed) {
        image(dropImages[board[pressedDropY][pressedDropX]],
            mouseX, mouseY,
            dropDisplaySize * 1.3, dropDisplaySize * 1.3);
    }
}

// ボードをランダム化
function randomizeBoard() {
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            board[y][x] = Math.floor(Math.random() * dropCount);
        }
    }
}

// ボードを判定する
function judgeBoard() {
    isJudging = false;
    return;

    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
        }
    }
}
