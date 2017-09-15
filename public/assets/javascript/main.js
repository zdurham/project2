
$(document).ready(function() {


  $('.slider').slider();
  $('.dropdown-button').dropdown();
  $('.modal').modal();
  $('select').material_select();


  	//Allows us to upload an image using a URL
	var image = document.getElementById("image");
	var imageURL = document.getElementById("imageURL");
	var src;

	//var profilePic = document.getElementById("profilePic");

	$("#uploadButton").click(function(){
		src = image.value;

		imageURL.src = src;

		//$("#image").val(src);

		//alert(src);

		//profilePic.src = src;
	});

})