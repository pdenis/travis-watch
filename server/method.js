if (Meteor.isServer) {
    Meteor.methods({
        fetchFromService: function(owner) {
            var travis_url = "https://api.travis-ci.org/repos.json?owner_name="+owner;
            var scrutinizer_url = "https://scrutinizer-ci.com/api/repositories/g/";
            //synchronous GET
            var result = Meteor.http.get(travis_url, {timeout:30000});
            if(result.statusCode==200) {

                JSON.parse(result.content).forEach(function(repo){
                    if (repo.last_build_status != null) {
                        try {
                            scrutinizerRepo = JSON.parse(Meteor.http.get(scrutinizer_url + repo.slug, {timeout:30000}).content);
                            metrics = scrutinizerRepo.applications.master.index._embedded.project.metric_values;

                            repo = {
                                slug: repo.slug,
                                build_status: repo.last_build_status,
                                build_date: repo.last_build_finished_at,
                                description: repo.description,
                                quality_note: parseFloat(metrics['scrutinizer.quality']).toFixed(2),
                                classes_count: {
                                    total: metrics['scrutinizer.nb_classes'],
                                    good: metrics['scrutinizer.nb_classes.good'],
                                    very_good: metrics['scrutinizer.nb_classes.very_good'],
                                    pass: metrics['scrutinizer.nb_classes.pass'],
                                    critical: metrics['scrutinizer.nb_classes.critical'],
                                    satisfactory: metrics['scrutinizer.nb_classes.satisfactory']
                                },
                                owner: owner
                            };

                            doc = Repos.findOne({slug: repo.slug});
                            if (doc) {
                                Repos.update(doc._id, {$set: repo});
                            } else {
                                Repos.insert(repo);
                            }
                        } catch(err) {
                            console.log(err);
                        }
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