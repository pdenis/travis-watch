if (Meteor.isClient) {

    function drawChart(repo) {
        var ctx = document.getElementById("chart-" + repo.slug).getContext("2d");

        var data = [
            {
                value: repo.classes_count.critical,
                color:"green",
                highlight: "#FF5A5E",
                label: "Critical"
            },
            {
                value: repo.classes_count.very_good,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Véry Good"
            },
            {
                value: repo.classes_count.satisfactory,
                color: "#FDB45C",
                highlight: "#FFC870",
                label: "Satisfactory"
            },
            {
                value: repo.classes_count.pass,
                color: "#949FB1",
                highlight: "#A8B3C5",
                label: "Pass"
            },
            {
                value: repo.classes_count.good,
                color: "#4D5360",
                highlight: "#616774",
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
