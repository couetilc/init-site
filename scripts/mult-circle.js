//Initialize Canvas
var canvas = document.getElementById("mult-circle");
var ctx = canvas.getContext("2d");

//Record canvas variables used for calculations
var x_origin = canvas.width / 2;
var y_origin = canvas.height / 2;
var radius_offset = 5;
var radius = Math.min(x_origin, y_origin) - radius_offset;

//Visual variables
var point_color = "red";
var circle_color = "black";
var line_color = "black";
var point_size = 3;
var clean_canvas;


//Set parameters for algorithm:
    //given m, n: f(x) = m * x % n for x <- {0, 1, . . ., n-1}
    //draw a line between x and f(x), where the number line is mapped to a 
    //circle with a period of n.

// set period (modulus parameter) of the algorithm
var N = 200;
// initialize coefficient M
var M = 2;
// store location of points
points = {}

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
        points[i] = {'x':x, 'y':y};

        ctx.beginPath();
        ctx.arc(x, y, point_size, 0, 2 * Math.PI);
        ctx.fillStyle = point_color;
        ctx.fill();
    }
    ctx.closePath();
}

function drawTimesTable() {
    var input, output;
    ctx.strokeStyle = line_color;
    for (i = 0; i < N; i++) {
        //determine domain/range value for the modular multiplication function
        input = i;
        output = M * input % N;

        //draw the line representing the map/function for the given value
        ctx.beginPath();
        ctx.moveTo(points[input].x, points[input].y);
        ctx.lineTo(points[output].x, points[output].y);
        ctx.stroke();
    }
    ctx.closePath();
}

function drawCanvas() {
    drawCircle();
    drawNPointsOnCircle(N);
    clean_canvas = ctx.getImageData(0,0,canvas.width,canvas.height);
    //Remember to take advantage of x-axis symettry at some point to cut
    //down on number of computations (For both Points and Lines)
    drawTimesTable();
}

function updateParameters() {
    ctx.putImageData(clean_canvas, 0, 0);
    M = mInput.value;
    drawTimesTable();
}

drawCanvas();

mInput = document.getElementById("m-value");
mInput.addEventListener('change', updateParameters);
