var cluster_type;

var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

function Park() {
    svg_img.append('image')
        .attr("opacity", 0.4)
        .attr('xlink:href', 'images/park-map.jpg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    bubble_chart(0);
}

function bubble_chart(type) {
    cluster_type = type;

    draw_axes_circles();
    mouse_events();
    background_text();
    add_legend();
    draw_bubbles();

}

function draw_axes_circles() {
    // var colorScale = d3.scaleOrdinal((d3.schemeCategory10))
    //     .domain([0, 1, 2, 3, 4])

    x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, 800]);

    y = d3.scaleLinear()
        .domain([0, 100])
        .range([800, 0]);

    svg_img.selectAll("dot")
        .data(ride_details)
        .enter()
        .append('g')
        .attr("class", "circleElement")
        .append("circle")
        .attr("cx", function (d) { return x(+d['x-coor entrance']); })
        .attr("cy", function (d) { return y(+d['y-coor entrance']); })
        .attr("r", 0)
        .attr("stroke", "black")
        .style("opacity", 0.8)
        //.style("fill", function (d) { return colorScale(cluster_type); })
        .attr("id", function (d) {
            // console.log(d['Park Guide Index']);
            return d['Park Guide Index'] })
}

function draw_bubbles(){
    cluster_type = document.getElementById("cluster").value
    console.log(cluster_type)
    var colorScale = d3.scaleOrdinal((d3.schemeCategory10))
        .domain([0, 1, 2, 3, 4])

    svg_img.selectAll(".circleElement").select("circle")
    .style("fill", function (d) { return colorScale(cluster_type); })

    var day_choice = document.getElementById("week_days").value;
    var ts_choice = document.getElementById("timestamp_input").value;

    d3.select("#background_indicator").text(day_choice + " - " + ts_choice);

    let filtered_data = get_filtered_data(day_choice, ts_choice);

    applyRScale(filtered_data)
}

function get_filtered_data(day_choice, ts_choice){

    var final_data = [];
    var parse_time = d3.timeParse("%m/%d/%Y %H:%M");
    var parse_selected_time = d3.timeParse("%H:%M");

    var selected_time = parse_selected_time(ts_choice);
  
    if(selected_time === null || selected_time.getMinutes() % 15 !== 0 || selected_time.getHours() < 8 || selected_time.getHours() > 23){
        alert("Park time is from 8:00 to 23:00");
        document.getElementById("timestamp_input").value = "08:00";
        selected_time = parse_selected_time("08:00");
    }

    var cluster_day_data;
    cluster_day_data  = get_cluster_day_data(day_choice,cluster_type)
    
    cluster_day_data.filter(function(d){
        if(selected_time.getHours() === parse_time(d["Timestamp"]).getHours() && selected_time.getMinutes() === parse_time(d["Timestamp"]).getMinutes()){
            var filtered_time_data = Object.values(d);
            filtered_time_data.pop();
            filtered_time_data.forEach(function (d){
                final_data.push( [ +d ] )
            })
        }
    });
    return final_data;
}
function get_cluster_day_data(day_choice){
    let cluster_data = "cluster_"+cluster_type+"_"+day_choice
    // console.log("cluster_data",TABLES[cluster_data]);
    return TABLES[cluster_data];
}

function applyRScale(filtered_data){
    let extent = getExtentsForCheckInCount(filtered_data);
    let sc_rad = d3.scaleLinear().domain(extent).range([7, 30]);

    svg_img.selectAll("circle")
        .data(filtered_data)
        .transition()
        .duration(500)
        .attr("r", function (d){
            if(d[0]!=0)
             return sc_rad(d[0]);
        });
}
function getExtentsForCheckInCount(filtered_data) {
    var max = Number.MIN_VALUE;
    var min = Number.MAX_VALUE;

    filtered_data.forEach(function (d){
        let val = d[0]
        if(val > max){
            max = val;
        }
        if(val < min){
            min = val;
        }
    })
    return [min,max];
  }

function dec(){
    var ts_choice = document.getElementById("timestamp_input").value;

    time_split = ts_choice.split(":");
    setDec(+time_split[0], +time_split[1]);
    draw_bubbles();
}

function setDec(hour, minute){
    if(hour < 8 || (hour === 8 && minute === 0)){
        alert("Park time is from 8:00 to 23:00");
    }
    if(hour>8 && minute === 0){
        hour -= 1;
        minute = 60 - 15;
    }
    else{
        minute -= 15;
    }

    ts_choice = hour.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0");
    document.getElementById("timestamp_input").value = ts_choice;
}
function inc(){
    var ts_choice = document.getElementById("timestamp_input").value;

    var time_split = ts_choice.split(":");
    setInc(+time_split[0], +time_split[1]);   
    draw_bubbles();
}

function setInc(hour, minute){
    if(hour < 23){ 
        minute += 15; 
        if(minute === 60){ 
            minute = 0;
            hour += 1;
        }
    } else{
        alert("Park time is from 8:00 to 23:00");
    }
    
    ts_choice = hour.toString().padStart(2, "0") + ":" + minute.toString().padStart(2, "0");
    document.getElementById("timestamp_input").value = ts_choice;
}

function background_text(){
    var day_choice = document.getElementById("week_days").value;
    var ts_choice = document.getElementById("timestamp_input").value;

    svg_img.append("text")
        .text(day_choice + " - " + ts_choice)
        .style("font-size", "25px")
        .style("font-weight", "750")
        .style("fill", "black")
        .attr("id", "background_indicator")
        .style("text-anchor", "left")
        .attr('opacity', 0.8)
        .attr("transform", "translate(" + (10) + "," + (25) + ")");
}

function add_legend(){
var clusters = ["Families", "Adults", "Strollers", "Breezy", "Adrenaline-Junkies"]
//var clusters = ["Cluster 0", "Cluster 1","Cluster 2","Cluster 3","Cluster 4"]
var color = d3.scaleOrdinal(d3.schemeCategory10).domain(clusters)

var size = 20
svg_img.selectAll("mydots")
    .data(clusters)
    .enter()
    .append("circle")
    .attr("cx", 30)
    .attr("cy", function (d, i) { 
        // console.log(i * (size) + 50)
        return i * (size) + 50 })
    .attr("r", 7)
    .style("fill", function (d,i) { return color(d) })

    svg_img.selectAll("mylabels")
    .data(clusters)
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", function (d, i) { 
        // console.log(i * (size) + 51)
        return i * (size) + 51 })
    .style("fill", function (d) { return color(d) })
    .text(function (d) { return d })
    .style("font-size", "16px")
    .style("font-weight", 650)
    .style("alignment-baseline", "middle")
}

function mouse_events(){

    svg_img.selectAll(".circleElement")
        .on("mouseover", function(d){
            d3.select(this).selectAll("circle")
                .transition()
                .duration(50)
                .style('opacity', 0.85)
                .attr("stroke-width", "4")
                .style("stroke", "cyan")
                .attr("fill", "none")
            tooltip.transition()
                .duration(50)
                .style("opacity", 0.85);
            tooltip.html(d["Real World Type"])
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY -15) + "px")
                .style("font-size", "11px")
                .style("font-weight", "600");
        })
        .on('mouseout', function() {
            d3.select(this).selectAll("circle")
            .transition()
            .duration(50)
            .style('opacity', 1)
            .attr("stroke-width", "0.5")
            .style("stroke", "black")
            .attr("fill", "none")
        tooltip.transition()
            .duration(50)
            .style("opacity", 0);
        })
        .on('click', function (d){
            let day_choice = document.getElementById("week_days").value;
            lollipop(day_choice, d["Park Guide Index"],cluster_type)
            radialBar(day_choice, d["Park Guide Index"])
            // radial_chart(day_choice, d["Park Guide Index"])
        });       
}

function reset(){
    /** Reset the input timestamp **/
    document.getElementById("timestamp_input").value = "08:00";
    draw_bubbles();
}