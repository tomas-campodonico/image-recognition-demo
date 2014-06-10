function categorize() {
	var api = window.location.href,
		api_key = 'acc_1163b1c1f38800c',
		image = $('#img').attr('src');

	var xhr = new XMLHttpRequest();
	xhr.open("POST", api);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.onreadystatechange = function () {
		$('#loading-bar').addClass('hidden');
		$('input').prop("disabled", false);
		if (this.readyState == 4) {
			console.log(this.responseText);
			if (this.responseText) {
				window.location.href += 'results/' + this.responseText;
			} else {
				alert('There was a problem in an external server. Please, try again in a few minutes.')
			}
			
	  	}
	};
	xhr.send("classifier=" + $('#classifier').val() + "&urls=" + image);

	$('#loading-bar').removeClass('hidden');
	$('input').prop("disabled", true);
}

function changePicture(src) {
	if (!src) {
		src = $('#file').val();
	} else {
		$('#file').val(src);
	}
	$('#img').attr('src', $('#file').val());
}

changePicture('http://www.dimensionsinfo.com/wp-content/uploads/2010/02/Hotel-Room.jpg');