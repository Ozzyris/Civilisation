(function($){

	/*socket Var*/
	var socket = io.connect('http://localhost:8080');

	/*global Var*/
	var UsrPseudo;
	var UsrColor;
	var userMe = [];
	var LastPosteur = null,
		LastMinute = null;

	/*template Var*/
	var msg_chat = $("#zone_chat").html();
	$("#msg_chat").remove();


	function GET(){
	var ArgPseudo = window.location.href.split(new RegExp("pseudo=", "g"));
		ArgPseudolvl = ArgPseudo[1].split(new RegExp("&", "g"));
		UsrPseudo = ArgPseudolvl[0];
		userMe["pseudo"] = UsrPseudo;

	var ArgColor = window.location.href.split(new RegExp("color=", "g"));
		UsrColor = ArgColor[1];
		UsrColor = UsrColor.substr(0,6);
		userMe["color"] = UsrColor;
	}

	GET();


/*Début de la transaction avec les Sockets*/

/* Socket Emit */
	/* NewUsr */
	socket.emit('nweUsr', {Pseudo: UsrPseudo, Color: UsrColor});
	$('#Nom_Utilisateur').html(Mustache.render('<h4>{{pseudo}}</h4><span id="UserIcone" style="color:#{{color}};"class="glyphicon glyphicon-user"></span>', userMe));

	/* NewMsg */
	$('#TextareaChat').keyup(function(event) {   
   		if(event.keyCode == 13) { // KeyCode de la touche entrée
         	event.preventDefault();
			socket.emit('newMsg', {colour: UsrColor, message: $('#TextareaChat').val()})
			$('#TextareaChat').val('');
			$('#TextareaChat').focus();
 		}
	});

/* Socket On */
	/* NewUsr */
	socket.on('nweUsr', function(user){
		$('#zone_chat').append('<div class="newUser col-md-12"></div>');
		$('#Zone_Usr').append('<a href="#" class="IconTooltip" id="' + user.id + '" data-title="' + user.Pseudo + '" data-placement="right" rel="tooltip" ><span style="color:#' + user.Color + ';" class="glyphicon glyphicon-user userCo"></span></a>');
		$('#zone_chat').scrollTop(1000000);
		$('.IconTooltip').tooltip();
	});

	/* AllUsr */
	socket.on('allUsr', function(user){
		$('#Zone_Usr').append('<a href="#" class="IconTooltip" id="' + user.id + '" data-title="' + user.Pseudo + '" data-placement="right" rel="tooltip" ><span style="color:#' + user.Color + ';" class="glyphicon glyphicon-user userCo"></span></a>');
		$('.IconTooltip').tooltip();
	});

	/* LeaveUsr */
	socket.on('leaveUsr', function(user){
		$('#' + user.id).remove();
		$('#zone_chat').append('<div style="background-color:#B71515;" class="newUser col-md-12"></div>');
		$('#zone_chat').scrollTop(1000000);
	});

	/* NewMsg */
	socket.on('newMsg', function(data_msg){
		if(LastPosteur == null || LastPosteur != data_msg.id){
			data_msg.Min = data_msg.m;
			data_msg.Colori = data_msg.colour;
			$('#zone_chat').append('<div class="Msg_space col-md-12"></div>');
			$('#zone_chat').append(Mustache.render(msg_chat, data_msg));
			$('#zone_chat').scrollTop(1000000);
			LastPosteur = data_msg.id;

		}else{
			$('#zone_chat').append(Mustache.render(msg_chat, data_msg));
			$('#zone_chat').scrollTop(1000000);
		}

	});

})(jQuery);
