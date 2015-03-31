
if (Meteor.isServer) {
    Meteor.methods({
        fetchFromService: function(owner) {
            var url = "https://api.travis-ci.org/repos.json?owner_name="+owner;
            //synchronous GET
            var result = Meteor.http.get(url, {timeout:30000});
            if(result.statusCode==200) {
                var respJson = JSON.parse(result.content);
                console.log("response received.");
                return respJson;
            } else {
                console.log("Response issue: ", result.statusCode);
                var errorJson = JSON.parse(result.content);
                throw new Meteor.Error(result.statusCode, errorJson.error);
            }
        }
    });
}


if (Meteor.isClient) {

    // This code only runs on the client
    Template.body.helpers({
        repos: Session.get('repos')
    });

  Template.body.events({
    "click #submit": function () {
        var owner = $("#owner").val();
        Meteor.call("fetchFromService", owner, function(err, respJson) {
            if(err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on server. ", err );
            } else {
                console.log("respJson: ", respJson);
                Session.set('repos', respJson);
            }
        });
    }
  });
}

