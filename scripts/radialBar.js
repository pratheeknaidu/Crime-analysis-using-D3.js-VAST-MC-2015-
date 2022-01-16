const radius = height / 2 - 40
const color = d3.scaleOrdinal(d3.schemeCategory10)
const PI = Math.PI, arcMinRadius = 10, arcPadding = 10 ,labelPadding = -10 ,numTicks = 10
const numArcs = 5
const arcWidth = (radius - arcMinRadius - numArcs * arcPadding) / numArcs

var arc

function radialBar(weekday, park_index)
{
    bar_svg.selectAll("g").remove()
    var g = bar_svg.append('g').attr('transform', 'translate(' + (width / 2 + 40) + ',' + (height / 2) + ')')
    var currentTable
    if(weekday === "Friday") currentTable = TABLES["friday_cluster_checkin"]
    else if(weekday === "Saturday") currentTable = TABLES["saturday_cluster_checkin"]
    else currentTable = TABLES["sunday_cluster_checkin"]
    
    var data = currentTable[park_index]
    if(data == undefined) return
    var scale = d3.scaleLinear().domain([0, d3.max(data)*1.1]).range([0, 2*PI])
    var ticks = scale.ticks(numTicks).slice(0, -1)

    arc = d3.arc()
    .innerRadius((d, i) => get_inner_radius(i))
    .outerRadius((d, i) => get_outer_radius(i))
    .startAngle(0)
    .endAngle((d, i) => scale(d))    

    var rAxis = g.append("g").attr("class","r-axis").selectAll("g").data(data).enter().append("g")
    rAxis.append("circle").attr('r', (d, i) => get_outer_radius(i) + arcPadding)
    //rAxis.append("text").attr("x", labelPadding).attr("y",(d, i) => -get_outer_radius(i) + arcPadding).text((d, i) => i)

    var aAxis = g.append("g").attr("class","a-axis").selectAll("g").data(ticks).enter().append("g")
    .attr('transform', d => 'rotate(' + (r2d(scale(d)) - 90) + ')')

    aAxis.append("line").attr("x2", radius)

    aAxis.append('text')
    .attr('x', radius + 10)
    .style('text-anchor', d => (scale(d) >= PI && scale(d) < 2 * PI ? 'end' : null))
    .attr('transform', d => 'rotate(' + (90 - r2d(scale(d))) + ',' + (radius + 10) + ',0)')
    .text(d => d)

    var arcs = g.append("g")
    .attr('class', 'data')
    .selectAll('path')
      .data(data)
      .enter().append('path')
      .attr('class', 'arc')
      .style('fill', (d, i) => color(i))

    arcs.transition().delay((d, i) => i * 200).duration(1000).attrTween('d', drawArcs)

    arcs.on('mousemove', function(d, i) {
        d3.select(this)
        .transition()
        .duration(50)
        .style("opacity", 0.85)

        tooltip.transition()
        .duration(50)
        .style("opacity", 0.85)

        tooltip.html("Number of visitors of type " + clust[i] + " are " + d)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY -15) + "px")
            .style("font-size", "12px")
            .style("font-weight", "700")
    })

    arcs.on('mouseout', function() {
        d3.select(this)
        .transition()
        .duration(50)
        .style("opacity", 1)

        tooltip.transition()
        .duration(50)
        .style("opacity", 0)
    })
    
    var legend = bar_svg.append("g").attr("class","legend").attr("transform", `translate(${width},${margin.top})`)
    legend.append("circle").attr("cx", 10).attr("cy", 10).attr("r", 6).style("fill", color(0))
    legend.append("circle").attr("cx", 10).attr("cy", 30).attr("r", 6).style("fill", color(1))
    legend.append("circle").attr("cx", 10).attr("cy", 50).attr("r", 6).style("fill", color(2))
    legend.append("circle").attr("cx", 10).attr("cy", 70).attr("r", 6).style("fill", color(3))
    legend.append("circle").attr("cx", 10).attr("cy", 90).attr("r", 6).style("fill", color(4))

    legend.append("text").attr("x", 20).attr("y", 15).text("Families").style("fill", color(0))
    legend.append("text").attr("x", 20).attr("y", 35).text("Adults").style("fill", color(1))
    legend.append("text").attr("x", 20).attr("y", 55).text("Strollers").style("fill", color(2))
    legend.append("text").attr("x", 20).attr("y", 75).text("Breezy").style("fill", color(3))
    legend.append("text").attr("x", 20).attr("y", 95).text("Adrenaline-Junkies").style("fill", color(4))
    //console.log(currentTable[park_index])

    var name = "";
    ride_details.forEach(function (d){if(d["Park Guide Index"] === park_index){name = d["Real World Type"];}});
    if(name === ""){name = "Entrance"}

    bar_svg.append("g")
    //.enter()
    .append("text")
    .attr("class","label")
    .attr("x", margin.left)
    .attr("y", margin.top + height)
    .style("opacity", 0.4)
    .style("font-size", "50px")
    .text("Location : " + name)
    
}

function drawArcs(d, i) {
    let interpolate = d3.interpolate(0, d);
    return t => arc(interpolate(t), i);
}

const get_inner_radius = (i) => arcMinRadius + (numArcs - (i + 1)) * (arcWidth + arcPadding)

const get_outer_radius = (i) =>  get_inner_radius(i) + arcWidth

const r2d = (angle) => angle*180/PI

const clust = ["Families", "Adults", "Strollers", "Breezy", "Adrenaline-Junkies"]