

function results(req, res, body) {
	var resArray = {
		'confortable rooms': [{
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
		'beach': [{
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
		'spa': [{
			name: 'Palazzo Arzaga - Brescia',
			pic: 'http://www.palazzoarzaga.com/wp-content/uploads/2012/05/7-Spa-Suite.jpg'
		}, {
			name: 'Miyako Inn - Los Angeles',
			pic: 'http://www.miyakoinn.com/bpimages/headers/header_spa.jpg'
		}, {
			name: 'Kerry Hotel - Shangai',
			pic: 'http://www.cntraveler.com/hot-list/2012/spas/kerry-hotel-spa-shanghai-china/_jcr_content/par/cn_contentwell/par-main/cn_colctrl/par-col1/cn_rotator/item0.size.kerry-hotel-pudong-spa-shanghai-china-1.jpg'
		}, {
			name: 'Renaissance Glendale Hotel & Spa',
			pic: 'http://imgsg.jobing.com/company/images/49495/Spa_Botanica_Hydro_Therapy_Room.jpg'
		}],
		'waterparks': [{
			name: 'Funtasia Waterpark - Drogheda',
			pic: 'http://media-cdn.tripadvisor.com/media/photo-s/02/50/b3/75/slip-soak-splash.jpg'
		}, {
			name: 'Aqua Sol Holiday Village',
			pic: 'http://images.hotels4u.com/Travel_Images/Resort_115/Building_5760/pool5263_AT_THE_aqua_sol_holiday_village.JPG'
		}, {
			name: 'Aqualand',
			pic: 'http://www.aqualand-corfu.com/images/gallery/33.jpg'
		}, {
			name: 'Walt Disney World',
			pic: 'http://attractionsmagazine.com/wp-content/uploads/2012/07/ap2-85-640x428-550x367.jpg'
		}],
		'big pools': [{
			name: 'The Ballantyne Hotel',
			pic: 'http://www.theballantynehotel.com/images/pool_005.jpg'
		}, {
			name: 'Holiday Check',
			pic: 'http://www.holidaycheck.com/data/urlaubsbilder/images/15/1160495161.jpg'
		}, {
			name: 'Elounda Beach Hotel',
			pic: 'http://www.allcretehotels.com/hotel/hotels/elounda_beach_hotel_outdoor_pool.jpg'
		}, {
			name: 'Big Pool Hotel',
			pic: 'http://www.smartdestinations.com/blog/wp-content/uploads/2011/08/hotel-pools.jpg'
		}]
	},
	options = {},
	resultCategory = null,
	categories = [];

	console.log('Results');

	if (body) {
		categories = JSON.parse(body)[0].tags;

		if (parseInt(categories[0].confidence, 10) > 60) {
			resultCategory = categories[0].name;
		}

		options.results = resArray[resultCategory];
		options.resultCategory = resultCategory;
		options.categories = categories;
	}
	console.log(options);
	res.render('results', options);
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
    		custom_classifier_id: 'inspire_me',
    		default_classifier_id_2: 'thomas_cook',
    	},
    	image = req.query.urls;
    	classifier = classifiers[req.query.classifier] || classifiers.default_classifier_id,
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

					    results(req, res, finalBody);
			    	});
				} else {
					if ((parsed.status && parsed.status === 'error') && (parsed[0].unsuccessful)) {
						numberOfAttempts++;
						if (numberOfAttempts < 5) {
							console.log('Sending again');
							sendRequest();
						} else {
							res.end();
							return
						}
					} else {
						results(req, res, body);
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
