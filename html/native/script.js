
var boardEl = document.getElementById("board");
var mineCountEl = document.getElementById("mineCount");
var timerEl = document.getElementById("timer");
var difficultyEl = document.getElementById("difficulty");
var rowsEl = document.getElementById("rows");
var colsEl = document.getElementById("cols");
var minesEl = document.getElementById("mines");
var restartBtn = document.getElementById("restartBtn");

var modal = document.getElementById("modal");
var modalTitle = document.getElementById("modalTitle");
var modalMessage = document.getElementById("modalMessage");
var modalBtn = document.getElementById("modalBtn");
var modalContent = document.querySelector(".modal-content");


// 游戏数据

var rows = 9;
var cols = 9;
var mines = 10;

// map 就是整个棋盘
// 每个格子都是一个对象
var map = [];

var over = false;     // 游戏是否结束
var begin = false;    // 是否已经开始计时
var openNum = 0;      // 已经翻开的安全格子
var flagNum = 0;      // 已经插旗的数量
var time = 0;         // 计时器数字
var timerId = null;   // 定时器

// 难度

var diffMap = {
  beginner: {
    rows: 9,
    cols: 9,
    mines: 10
  },
  intermediate: {
    rows: 16,
    cols: 16,
    mines: 40
  },
  advanced: {
    rows: 16,
    cols: 30,
    mines: 99
  }
};

// 页面初始化

function init() {
  bind();
  newGame();
}

function bind() {
  // 切换难度
  difficultyEl.addEventListener("change", function () {
    if (difficultyEl.value !== "custom") {
      newGame();
    }
  });

  // 手动改参数时，切成自定义
  rowsEl.addEventListener("change", function () {
    difficultyEl.value = "custom";
  });

  colsEl.addEventListener("change", function () {
    difficultyEl.value = "custom";
  });

  minesEl.addEventListener("change", function () {
    difficultyEl.value = "custom";
  });

  // 重新开始
  restartBtn.addEventListener("click", function () {
    newGame();
  });

  // 弹窗按钮
  modalBtn.addEventListener("click", function () {
    hideModal();
    newGame();
  });
}

// 开始新游戏

function newGame() {
  // 清掉旧计时器
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  // 先根据难度读取值
  readSetting();

  // 限制一下范围
  rows = limit(parseInt(rowsEl.value, 10), 5, 30);
  cols = limit(parseInt(colsEl.value, 10), 5, 40);
  mines = limit(parseInt(minesEl.value, 10), 1, rows * cols - 1);

  // 写回输入框
  rowsEl.value = rows;
  colsEl.value = cols;
  minesEl.value = mines;

  // 重置状态
  map = [];
  over = false;
  begin = false;
  openNum = 0;
  flagNum = 0;
  time = 0;
  timerEl.textContent = "0";
  mineCountEl.textContent = mines;

  hideModal();

  // 创建地图并渲染
  makeMap();
  drawMap();
}

// 读取难度

function readSetting() {
  var d = difficultyEl.value;

  if (diffMap[d]) {
    rows = diffMap[d].rows;
    cols = diffMap[d].cols;
    mines = diffMap[d].mines;

    rowsEl.value = rows;
    colsEl.value = cols;
    minesEl.value = mines;
  } else {
    rows = parseInt(rowsEl.value, 10);
    cols = parseInt(colsEl.value, 10);
    mines = parseInt(minesEl.value, 10);
  }
}
// 创建棋盘数据

function makeMap() {
  var x, y;
  for (x = 0; x < rows; x++) {
    map[x] = [];
    for (y = 0; y < cols; y++) {
      map[x][y] = {
        mine: false,  
        open: false,   
        flag: false,   
        num: 0         
      };
    }
  }

  var put = 0;
  while (put < mines) {
    x = Math.floor(Math.random() * rows);
    y = Math.floor(Math.random() * cols);
    if (!map[x][y].mine) {  map[x][y].mine = true;
    put++;  
  
  for (x = 0; x < rows; x++) {
    for (y = 0; y < cols; y++) {
      if (!map[x][y].mine) {
        map[x][y].num = getNum(x, y);
      }
    }
  }
  
  }
  }
function getNum(x, y) {
  var num = 0; var i, j;
  for (i = -1; i <= 1; i++) {
    for (j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {   continue; }
      var nx = x + i;
      var ny = y + j;
      if (inMap(nx, ny) && map[nx][ny].mine) {
        num++;
      }
       }
  }
  return num;
}
  for (x = 0; x < rows; x++) {
 for (y = 0; y < cols; y++) {
      if (!map[x][y].mine) { map[x][y].num = getNum(x, y);
  }
    }
}
}
// 更新某个格子的显示

function showBox(el, cell) {
  el.className = "cell";
  el.textContent = "";

  if (cell.open) {
    el.classList.add("open");

    if (cell.mine) {
      el.classList.add("mine");
      el.textContent = "💣";
    } else if (cell.num > 0) {
      el.textContent = cell.num;
      el.classList.add("num-" + cell.num);
    }
  } else if (cell.flag) {
    el.classList.add("flagged");
    el.textContent = "🚩";
  }
}
function clickBox(e) {
  if (over) {
    return;
  }

  var box = e.currentTarget;
  var x = parseInt(box.getAttribute("data-x"), 10);
  var y = parseInt(box.getAttribute("data-y"), 10);

  var cell = map[x][y];

  // 插旗或已经翻开的格子不能点
  if (cell.open || cell.flag) {
    return;
  }

  // 第一次点击开始计时
  if (!begin) {
    begin = true;
    startTime();
  }

  openBox(x, y);
  checkWin();
}


function rightBox(e) {
  e.preventDefault();

  if (over) {
    return;
  }
  var box = e.currentTarget;
  var x = parseInt(box.getAttribute("data-x"), 10);
  var y = parseInt(box.getAttribute("data-y"), 10);

  var cell = map[x][y];
  if (cell.open) {
    return;
  }

  if (cell.flag) {
    cell.flag = false;
    flagNum--;
  } else {
    cell.flag = true;
    flagNum++;
  }

  mineCountEl.textContent = mines - flagNum;

  showBox(box, cell);
}

function openBox(x, y) {
  var cell = map[x][y];

  if (cell.open || cell.flag) {
    return;
  }

  cell.open = true;
  openNum++;

  var box = getBox(x, y);
  showBox(box, cell);

  if (cell.mine) {
    showAllMine();
    endGame(false);
    return;
  }

  if (cell.num === 0) {
    spread(x, y);
  }
}


function spread(x, y) {
  var i, j;
  for (i = -1; i <= 1; i++) {
    for (j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {continue;  }
      var nx = x + i;
      var ny = y + j;
      if (!inMap(nx, ny)) {
        continue; }
      var next = map[nx][ny];
      if (next.open || next.flag || next.mine) {  continue;}
      next.open = true;
      openNum++;
      var nextBox = getBox(nx, ny);
      showBox(nextBox, next);
      if (next.num === 0) {spread(nx, ny);}
    }
  }
}


function showAllMine() {
  var x, y;

  for (x = 0; x < rows; x++) {
    for (y = 0; y < cols; y++) {
      if (map[x][y].mine) {
        map[x][y].open = true;
        showBox(getBox(x, y), map[x][y]);
      }
    }
  }
}

function checkWin() {
  var safe = rows * cols - mines;
  if (openNum >= safe) {endGame(true);}
}
function endGame(win) {
  over = true;
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  if (win) {
    showModal("恭喜通关！", "你已经成功清空了所有非雷格子。", true);
  } else {
    showModal("游戏失败", "你踩到地雷了，再来一局吧。", false);
  }
}


// 开始计时
function startTime() {
  timerId = setInterval(function () {
    time++;
    timerEl.textContent = time;
  }, 1000);
}


function getBox(x, y) {
  return boardEl.children[x * cols + y];}
function inMap(x, y) {
  return x >= 0 && x < rows && y >= 0 && y < cols;}
function limit(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

function showModal(title, msg, ok) {
  modalTitle.textContent = title;
  modalMessage.textContent = msg;

  modalContent.classList.remove("success", "fail");
  modalContent.classList.add(ok ? "success" : "fail");

  modal.classList.remove("hidden");
}
function drawMap() {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = "repeat(" + cols + ", 35px)";

  var x, y;

  for (x = 0; x < rows; x++) {
    for (y = 0; y < cols; y++) {
      var box = document.createElement("div");
      box.className = "cell";
      box.setAttribute("data-x", x);
      box.setAttribute("data-y", y);

      // 左键翻开
      box.addEventListener("click", clickBox);
      // 右键插旗
      box.addEventListener("contextmenu", rightBox);
      boardEl.appendChild(box);

      // 初始显示
      showBox(box, map[x][y]);
    }
  }
}
function hideModal() {
  modal.classList.add("hidden");
}

init();
