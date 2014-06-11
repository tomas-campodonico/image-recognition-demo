

function results(req, res, body) {
	var resArray = {
		'rooms': [{
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
		//{"labels": [{"raw_label": "waterparks", "probability": "100.0", "label": "waterparks"}], "results": []}
		categories = JSON.parse(body).labels;

		if (parseInt(categories[0].probability, 10) > 60) {
			resultCategory = categories[0].label;
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
    	api = 'http://93.152.158.212:8080',
    	image = req.query.urls;
    	classifier = '183d80f62636f73ec3d4a0e3f0de34d5',
    	numberOfAttempts = 0;

	var sendRequest = function() {
		//http://93.152.158.212:8080/classify/183d80f62636f73ec3d4a0e3f0de34d5/?url=<yourimageurl>
		request({
		    url: api + '/classify/' + classifier + '/?url=' + image,
		    method: "GET",
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
			    if (parsed.status.type === 'success') {
					results(req, res, body);
				} else {
					numberOfAttempts++;
					if (numberOfAttempts < 5) {
						console.log('There was a problem. Sending request again...');
						sendRequest();
					} else {
						res.end();
						return
					}
				}
			} catch (e) {
				console.error('There was an error.')
				res.end();
			}
	    });
	};

	sendRequest();
}
