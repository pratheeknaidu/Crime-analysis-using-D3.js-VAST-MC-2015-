var textdoc
window.onload = function(){
  drawTreeMap()
  drawLegend()
  textdoc = d3.select("#map").append("div")
  .attr("class", "textdocs")
  .style("opacity", 0)
  .style("width", "fit-content")
  .style("height", "fit-content")
  .style("position", "absolute")
  .style("background", "white")
}

function drawTreeMap(){
  
  const margin = {top: 5, right: 10, bottom: 5, left: 10},
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

  const color = d3.scaleOrdinal(['#e41a1c','#377eb8','#4daf4a','#ff7f00','#984ea3'])
  
  const svg = d3.select("#treemap")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left}, ${margin.top})`);

  d3.json("data/cluster.json").then(function(data) {

    var root = d3.hierarchy(data, (node) => {
      return node['children']
    }).sum((node) => {
        return node['value']
    }).sort((node1, node2) => {
        return node2['value'] - node1['value']
    })

    d3.treemap()
      .size([width, height])
      .padding(3)
      .paddingInner(3)
      (root)

    var opacity = d3.scaleLinear()
    .domain([1, 8])
    .range([.5,1])
    
    svg
      .selectAll("rect")
      .data(root.leaves())
      .join("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) { return (d.x1 - d.x0); })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("opacity", function(data){  
          var category = data['data']['name']
          
          if (category === 'Thrill') {
            return opacity(8)
        } else if (category === "Entrance") {
            return opacity(7)
        } else if (category === "Kiddie") {
            return opacity(3)
        } else if (category === "Everybody") {
            return opacity(5)
        } else if (category === "Pavilion") {
            return opacity(4)
        } else if (category === "First Aid") {
            return opacity(6)
        } else if (category === "Show Hall") {
            return opacity(2)
        } return opacity(1)
        })
        .attr('fill', function(data) {

          return color(data['data']['cluster']-1)
        })
        .on('mouseover', function(data) {
          d3.select(this).style('opacity', '.5');
          textdoc.transition().duration(50).style("opacity", 1);
          var textval = data['data']['name'] + ": "+ data['value']
          textdoc.html(textval).style("left", (d3.event.pageX+5) + "px").style("top", (d3.event.pageY+5) + "px")
          .style("text-align",'center')
          .style("padding",'.5rem')
          .style("background",'white')
          .style("color",'#313639')
          .style("border",'1px solid #313639')
          .style("border-radius",'8px')
          .style("pointer-events",'none')
          .style("font-size",'1.3rem')
      })
        .on('mouseout', function(data) {
          d3.select(this).style("opacity", function(data){  
            var category = data['data']['name']
            
            if (category === 'Thrill') {
              return opacity(8)
          } else if (category === "Entrance") {
              return opacity(7)
          } else if (category === "Kiddie") {
              return opacity(3)
          } else if (category === "Everybody") {
              return opacity(5)
          } else if (category === "Pavilion") {
              return opacity(4)
          } else if (category === "First Aid") {
              return opacity(6)
          } else if (category === "Show Hall") {
              return opacity(2)
          } return opacity(1)
          })
          textdoc.transition().duration(50).style("opacity", 0);
          textdoc.html("")
      })
      .on('click', function(data){
        drawPieChart(data)
      })
    
    svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+4})    
      .attr("y", function(d){ return d.y0+15})     
      .text(function(d){ 
        if(d.x1-d.x0>50){
          return d.data.name
        }
        else{
          return ""
        }
      })
      .attr("font-size", "15px")
      .attr("fill", "black")
      .attr("font-weight", "bold")
  })
}

function drawPieChart(d){
    
  var svg_pie = d3.select("#piechart")
  svg_pie.select(".pie_chart").remove()

  var cluster = d['data']['cluster']-1
  var ride = d['data']['name']
  const data = {}
  radius = 250

  g = svg_pie.append("g").attr("class", "pie_chart").attr("transform", "translate(" + 280 + "," + 300 + ")")
  
  d3.json("data/Fri_Sun_pie.json").then(function(data_pie) {
    var all_ride = data_pie[ride]
    for(let rides in all_ride){
      data[rides] = data_pie[ride][rides][cluster]
    }
    var color_pie = d3.scaleOrdinal(d3.schemePaired)
    
    var pie = d3.pie()
    .value(function(d) {return d.value; })
    
    var data_final = pie(d3.entries(data))
    var arcs = d3.arc()
    .innerRadius(5)
    .outerRadius(radius)

  g
    .selectAll('arcs')
    .data(data_final)
    .enter()
    .append('path')
      .attr('d', arcs)
      .attr('fill', function(d){ return(color_pie(d.data.key)) })
      .attr("stroke", "black")
      .style("stroke-width", "2.5px")
      .on('mouseover', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '.5');
      })
      .on('mouseout', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '1');
      })
  g
    .selectAll('arcs')
    .data(data_final)
    .enter()
    .append('text')
    .text(function(d){ return d.data.key+": "+d.data.value})
    .attr("transform", function(d) { 
      [x, y] = arcs.centroid(d);
      var rotation = d.endAngle < Math.PI ? (d.startAngle / 2 + d.endAngle / 2) * 180 / Math.PI : (d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180 / Math.PI;
      return "translate(" + [x, y] + ") rotate(-90) rotate(" + rotation + ")";  })
    .style("text-anchor", "middle")
    .attr("font-weight", "bold")
    .style("font-size", 17)
    .attr("fill", "black")
  })
}

function drawLegend(){
  var svg_legend = d3.select("#legend").attr("transform", "translate(" + 15 + "," + 15 + ")").style("position", "absolute")

  var clusters = ["Families: 82113", "Adults: 38853", "Strollers: 71391", "Breezy: 86290", "Adrenaline-Junkies: 28767"]

  const color = d3.scaleOrdinal(['#377eb8','#ff7f00','#4daf4a','#e41a1c','#984ea3'])

  svg_legend.selectAll("mydots")
    .data(clusters)
    .enter()
    .append("circle")
      .attr("cx", 100)
      .attr("cy", function(data,i){ return 50+i*25})
      .attr("r", 7)
      .style("fill", function(data){ return color(data)})

  svg_legend.selectAll("mylabels")
    .data(clusters)
    .enter()
    .append("text")
      .attr("x", 120)
      .attr("y", function(data,i){ return 50+i*25}) 
      .style("fill", function(data){ return color(data)})
      .text(function(data){ return data})
      .attr("text-anchor", "left")
      .attr("font-weight", "bold")
      .style("alignment-baseline", "middle")
}