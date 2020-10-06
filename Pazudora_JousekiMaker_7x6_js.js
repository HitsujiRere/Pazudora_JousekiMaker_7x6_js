
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

// 選択しているボタン
const buttonTexts = ['random', 'deploy', 'play']
let selectedButton = 0;

function preload() {
    // ドロップの画像読込み
    for (let i = 0; i < dropCount; ++i) {
        print('images/drop_' + i + '.png');
        dropImages[i] = loadImage('images/drop_' + i + '.png');
        //dropImages[i].resize(dropDisplaySize, dropDisplaySize);
    }
}

function setup() {
    createCanvas(dropDisplaySize * 7, dropDisplaySize * 8);

    textAlign(CENTER, CENTER);
    imageMode(CENTER);

    randomizeBoard();
}

function draw() {
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

    // ドロップ
    for (let y = 0; y < boardHeight; ++y) {
        for (let x = 0; x < boardWidth; ++x) {
            image(dropImages[board[y][x]],
                dropDisplaySize * (x + 0.5), dropDisplaySize * (y + 0.5),
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

        if (i === selectedButton && i === 0) {
            for (let i = 0; i < dropCount; ++i) {
                image(dropImages[i],
                    dropDisplaySize * (i + 0.5), dropDisplaySize * (boardHeight + 1.5),
                    dropDisplaySize, dropDisplaySize);
            }
        }
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
