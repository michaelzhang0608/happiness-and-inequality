
  var height = 1400
  var width = 1400
  d3.json("datapoints.json", d3.autotype).then((data) => {
    margin = { "top": 100, "right": 300, "bottom": 400, "left": 160 };
    const svg = d3.select("svg.plot");
    var chart_width = width - margin.left - margin.right
    var chart_height = height - margin.top - margin.bottom
    const giniExtent = d3.extent(data, d => d['gini'])
    const ethnicExtent = d3.extent(data, d => d['ethnic'])
    const happyExtent = d3.extent(data, d => d['happiness'])
    const giniScale = d3.scaleLinear().domain([25, 50]).range([0, chart_width])
    const ethnicScale = d3.scaleLinear().domain(ethnicExtent).range([15, 45])
    const happyScale = d3.scaleLinear().domain([3, 8]).range([chart_height, 0])


    let leftAxis = d3.axisLeft(happyScale)
    let bottomAxis = d3.axisBottom(giniScale)
    let leftGridlines = d3.axisLeft(happyScale).tickFormat("").tickSize(-chart_width - 10)
    let bottomGridlines = d3.axisBottom(giniScale).tickFormat("").tickSize(-chart_height - 10)
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (margin.left - 10) + "," + (margin.top) + ")")
      .call(leftAxis);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_height + 10) + ")")
      .call(bottomAxis);
    svg.append("g")
      .attr("class", "y gridlines")
      .attr("transform", "translate(" + (margin.left - 10) + "," + (margin.top) + ")")
      .call(leftGridlines);
    svg.append("g")
      .attr("class", "x gridlines")
      .attr("transform", "translate(" + margin.left + "," + (margin.top + chart_height + 10) + ")")
      .call(bottomGridlines);
    svg.append("text")
      .attr("x", -600)
      .attr("y", 60)
      .text("Happiness Score")
      .attr("transform", "rotate(270)")
    svg.append("text")
      .attr("x", 600)
      .attr("y", 1080)
      .text("Gini Coefficient")
    var label_height = margin.top + 10;
    data.forEach(d => {
      svg.append("svg:image")
        .attr("href", "https://hatscripts.github.io/circle-flags/flags/" + d['iso'] + ".svg")
        .attr("height", ethnicScale(d['ethnic']) * 2)
        .attr("width", ethnicScale(d['ethnic']) * 2)
        .attr("x", giniScale(d['gini']) + 139) // this is because the center of the image doesn't exactly align with the datapoint
        .attr("y", happyScale(d['happiness']) + 84) // this is because the center of the image doesn't exactly align with the datapoint
      svg.append("svg:image")
        .attr("href", "https://hatscripts.github.io/circle-flags/flags/" + d['iso'] + ".svg")
        .attr("height", 21)
        .attr("width", 21)
        .attr("x", "1120")
        .attr("y", label_height)
      svg.append("text")
        .attr("x", "1160")
        .attr("y", label_height + 16)
        .text(d['country'])
      label_height = label_height + 40
    })
    var circle_height = 1200
    var radius = 15
    for (i = 400; i < 1000; i += 100) {
      svg.append("circle")
        .attr("cx", i)
        .attr("cy", circle_height)
        .attr("r", radius)
        .attr("fill", "black")
      var radius = radius + 6
    }
    svg.append("text")
      .attr("x", "300")
      .attr("y", "1300")
      .text("Low ethnic fractionalization")
    svg.append("text")
      .attr("x", "800")
      .attr("y", "1300")
      .text("High ethnic fractionalization")
    svg.append("rect")
      .attr("x", 290)
      .attr("y", 1130)
      .attr("height", 180)
      .attr("width", 750)
      .attr("fill", "none")
      .attr("stroke", "black")
  })
    
  svg2 = d3.select("svg.svg2")
  svg2.selectAll("path").attr("fill", "gray")
  d3.csv("happiness.csv", d3.autotype).then((data) => {
    var happyExtent2 = d3.extent(data, d => d['Score'])
    var happyScale2 = d3.scaleSequential(d3.interpolateGreens).domain(happyExtent2)
    data.forEach(d => {
      if (!d['Country or region'].includes(" ")) {
        svg2.selectAll("path." + d['Country or region']).attr("fill", happyScale2(d['Score']))
      }
      else {
        svg2.selectAll("path." + d['Country or region'].split(" ").join(".")).attr("fill", happyScale2(d['Score']))
      }
    })
  })
  svg3 = d3.select("svg.svg3")
  svg3.selectAll("path").attr("fill", "gray")
  d3.json("ethnic_data.json", d3.autotype).then((data) => {
    var ethnicExtent2 = d3.extent(data, d => {
      if (typeof (d['ethnicFractionalization']) == 'string') {
        return parseFloat(d['ethnicFractionalization'])
      }
      else {
        return 0
      }
    })
    var ethnicScale2 = d3.scaleSequential(d3.interpolateReds).domain(ethnicExtent2)
    console.log(ethnicScale2(0.09))
    data.forEach(d => {
      if (!d['country'].includes(" ")) {
        svg3.selectAll("path." + d['country']).attr("fill", ethnicScale2(d['ethnicFractionalization']))
      }
      else {
        svg3.selectAll("path." + d['country'].split(" ").join(".")).attr("fill", ethnicScale2(d['ethnicFractionalization']))
      }
    })
  })
