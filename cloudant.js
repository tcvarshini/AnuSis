var Cloudant = require('cloudant');

var me = "bbba6cb6-ec8a-4c4f-abdb-67103f9734fd-bluemix"; // Set this to your own account
var password = "9953210fb9c4df93363bc71ca665bc5c3447aa5f51053e6b13d56cb7ba52faff";

// Initialize the library with my account.
var cloudant = Cloudant({account:me, password:password});
  var db = cloudant.db.use('varshbot')

cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});

db.insert({ name: 'chandana',city: 'visakhapatnam' }, function(err, body, header) 
    {
              if (err) 
              {
                return console.log('[db.insert] ', err.message);
              }

              console.log('You have inserted ');
    });


	
db.find({selector:{name:'chandana'}}, function(er, result) 
    {
          if (er) 
          {
            throw er;
          }
        for (var i = 0; i < result.docs.length; i++) {}
  });

