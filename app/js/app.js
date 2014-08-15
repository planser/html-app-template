function greet() {
	console.log("Hello World")
}

$(document).ready(function() {
	$("button").on("click", greet);
});