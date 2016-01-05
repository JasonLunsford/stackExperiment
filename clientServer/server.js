var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var fs 			   = require("fs");

// Set environmental variables in .bash_profile
// set our port
var port = process.env.NODE_ENV_PORT || 8080;
// set static files dir, depending on environment
var staticdir = process.env.NODE_ENV === 'production' ? 'dist.prod' : 'dist.dev';
// set default styles dir
var stylesdir = 'app/styles/';

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/' + staticdir));

// routes ==================================================
require('./devServer/routes')(app); // configure our routes

// listeners ==================================================
app.post('/writecss', function(req, res) {
	var targetCssFile = req.body.file,
		cssContent = req.body.content;

	var path = stylesdir+targetCssFile;

	fs.writeFile(path, cssContent, function(error) {
		if (error) throw error;

		res.send("CSS update successful");
	});
});

// start app ===============================================
app.listen(port);
console.log('Starting sever on port ' + port);
// expose app
exports = module.exports = app;