
$(document).ready(function() {


  $('.slider').slider();
  $('.dropdown-button').dropdown();
  $('.modal').modal();
  $('select').material_select();



	var imageURLinput = document.getElementById("imageURLinput");
	var image = document.getElementById("image");
	var src;

	//var profilePic = document.getElementById("profilePic");

	$("#uploadButton").click(function(){
		src = imageURLinput.value;

		image.src = src;

		//profilePic.src = src;
	});

})