const express 	  = require('express');
const router 	  = express.Router();
const mongoose    = require('mongoose');

var Login         = require('../server/models/login').login;

router.get('/', (req, res) => {
	res.render('login.hbs', {
		morris: true
	});
});

router.post('/login', function(req, res) {
    var email    = req.body.email;
    var pass = req.body.pass;
    console.log(email);
	console.log(pass);
	res.render('index.hbs', {
		morris: true
	});
    // Login.findOne({email: email}, function(err, result) {
    //   console.log(result);
    //   if(err){
    //     console.log("err");
    //     res.send({success: false, reason: "Login Failed" , type:null});
    //   }
    //   else if(result == null || !result) {
    //     res.send({success: false, reason: "Invalid email-id" ,type:null});
    //   }
    //   else if(result.password == pass){
    //     res.send({success: true, reason: "Login Successful" , type:result.type , username :result.email});
    //   }
    //   else{
    //     res.send({success: false, reason: "Invalid email-id or password" ,type:null});
    //   }
    // });
 })


router.get('/home', (req, res) => {
	
	var data = {
	}

	res.render('index.hbs', {
		"menuItems":[  
			{  
			   "subMenuName":"Payments",
			   "shortCode":"PAY",
			   "key":"primaryKey"
			},
			{  
				"subMenuName":"Payments2",
				"shortCode":"PAY",
				"key":"primaryKey"
			 }
		 ],
		morris: true
	});
});

router.get('/flot', (req, res) => {
	res.render('flot.hbs', {
		flot: true
	});
});

router.get('/morris', (req, res) => {
	res.render('morris.hbs', {
		morris: true
	});
});

router.get('/tables', (req, res) => {
	res.render('tables.hbs', {
		tables: true
	});
});

router.get('/forms', (req, res) => {
	res.render('forms.hbs', {
		morris: true
	});
});

router.get('/panels-wells', (req, res) => {
	res.render('forms.hbs', {
		morris: true
	});
});

router.get('/buttons', (req, res) => {
	res.render('buttons.hbs', {
		morris: true
	});
});

router.get('/notifications', (req, res) => {
	res.render('notifications.hbs', {
		morris: true
	});
});

router.get('/typography', (req, res) => {
	res.render('typography.hbs', {
		morris: true
	});
});

router.get('/icons', (req, res) => {
	res.render('icons.hbs', {
		morris: true
	});
});

router.get('/grid', (req, res) => {
	res.render('grid.hbs', {
		morris: true
	});
});

router.get('/blank', (req, res) => {
	res.render('blank.hbs', {
		morris: true
	});
});

router.get('/login', (req, res) => {
	res.render('login.hbs', {
		morris: true
	});
});

module.exports = router;