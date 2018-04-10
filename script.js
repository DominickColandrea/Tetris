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
  matrix:matrix,
  pos:{x:5, y:0}
};
const arena = createMatrix(12,20);
let dropCounter =0;
let dropInterval =1000;

let lastTime =0;


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
        ctx.fillStyle ='red';
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
}

function playerDrop() {
  player.pos.y++;
  if (collide(arena,player)) {
    player.pos.y--;
    merge(arena,player);
    player.pos.y=0;
  }
  dropCounter=0;
}//end playerDrop

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
  }
});

update();
