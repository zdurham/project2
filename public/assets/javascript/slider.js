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




$("#paymentsTab").on('click', function(event){
if ( $(this).hasClass("subTabInactive") ) {
		$(this).removeClass("subTabInactive");
		$(this).addClass("subTabActive");

		$("#earningsTab").removeClass("subTabActive");
		$("#earningsTab").addClass("subTabInactive");

		$("#postsTab").removeClass("subTabActive");
		$("#postsTab").addClass("subTabInactive");

		$("#commentsTab").removeClass("subTabActive");
		$("#commentsTab").addClass("subTabInactive");
}
});
$("#earningsTab").on('click', function(event){
if ( $(this).hasClass("subTabInactive") ) {
		$(this).removeClass("subTabInactive");
		$(this).addClass("subTabActive");

		$("#paymentsTab").removeClass("subTabActive");
		$("#paymentsTab").addClass("subTabInactive");

		$("#postsTab").removeClass("subTabActive");
		$("#postsTab").addClass("subTabInactive");

		$("#commentsTab").removeClass("subTabActive");
		$("#commentsTab").addClass("subTabInactive");
}
});
$("#postsTab").on('click', function(event){
if ( $(this).hasClass("subTabInactive") ) {
		$(this).removeClass("subTabInactive");
		$(this).addClass("subTabActive");

		$("#paymentsTab").removeClass("subTabActive");
		$("#paymentsTab").addClass("subTabInactive");

		$("#earningsTab").removeClass("subTabActive");
		$("#earningsTab").addClass("subTabInactive");

		$("#commentsTab").removeClass("subTabActive");
		$("#commentsTab").addClass("subTabInactive");
}
});
$("#commentsTab").on('click', function(event){
if ( $(this).hasClass("subTabInactive") ) {
		$(this).removeClass("subTabInactive");
		$(this).addClass("subTabActive");

		$("#paymentsTab").removeClass("subTabActive");
		$("#paymentsTab").addClass("subTabInactive");

		$("#earningsTab").removeClass("subTabActive");
		$("#earningsTab").addClass("subTabInactive");

		$("#postsTab").removeClass("subTabActive");
		$("#postsTab").addClass("subTabInactive");
}
});


