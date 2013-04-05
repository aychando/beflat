var Renderer = function(context, width, height, gridSpace) {
  this.context = context;
  this.width = width;
  this.height = height;
  this.gridSpace = gridSpace;
}

Renderer.prototype = {

  clearCanvas: function() {
    var context = this.context;
    context.clearRect(0,0,this.width,this.height);
  },

  drawGrid: function() {
    var context = this.context;
    context.save();
      context.beginPath();
      //Draw Vertical Lines
      for (var x = 0.5; x <= this.width+0.5; x += this.gridSpace) {
        context.moveTo(x, 0);
        context.lineTo(x, this.height);
      }

      //Draw Horizontal Lines
      for (var y = 0.5; y <= this.height+0.5; y += this.gridSpace) {
        context.moveTo(0, y);
        context.lineTo(this.width, y);
      }
      context.strokeStyle = "rgba(0,0,0,0.3)";
      context.stroke();
    context.restore();
  },

  drawHighlight: function(x,y) {
    var context = this.context;
    context.save();
      context.fillStyle = "rgba(50,100,150,0.4)";
      context.fillRect(x+1,y+1,this.gridSpace-1,this.gridSpace-1);
    context.restore();
  },

  drawEmpty: function() {

  },

  drawShape : function(shape,x,y,r,highlight) {
    var context = this.context;
    if(highlight) {
      this.drawHighlight(x,y);
    }
    context.save();
      shape(x+5,y+5,r-10);
    context.restore();

  },

  drawSquare: function(x,y,r) {
    var context = this.context;
    
    context.fillStyle = "rgba(0,0,0,0.2)";
    context.fillRect(x,y,r,r);
  },

  drawTriangle: function(x,y,r) {
    var context = this.context;
    var radius = r/2;
    
    context.fillStyle = "rgba(0,0,0,0.45)";
    context.beginPath();
    context.moveTo(x+radius,y);
    context.lineTo(x,y+r);
    context.lineTo(x+r,y+r);
    context.lineTo(x+radius,y);
    context.closePath();
    
    context.fill();
  },

  drawDiamond: function(x,y,r) {
    var context = this.context;
    var radius = r/2;
    
    context.fillStyle = "rgba(0,0,0,0.65)";
    context.beginPath();
    context.moveTo(x+radius,y);
    context.lineTo(x,y+radius);
    context.lineTo(x+radius,y+r);
    context.lineTo(x+r,y+radius);
    context.lineTo(x+radius,y);
    context.closePath();
    context.fill();
  },

  drawActualDiamond: function(x,y,r) {
    var context = this.context;
    var radius = r/2,
        quart  = radius / 2;

    context.fillStyle = "rgba(0,0,0,0.8)";
    context.beginPath();
    context.moveTo(x+quart,y);
    context.lineTo(x,y+quart);
    context.lineTo(x+radius,y+r);
    context.lineTo(x+r,y+quart);
    context.lineTo(x+quart+radius,y);
    context.lineTo(x+quart,y);
    context.closePath();
    context.fill();
  },

  drawCircle: function(x,y,r) {
    var context = this.context;
    var radius = r/2;

    context.fillStyle = "rgba(0,0,0,0.3)";
    context.beginPath();
    context.arc(x+radius, y+radius, radius, 0 , 2 * Math.PI, false);
    context.closePath();
    
    context.fill();
  }
}