'use strict'

const	express			= require('express'),
		session			= require('express-session'),
		app				= express(),
		bodyParser		= require('body-parser'),
		server			= require('http').createServer(app),
		mysql			= require('mysql'),
		jwt				= require('jsonwebtoken'),
		RateLimit		= require('express-rate-limit');


// configuration ===============================================================



app.use((req, res,next)=>
{
	res.setHeader('Access-Control-Allow-Origin',  '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});



// set up our express application
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

// required for passport
app.use(session(
{
	secret: 'theMatchaSuperSessionSESSid0rNot',
	resave: false,
	saveUninitialized: true,
	cookie:
	{
		secure: false,
		maxAge: 1000 * 60 * 60 * 24
	}
}));

app.enable('trust proxy');
var limiterRequest = new RateLimit(
{
	// windowMs: (24 * 60 * 60 * 1000), // one day request per day
	windowMs: 10000,
	max: 5, // limit each IP to 100 requests per windowMs
	delayMs: 0, // disable delaying - full speed until the max limit is reached
	message: 'Too many request for today please come back tomorrow'
});


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "sport_project",
	insecureAuth : true
  // password: "2,Ksfwpwd_OC"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("1 Connected!");
});

con.on('error', function(err) {
  console.log("[mysql error]",err);
});;



app.get('/', limiterRequest, (req, res, next) =>
{
	return (res.status(400).json({message: 'Bad request, the request should contain the product barcode id'}))

})
app.get('/:id', limiterRequest, (req, res, next) =>
{
	let id = con.escape(req.params.id);

	if (!id)
		return (res.status(400).json({message: 'No product id sended'}));

	// id = '37504100337979';
	// id = '37504101522058';
	con.query("SELECT * FROM product_table WHERE barcode_id = ?", id ,function (err, result, fields)
	{
		if (err)
			return (res.status(400).json({message: 'Bad request'}))

		result = result[0];
		if (!result || !result.hasOwnProperty('is_doping'))
			return (res.status(400).json({message: 'This product is not listed'}));

		let message;

		if (result.is_doping == 'true')
			message = `Warning this product <stong>${result.name}<strong/> is doping.`;
		else if (result.is_doping == 'false')
			message = `This product <stong>${result.name}</stong> is not doping.`;
		else
			return (res.status(400).json({message: 'Bad request'}))

	 	res.json({message, is_doping: result.is_doping})
	});

})
// .post('/', limiterRequest, (req, res, next) =>
// {
// 	let {barcode_id, product_name} = req.body,
// 		data;

// 	if (isNaN(barcode_id) || product_name == undefined)
// 		return (res.status(400).json({message: 'Bad request'}))

// 	data = {barcode_id: con.escape(barcode_id), product_name: con.escape(product_name)};

// 	console.log(data)
// 	res.json({message: 'posted'})
// 	return ;
// 	var sql = "INSERT INTO product_table (barcode_id, product_name) VALUES ('Company Inc', 'Highway 37')";
// 	con.query(sql, function (err, result)
// 	{
// 		if (err)
// 		{
// 			res.status(400).json({message: 'Bad request'})
// 			throw err;
// 		}

// 		res.json({message: 'posted'})
// 		console.log("1 record inserted");
// 	});


// }).put('/', (req, res, next) =>
// {

// }).delete('/:id', (req, res, next) =>
// {

// })

// Launch ======================================================================
server.listen(3000, () => console.log('listening 3000'))
