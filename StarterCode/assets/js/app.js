//#D3 Dabbler
console.log("in the JS")

//Create a scatter plot between two of the data variables such as `Healthcare vs. Poverty` or `Smokers vs. Age`.
// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 500;
// zoom = 10;

// Create chart margins
var chartMargin = {
  top: 40,
  right: 20,
  bottom: 50,
  left: 50
};

// Define the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;



var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')



  .attr('transform', 'translate(' + chartMargin.left + ',' + chartMargin.top + ')');
var chartGroup = svg.append("g")

//Using the D3, create a scatter plot that represents each state with circle data points
//pull data from `data.csv` by using the `d3.csv` function. 

d3.csv("assets/data/data.csv").then(function(healthData) {
  // if (error) throw error;
    console.log("inside d3 csv")

    console.log(healthData)

    for (var i = 0; i < healthData.length; i++) {
        console.log(i, healthData[i].state, healthData[i].smokes, healthData[i].age );
        console.log(i, healthData[i].state, healthData[i].poverty, healthData[i].healthcare );
      }
    // Cast the smokes value to a number for each piece of healthData
    healthData.forEach(function(data) {
      data.smokes = +data.smokes;
      data.age = +data.age;
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    //y scaled to chart height
    var yLinearScale = d3.scaleLinear().range([chartHeight, 0]);
    //x scaled to chart width.
    var xLinearScale = d3.scaleLinear().range([0, chartWidth]);

    //axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);  

    xLinearScale.domain([8,
        d3.max(healthData, function(data) {
        return +data.smokes * 1.1;
        return +data.poverty * 1.1;
      }),
    ]);

    yLinearScale.domain([28,
        d3.max(healthData, function(data) {
        return +data.age * 1.1;
        return +data.healthcare * 1.1;
      }),
    ]);

          // Tool tip
          var toolTip = d3
          .tip()
          .attr('class', 'd3-tip')
          .offset([-10, 30])
          .html(function(data) {
              var state = data.state;
              var smokes = +data.smokes;
              var age = +data.age;
              var poverty = +data.poverty;
              var healthcare = +data.healthcare;
              return (
              state + '<br> Smoking Percentage: ' + smokes + '<br> Age: ' + age
              );
          });
    
        svg.call(toolTip);

      //Scatter code
      chartGroup
      .selectAll('circle')
      .data(healthData)
      .enter()
      .append('circle')
      .attr('cx', function(data, index) {
        return xLinearScale(data.smokes);
        return xLinearScale(data.poverty);
      })
      .attr('cy', function(data, index) {
        return yLinearScale(data.age);
        return yLinearScale(data.healthcare);
      })
      .attr('r', '16')
      .attr('fill', 'purple')
      .attr('fill-opacity',0.5)

      //hover over the point and show data
      .on("mouseover",function(data) {
        toolTip.show(data, this);
      })
      // Hide the mouseout
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
      chartGroup
      .append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append('g').call(leftAxis);

    svg.selectAll(".dot")
    .data(healthData)
    .enter()
    .append("text")
    .text(function(data) { return data.abbr; })
    .attr('x', function(data) {
      return xLinearScale(data.smokes);
    })
    .attr('y', function(data) {
      return yLinearScale(data.age);
    })
    .attr("font-size", "10px")
    .attr("fill", "black")
    .style("text-anchor", "middle");

    // x-axis
    chartGroup
      .append('text')
      .attr(
        'transform',
        'translate(' + chartWidth / 2 + ' ,' + (chartHeight + chartMargin.top) + ')',
      )
      .attr('class', 'axisText')
      .text('Smoking');  

    chartGroup
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', 0 - chartHeight / 2)
      .attr('dy', '1em')
      .attr('class', 'axisText')
      .text('Age');

  });
   

      //Use `python -m http.server` to run the visualization. This will host the page at `localhost:8000` in your web browser.