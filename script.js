'use strict';
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');

ctx.scale(20,20);

const matrix =[
  [0,0,0],
  [1,1,1],
  [0,1,0],
];// end matrix

const player ={
  matrix:null,
  pos:{x:5, y:-1},
  score:0
};
const arena = createMatrix(12,20);

const colors = [
  null,
  "#8C40D9",
  "#FFFC0E",
  "#FA4F42",
  "#7FE62C",
  "#2AC9BB",
  "#2754ED",
  "#128C0C",
]
let dropCounter =0;
let dropInterval =1000;

let lastTime =0;

function arenaSweep() {
  let rowCount =1;
  outer: for (let y =  arena.length-1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; x++) {
      if (arena[y][x] ===0) {
          continue outer;
      }
    }
    const row = arena.splice(y,1)[0].fill(0);
    arena.unshift(row);
    ++y
    player.score += rowCount*10;
    rowCount*=2;
  }
}//end arenaSweep

function collide(arena,player) {
  const[m,o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; y++) {
    for (let x = 0; x < m[y].length; x++) {
      if (m[y][x] !==0 && (arena[y+o.y] && arena[y+o.y][x+o.x]) !==0) {
          return true;
      }
    }
  }
  return false;
}

function createMatrix(w,h) {
const matrix =[];
while (h--) {
  matrix.push(new Array(w).fill(0));
}
  return matrix;
}//end createMatrix

function createPiece(type) {
  if (type ==="T") {
return [
  [0,0,0],
  [1,1,1],
  [0,1,0],
]
  }
  else if (type ==="O") {
    return [
      [2,2],
      [2,2],
    ]
  }

  else if (type ==="I") {
    return [
      [0,3,0,0],
      [0,3,0,0],
      [0,3,0,0],
      [0,3,0,0]
    ]
  }

  else if (type ==="S") {
    return [
      [0,0,0],
      [0,4,4],
      [4,4,0],
    ]
  }

  else if (type ==="Z") {
    return [
      [0,0,0],
      [5,5,0],
      [0,5,5],
    ]
  }

  else if (type ==="L") {
    return [
      [0,0,6],
      [6,6,6],
      [0,0,0],
    ]
  }

  else if (type ==="J") {
    return [
      [7,0,0],
      [7,7,7],
      [0,0,0],
    ]
  }
}

function draw() {
  ctx.fillStyle ="#000";
  ctx.fillRect(0,0, canvas.width, canvas.height);

drawMatrix(arena, {x:0, y:0});
drawMatrix(player.matrix, player.pos);
}//end draw

function drawMatrix(matrix, offset) {
  matrix.forEach((row,y) =>{
    row.forEach((value,x) =>{
      if (value !==0) {
        ctx.fillStyle =colors[value];
        ctx.fillRect(x +offset.x,
                    y +offset.y,
                    1,1);
      }
    });
  });
}//end drawMatrix

function merge(arena, player) {
  player.matrix.forEach((row,y) =>{
    row.forEach((value,x) =>{
      if (value !==0) {
        arena[y+player.pos.y][x+player.pos.x] = value;
      }
    });
});
}//end merge

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena,player)) {
      player.pos.x -=dir;
  }
}// end oplayerMove

function playerReset() {
  const pieces = "ILJSZOT";
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y =0;
  player.pos.x =5;

  if (collide(arena, player)) {
    arena.forEach(row => row.fill(0));
    player.score = 0;
    updateScore();
  }
}//end playerReset

function playerRotate(dir) {
  const pos = player.pos.x;
  let offset =1;
  rotate(player.matrix, dir);
  while (collide(arena,player)) {
    player.pos.x+= offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x =pos;
      return;
    }
  }
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena,player)) {
    player.pos.y--;
    merge(arena,player);
    playerReset();
    arenaSweep();
    updateScore();
  }
  dropCounter=0;
}//end playerDrop

function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
        [
          matrix[x][y],
          matrix[y][x]
        ] = [
          matrix[y][x],
          matrix[x][y]
        ]
    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  }
  else{
    matrix.reverse();
  }
}// end rotate

function update(time=0) {
  const deltaTime = time - lastTime;
  lastTime =time;
  dropCounter+=deltaTime;
  if (dropCounter>dropInterval) {
      playerDrop();
  }
draw();
requestAnimationFrame(update);
}//end update

function updateScore() {
    document.getElementById('score').innerText = player.score;
    if (player.score>800) {
        dropInterval =300;
    }
    else if (player.score>400) {
      dropInterval =450
    }
    else if (player.score>200) {
      dropInterval =600
    }
    else if (player.score>100) {
      dropInterval =850
    }
}


document.addEventListener('keydown',event =>{
  switch (event.keyCode) {
    case 37:
    playerMove(-1);
      break;

    case 39:
    playerMove(1);
      break;

      case 40:
        playerDrop();
        break;

        case 81:
          playerRotate(-1);
          break;

          case 87:
            playerRotate(1);
            break;
  }
});
playerReset();
updateScore();
update();
