/*

threeterm - Three.JS WebGL terminal that can be easily added to your three.js
application. To use it, call terminal.create() with the parameters you want
to use for your size and row/col count.

Software License: Anthony Nicholas Usable Source Without Implied Damages or Earnings v1

This software license allows for the source code associated with the included files
to be used by any party without implied damages or earnings from the use of the files.
That means, I don't expect to earn anything from your using this software, nor am I
responsible for any damages incurred from using this software. It's all yours, and
you take all responsibility for what happens once you use it.
The license to subject to change, but versions released under a certain version
of the license will forever remain licensed under that version.
*/

var terminal = {
  initialized : false,
  scene: null,

  rows: 0, cols: 0,
  width: 0, height: 0, length: 0,
  position: {
    x: 0,
    y: 0,
    z: 0,
  },
  rotation : {
    x: 0.0,
    y: 0.0,
    z: 0.0,
  },
  scale : {
    x: 1.0,
    y: 1.0,
    z: 1.0,
  },

  cursor : {
    row: 23,
    col: 0
  },

  lastUpdate: 0,

  character : [],
  mesh: null,
  material: null,

  create: function(_scene, _rows, _cols, _posX, _posY, _posZ, _width, _length, _height) {
    // this.renderer = _renderer;
    this.scene = _scene;
    this.rows = _rows;
    this.cols = _cols;

    this.position = {
      x : _posX,
      y : _posY,
      z : _posZ,
    }

    this.width = _width;
    this.length = _length;
    this.height = _height;

    var colCounter = 0;
    var charWidth = (this.width / this.cols);
    var charHeight = (this.height / this.rows);

    var singleGeometry = new THREE.Geometry();
    var geometries = [];

    // initialize geometry, uv maps, and char to blanks
    for(var _x = 0; _x < this.cols * charWidth; _x += charWidth) {
      this.character[colCounter] = [];
      // if(colCounter != 2) { colCounter++; continue; }
      var rowCounter = 0;
      for(var _y = 0; _y < this.rows * charHeight; _y += charHeight) {
        this.character[colCounter][rowCounter] = {
          geometry : null,
        }

        // if(rowCounter != 0) { rowCounter++; continue; }

        this.character[colCounter][rowCounter].isUserCharacter = true;
        this.character[colCounter][rowCounter].geometry = this._rect(_x + this.position.x, _y + this.position.y, _x + charWidth + this.position.x, _y + charHeight + this.position.y);
          // console.log("R:" + rowCounter + "  C: " + colCounter + "  x1=" + _x
          // + "     x2=" + (_x + charWidth)
          // + "     y1=" + _y
          // + "     y2=" + (_y + charHeight));
        // console.log("___________");
        this.character[colCounter][rowCounter].geometry.faceVertexUvs[0] = [];
        this.character[colCounter][rowCounter].geometry.faceVertexUvs[0][0] = [];
        this.character[colCounter][rowCounter].geometry.faceVertexUvs[0][1] = [];

        this.character[colCounter][rowCounter].character = "NULL";
        this._setCharUV(colCounter, rowCounter, true);

        // singleGeometry.merge(this.character[colCounter][rowCounter].geometry);
        geometries.push(this.character[colCounter][rowCounter].geometry);
        rowCounter++;
      }
      colCounter++;
    }

/*/
var ctr = 0;

    for(var drawCol = 0; drawCol < this.cols; drawCol++) {
      for(var drawRow = 0; drawRow < this.rows; drawRow++) {
        ctr++;
        // if(!(drawRow == 0 && drawCol == 1)) continue;
        var color = Math.random() * 0xffffff - 1;;
        console.log(color);
        var material = new THREE.MeshBasicMaterial( { color: color, wireframe: true } )
        var mesh = new THREE.Mesh( this.character[drawCol][drawRow].geometry, material );
        mesh.position.z = _posZ;
        console.log(mesh);
          this.scene.add(mesh);

      }
    }
/*/
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load('res/termfont.png', function (texture){
      this.material = new THREE.MeshBasicMaterial( {map: texture });
      for(geometryX in geometries) {
        var mesh = new THREE.Mesh( geometries[geometryX], material );
        this.scene.add(mesh);
      }
      // this.mesh = new THREE.Mesh(singleGeometry, material);
      // this.scene.add(this.mesh);
    });
//*/

    this.initialized = true;
  },
  _rect : function(x1, y1, x2, y2) {
    var rectangle = new THREE.Geometry();

    rectangle.vertices.push( new THREE.Vector3( x1, y1, this.position.z) );
    rectangle.vertices.push( new THREE.Vector3( x2, y1, this.position.z) );
    rectangle.vertices.push( new THREE.Vector3( x1, y2, this.position.z) );
    rectangle.vertices.push( new THREE.Vector3( x2, y2, this.position.z) );

    rectangle.faces.push( new THREE.Face3( 0,1,2) );
    rectangle.faces.push( new THREE.Face3( 3,2,1) );

    return rectangle;
  },

  _charToPos : function(char) {
    var charMap =
    [
      ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p',],
      ['q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F',],
      ['G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V',],
      ['W','X','Y','Z',' ',':',';','{','}','(',')','\\','/','`','\'','"',],
      ['!','@','#','$','%','^','&','*','_','-','+',',','.','<','>','|',],
      ['=','?', 'Cursor', '1','2','3','4','5','6','7','8','9','0','[',']',''],
      ['','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','NULL'],
    ];

    for(var col = 0; col < charMap.length; col++) {
        for(var row = 0; row < charMap[col].length; row++) {
          if(charMap[col][row] === char) {
            return { row: row, col: col };
          }
        }
    }

    return null;
  },
  _setCharUV(col, row, init, newChar) {
    var char = null;
    if(typeof(init) !== "undefined" && init == true) {
      char = this.character[col][row].character;
    }
    else {
      if(typeof(init) == "undefined") {
        char = this.character[col][row].character;
      } else {
        if(newChar != this.character[col][row].character) {
          this.character[col][row].character = char = newChar;
        }
        else {
          return;
        }
      }
    }
    var charPos = this._charToPos(char);

    if(charPos == null) return;

    var charRowOffset = charPos.row / 16.0;
    var charColOffset = charPos.col / 16.0;

    this.character[col][row].geometry.faceVertexUvs[0][0][0] = new THREE.Vector2(1.0 - charRowOffset, 1.0/16.0 + charColOffset);
    this.character[col][row].geometry.faceVertexUvs[0][0][1] = new THREE.Vector2(1.0 - 1.0/16.0  - charRowOffset, 1.0/16.0 + charColOffset);
    this.character[col][row].geometry.faceVertexUvs[0][0][2] = new THREE.Vector2(1.0  - charRowOffset, 0.0 + charColOffset);

    this.character[col][row].geometry.faceVertexUvs[0][1][0] = new THREE.Vector2(1.0 - 1.0 / 16.0 - charRowOffset, 0.0 + charColOffset);
    this.character[col][row].geometry.faceVertexUvs[0][1][1] = new THREE.Vector2(1.0 - charRowOffset, 0.0 + charColOffset);
    this.character[col][row].geometry.faceVertexUvs[0][1][2] = new THREE.Vector2(1.0 - 1.0 / 16.0 - charRowOffset, 1.0 / 16.0 + charColOffset);

    this.character[col][row].geometry.elementsNeedUpdate = true;
  },
  animate : function() {
    if(this.initialized) {
      var miliEpochTime = new Date().getTime();
      var epochTime =  miliEpochTime / 1000;

      // limit updates
      if(this.lastUpdate != 0) {
        // 30fps is enough, right?
        if(epochTime - this.lastUpdate < 33) return;
        this.lastUpdate = epochTime;
      }

      // // blink cursor
      if(parseInt(miliEpochTime) % 2000 == 0) {
        if(this.cursor.col > this.cols) { this._moveCursor(true, true); }
        if(this.character[this.cursor.col][this.cursor.row].character === "NULL") {
          this._setCharUV(this.cursor.col, this.cursor.row, false, "Cursor");
          // this.character[this.cursor.col][this.cursor.row].character = "Cursor";
        } else {
          this._setCharUV(this.cursor.col, this.cursor.row, false, "NULL");
          // this.character[this.cursor.col][this.cursor.row].character = " ";
        }
      }
    }
  },
  _moveCursor: function(forward, newLine) {
    if(forward == null) forward = true;
    if(newLine == null) newLine = false;

    if(newLine) {
      this.cursor.row--;
      this.cursor.col = 0;
    } else if (forward) {
      if(this.cursor.col >= this.cols - 1) {
        this.cursor.row--;
        this.cursor.col = 0;
      } else {
          this.cursor.col++;
      }
    } else if(!forward) {
      if(this.cursor.col == 0) {
        if(this.cursor.row + 1 < this.rows) {
          this.cursor.col = this.cols - 1;
          this.cursor.row++;
          if(this.character[this.cursor.col][this.cursor.row].character === 'NULL') {
            this._moveCursor(false, false);
          }
        }
      } else {
        this.cursor.col--;
        if(this.character[this.cursor.col][this.cursor.row].character === 'NULL') {
          while(this.cursor.col > 0 && this.character[this.cursor.col][this.cursor.row].character === 'NULL') {
            this.character[this.cursor.col][this.cursor.row].character = 'NULL';
            this.cursor.col--;
          }

          if(this.cursor.col == 0 && this.character[this.cursor.col][this.cursor.row].character == 'NULL') {
            this.cursor.row++;
            this.curosr.col = this.cols - 1;
            this._moveCursor(false, false);
          }
        }
      }
    }

    if(this.cursor.col >= this.cols) this.cursor.col = this.cols - 1;
    if(this.cursor.row >= this.rows) this.cursor.row = this.rows - 1;
    if(this.cursor.col < 0) this.cursor.col = 0;
    if(this.cursor.row < 0) this.cursor.row = 0;
  },
  writeCharToTerminal: function(character, isUserCharacter) {
    // console.log(character);
    // console.log(this.character[this.cursor.col][this.cursor.row].character);
    this._setCharUV(this.cursor.col, this.cursor.row, false, character);
    this.character[this.cursor.col][this.cursor.row].isUserCharacter = isUserCharacter !== null ? isUserCharacter : false;
    this._moveCursor();
  },
  enter : function() {
    this._moveCursor(true, true);
  },
  backspace : function() {
    if(this.character[this.cursor.col][this.cursor.row].isUserCharacter) {
      this._setCharUV(this.cursor.col, this.cursor.row, false, "NULL");
      // this.character[this.cursor.col][this.cursor.row].character = " ";
      this._moveCursor(false, false);
    }
  }

}
