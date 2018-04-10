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
  pos:{x:5, y:5}
}

function draw() {
  ctx.fillStyle ="#000";
  ctx.fillRect(0,0, canvas.width, canvas.height);

drawMatrix(player.matrix, player.pos);
}//end draw

let dropCounter =0;
let dropInterval =1000;

let lastTime =0;

function playerDrop() {
  player.pos.y++;
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

document.addEventListener('keydown',event =>{
  switch (event.keyCode) {
    case 37:
      player.pos.x--;
      break;

    case 39:
      player.pos.x++;
      break;

    case 40:
      playerDrop();
      break;
  }
});

update();
