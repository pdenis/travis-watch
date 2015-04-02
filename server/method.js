if (Meteor.isServer) {
    Meteor.methods({
        fetchFromService: function(owner) {
            var url = "https://api.travis-ci.org/repos.json?owner_name="+owner;
            //synchronous GET
            var result = Meteor.http.get(url, {timeout:30000});
            if(result.statusCode==200) {
                console.log("response received.");
                JSON.parse(result.content).forEach(function(repo){
                    repo = {
                        slug: repo.slug,
                        build_status: repo.last_build_status,
                        build_date: repo.last_build_finished_at
                    };


                    doc = Repos.findOne({slug: repo.slug});
                    if (doc) {
                        console.log(repo);
                        Repos.update(doc._id, {$set: repo});
                    } else {
                        Repos.insert(repo);
                    }
                });
            } else {
                console.log("Response issue: ", result.statusCode);
                var errorJson = JSON.parse(result.content);
                throw new Meteor.Error(result.statusCode, errorJson.error);
            }
        }
    });
}