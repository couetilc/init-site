//Initialize Canvas
var canvas = document.getElementById("mult-circle");
var ctx = canvas.getContext("2d");

//Record canvas variables used for calculations
var x_origin = canvas.width / 2;
var y_origin = canvas.height / 2;
var radius_offset = 5; //distance of radius to edge of canvas
var label_offset = 0; //distance of label to corresponding point
var radius = Math.min(x_origin, y_origin) - radius_offset - label_offset;
var Lines = new Object(); //Stores location of all lines during computation

//Visual variables
var point_color = "red";
var circle_color = "black";
var line_color = "black";
var text_color = "black";
var point_size = 3;
var text_size = 8;
var clean_canvas; //visual state of canvas with no lines drawn
//Possibilities for coloring lines:
//  a) Each M increment applies a single value on color spectrum to all lines
//  b) Each line drawn is a different color along spectrum. (more psychedelic)
//      -> May want to change alpha value so the colors blend on intersection

//Performance tracking variables
var last_drawtime = 0;
var avg_drawtime = 0;
var num_draws = 0;
var div_lastdraw = document.getElementById("last_drawtime");
var div_avgdraw = document.getElementById("avg_drawtime");


//Set parameters for algorithm:
    //given m, n: f(x) = m * x % n for x <- {0, 1, . . ., n-1}
    //draw a line between x and f(x), where the number line is mapped to a 
    //circle with a period of n.

// set period (modulus parameter) of the algorithm
var N;
var nInput = document.getElementById("n-value");
nInput.addEventListener('input', updateCanvas);
// initialize coefficient M (the multiplier)
var M;
var mInput = document.getElementById("m-value");
mInput.addEventListener('input', updateTimesTable);

function drawCircle() {
    ctx.beginPath();
    ctx.arc(x_origin, y_origin, radius, 0, 2 * Math.PI); 
    ctx.strokeStyle = circle_color;
    ctx.stroke();
    ctx.closePath();
}

function drawNPointsOnCircle(n) {
    for (i = 0; i < n; i++) {
        // calculate angle so that points are equidistant on the circle 
        // starting at 180 degrees
        var angle = 180 + 360 * i / N;
        var ratio = -angle * Math.PI / 180;
        var x = x_origin + radius * Math.cos(ratio);
        var y = y_origin + radius * Math.sin(ratio);

        //Draw point
        ctx.beginPath();
        ctx.arc(x, y, point_size, 0, 2 * Math.PI);
        ctx.fillStyle = point_color;
        ctx.fill();
    }
    ctx.closePath();
}

function drawCanvas() {
    N = nInput.value;
    drawCircle();
    drawNPointsOnCircle(N);
    clean_canvas = ctx.getImageData(0,0,canvas.width,canvas.height);
}

function calcTimesTable() {
    var val_x, val_fx, angle, ratio;
    for (i = 0; i < N; i++) {
        //determine domain (argument) & range (value) for the modular 
        //multiplication function
        val_x = i;
        val_fx = M * val_x % N;

        //determine argument and value locations on the canvas
        angle = 180 + 360 * val_x / N;
        ratio = -angle * Math.PI / 180;
        x_dim1 = x_origin + radius * Math.cos(ratio);
        x_dim2 = y_origin + radius * Math.sin(ratio);

        angle = 180 + 360 * val_fx / N;
        ratio = -angle * Math.PI / 180;
        fx_dim1 = x_origin + radius * Math.cos(ratio);
        fx_dim2 = y_origin + radius * Math.sin(ratio);

        //store line components to draw later
        Lines[val_x] = { x:{'dim1':x_dim1, 'dim2':x_dim2},
                        fx:{'dim1':fx_dim1,'dim2':fx_dim2}};
    }
}

function drawTimesTable() {
    //calculate point values for all lines to be drawn
    calcTimesTable();

    //draw all lines
    ctx.strokeStyle = line_color;
    for (i = 0; i < N; i++) {
        ctx.beginPath();
        ctx.moveTo(Lines[i].x['dim1'], Lines[i].x['dim2']);
        ctx.lineTo(Lines[i].fx['dim1'], Lines[i].fx['dim2']);
        ctx.stroke();
    }
    ctx.closePath();
}

function updateTimesTable() {
    //measure performance
    num_draws = num_draws + 1;
    var t0 = performance.now();

    //remove all currently drawn lines from canvas
    ctx.putImageData(clean_canvas, 0, 0);

    //store multiplier value supplied by user
    M = mInput.value;

    //update canvas by drawing the new times table
    drawTimesTable();

    //record time taken to draw
    var t1 = performance.now();
    last_drawtime = t1 - t0;
    avg_drawtime = avg_drawtime + (last_drawtime - avg_drawtime) / num_draws;

    //display performance metrics
    updatePerformance();
}

function updatePerformance() {
    div_lastdraw.innerHTML = last_drawtime.toFixed(4);
    div_avgdraw.innerHTML = avg_drawtime.toFixed(4);
}

function updateCanvas() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //clear performance metrics
    num_draws = 0;
    last_drawtime = 0;
    avg_drawtime = 0;

    //redraw canvas using new parameters
    drawCanvas();

    //redraw lines using new parameters
    updateTimesTable();
}

updateCanvas();
