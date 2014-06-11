function categorize() {
	var image = $('#img').attr('src');

	$('#loading-bar').removeClass('hidden');
	$('input').prop("disabled", true);
	window.location.href += 'results?classifier=' + $('#classifier').val() + '&urls=' + image;
}

function changePicture(src) {
	if (!src) {
		src = $('#file').val();
	} else {
		$('#file').val(src);
	}
	$('#img').attr('src', $('#file').val());
}

function showResults() {
	$('.categories').toggleClass('hidden');
}

changePicture('http://www.dimensionsinfo.com/wp-content/uploads/2010/02/Hotel-Room.jpg');