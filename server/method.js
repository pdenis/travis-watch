if (Meteor.isServer) {
    Meteor.methods({
        fetchFromService: function(owner) {
            var travis_url = "https://api.travis-ci.org/repos.json?owner_name="+owner;
            var scrutinizer_url = "https://scrutinizer-ci.com/api/repositories/g/";
            //synchronous GET
            var result = Meteor.http.get(travis_url, {timeout:30000});
            if(result.statusCode==200) {
                console.log("response received.");
                Repos.remove({});
                JSON.parse(result.content).forEach(function(repo){
                    if (repo.last_build_status != null) {
                        try {
                            scrutinizerRepo = Meteor.http.get(scrutinizer_url + repo.slug, {timeout:30000}).content;

                            console.log(scrutinizerRepo);
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
                        } catch(err) {}
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