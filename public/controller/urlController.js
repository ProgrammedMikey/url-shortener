'use strict';

var shortid = require('shortid');
var validator = require('validator');

var Url = require('../model/urlModel');
var path = process.cwd();

var MYURL = process.env.HOST || "https://mdasilva-urlShortener.herokuapp.com/";

module.exports = function (app) {


	app.route('/:id')
		.get(function (req, res) {
			
			Url.findOne({code:req.params.id}, function(err, address){
			    if(err) { return handleError(res, err); }
			    if(!address) { 
			    	return res.status(404).json({"error":"No short url found for given input"}); 
			    }
				
				var target = (address.target.search("://") >=0) ? address.target : "http://"+address.target;
				res.redirect(target);
				
			});
		});


	
	app.route('/new/*').get(function (req, res) {
			var allowInvalid = req.query.allow ?  req.query.allow.toUpperCase() === "TRUE": false;
			
			
			var options =  { 
				protocols: ['http','https','ftp'], 
				require_tld: true, require_protocol: false, 
				require_valid_protocol: true, allow_underscores: false, 
				host_whitelist: false, host_blacklist: false, 
				allow_trailing_dot: false, allow_protocol_relative_urls: true 
			};
			var validURL = validator.isURL(req.params["0"], options) ;
			
			if (!validURL && !allowInvalid) {
				return res.json({"error":"URL invalid"});
			}
			
			var data = {
				code: shortid.generate(),
				target: req.params["0"],
				invalid: allowInvalid
			};
			
			
			Url.create(data, function(err, address) {
			    if(err) { return handleError(res, err); }
			    var result= {
			    	"original_url":address.target,
			    	"short_url":MYURL+ address.code
			    };
			   
			    
			    return res.status(201).json(result);
			  });
			
		});

};

function handleError(res, err) {

  return res.status(500).send(err);
}