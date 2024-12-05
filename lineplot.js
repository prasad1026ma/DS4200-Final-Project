// Load the data from CSV
const maangstock = d3.csv("maang_data.csv");

// Once the data is loaded, proceed with plotting
maangstock.then(function(data) {
    // Convert string values to numbers and parse the date
    const parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(function(d) {
        d.Date = parseDate(d.Date);
        d.Apple_Avg = +d.Apple_Avg;
        d.Amazon_Avg = +d.Amazon_Avg;
        d.Microsoft_Avg = +d.Microsoft_Avg;
        d.Netflix_Avg = +d.Netflix_Avg;
        d.Google_Avg = +d.Google_Avg;
    });

    // Define the dimensions and margins for the SVG
    const width = 800,
          height = 500;

    const margin = {
        top: 30,
        bottom: 50,
        left: 50,
        right: 100
    };

    // Create the SVG container
    const svg = d3.select('#lineplot')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up scales for x and y axes
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Date))
        .range([0, width - margin.left - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => Math.max(d.Apple_Avg, d.Amazon_Avg, d.Microsoft_Avg, d.Netflix_Avg, d.Google_Avg))])
        .range([height - margin.top - margin.bottom, 0]);

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale).ticks(10));

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add x-axis label
    svg.append('text')
        .attr('x', width/2 - 50)
        .attr('y', 455)
        .text('Date')
        .style('text-anchor', 'middle')

    // Add y-axis label
    svg.append('text')
        .attr('x', 0 - height/2)
        .attr('y', -30)
        .text('Average Stock Price')
        .attr('transform', 'rotate(-90)')

    // Define line generator function
    const lineGenerator = d3.line()
        .x(d => xScale(d.Date))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    // Define companies, their colors, and line styles
    const companies = [
        {name: 'Apple_Avg', color: 'orange'},      
        {name: 'Amazon_Avg', color: 'blue'},     
        {name: 'Microsoft_Avg', color: 'green'}, 
        {name: 'Netflix_Avg', color: 'red'},
        {name: 'Google_Avg', color: 'purple'}
    ];

    // Draw lines for each company
    companies.forEach(company => {
        svg.append("path")
            .datum(data.map(d => ({Date: d.Date, value: d[company.name]})))
            .attr("fill", "none")
            .attr("stroke", company.color)
            .attr("stroke-width", 2)
            .attr("d", lineGenerator);
    });

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(companies)
        .enter().append("g")
        .attr("transform", (d, i) => "translate(650," + (i * 20 - 10) + ")");


    legend.append("rect")
        .attr("x", 0)
        .attr("y", 5)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", d => d.color);

    legend.append("text")
        .attr("x", 20)
        .attr("y", 15)
        .text(d => d.name.replace('_Avg', ''));

    const annotations = [
        { date: "2008-09-01", text: "Start of Crisis", yValue: 30 },
        { date: "2011-04-13", text: "End of Crisis", yValue: 40 }
    ];
    
    annotations.forEach(annotation => {
        const x = xScale(parseDate(annotation.date));
        const y = yScale(annotation.yValue);
    
            // Add a vertical line
        svg.append("line")
            .attr("x1", x)
            .attr("x2", x)
            .attr("y1", y)
            .attr("y2", height - margin.top - margin.bottom)
            .attr("stroke", "black")
            .attr("stroke-dasharray", "4 4");
    
            // Add a text box
        svg.append("text")
            .attr("x", x - 32)
            .attr("y", y - 10)
            .attr("fill", "black")
            .style("font-size", "9px")
            .text(annotation.text);
    });
});
