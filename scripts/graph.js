


function draw(canvas) {

    if (canvas.getContext) {
      var context = canvas.getContext('2d');
      drawXAxis(canvas);

      let yAxis = canvas.getContext('2d');


      let size = (canvas.width > canvas.height)? canvas.width : canvas.height;
      for(var x=50;x< size;x+=50) {
        context.moveTo(x,0);
        context.lineTo(x,size);
        context.strokeStyle='grey';
        context.stroke();
      }

      for(var y=50; y<size; y+=50) {
        context.moveTo(0,y);
        context.lineTo(size,y);
        context.strokeStyle='black';
        context.stroke();

        }

     

    }
}

function drawXAxis(canvas){
  var xAxis = canvas.getContext('2d');  
  xAxis.moveTo((canvas.height/2).toFixed(0),0);
  xAxis.lineTo((canvas.height/2).toFixed(0),canvas.width);
  xAxis.lineWidth = "2";
  xAxis.stroke();
}

function showCoords(event) {
  var x = event.clientX - 10;
  var y = event.clientY - 10;
  var coords = "X coordinates: " + x + ", Y coordinates: " + y;
  document.getElementById('showCoords').innerHTML = coords;
  
}