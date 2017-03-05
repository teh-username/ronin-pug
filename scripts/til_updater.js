var storage = require('node-persist');
var request = require('request');
var url = 'https://www.reddit.com/r/ProgrammerTIL/top/.json?sort=top&t=month';

request(url, function(err, res, body){
    if(err || res.statusCode !== 200){
        return;
    }

    try{
        // hot incomprehensible stuff
        storage.init().then(function(){
            JSON.parse(body).data.children.splice(0, 10).map(function(entry){
                return {
                    id: entry.data.id,
                    value: {
                        title: entry.data.title,
                        author: entry.data.author,
                        url: entry.data.url
                    }
                };
                return {id: entry.data.id, title: entry.data.title};
            }).forEach(function(entry){
                storage.setItemSync(entry.id, entry.value);
            });
        });
    }
    catch(e){
        // weep silently
    }
});
