
    let data

	 // simply call the update function with the supplied data

    // create svg with margin convention

    const margin = {top:20, left:45, right:20, bottom:20};
    const width = 650 - margin.left - margin.right; 
    const height = 500 - margin.top - margin.bottom;


    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
      // create scales

    const xScale = d3.scaleBand() //not sure about this
        //.domain(data.map(d=>d.company))
        .rangeRound([0,width])
        .paddingInner(0.1)
        
    const yScale = d3.scaleLinear()
        //.domain([0, d3.max(d3.extent(data, d=>d.stores))])
        .range([height,0]);




    svg.append("text")
        .attr("class", "y-axis-title")
        //.attr("writing-mode", "tb")
        // add attrs such as alignment-baseline and text-anchor as necessary
        .attr('alignment-baseline','baseline')
    
        .attr("dy",-10)
        .attr('font-size','12')



    function update(data,type, rev){

        console.log(data,type)
        data.sort((a,b)=>b[type]-a[type]);

        if (rev){
            data.reverse();

        }


        xScale.domain(data.map(d=>d.company));

        yScale.domain([0, d3.max(d3.extent(data, d=>d[type]))]);
         // create bars
        const bars = svg.selectAll('.bar')
            .data(data,d=>d.company);

        bars.enter()
            .append('rect')
            .attr('class','bar')
            .attr('fill','#1f76b4')
            .attr("x",d=>xScale(d.company))
            .attr("width",xScale.bandwidth())
            .attr("height",0)
            .attr("y",height)
            .merge(bars)
            .transition()
            .delay((d,i)=>i*100)
            .duration(1000)
            .attr("x",d=>xScale(d.company))
            .attr("y",d=>yScale(d[type]))
            .attr("height",d=>height-yScale(d[type]))
        
        bars.exit().remove()

        const xAxis = d3.axisBottom(xScale);

        svg.append('g')
	        .attr('class', 'axis y-axis')

        svg.append('g')
            .attr('class', 'axis x-axis')
            .attr("transform", `translate(0, ${height})`)

        svg.select('.x-axis')
            .transition()
            .duration(1000)
            .call(xAxis)

        const yAxis = d3.axisLeft(yScale);
            
        
        svg.select('.y-axis')
            .transition()
            .duration(1000)
            .call(yAxis)


        d3.select(".y-axis-title").text(type==="stores"?"Stores":"Billion USD")

        /*svg.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x",d=>xScale(d.company))
            .attr("y",d=>yScale(d[type]))
            .attr("width",xScale.bandwidth())
            .attr("height",d=>height-yScale(d[type]))
            .attr("fill","blue")

        // create axes and axis title

        const xAxis = d3
            .axisBottom(xScale)

        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);


            

        const yAxis = d3
            .axisLeft(yScale)

        svg.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(0, 0)`)
            .call(yAxis)

        
        */

        d3
            .selectAll(".bar")
            .attr("role", "graphics-symbol")
            .attr("aria-roledescription", "bar element")
            .attr("tabindex", 0) // make it focusable element
            .attr("aria-label", d => {
              return type === "Stores Worldwide"
                ? `${d.company}'s donation ${parseInt(
                    d[type] / 1000000
                  )} million dollars'`
                : `${d.company} spent ${d[type]} percent of its GDP'`;
            });

        d3
            .selectAll("")




        d3
            .select(".chart")
            .select("svg")
            .attr("role", "graphics-document")
            .attr("aria-roledescription", "bar chart");
          svg.attr("tabindex", 0);
          svg.attr(
            "aria-label",
            type === "Stores Worldwide"
              ? "Bar chart showing the number of coffee stores worldwide respective to the company."
              : "Bar chart showing the coffee company revenue in billions of USD."
          );

            }
        d3.csv('coffee-house-chains.csv',d3.autoType).then(_data=>{
                rev = 0
                type = d3.select('#group-by').node().value;
                data = _data
                update(data,type,rev)
               
            
              });

    d3.select('#group-by').on('change',(event)=>{
        type = d3.select('#group-by').node().value;
        update(data,type,rev)
    })
    d3.select('#sort-btn').on('click',(event)=>{
        rev= !rev;
        update(data,type,rev)
    })


