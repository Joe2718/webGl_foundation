var canvas = document.createElement('canvas');

function setup(){
	let $container = document.getElementById('glTestDiv');
	let $body = document.getElementsByTagName('body')[0];
	canvas.height = window.innerHeight - 20 ;
	canvas.width = window.innerWidth - 20 ;
	// gl.viewport(0,0,window.innerWidth, window.innerHeight); // if I start resizing 
	canvas.id= "webGL-test";
	$container.appendChild(canvas);
	var gl = canvas.getContext('webgl');
	gl.viewport(0,0,window.innerWidth, window.innerHeight);
	if(!gl){
		console.log('Browser no support Webgl, falling back to experimental-webgl ');
		gl = canvas.getContext('experimental-webgl')
	}
	if(!gl){
		alert('Your browser does not support Webgl ');
	}
	gl.clearColor(.75 ,.8 ,.8 ,1);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.	DEPTH_BUFFER_BIT);
	// SHADERS 
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
     var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
     gl.shaderSource(vertexShader, vertexShaderText);
     gl.shaderSource(fragmentShader, fragmentShaderText);

     gl.compileShader(vertexShader);
     if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
     	console.log('ERROR, vertexShader compile error', gl.getShaderInfoLog(vertexShader));
     	return;
     }
     gl.compileShader(fragmentShader);
     if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
     	console.log('ERROR, fragmentShader compile error', gl.getShaderInfoLog(fragmentShader));
     }

     var program = gl.createProgram();
     gl.attachShader(program,vertexShader);
     gl.attachShader(program,fragmentShader);
     gl.linkProgram(program);
     if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
     	console.log('error linking program ', gl.getProgramInfoLog(program));
     	return;
     }
     gl.validateProgram(program);
     if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
     	console.log('ERROR validating program ', gl.getProgramInfoLog(program));
     	return;
     }
     var triangleVertices = 
     [ // x , y,    R, G, B
     	-0.5 ,  -0.5,   0.0, 0.0, 0.0,
     	-0.5 ,   0.5, 	 1.0, 0.0, 0.0,
	      0.5 ,  -0.5,   0.0, 0.0, 1.0
     ];
     var triangleVertexBufferObject = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array (triangleVertices), gl.STATIC_DRAW);

     var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
     var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

     gl.vertexAttribPointer(
		positionAttribLocation,     	// attribute locatoin
		2, // number of elements per attribute
		gl.FLOAT, // type of elements 
		gl.FALSE,  // is data normalized 
		5 * Float32Array.BYTES_PER_ELEMENT,  //  4bytes  size of an individual vertex 
		0 // offset from the beginning of a single vertex to this attribute
     	);
     gl.vertexAttribPointer(
		colorAttribLocation,     	// attribute locatoin
		3, // number of elements per attribute
		gl.FLOAT, // type of elements 
		gl.FALSE,  // is data normalized 
		5 * Float32Array.BYTES_PER_ELEMENT,  //  4bytes  size of an individual vertex 
		2 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute
     	);
     gl.enableVertexAttribArray(positionAttribLocation);
     gl.enableVertexAttribArray(colorAttribLocation);
     //
     // main render loop 
     //
     // var loop = function (){
     // 	updateWorld();
     // 	renderWorld();
     // 	if (running){
     // 		requestAnimationFrame(loop);
     // 	}
     // }
     // requestAnimationFrame(loop);
     gl.useProgram(program);
     gl.drawArrays(gl.TRIANGLES, 0, 3);

}

var vertexShaderText = [
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
' fragColor = vertColor;',
' gl_Position = vec4(vertPosition, 0.0 , 1.0);',
'}'
].join('\n');
// function vertexShader(vertPosition, vertColor){
// 	return {
// 		fragColor: vertColor,
// 		gl_Position: 
// 	}
// }

var fragmentShaderText = [
	'precision mediump float;',
	'',
	'varying vec3 fragColor;',
	'void main()',
	'{',
		'gl_FragColor = vec4 ( fragColor , 1.0 );',
	'}'
].join('\n');

