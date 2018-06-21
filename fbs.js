const request = require('request');
var events = [
    {
        "name": "hi"
    }
]


module.exports.adddonor = function (sender,text) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: "EAADLdRzOPsQBAKec4AZBzgNxzo4i5auzGBPWnqxIV8urKZAh2Xm9FabPjkIToR69JsXZAfuv5ttFZCfTbPaJevLndCgAeX5nlLYnLUNzxXBtP1Q5rfX3UlaQVtL7tFrWaN7cJDekoZCXSXTmmF2pn3qhz5uWnxvQxkCB9ysFNZCAZDZD"
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            "message":{
                "text": "Want to be a Donor(yes/no)",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Yes",
                    "payload": text
                  },
                  {
                    "content_type":"text",
                    "title":"No",
                    "payload":"I don't want to be a Donor"
                  }
                ]
              }
        }
    }, (error, response) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}


module.exports.textmessage = function (sender, aiText) {
   request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: "EAADLdRzOPsQBAKec4AZBzgNxzo4i5auzGBPWnqxIV8urKZAh2Xm9FabPjkIToR69JsXZAfuv5ttFZCfTbPaJevLndCgAeX5nlLYnLUNzxXBtP1Q5rfX3UlaQVtL7tFrWaN7cJDekoZCXSXTmmF2pn3qhz5uWnxvQxkCB9ysFNZCAZDZD"
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: {
                text: aiText
            }
        }
    }, (error, response) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}


module.exports.sendbuttons = function (fbid,text,data) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: "EAADLdRzOPsQBAKec4AZBzgNxzo4i5auzGBPWnqxIV8urKZAh2Xm9FabPjkIToR69JsXZAfuv5ttFZCfTbPaJevLndCgAeX5nlLYnLUNzxXBtP1Q5rfX3UlaQVtL7tFrWaN7cJDekoZCXSXTmmF2pn3qhz5uWnxvQxkCB9ysFNZCAZDZD"
        },
        method: 'POST',
        json: {
            recipient: {
                id: fbid
            },
            "message":{
                "text": data,
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Yes",
                    "payload": text
                  },
                  {
                    "content_type":"text",
                    "title":"No",
                    "payload":text
                  }
                ]
              }
        }
    }, (error, response) => {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
}

