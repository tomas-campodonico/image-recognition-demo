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
			window.location.href += 'results/' + this.responseText;
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

changePicture('http://www.aedas.com/Content/images/pageimages/Hilton-Hotel-Liverpool-UK-4.jpg');