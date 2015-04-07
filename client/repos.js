if (Meteor.isClient) {

    function drawChart(repo) {
        var ctx = document.getElementById("chart-" + repo.slug).getContext("2d");

        var data = [
            {
                value: repo.classes_count.critical,
                color:"#D90019",
                highlight: "#D90019",
                label: "Critical"
            },
            {
                value: repo.classes_count.very_good,
                color: "#00B84F",
                highlight: "#00B84F",
                label: "Very Good"
            },
            {
                value: repo.classes_count.satisfactory,
                color: "#D9D21F",
                highlight: "#D9D21F",
                label: "Satisfactory"
            },
            {
                value: repo.classes_count.pass,
                color: "#D992A8",
                highlight: "#D992A8",
                label: "Pass"
            },
            {
                value: repo.classes_count.good,
                color: "#7AB85A",
                highlight: "#7AB85A",
                label: "Good"
            }
        ];

        new Chart(ctx).Doughnut(data);
    }

    Template.repo.rendered = function () {
        drawChart(Repos.findOne({slug: this.data.slug}));
    }

    // This code only runs on the client
    Template.body.helpers({
        repos: function() {
            return Repos.find({owner: Session.get('owner')});
        }
    });

    Template.body.events({
        "click #submit": function () {
            var owner = $("#owner").val();
            Session.set('owner', owner);
            Meteor.call("fetchFromService", owner, function(err, respJson) {
                if(err) {
                    console.log("error occured on receiving data on server. ", err );
                } else {


                }
            });
        }
    });
}
