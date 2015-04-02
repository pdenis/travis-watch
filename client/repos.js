if (Meteor.isClient) {

    // This code only runs on the client
    Template.body.helpers({
        repos: function() {
            return Repos.find();
        }
    });

    Template.body.events({
        "click #submit": function () {
            var owner = $("#owner").val();
            Meteor.call("fetchFromService", owner, function(err, respJson) {
                if(err) {
                    window.alert("Error: " + err.reason);
                    console.log("error occured on receiving data on server. ", err );
                } else {


                }
            });
        }
    });
}