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
			//error
			if (JSON.parse(this.responseText)[0].unsuccessful) {
				alert('There was a problem loading the image. Please try again');
			} else {
				var tags = JSON.parse(this.responseText)[0].tags;
				$('#result-list').empty();
		    	for (var i = 0; i < tags.length; i++) {
		    		$('#result-list').append('<li><span class="cat-name">' +
		    			tags[i].name + '</span> - <span class="cat-confidence">' + tags[i].confidence + '</span></li>');
		    	}
		    	$('#results').removeClass('hidden');
			}
	  	}
	};
	xhr.send("urls=" + image);

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

function dismissModal() {
	$('#results').addClass('hidden');
}

changePicture('http://www.aedas.com/Content/images/pageimages/Hilton-Hotel-Liverpool-UK-4.jpg');