(function () {

 	window.addEventListener('load', function () {
	var canvas = document.getElementById('canvas');
	if (!canvas || !canvas.getContext) {
		return;
	}

	var ctx = canvas.getContext('2d');
	if (!context) {
		return;
	}
	
 	ctx.rect(50, 50, 10, 10);


}, false);

} ());