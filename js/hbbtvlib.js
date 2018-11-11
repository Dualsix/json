/*
 * To use This library, You need to add the OIPF application manager objects to your HTML page,
 * 
 *	<object id="oipfAppMan" type="application/oipfApplicationManager"></object>
 */
var fullscreen = false;
var j = 1;


function hbbtvlib_initialize(){
	//should be called show() function, if not the application will not be shown;
    var appManager = document.getElementById("oipfAppMan").getOwnerApplication(document);
    appManager.show();

    //escondemos los elementos de las otras paginas
    $('#Sync').hide();
    $('#OkBox').hide();
    $('#CatalogList').hide();
    $('#CatalogInfo').hide();
    $('#blocRight').hide();
    $('#navbar').hide();
    //ejecutamos a rutina del boton rojo
	red();
	//set keyset, only defined keys can be triggered on application.
	// RED, GREEN, YELLOW, BLUE, NAVIGATION, VCR, NUMERIC
	//app.private.keyset.setValue(0x1+0x2+0x4+0x8+0x10+0x20+0x100);  // official
	appManager.privateData.keyset.setValue(0x1+0x2+0x4+0x8+0x10+0x20+0x100);

	var startButton = function(e) {
        e.preventDefault();
        if (e.keyCode == VK_RED) pressStart();
    };
    document.addEventListener("keydown",startButton);

    var destroyButton = function(e) {
        e.preventDefault();
        if (e.keyCode == VK_0) destroyApp(appManager);
    };
    document.addEventListener("keydown",destroyButton);
}


//funcion que ejecuta la rutina del boton rojo
function red() {
    setTimeout(function () {
        $('#redButton').show().delay(10000).fadeOut(function () {
            $('#redButton').hide().delay(5000).fadeIn(function () {
                $('#redButton').show().delay(5000).fadeOut(function () {
                    $('#redButton').hide().delay(60000).fadeIn(function () {
                        $('#redButton').show().delay(5000).fadeOut(function () {
                            $('#redButton').hide();
                        });
                    });
                });
            });
        });
    });
}


//funcion que ejecuta la rutina del boton de fullscreen
function blue() {
    setTimeout(function () {
        $('#fullscreenBox').show().delay(5000).fadeOut(function () {
            $('#fullscreenBox').hide();
        });
    });
}


// al apretar el botón rojo en la primera pantalla, se muestra el contenido de la siguiente y se oculta el bloque de la primera pantalla
function pressStart (){
    $('#startBox').hide();
    $('#Sync').show();
    $('#OkBox').show();
    $('#syncNum').text(generateRandom());
    var enterButton = function(e) {
        e.preventDefault();
        if (e.keyCode == VK_ENTER) pressEnter();
    };
    document.addEventListener("keydown", enterButton);
}


//Escondemos lo relativo a la segunda ventana y mostramos lo referente al catalogo
function pressEnter (){
    $('#Sync').hide();
    $('#OkBox').hide();
    $('#videoPlayer').show();
    $('#CatalogList').show();
    $('#blocRight').show();
    $('#CatalogInfo').show();
    $('#navbar').show();
    document.body.style.background = "#f3f3f3 url('/img/background.png') no-repeat";
   // var player = $('#VideoPlayer');
    var video = document.getElementById("videoPlayer");
    video.type = "video/broadcast";
    video.style.width = "350px";
    video.style.height = "250px";
    video.bindToCurrentChannel();
    //player.appendChild(video);

    var fullscreenButton = function(e) {
        e.preventDefault();
        if (e.keyCode == VK_BLUE) Fullscreen();
    };
    document.addEventListener("keydown",fullscreenButton);
    loadAllJSON();
    
    var videos = JSON.parse(localStorage.getItem("videoListStorage"));
    images(videos);
    loadAutor(videos);
    loadVisitas(videos);
    //leerUsers(videos);
    //loadtitulo(videos);
    //descripcion(j);
 

    //activa el scroll abajo
   
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == VK_DOWN ) {
            document.getElementById("Video" + j).style.backgroundColor = "white";
            if (j < videos.datos.length) {
                j++;
            }
            document.getElementById("Video" + j).style.backgroundColor = "red";

        };
        e.preventDefault();
    }, false);


    //activa el scroll arriba
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == VK_UP ) {

            document.getElementById("Video" + j).style.backgroundColor = "white";
            if (j > 1) {
                j--;
            }
            document.getElementById("Video" + j).style.backgroundColor = "red";

        };
        e.preventDefault();
    }, false);


    //visualitza el video que es vol veure a la pantalla lateral
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == VK_ENTER) {
            document.getElementById("videoPlayer").innerHTML = "";
            document.getElementById("videoPlayer").type = "video/mpeg4";
            document.getElementById("videoPlayer").data = videos.datos[j-1].Url;
            document.getElementById("videoPlayer").play();
            document.getElementById("view" + j).innerHTMLvideos.datos[j - 1].Visitas += 1;
            //videos.datos[j].Visitas++;
            descripcion(j);
        };
        e.preventDefault();
    }, false);

}


//generamos el numero aleatorio que se muestra durante el sincronismo
function generateRandom () {
    var num = Math.floor((Math.random() * 9999) + 1);
    while (num<1000) num = Math.floor((Math.random() * 9999) + 1);
        return num;
}


//creamos la funcion que destruye la aplicacion
function destroyApp(app){
    app.hide();
    app.destroyApplication();
}


//variamos la imagen de los videos a fullscreen o a pequeño
function Fullscreen(){
    var video = document.getElementById("videoPlayer");
    if (fullscreen == false){
       /* var video = document.createElement('object');
        video.id="fullscreenVideo"
        video.type = "video/broadcast";
        video.position ="relative";
        video.style.width = "1280px";
        video.style.height = "720px";
        video.bindToCurrentChannel();
        document.body.appendChild(video);*/
       openFullscreen(video);
        fullscreen = true;
    }else{
        /*var deleteV = document.getElementById("fullscreenVideo");
        document.body.removeChild(deleteV);
        var video = document.getElementById("videoPlayer");
        video.type = "video/broadcast";
        video.style.width = "350px";
        video.style.height = "250px";
        video.bindToCurrentChannel();*/
        closeFullscreen(video);
        fullscreen = false;
    }
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
        var message = document.createElement('p');

        elem.appendChild(message);
    } else {
        elem.mozRequestFullScreen();
    }
}

/* Close fullscreen */
function closeFullscreen(elem) {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }else{
        document.mozCancelFullScreen();
    }
}
