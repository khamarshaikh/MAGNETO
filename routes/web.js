const express 	  = require('express');
const router 	  = express.Router();
const mongoose    = require('mongoose');
const ssh = require('../server/utilities/ssh');
const centralHub = require('../server/utilities/LocalSsh');
const WebHdfs = require('../server/utilities/WebHdfs');
const fsUtil = require('../server/utilities/fs');
const Login = require('../server/models/login').login;
const sshKey = require('../server/models/ssh').sshKeyCollection;


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

router.post('/registerNode', (req,res) => {
	const body = req.body;
	const obj = {
		host: (req.headers['x-forwarded-for'] ||
			req.connection.remoteAddress ||
			req.socket.remoteAddress ||
			(req.connection.socket ? req.connection.socket.remoteAddress : null)).replace("::ffff:",""),
		username: "magneto",
		privateKey: body.key
	};
	console.log(obj);
	const sshKeyIns = new sshKey(obj);
	sshKeyIns.save((err) => {
		if(err)res.send(err);
		else res.send("done");
	});
});

router.post('/installAgent', (req,res) => {
	const body = req.body;
	const host = (req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.socket.remoteAddress : null)).replace("::ffff:","");
	const sshInstance = new ssh();
	sshInstance.getConnection(host, "magneto","host.privateKey").then(() => {
		sshInstance.executeCommand("mkdir /Users/magneto/Agent").then((resmkdir) => {
			sshInstance.putDirectory("/Users/aniruaga/projects/magneto/Agent","/Users/magneto/Agent").then((resfile) => {
				console.log(resfile);
				sshInstance.executeCommand("python -m pip install -r requirements.txt --user --no-warn-script-location.","/Users/magneto/Agent").then((respip) => {
					console.log(respip);
					res.send("done");
					sshInstance.removeConnection();
				}).catch((err) => {
					res.send(err);
				});
			}).catch((err) => {
				res.send(err);
			});
		});
	});
});

router.get('/getInfoFromAllNodes', (req,res) => {
	let allNodes = [];
	let allUSers = [];
	let allConnections = [];
	let sshInstances = [];
	// const sshKeyIns = new sshKey();
	// sshKeyIns.
	sshKey.find({},(err,users) => {
		users.forEach((user) => {
			allUSers.push(user);
			let sshInstance = new ssh();
			allConnections.push(sshInstance.getConnection(user.host,user.username,user.privateKey));
			sshInstances.push(sshInstance);
		});
		Promise.all(allConnections).then((connections) => {
			sshInstances.forEach((sshInstance) => {

				allNodes.push(sshInstance.executeCommand("top -l 1 -s 0 | grep PhysMem"));

				Promise.all(allNodes).then((AllNodesRes) => {
					res.send(AllNodesRes.map((val,i) => {
						return {
							node: allUSers[i].host,
							totalMemory: "16Gb",
							memoryRemaining: val.split(",")[1],
							totalCores: "6"
						}
					}));
				});
			});
		});

	});
});

router.post('/DistributeDataAndRunQuery', (req,res) => {
	const body = req.body;
	const webHdfs = new WebHdfs("test", body.host, body.port);
	const localPath = '/Users/aniruaga/projects/magneto/temp';
	const filesPath = localPath + "/";
	let allUsers = [];
	let allConnected = [];

	webHdfs.getFolder(body.path,localPath + "/").then((folderRes) => {
		fsUtil.getFilesFromFolder(localPath).then((files) => {
			files = files.filter(file => file.includes("parquet"));
			console.log(files);

			sshKey.find({},(err,users) => {
				users.forEach(user => allUsers.push(user));
				allUsers = allUsers.splice(0,files.length);
				const AlluserSshInstance = allUsers
					.map((user) => {
						const inst = new ssh();
						allConnected.push(inst.getConnection(user.host,user.username,user.privateKey));
						return inst;
					});

				Promise.all(allConnected).then(() => {
					console.log("PPPPPPPPP");
					const filesPut = AlluserSshInstance.map((sshInstance,i) => {
						return sshInstance.putFile(filesPath + "/" + files[i],
							"/Users/magneto/Agent/" + files[i]);
					});
					Promise.all(filesPut).then((fres) => {

						console.log("!!!!!!!!!!!!!!!!!!")

						const mapExecuted = AlluserSshInstance.map((sshInstance, i) => {
							console.log(files[i]);
							const command = "python /Users/magneto/Agent/agent.py " +
								"/Users/magneto/Agent/" + files[i] + " " +
								"/Users/magneto/Agent/out.parquet " +
								'"' +body.mapQuery + '"';
							console.log(command);
							return  sshInstance.executeCommand(command,	"/Users/magneto/Agent");
						});

						Promise.all(mapExecuted).then((mapser) => {
							console.log("*********")
							const getAllFiles = AlluserSshInstance.map((sshInstance,i) => {
								sshInstance.getFile("/Users/magneto/Agent/out.parquet",
									localPath + "/out" + i + ".parquet")
							});

							centralHub.executeCommand("python -m pip install -r requirements.txt --user --no-warn-script-location", "/Users/aniruaga/projects/magneto/Agent").then(() => {
								console.log("dddddddddddddd");
								Promise.all(getAllFiles).then(() => {
									centralHub.executeCommand("python agentReduce.py " +
										localPath + "/out0.parquet " +
										localPath + "/out1.parquet " +
										localPath + "/result.parquet " +
										'"' + body.reduceQuery + '"',
										"/Users/aniruaga/projects/magneto/Agent/").then(() => {

										centralHub.executeCommand("cat result.parquet",
											"/Users/aniruaga/projects/magneto/temp").then((result) => {
											res.send(result);
										});
									});

								});
							});


						})
					});
				});

			});
		});
	}).catch((err) => {

	});


});

module.exports = router;