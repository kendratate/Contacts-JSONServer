var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');


module.exports = function(app){
    var contactsFile = path.join(__dirname, 'contacts.json');

    function findRemove(arr, property, item){
        var i = arr.length + 1;
        while(i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(property)
                && (arr[i][property] === item )) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }

    app.get(['/','/search'], function (req, res){
        res.type('application/json');
        var readable = fs.createReadStream(contactsFile);
        readable.pipe(res);
    });

    // array filters items based on search criteria (query)
    function filterItems(contactarray, query) {
        return contactarray.filter(function(el){
            return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
        })
    }

    app.get('/search/:searchterm', function (req, res){
        res.type('application/json');
        var readdata = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
        //console.log(readdata);
        console.log(req.body);
        var jsonobject = {contacts: []};

        var i = readdata.contacts.length + 1;
        while(i--) {
            if (readdata.contacts[i]
                && ((readdata.contacts[i].firstname.toLowerCase().indexOf(req.params.searchterm.toLowerCase()) > -1)
                || (readdata.contacts[i].lastname.toLowerCase().indexOf(req.params.searchterm.toLowerCase()) > -1)
                || (readdata.contacts[i].phone.toLowerCase().indexOf(req.params.searchterm.toLowerCase()) > -1)
                )) {
                jsonobject.contacts.push(readdata.contacts[i]);
            }
        }
        console.log(jsonobject);
        readdata.contacts = jsonobject;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(JSON.stringify(jsonobject));
    });


    app.delete('/:id', function(req,res) {
        console.log("in delete");
        var readdata = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
        var data = findRemove(readdata.contacts, 'id', req.params.id);

        readdata.contacts = data;
        fs.writeFile(contactsFile, JSON.stringify(readdata,null,2), function(err){
            if(err) {
                console.log(err);
                return;
            }
            res.end(JSON.stringify(readdata));
           console.log('writing to ' + contactsFile);
        });
        // return data;
    });

    app.get('/sorta', function(req, res){
        console.log("in sort");
        var readdata = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));

        var data = readdata.contacts.sort(function(a, b){
            console.log(a);
            console.log(b);
            var x = a.firstname.toLowerCase();
            var y = b.firstname.toLowerCase();
            if(x < y) {return -1;}
            if(x > y) {return 1;}
            return 0;
        });
        readdata.contacts = data;
        fs.writeFile(contactsFile, JSON.stringify(readdata,null,2), function(err){
            if(err) {
                console.log(err);
                return;
            }
            res.end(JSON.stringify(readdata));
        });

    });

    app.get('/sortd', function(req, res){
        var readdata = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));

        var data = readdata.contacts.sort(function(a, b){
            console.log(a);
            console.log(b);
            var x = a.firstname.toLowerCase();
            var y = b.firstname.toLowerCase();
            if(x > y) {return -1;}
            if(x < y) {return 1;}
            return 0;
        });
        readdata.contacts = data;
        fs.writeFile(contactsFile, JSON.stringify(readdata,null,2), function(err){
            if(err) {
                console.log(err);
                return;
            }
            res.end(JSON.stringify(readdata));
        });

    })

    app.post('/', function(req, res){
        var readdata = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
        //console.log(readdata);
        console.log(req.body);
        readdata.contacts.push(req.body);
        console.log(readdata);

        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.writeFile(contactsFile, JSON.stringify(readdata,null,2), function(err){
            if(err) {
                console.log(err);
                return;
            }
            res.end(JSON.stringify(readdata));
        });
    })

    app.post('/:id', function(req, res){
        var readdata = JSON.parse(fs.readFileSync(contactsFile, 'utf8'));
        //console.log(readdata);
        console.log(req.body);

        var i = readdata.contacts.length + 1;
        while(i--) {
            if (readdata.contacts[i]
                && (readdata.contacts[i].id === req.body.id )) {
                readdata.contacts[i].firstname = req.body.firstname;
                readdata.contacts[i].lastname = req.body.lastname;
                readdata.contacts[i].phone = req.body.phone;
            }
            }
        console.log(readdata);

        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.writeFile(contactsFile, JSON.stringify(readdata,null,2), function(err){
            if(err) {
                console.log(err);
                return;
            }
            res.end(JSON.stringify(readdata));
        });
    })
};
