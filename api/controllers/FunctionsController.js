/**
 * FunctionsController
 *
 * @description :: Server-side logic for managing functions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var cloudinary = require('cloudinary');
 var rek = require('rekuire');
 let secrets = rek('secrets/secrets.js');

 cloudinary.config({
   cloud_name: secrets.cloudinary.cloud_name,
   api_key: secrets.cloudinary.api_key,
   api_secret: secrets.cloudinary.api_secret
 });

 module.exports = {

 uploadFile: function (req, res) {
   req.file('file').upload(function (err, uploadedFiles) {
     if (err) {
       return res.send(500, err);
     } else {
       cloudinary.uploader.upload(uploadedFiles[0].fd, function(result) {
				 if(result.err){
					 console.log(err);
					 res.status(400).json(err);
				 } else {
					 res.status(200).json(result.url);
				 }
      //  Images.update(req.param('id'), {imagePath: result.url}, function imageUpdated (err) {
      //    if (err) {
      //      console.log(err);
      //      return res.redirect('/');
      //    }
      //  res.redirect('/image/upload/' + req.param('id'))
      //  });
       });
     }
   });
 },

 };
