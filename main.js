//===================================================*/
/* GLOBAL VARIABLES
===================================================*/

// Empty object for the ciderApp to live in
var ciderApp = {};

// LCBO API URL with Access Key
ciderApp.apiUrl = 'https://lcboapi.com/products/?access_key=MDplMzgyZmMzNC0xZmEyLTExZTYtYTRkOS1jZmFmZTcxODU4YTI6NEhMYURFWkptTXByNlZhQXFFVUk5cGcxNTlxa3A4cE5Pc0xN';

//===================================================*/
/* HERO STUFF
===================================================*/

$('#use').on('click', function () {
	$.smoothScroll({
		scrollTarget: '.taste-section'
	});
});

//===================================================*/
/* WHEN STYLE IS CHOSEN, GO DOWN TO SUB-STYLES
===================================================*/

$('#sweet').on('click', function () {
	$.smoothScroll({
		scrollTarget: '.sweet-sub-choices'
	});
});

$('#dry').on('click', function () {
	$.smoothScroll({
		scrollTarget: '.dry-sub-choices'
	});
});

$('#surpriseMe').on('click', function () {
	$.smoothScroll({
		scrollTarget: '.super-final-results'
	});
});

//===================================================*/
/* COLLECT INFORMATION
===================================================*/

// When the user clicks on a selection...
ciderApp.listeners = function(){


// If user clicks on SWEET...
	$('.globalTaste.sweet').on('click', function() {
			$('.subSweetChoices').fadeIn();
		});
	
	$('.subSweetChoices .beforeSelection input').on('click', function(){
		var whatIreallyClicked 	= $(this).parent();
		var myParentElement = whatIreallyClicked[0];
			$('.subSweetChoices .beforeSelection').removeClass('selectionMade');
			$(myParentElement).addClass('selectionMade');
	});

// If user clicks on DRY...
	$('.globalTaste.dry').on('click', function() {
			$('.subDryChoices').fadeIn();
		});

	$('.subDryChoices .beforeSelection input').on('click', function(){
		var whatIreallyClicked 	= $(this).parent();
		var myParentElement = whatIreallyClicked[0];
			$('.subDryChoices .beforeSelection').removeClass('selectionMade');
			$(myParentElement).addClass('selectionMade');
	});

// If user clicks on SURPRISE ME...
	$('.surpriseMe').on('click', function() {
			ciderApp.getData('random');
		});
}

ciderApp.init = function(){

// When the form is submitted, prevent the default refresh event
	$('form').on('submit', function(event) {
		event.preventDefault();
// Store the user's choice into a variable that carries the value
// (e.g. "Sweet & Fruity")
		var userChoice = $('input:checked').val();

// Restart thingy needs to live here
		ciderApp.restart();
// Get data for userChoice
		ciderApp.getData(userChoice);
	
	}); // -- end of form submit -->

		ciderApp.listeners();

	}; // -- end of .init

//===================================================*/
/* AJAX CALL
===================================================*/
// Here we flesh out the previously referenced ".getData",
// using an AJAX call
// Getting all the ciders first - responds with an array of objects
ciderApp.getData = function(decision){

	$.ajax({
		url: ciderApp.apiUrl,
		method: 'GET',
		dataType: 'json',
		data: {
			q: 'Ciders',
			per_page: '5',
		} // data
	}) // -- $.ajax -->
	.then(function(res){
		console.log(res.result[4]);
		console.log(res.result[4].id);
		var onlyImages = res.result.filter(function(cider) {
			return cider.image_url
		});

// ALTERNATE APPROACHES TO FILTER; understand how they work and why we don't use them:

// var filteredResults = [];
// res.result.forEach(function(cider) {
// 	if (cider.style === decision || cider.style === `Medium-${decision}`) {
// 		cider.myNewKey = 'thing';
// 		filteredResults.push(cider);
// 	}
// });
// var mappedResults = res.result.map(function(cider) {
// 	return cider.name;
// });

//===================================================*/
/* RANDOM RESULTS
===================================================*/
		if (decision === 'random'){
			var randomResults = _.sample(onlyImages, 2);
			ciderApp.displayCiders(randomResults);
		} else{
				var filteredResults = onlyImages.filter(function(cider) {
					return cider.style === decision || cider.style === `Medium-${decision}`;
				});

				ciderApp.displayCiders(filteredResults);
		}; // -- end of if / else statement;

	}); // -- .then -->

}; // -- ciderApp.getData -->


//===================================================*/
/* OUTPUT
//===================================================*/

ciderApp.displayCiders = function(usersCiders) {
	$('#finalCiders').html('');
	// usersCiders is a parameter and is required
	// usersCiders is an array (e.g. sweetAndFruityOnly)
	// we use forEach to go through the array
	usersCiders.forEach(function(individualCider){
	// individualCider is a placeholder; each item is inside the array of usersCiders

	// now we dynamically create HTML elements and store them in variables
		var ciderTitle = $('<h3>')
			.text(individualCider.name);
		var ciderDesc = $('<p>')
			.text(individualCider.tasting_note);
		var ciderImage = $('<img>')
			.attr('src', individualCider.image_url);
		var ciderPrice = $('<p>')
			.text("$" + (individualCider.regular_price_in_cents/100).toFixed(2));
		var ciderBuy = $('<p>')
			.text("Buy");
		var ciderDiv = $('<div class="ciderResult">')
			.append(ciderTitle, ciderDesc, ciderImage, ciderPrice, ciderBuy);

		$('#finalCiders').append(ciderDiv);

		}) // -- end of forEach  -->

	// Originally had it within the forEach, now moved it outside of it, so it scrolls down once it loads

	$('body').animate({
	 		scrollTop: $('#here').offset().top
	 	}, 500);

	}; // end of displayCiders


//===================================================*/
// RESTART THE APP
//===================================================*/
// When the "Again! Again!" button is pressed, do this:

ciderApp.restart = function() {
	$('.again').on('click', function(){
		// removes previous userChoice
		$('.subSweetChoices .beforeSelection').removeClass('selectionMade');
		$('.subDryChoices .beforeSelection').removeClass('selectionMade');
		// empties previous results
		$('#finalCiders').empty();
		// scrolls back up to top
		$('html, body').animate({scrollTop:0},'slow');
 		// closes previous div opened
		$('.subSweetChoices').fadeOut();
		$('.subDryChoices').fadeOut();
	});
}

//===================================================*/
// DOCUMENT READY
//===================================================*/

$(function() {
    ciderApp.init();
});