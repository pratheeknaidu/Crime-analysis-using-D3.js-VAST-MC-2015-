var svg_img, lollipop_svg, bar_svg ;

var margin = { top: 20, right: 60, bottom: 60, left: 100 };
var width = 800 - margin.left - margin.right;
var height = 800 - margin.top - margin.bottom;
var x, y;
var sc_rad;

var TABLES;
var ride_details;
var cluster_0_Friday,cluster_1_Friday,cluster_2_Friday,cluster_3_Friday,cluster_4_Friday;
var cluster_0_Saturday,cluster_1_Saturday,cluster_2_Saturday,cluster_3_Saturday,cluster_4_Saturday;
var cluster_0_Sunday,cluster_1_Sunday,cluster_2_Sunday,cluster_3_Sunday,cluster_4_Sunday;
var friday_cluster_checkin, saturday_cluster_checkin, sunday_cluster_checkin

document.addEventListener('DOMContentLoaded', function() {
    svg_img = d3.select("#image-svg");
    lollipop_svg = d3.select("#lollipop-svg");
    bar_svg = d3.select("#bar-chart-svg");
    
    Promise.all(
        [
            d3.csv("data/Ride-Details.csv"),
            d3.csv("data/cluster_0_Friday.csv"),
            d3.csv("data/cluster_1_Friday.csv"),
            d3.csv("data/cluster_2_Friday.csv"),
            d3.csv("data/cluster_3_Friday.csv"),
            d3.csv("data/cluster_4_Friday.csv"),
            d3.csv("data/cluster_0_Saturday.csv"),
            d3.csv("data/cluster_1_Saturday.csv"),
            d3.csv("data/cluster_2_Saturday.csv"),
            d3.csv("data/cluster_3_Saturday.csv"),
            d3.csv("data/cluster_4_Saturday.csv"),
            d3.csv("data/cluster_0_Sunday.csv"),
            d3.csv("data/cluster_1_Sunday.csv"),
            d3.csv("data/cluster_2_Sunday.csv"),
            d3.csv("data/cluster_3_Sunday.csv"),
            d3.csv("data/cluster_4_Sunday.csv"),
            d3.json("data/Spot_Clus_Fri.json"),
            d3.json("data/Spot_Clus_Sat.json"),
            d3.json("data/Spot_Clus_Sun.json")
        ]
    ).then(function(values){
        ride_details = values[0];
        cluster_0_Friday = values[1];
        cluster_1_Friday = values[2];
        cluster_2_Friday = values[3];
        cluster_3_Friday = values[4];
        cluster_4_Friday = values[5];
        cluster_0_Saturday = values[6];
        cluster_1_Saturday = values[7];
        cluster_2_Saturday = values[8];
        cluster_3_Saturday = values[9];
        cluster_4_Saturday = values[10];
        cluster_0_Sunday = values[11];
        cluster_1_Sunday = values[12];
        cluster_2_Sunday = values[13];
        cluster_3_Sunday = values[14];
        cluster_4_Sunday = values[15];
        friday_cluster_checkin = values[16]
        saturday_cluster_checkin = values[17]
        sunday_cluster_checkin = values[18]
        
        TABLES = {
            "ride_details": ride_details,
            "cluster_0_Friday": cluster_0_Friday,
            "cluster_1_Friday": cluster_1_Friday,
            "cluster_2_Friday": cluster_2_Friday,
            "cluster_3_Friday": cluster_3_Friday,
            "cluster_4_Friday": cluster_4_Friday,
            "cluster_0_Saturday": cluster_0_Saturday,
            "cluster_1_Saturday": cluster_1_Saturday,
            "cluster_2_Saturday": cluster_2_Saturday,
            "cluster_3_Saturday": cluster_3_Saturday,
            "cluster_4_Saturday": cluster_4_Saturday,
            "cluster_0_Sunday": cluster_0_Sunday,
            "cluster_1_Sunday": cluster_1_Sunday,
            "cluster_2_Sunday": cluster_2_Sunday,
            "cluster_3_Sunday": cluster_3_Sunday,
            "cluster_4_Sunday": cluster_4_Sunday,
            friday_cluster_checkin,
            saturday_cluster_checkin,
            sunday_cluster_checkin
        }
        /** 1st Row **/
        Park()

    })
});
