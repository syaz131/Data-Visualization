rowConverter = function(d) {
    return {
        MoSold: +d.MoSold,
        YrSold: +d.YrSold,
        YearBuilt: +d.YearBuilt

    }
}

housesoldyear = []
housesoldyear_object_data = []

var svg = d3.select("#viz-line-house"),
    margin = {
        top: 20,
        right: 20,
        bottom: 50,
        left: 60
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var xLine = d3.scaleBand().rangeRound([0, width]).padding(1),
    yLine = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("house price.csv", rowConverter).then(function(data) {
    availYear = d3.map(data, function(d) {
        return d.YrSold;
    }).keys();

    availMonth = d3.map(data, function(d) {
        return d.MoSold;
    }).keys();

    /////////////////// Select YEAR //////////////////
    d3.select("#selectYear")
        .selectAll('ChosenYear')
        .data(availYear)
        .enter()
        .append('option')
        .text(function(d) {
            return d;
        })
        .attr("value", function(d) {
            return d;
        });
    /////////////////// Select YEAR //////////////////

    housesoldyear2006 = []
    housesoldyear2007 = []
    housesoldyear2008 = []
    housesoldyear2009 = []
    housesoldyear2010 = []

    for (i = 0; i < data.length; i++) {
        if (data[i].YrSold == 2006) {
            var housesoldyear_object = {
                MoSold: data[i].MoSold,
                YrSold: data[i].YrSold

            }

            housesoldyear2006.push(housesoldyear_object);
        } else if (data[i].YrSold == 2007) {
            var housesoldyear_object = {
                MoSold: data[i].MoSold,
                YrSold: data[i].YrSold
            }

            housesoldyear2007.push(housesoldyear_object);
        } else if (data[i].YrSold == 2008) {
            var housesoldyear_object = {
                MoSold: data[i].MoSold,
                YrSold: data[i].YrSold
            }

            housesoldyear2008.push(housesoldyear_object);
        } else if (data[i].YrSold == 2009) {
            var housesoldyear_object = {
                MoSold: data[i].MoSold,
                YrSold: data[i].YrSold
            }

            housesoldyear2009.push(housesoldyear_object);
        } else if (data[i].YrSold == 2010) {
            var housesoldyear_object = {
                MoSold: data[i].MoSold,
                YrSold: data[i].YrSold
            }

            housesoldyear2010.push(housesoldyear_object);
        }
    }

    counted2006 = []
    counted2007 = []
    counted2008 = []
    counted2009 = []
    counted2010 = []

    for (i = 0; i < availMonth.length; i++) {
        count = 0
        for (j = 0; j < housesoldyear2006.length; j++) {
            if (housesoldyear2006[j].MoSold == availMonth[i])
                count += 1
        };

        var grouped2006 = {
            MoSold: +availMonth[i],
            Count: count
        }

        counted2006.push(grouped2006)
    };

    for (i = 0; i < availMonth.length; i++) {
        count = 0
        for (j = 0; j < housesoldyear2007.length; j++) {
            if (housesoldyear2007[j].MoSold == availMonth[i])
                count += 1
        };

        var grouped2007 = {
            MoSold: +availMonth[i],
            Count: count
        }
        counted2007.push(grouped2007)
    };

    for (i = 0; i < availMonth.length; i++) {
        count = 0
        for (j = 0; j < housesoldyear2008.length; j++) {
            if (housesoldyear2008[j].MoSold == availMonth[i])
                count += 1
        };

        var grouped2008 = {
            MoSold: +availMonth[i],
            Count: count

        }
        counted2008.push(grouped2008)
    };

    for (i = 0; i < availMonth.length; i++) {
        count = 0
        for (j = 0; j < housesoldyear2009.length; j++) {
            if (housesoldyear2009[j].MoSold == availMonth[i])
                count += 1
        };

        var grouped2009 = {
            MoSold: +availMonth[i],
            Count: count
        }
        counted2009.push(grouped2009)
    };

    for (i = 0; i < availMonth.length; i++) {
        count = 0
        for (j = 0; j < housesoldyear2010.length; j++) {
            if (housesoldyear2010[j].MoSold == availMonth[i])
                count += 1
        };

        var grouped2010 = {
            MoSold: +availMonth[i],
            Count: count
        }
        counted2010.push(grouped2010)
    };

    counted2006 = counted2006.slice().sort((a, b) => d3.ascending(a.MoSold, b.MoSold))
    counted2007 = counted2007.slice().sort((a, b) => d3.ascending(a.MoSold, b.MoSold))
    counted2008 = counted2008.slice().sort((a, b) => d3.ascending(a.MoSold, b.MoSold))
    counted2009 = counted2009.slice().sort((a, b) => d3.ascending(a.MoSold, b.MoSold))
    counted2010 = counted2010.slice().sort((a, b) => d3.ascending(a.MoSold, b.MoSold))
    counted2010 = counted2010.slice(0, 7)
    console.log(counted2010)

    xLine.domain(counted2006.map(function(d) {
        return d.MoSold;
    }));

    yLine.domain([0, d3.max(counted2006, function(d) {
        return d.Count;
    })]);

    g.append("g")
        //.attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xLine));

    g.append("g")
        //.attr("class", "axis axis--y")
        .call(d3.axisLeft(yLine).ticks(10))
        //.transition()
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Number Of House Sold");

    g.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr('font-weight', 'bold')
        .attr("x", width / 2 + 50)
        .attr("y", height + 40)
        .text("Month");

    g.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr('font-weight', 'bold')
        .attr("y", -50)
        .attr("x", (-height / 2) + 50)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Number of House Sold");

    g.append("path")
        .datum(counted2006)
        .attr("class", "lineTest")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) {
                return xLine(d.MoSold)
            })
            .y(function(d) {
                return yLine(d.Count)
            })
        )
        .attr("stroke-width", 2.5)
});

function updateData(data) {

    d3.selectAll("path.lineTest").remove()
    data1 = data

    var path = g.append("path")
        .datum(data1)
        .attr("class", "lineTest")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) {
                return xLine(d.MoSold)
            })
            .y(function(d) {
                return yLine(d.Count)
            })
        )
        .attr("stroke-width", 2.5)

    var totalLength = path.node().getTotalLength();

    // Set Properties of Dash Array and Dash Offset and initiate Transition
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2500)
        .attr("stroke-dashoffset", 0);

}