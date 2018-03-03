


var pageCanvas = document.querySelector("#pageCanvas");

pageCanvas.addEventListener("mousemove", updateDisplay, false);
pageCanvas.addEventListener("mouseenter", updateDisplay, false);
pageCanvas.addEventListener("mouseleave", updateDisplay, false);
pageCanvas.addEventListener("click", cliked, false);

var mouseX = 0;
var mouseY = 0;

var polX;
var polY;

var fail = new Audio('fail.wav');
var success = new Audio('success.wav');


function getRandomInt(min, max) {
	// Questa funzione genera un numero intero random contenuto fra min e max inclusi
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// definisco le variabili
var targhet_canvas_id , lati , diametro_costruzione_poligono , diametro_costruzione_cerchio , rotazione , colore_poligono, colore_cerchio , pos_x , pos_y


function generateVariables (){
	// genero le variabili ogni volta che devo disegnare un poligono nuovo

	targhet_canvas_id = "pageCanvas"; // il canvas in cui vogliamo disegnare
	lati = getRandomInt(1, 6) ; // numro dei lati del poligono, se x < 3 verra diasegnato un cerchio, per una selezone random usare "getRandomInt(1, 8)"
	diametro_costruzione_poligono = 150; // grandezza poligono 
	diametro_costruzione_cerchio = 70; // grandezza cerchio centrale
	rotazione = Math.PI/lati; // rotazione del poligono, "Math.PI/lati" serve per tenere le facce ortogonali alla finestra, "Math.random() *Math.PI*2" per una rotazione random
	
	colore_poligono= "#FFFFFF";  //"#000000";
	colore_cerchio = "#FFBF18";  // blu "#0000E0";  //"#FF3300";

	pos_x =((Math.random() * 100) + 1 )/100; // posizione x e y random del poligono
	pos_y = ((Math.random() * 100) + 1 )/100; 

}

// eseguo le funzioni una volta per inizializzare la pagina (aggiornando le variabili)
generateVariables ();
drawCanvas(mouseX ,mouseY);



function updateDisplay(event) {
	mouseX = event.pageX;
	mouseY = event.pageY;
	drawCanvas(mouseX ,mouseY);
}


document.body.onkeyup = function(e){
    if(e.keyCode == 32){
    	generateVariables();
    	drawCanvas(mouseX ,mouseY);
    }
}





// eseguo le funzioni ogni volta che la il mouse viene premuto(aggiornando le variabili)
function cliked(){


	distanceBtw= distance(mouseX, mouseY , polX,polY)
	console.log(distanceBtw,mouseX, mouseY,polX,polY)


    if(distanceBtw < diametro_costruzione_poligono*0.6){
    	generateVariables();
    	drawCanvas(mouseX ,mouseY);
    	var success = new Audio('success.wav');
    	success.play();
		
    }
    else{
    	var fail = new Audio('fail.wav');

    	fail.play();

		
    }
    
}



// variabili relative al evento di ridimensionamento della pagina window.resize

var w = document.querySelector("#width"),
    h = document.querySelector("#height"),
    c = document.querySelector("#calls"),
    timeout = false, // holder for timeout id
    delay = 250, // delay after event is "complete" to run callback
    calls = 0;

// window.resize callback function e funzione di disengo del canvas
function drawCanvas(mouseX ,mouseY) {

  // leggo le dimensioni della finestra 
  w = window.innerWidth;
  h = window.innerHeight;
  calls += 1;
  c = calls;

  // imposto le dimensioni del canvas uguali alla finsestra 
  var targhet_canvas = document.getElementById(targhet_canvas_id)
  targhet_canvas.width  = w;
  targhet_canvas.height = h;

  // disegno il poligono 
  drawPoligon(targhet_canvas_id , pos_x , pos_y , lati , diametro_costruzione_poligono, rotazione , true, true, colore_poligono);
 
  // disegno il cerchio 
  drawPoligon(targhet_canvas_id , mouseX ,mouseY  , 1 , diametro_costruzione_cerchio, 0, false, false, colore_cerchio);
  
}

// window.resize event listener (aspetta che la finestra si ridimensioni e esegue drawCanvas() )
window.addEventListener('resize', function() {
    // clear the timeout
	clearTimeout(timeout);
	// start timing for event "completion"
	timeout = setTimeout(drawCanvas, delay);
});

function clamp(n, minn, maxn){
// che limita il valore n entro min e max
    if (n < minn){
    	return minn;
    }
        
    else if(n > maxn){
    	return maxn;
    }

    else{
        return n;
    }

}


function distance(x1,y1,x2,y2){
	//distance between two points
	return Math.hypot(x2-x1, y2-y1);
}





function drawPoligon(targhet_canvas_id ,pos_x,pos_y , n_faces, outer_diameter, rotation, percent_pos,storePos, colour ) {
	// funzione che disegna il poligono 

	var targhet_canvas = document.getElementById(targhet_canvas_id)
	var canvas_context = targhet_canvas.getContext("2d");

	// apriamo il "livello 2d" del canvas

	
	if (percent_pos){
		// calcolo la posizione del poligono proporzionalmente alla dimensione del canvas pos_x e pos_y vanno da 0 a 1 (0.5 è il centro della pagina)
		pos_x = clamp (targhet_canvas.width * pos_x, outer_diameter/2,targhet_canvas.width-(outer_diameter/2) );
		pos_y = clamp (targhet_canvas.height * pos_y, outer_diameter/2,targhet_canvas.height-(outer_diameter/2) );

	}

	if (storePos) {
		//save the positions of the poligon to ceck against the mouse
		polX = pos_x;
		polY = pos_y;

	}


	canvas_context.beginPath(); // inizia il disegno 

	
	if (n_faces > 2){
		 // se le faccie sono 3 o più disengo un poligono regolare, i indica il vertice che sarà disegnato in ogni ciclo
		canvas_context.lineWidth = 8; // spessore del filetto
		var i = 0
		while (i <= n_faces-1) {
	
			ang = ((2*Math.PI)/n_faces)* i + rotation // 360° (2*Math.PI) viene diviso dal numero di lati 360°/4= 90°, questo valore viene moltiplocato per l'indice del vertice e la rotazone del solido che abbiamo inpostato allinizio per caclorare l'angolo del "raggio" che va dal centro del poligono al vertice in questione .
	
			vertex_x = pos_x + Math.sin(ang)*outer_diameter/2; //calcolo le coordinate del vertice usando seno e coseno
			vertex_y = pos_y + Math.cos(ang)*outer_diameter/2;
	
	
			if (i==0) { canvas_context.moveTo(vertex_x, vertex_y); } //al primo ciclo muovo la penna sul primo vertice

			else { canvas_context.lineTo(vertex_x , vertex_y);} //ad ongi ciclo disegno una linea fra l'ultimo vertice disegnato e uno nuovo
			i=i+1;

		}
	
			
	
	}
	else{
		// se le faccie sono meno di 3 disegno un cerchio https://www.w3schools.com/tags/ref_canvas.asp
                canvas_context.lineWidth = 5; // spessore del filetto
		canvas_context.arc (pos_x , pos_y , outer_diameter/2, 0, 2 * Math.PI, false);
	}

	canvas_context.closePath(); // chiudiamo la forma
	

	
	canvas_context.fillStyle = colour; // colore di riempimento
	canvas_context.fill();
	canvas_context.strokeStyle = "#000000"; // colore del filetto
	// canvas_context.strokeStyle = colour; // colore del filetto
    canvas_context.stroke();

}
