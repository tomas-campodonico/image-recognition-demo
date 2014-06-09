
/*
 * GET home page.
 */

function redirectToResults(body) {
	var url = 'no-match',
		tags = JSON.parse(body)[0].tags;

	if (parseInt(tags[0].confidence, 10) > 60) {
		url = tags[0].name;
	}

	return url;
}

exports.index = function(req, res){
  res.render('index', { title: 'Image Recognition Demo' });
};

exports.api = function(req, res) {
	var request = require("request"),
    	api = 'http://api.imagga.com',
    	api_key = 'acc_7c64f06c8eaedfa',

    	classifiers = {
    		default_classifier_id: 'mobile_photos_sliki_v7',
    		default_classifier_id_2: 'carpet_pattern_v4',
    		custom_classifier_id: 'thomas_cook'
    	},

    	image = req.body.urls;
    	classifier = classifiers[req.body.classifier] || classifiers.default_classifier_id,
    	numberOfAttempts = 0;

	var sendRequest = function() {
		request({
		    url: api + '/draft/classify/' + classifier + '?api_key=' + api_key,
		    form: {
		    	urls: image
		    },
		    method: "POST",
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		}, function (error, response, body) {
		    if (error) {
		        console.error(error);
		        return
		    }

		    console.log("\n<<Status>>", response.statusCode);
		    console.log("<<Headers>>", JSON.stringify(response.headers));
		    console.log("<<Response>>", body);

		    try {
			    var parsed = JSON.parse(body);
			    if (parsed.msg) {
			    	console.log('Sending GET...');
			    	request({
			    		url: api + '/draft/classify/result/' + body.ticket_id + '?api_key=' + api_key,
			    		method: 'GET',
			    		headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			    	}, function(finalError, finalResponse, finalBody) {
			    		if (finalError) {
					        console.error(finalError);
					        return
					    }

					    console.log("\n<<Status>>", finalResponse.statusCode);
					    console.log("<<Headers>>", JSON.stringify(finalResponse.headers));
					    console.log("<<Response>>", finalBody);

					    var finalURL = redirectToResults(finalBody);

					    res.end(finalURL);
			    	});
				} else {
					if (parsed[0].unsuccessful) {
						numberOfAttempts++;
						if (numberOfAttempts < 5) {
							console.log('Sending again');
							sendRequest();
						} else {
							res.end();
							return
						}
					} else {
						var finalURL = redirectToResults(body);
						res.end(finalURL);
					}
				}
			} catch (e) {
				console.error('There was an error trying to parse the response.')
				res.end();
			}
	    });
	};

	sendRequest();
}

exports.results = function(req, res) {
	var resArray = {
		'interior_objects': [{
			name: 'Comfortable Room 1',
			pic: 'http://3.bp.blogspot.com/-3p21KJxpWKw/T9ncU0RQPoI/AAAAAAAADh4/I5iA0r4qf70/s1600/standard_room_twin_bed.jpg'
		}, {
			name: 'Comfortable Room 2',
			pic: 'http://www.seawardinn.com/photo_gallery/gal/Tour%20Seaward/room104.jpg'
		}, {
			name: 'Comfortable Room 3',
			pic: 'http://ohua88.com/wp-content/uploads/2012/12/comfortable-teenage-room-ideas-915x610.jpg'
		}, {
			name: 'Comfortable Room 4',
			pic: 'http://nigerianmaritimedirectory.com/wp-content/uploads/2013/06/comfortable-room-design-image-915x683.jpg'
		}],
		'beaches_seaside': [{
			name: 'Rio de Janeiro',
			pic: 'http://upload.wikimedia.org/wikipedia/commons/d/d2/Rio_de_Janeiro_Ipanema_%26_Leblon_173_Feb_2006.JPG'
		}, {
			name: 'Mar del Plata',
			pic: 'http://www.letrap.com.ar/wp-content/uploads/2012/09/Puerto.jpg'
		}, {
			name: 'Aruba',
			pic: 'http://www.saidaonline.com/en/newsgfx/aruba-saidaonline.jpg'
		}, {
			name: 'Miami',
			pic: 'http://media-cdn.tripadvisor.com/media/photo-s/03/d4/40/8c/miami.jpg'
		}],
		'streetview_architecture': [{
			name: 'Sheraton Hotel - Mar del Plata',
			pic: 'http://images.bestday.com/_lib/vimages/mar-del-plata-argentina/hotels/sheraton-mar-del-plata/fachada_g.jpg'
		}, {
			name: 'Corregidor Hotel - La Plata',
			pic: 'http://www.reservas.net/prvimagen/387_prin.jpg'
		}, {
			name: 'Hilton Hotel - London',
			pic: 'http://media-cdn.tripadvisor.com/media/photo-s/01/d6/de/dd/exterior-shot.jpg'
		}, {
			name: 'Sheraton Hotel - London',
			pic: 'https://yourmotelreservations.com/propertyimages/165052/sheraton_skyline_hotel_london_heathrow_photo18_hayes_unitedkingdom.jpg'
		}]
	}
	res.render('results', { results: resArray[req.params.id] });
}
