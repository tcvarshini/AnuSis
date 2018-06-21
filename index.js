"use strict";
var fb = require('./fbs');
var OAuth2 = require('oauth2').OAuth2;
var oauth2 = new OAuth2("223703854890692",
  "c1783bcf2b67b593a31d171695447907",
  "", "https://www.facebook.com/dialog/oauth",
  "https://graph.facebook.com/oauth/access_token",
  null);
const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");
var unirest = require("unirest");
var Cloudant = require('cloudant');
var me = "bbba6cb6-ec8a-4c4f-abdb-67103f9734fd-bluemix"; // Set this to your own account
var password = "9953210fb9c4df93363bc71ca665bc5c3447aa5f51053e6b13d56cb7ba52faff";

// Initialize the library with my account.
var cloudant = Cloudant({
  account: me,
  password: password
});
var db = cloudant.db.use('varshbot')

cloudant.db.list(function (err, allDbs) {
  console.log('Available Databases: %s', allDbs.join(', '))
});
const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);


restService.use(bodyParser.json());

// webhook starting
restService.post("/webhook", function (req, res) {
  const fbid = req.body.originalRequest.data.sender.id;

  const action = req.body.result.action;
  const parameters = req.body.result.parameters;

// entry to the chatbot and checking the donor details
  if (action == 'donorentry') {
    db.find({
      selector: {
        dfbid: fbid
      }
    }, function (er, result) {
      if (er) {
        throw er;
      }

      if (result.docs.length < 1) 
      {
        fb.adddonor(req.body.originalRequest.data.sender.id, "I want to add as a donor");
        }
        
      else if(result.docs[0].dstatus == "active")
      {
        fb.textmessage(req.body.originalRequest.data.sender.id, "You have already Registered as a Donor");
        
      }
      else
      {
        db.get(fbid, (err, data) => {
          if (err) {
            throw err;
          }
          
          let doc = data;
          doc.donor_status= "active";
          
          // Now mark it as updatable.
          doc.c = true; // c stands for canChange
          // Now insert it
          db.insert(doc, (err2, data2) => {
            if (err2) {
              throw err2;
            }
            console.log(data2);
          });
        });
        
        fb.textmessage(req.body.originalRequest.data.sender.id, "Welcome back "+result.docs[0].dname+" your status is active now");
        
      }


    });
  }
    
// enter donor details
  if (action == 'donordetails' && parameters.dcity !='' && parameters.dblood!='' && parameters.dacceptance !='' && parameters.dstate !='') {
    console.log(req.body.originalRequest.data.sender);
    //posting Donor-data to cloudant start

    db.insert({
      _id: req.body.originalRequest.data.sender.id,
      dname: parameters.dname,
      dblood: parameters.dblood,
      dcity: parameters.dcity,
      dacceptance: parameters.dacceptance,
      dphone: parameters.dphone,
      dstate: parameters.dstate,
      ddate: parameters.ddate,
      dfbid: req.body.originalRequest.data.sender.id,
      dstatus: "active"
    }, function (err, body, header) {
      if (err) {
        return console.log('[db.insert] ', err.message);
      }

    });


    //posting data to cloudant end
    return res.json({
      speech: 'Your Donation details has been saved successfully',
      displayText: 'Your Donation details has been saved successfully using webhook',
      source: "bloodbank"
    });
  }
 
//requester details
    
  if (action == 'recipientdetails') {
    
    db.insert({
      rname: parameters.rname,
      rblood: parameters.rblood,
      rcity: parameters.rcity,
      rphone: parameters.rphone,
      fbid: req.body.originalRequest.data.sender.id
    }, function (err, body, header) {
      if (err) {
        return console.log('[db.insert] ', err.message);
      }
    });


    //sending message to donors
    fb.textmessage(fbid, "Please be patient we search donors and get back to you")
    
    
    db.find({
      selector: {
        dblood: parameters.rblood,
        dcity: parameters.rcity,
        dstatus: "active"
      }
    }, function (er, result) {
      if (er) {
        throw er;
      }

     
      for (var i = 0; i < result.docs.length; i++) 
      {
        
        if(result.docs[i].dfbid != fbid)
        {
            fb.sendbuttons(result.docs[i].dfbid, "Process my request towards the id " + fbid, "\nHey Need blood for  " + parameters.rname + '\nContact: ' + parameters.rphone+'\n Are you intrested to give blood');
        }
      }
        
        
      if (result.docs.length < 1) {

        return res.json({
          speech: 'No donors are available',
          displayText: 'Your input name is updated',
          source: "bloodbank"
        });
      }


    });
    

  }

   
});


restService.listen(process.env.PORT || 8080, function () {
  console.log("Server up and listening");
});