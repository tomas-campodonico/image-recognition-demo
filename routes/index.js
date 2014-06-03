
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Image Recognition Demo' });
};

exports.api = function(req, res) {
	var request = require("request"),
    	api = 'http://api.imagga.com',
    	api_key = 'acc_4d1a766f8fd64d4',

    	classifier_id = 'mobile_photos_sliki_v7',

    	image = req.body.urls;

	request({
	    url: api + '/draft/classify/' + classifier_id + '?api_key=' + api_key,
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

	    if (JSON.parse(body).msg) {
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

			    res.end(finalBody);
	    	});
		} else {
			res.end(body);
		}
	});
}