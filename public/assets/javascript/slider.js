$(document).ready(function(){
      $('.slider').slider();
      $('.dropdown-button').dropdown();
      $('.modal').modal();
      $(".button-collapse").sideNav();
      $('ul.tabs').tabs('select_tab', 'tab_id');
      $('.parallax').parallax();
});
$("#historyTab").on('click', function(event){
	if ( $(this).hasClass("tabInactive") ) {
		$(this).removeClass("tabInactive");
		$(this).addClass("tabActive");
		$("#profileTab").removeClass("tabActive");
		$("#profileTab").addClass("tabInactive");
	}
});
$("#profileTab").on('click', function(event){
	if ( $(this).hasClass("tabInactive") ) {
		$(this).removeClass("tabInactive");
		$(this).addClass("tabActive");
		$("#historyTab").removeClass("tabActive");
		$("#historyTab").addClass("tabInactive");
	}

});




