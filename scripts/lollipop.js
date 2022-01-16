var current_park_index,day;
var g;

function lollipop(week_day, park_index,type) {
    initialize(week_day, park_index,type);
    draw_lollipop();
}

function initialize(week_day, park_index,type){
    if(week_day === undefined){
        week_day = document.getElementById("week_days").value;
    }
    if(park_index === undefined){
        park_index = current_park_index
    }
    if(type === undefined){
        type = cluster_type
    }
    current_park_index = park_index;
    day = week_day;
}

function draw_lollipop(){
    var current_data = get_cluster_data(day,cluster_type);
    draw_lollipop_axes(current_data);
}

function get_cluster_data(weekday,cluster_type){
    var cluster_data = "cluster_"+cluster_type+"_"+weekday;
    return TABLES[cluster_data];
}

function draw_lollipop_axes(current_data){
    var parseTime = d3.timeParse("%m/%d/%Y %H:%M");
    var color = d3.scaleOrdinal((d3.schemeCategory10))
    .domain([0, 1, 2, 3, 4])

    let extent = getExtentsForDayCheckIn(current_data);

    lollipop_svg.selectAll("g").remove();
    g = lollipop_svg.append('g')
        .attr("opacity", 1)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xScale = d3.scaleTime()
        .domain(d3.extent(current_data, function(d){return parseTime(d["Timestamp"]);
        }))
        .range([0, width]);
    var yScale = d3.scaleLinear()
        .domain(extent)
        .range([height, 0]);
    const xAxis = d3.axisBottom(xScale)
        .ticks(20);

    g.append("g")
        .attr("class","x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    const yAxis = d3.axisLeft(yScale)
        .ticks(10);
    g.append("g")
        .attr("class","y_axis")
        .call(yAxis);


    g.selectAll("myline")
    .data(current_data)
    .enter()
    .append("line")
        .attr("x1", function(d) { return xScale(parseTime(d["Timestamp"])) + 8; })
        .attr("x2", function(d) { return xScale(parseTime(d["Timestamp"])) + 8; })
        .attr("y1", function(d) { return yScale(d[current_park_index]); })
        .attr("y2", yScale(0))
        .attr("stroke", "black")
    
    g.selectAll("mycircle")
    .data(current_data)
    .enter()
    .append("circle")
        .attr("cx", function(d) { return xScale(parseTime(d["Timestamp"])) + 8; })
        .attr("cy", function(d) { return yScale(d[current_park_index]); })
        .attr("r", "5")
        .style("fill", function (d) { return color(cluster_type); })
        .attr("stroke", "pink")
    .on("mouseover", function(d, i){
        d3.select(this)
        .transition()
        .duration(50)
        .style("opacity", 0.85)
        .attr("r", "10")

        tooltip.transition()
        .duration(50)
        .style("opacity", 0.85)

        tooltip.html("Number of check-ins : " + d[current_park_index])
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY -15) + "px")
            .style("font-size", "12px")
            .style("font-weight", "700")
    })
    .on("mouseout", function() {
        d3.select(this)
        .transition()
        .duration(50)
        .style("opacity", 1)
        .attr("r", "5")

        tooltip.transition()
        .duration(50)
        .style("opacity", 0)
    })

    var real_word_name = "";
    ride_details.forEach(function (d){if(d["Park Guide Index"] === current_park_index){real_word_name =d["Real World Type"]}});

    g.append("text")
        .text("Timestamp")
        .style("text-anchor", "middle")
        .style("font", "25px")
        .style("font-weight", "850")
        .style("fill", "black")
        .style("opacity", 1)
        .attr('class', 'axis-label')
        .attr("x", (width/2))
        .attr("y", (height + margin.top + 20));
    
    g.append("text")
        .text("Visitor Count At " + real_word_name)
        .style("fill", "black")
        .style("text-anchor", "middle")
        .style("font", "25px")
        .style("font-weight", "850")
        .attr("transform", "rotate(-90)")
        .style("opacity", 1)
        .attr('class', 'axis-label')
        .attr("x", - height/2)
        .attr("y", - margin.left + 30)
        .attr("dy", "11px");
}

function getExtentsForDayCheckIn(current_data) {
    var max = Number.MIN_VALUE;
    var min = Number.MAX_VALUE;

    current_data.forEach(function (d){
        let val = +d[current_park_index]
        if(val > max){
            max = val;
        }
        if(val < min){
            min = val;
        }
    })
    return [min,max];
  }