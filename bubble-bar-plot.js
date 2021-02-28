rowConverter = function(d) {
    return {
        Neighborhood: d.Neighborhood,
        GarageType: d.GarageType,
        HeatingType: d.Heating,
        GarageQC: d.GarageQual,
        HeatQC: d.HeatingQC

    }
}

d3.csv("house price.csv", rowConverter).then(function(data) {


    var neighborhood_list = d3.map(data, function(d) {
        return d.Neighborhood;
    }).keys();

    var garage_list = d3.map(data, function(d) {
        return d.GarageType;
    }).keys();

    var heating_list = d3.map(data, function(d) {
        return d.HeatingType;
    }).keys();

    /////////////////// Select neighborhood //////////////////
    d3.select("#selectNeighborBubbleBar")
        .selectAll('myNeighbor')
        .data(neighborhood_list)
        .enter()
        .append('option')
        .text(function(d) {
            return d;
        })
        .attr("value", function(d) {
            return d;
        });
    /////////////////// Select neighborhood //////////////////



    var garage_data = new Array();
    var heating_data = new Array();

    garage_list.forEach(garage => {
        count = 0;
        for (i = 0; i < data.length; i++) {
            if (data[i].GarageType === garage)
                count += 1
        }

        var garage_obj = {
            GarageType: garage,
            GarageCount: count,
        }

        garage_data.push(garage_obj)
    });


    garage_data = {
        "children": garage_data
    }


    heating_list.forEach(heating => {
        count = 0;
        for (i = 0; i < data.length; i++) {
            if (data[i].HeatingType === heating)
                count += 1
        }

        var heat_obj = {
            HeatingType: heating,
            HeatingCount: count,
        }

        heating_data.push(heat_obj)
    });

    heating_data = {
        "children": heating_data
    }

    var diameter = 450;
    var colorBar = d3.scaleOrdinal(d3.schemeSet2);
    var colorBubble = d3.scaleOrdinal(d3.schemeAccent);

    // garage variables

    var bubbleGarage = d3.pack(garage_data)
        .size([diameter, diameter])
        .padding(1.5);

    var svgBubbleGarage = d3.select("#viz-bubble-garage")
        .append("svg")
        .attr("width", diameter + 150)
        .attr("height", diameter)
        .attr("class", "bubble");

    var nodesGarage = d3.hierarchy(garage_data)
        .sum(function(d) {
            return d.GarageCount;
        });

    var nodeGarage = svgBubbleGarage.selectAll(".node")
        .data(bubbleGarage(nodesGarage).descendants())
        .enter()
        .filter(function(d) {
            return !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("opacity", 1)
        .attr("font-weight", "bold")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .on("mouseover", mouseoverBubble)
        .on("mouseout", mouseoutBubble);

    // heating variables

    var bubbleHeat = d3.pack(heating_data)
        .size([diameter, diameter])
        .padding(1.5);

    var svgBubbleHeat = d3.select("#viz-bubble-heat")
        .append("svg")
        .attr("width", diameter + 150)
        .attr("height", diameter)
        .attr("class", "bubble");

    var nodesHeat = d3.hierarchy(heating_data)
        .sum(function(d) {
            return d.HeatingCount;
        });

    var nodeHeat = svgBubbleHeat.selectAll(".node")
        .data(bubbleHeat(nodesHeat).descendants())
        .enter()
        .filter(function(d) {
            return !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("opacity", 1)
        .attr("font-weight", "bold")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        .on("mouseover", mouseoverBubble)
        .on("mouseout", mouseoutBubble);

    // garage nodes
    nodeGarage.append("circle")
        .attr("class", "bubble")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d, i) {
            return colorBubble(i);
        });

    svgBubbleGarage.append("rect")
        .attr("fill", 'whitesmoke')
        .attr("height", 36)
        .attr("width", 200)
        .attr("x", 20)
        .attr("y", 10)
        .attr("rx", 20)
        .attr("ry", 20)
        .attr("opacity", 0.85)

    svgBubbleGarage.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .attr("font-family", "Ubuntu, sans-serif")
        .attr("font-size", 24)
        .attr("font-weight", "bold")
        .attr("transform", "translate(" + 120 + ", " + 30 + ")")
        .attr("fill", "black")
        .text('Garage Type');

    nodeGarage.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.GarageType;
        })
        .attr("font-family", "sans-serif")
        .attr("fill", "black");

    nodeGarage.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.GarageCount;
        })
        .attr("font-family", "sans-serif")
        .attr("fill", "black");

    // heating nodes
    nodeHeat.append("circle")
        .attr("class", "bubble")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d, i) {
            return colorBubble(i);
        });

    svgBubbleHeat.append("rect")
        .attr("fill", 'whitesmoke')
        .attr("height", 36)
        .attr("width", 200)
        .attr("x", 20)
        .attr("y", 10)
        .attr("rx", 20)
        .attr("ry", 20)
        .attr("opacity", 0.85)

    svgBubbleHeat.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .attr("font-family", "Ubuntu, sans-serif")
        .attr("font-size", 24)
        .attr("font-weight", "bold")
        .attr("transform", "translate(" + 120 + ", " + 30 + ")")
        .attr("fill", "black")
        .text('Heating Type');

    nodeHeat.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.HeatingType;
        })
        .attr("font-family", "sans-serif")
        .attr("fill", "black");

    nodeHeat.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.HeatingCount;
        })
        .attr("font-family", "sans-serif")
        .attr("fill", "black");

    //garage qc list
    garageqc_list = d3.map(data, function(d) {
        return d.GarageQC;
    }).keys();

    //heat qc list
    heatqc_list = d3.map(data, function(d) {
        return d.HeatQC;
    }).keys();

    var garageQC_data = new Array();

    garageqc_list.forEach(garageqc => {
        count = 0;
        for (i = 0; i < data.length; i++) {
            if (data[i].GarageQC === garageqc)
                count += 1
        }

        var garage_obj = {
            GarageQC: garageqc,
            GarageQCCount: count,
        }
        garageQC_data.push(garage_obj)
    });

    var heatQC_data = new Array();

    heatqc_list.forEach(heatqc => {
        count = 0;
        for (i = 0; i < data.length; i++) {
            if (data[i].HeatQC === heatqc)
                count += 1
        }

        var heat_obj = {
            HeatQC: heatqc,
            HeatQCCount: count,
        }
        heatQC_data.push(heat_obj)
    });

    // Height bar chart and width bar chart
    var margin = {
            top: 20,
            right: 60,
            bottom: 60,
            left: 60
        },
        width = 750 - margin.left - margin.right,
        height = 450 - margin.top - margin.bottom;

    // set the ranges
    var y_garage = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

    var x_garage = d3.scaleLinear()
        .range([0, width]);

    // console.log(garageQC_data)
    // console.log(heatQC_data)

    var svgGarage = d3.select("#viz-bar-garage")
        .append("svg")
        .attr("class", "bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    x_garage.domain([0, d3.max(garageQC_data, function(d) {
        return d.GarageQCCount;
    })])
    y_garage.domain(garageQC_data.map(function(d) {
        return d.GarageQC;
    }));

    svgGarage.selectAll(".bar")
        .data(garageQC_data)
        .enter()
        .append("rect")
        .style("fill", function(d, i) {
            return colorBar(i);
        })
        .attr("width", function(d) {
            return x_garage(d.GarageQCCount);
        })
        .attr("y", function(d) {
            return y_garage(d.GarageQC);
        })
        .attr("height", y_garage.bandwidth());

    // add the x Axis
    xAxisGarage = d3.axisBottom(x_garage);
    xAxisGarage.ticks(3);
    svgGarage.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisGarage)

    // add the y Axis
    yAxisGarage = d3.axisLeft(y_garage);
    svgGarage.append("g")
        .call(yAxisGarage)
        .call(g => g.selectAll(".tick text").attr("font-weight", "bold"))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").remove());

    svgGarage.selectAll("barLabel")
        .data(garageQC_data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.GarageQCCount;
        })
        .attr("y", function(d, i) {
            return y_garage(d.GarageQC) + 5 + y_garage.bandwidth() / 2;
            // return y_garage(d.GarageQCCount) + y_garage.bandwidth() / 2;
        })
        .attr("x", function(d) {
            return x_garage(d.GarageQCCount) + 20;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("text-anchor", "middle");

    svgGarage.append('text')
        .text('Count')
        .attr('x', 350)
        .attr('y', 400)
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("text-anchor", "middle");

    svgGarage.append("rect")
        .attr("fill", 'whitesmoke')
        .attr("height", 36)
        .attr("width", 220)
        .attr("x", 190)
        .attr("y", -7)
        .attr("rx", 20)
        .attr("ry", 20)
        .attr("opacity", 0.85)

    svgGarage.append("text")
        .text('Garage Quality')
        .attr('x', 300)
        .attr('y', 20)
        .style("text-anchor", "middle")
        .attr("font-family", "Ubuntu, sans-serif")
        .attr("font-size", 24)
        .attr("font-weight", "bold")
        .attr("fill", "black");

    // set the ranges - HEATING
    var y_heat = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

    var x_heat = d3.scaleLinear()
        .range([0, width]);

    var svgHeat = d3.select("#viz-bar-heat")
        .append("svg")
        .attr("class", "bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    x_heat.domain([0, d3.max(heatQC_data, function(d) {
        return d.HeatQCCount;
    })])
    y_heat.domain(heatQC_data.map(function(d) {
        return d.HeatQC;
    }));

    svgHeat.selectAll(".bar")
        .data(heatQC_data)
        .enter()
        .append("rect")
        .style("fill", function(d, i) {
            return colorBar(i);
        })
        .attr("width", function(d) {
            return x_heat(d.HeatQCCount);
        })
        .attr("y", function(d) {
            return y_heat(d.HeatQC);
        })
        .attr("height", y_heat.bandwidth());

    // add the x Axis
    xAxisHeat = d3.axisBottom(x_garage);
    xAxisHeat.ticks(3);
    svgHeat.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxisHeat)

    // add the y Axis
    yAxisHeat = d3.axisLeft(y_garage);
    svgHeat.append("g")
        .call(yAxisHeat)
        .call(g => g.selectAll(".tick text").attr("font-weight", "bold"))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").remove());


    svgHeat.selectAll("barLabel")
        .data(heatQC_data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.HeatQCCount;
        })
        .attr("y", function(d, i) {
            return y_heat(d.HeatQC) + 5 + y_heat.bandwidth() / 2;
            // return y_garage(d.GarageQCCount) + y_garage.bandwidth() / 2;
        })
        .attr("x", function(d) {
            return x_heat(d.HeatQCCount) + 20;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("text-anchor", "middle");

    svgHeat.append('text')
        .text('Count')
        .attr('x', 350)
        .attr('y', 400)
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .attr("text-anchor", "middle");

    svgHeat.append("rect")
        .attr("fill", 'whitesmoke')
        .attr("height", 36)
        .attr("width", 200)
        .attr("x", 200)
        .attr("y", -7)
        .attr("rx", 20)
        .attr("ry", 20)
        .attr("opacity", 0.85)

    svgHeat.append("text")
        .text('Heating Quality')
        .attr('x', 300)
        .attr('y', 20)
        .style("text-anchor", "middle")
        .attr("font-family", "Ubuntu, sans-serif")
        .attr("font-size", 24)
        .attr("font-weight", "bold")
        .attr("fill", "black");

    // select neighbor functions
    d3.select("#selectNeighborBubbleBar").on("change", function(d) {
        var selectedOption = d3.select(this).property("value")
        updateBubbleBar(selectedOption)
    })

    // update scatter plot function
    function updateBubbleBar(selectedGroup) {
        // garage neighborhood data
        var garage_dataFilter = data.map(function(d) {
            if (d.Neighborhood === selectedGroup)
                return {
                    Neighborhood: d.Neighborhood,
                    GarageType: d.GarageType
                }
            if (selectedGroup === "all")
                return d;
        })

        garage_dataFilter = garage_dataFilter.filter(function(x) {
            return x !== undefined;
        });

        var garage_of_neigh = d3.map(garage_dataFilter, function(d) {
            return d.GarageType;
        }).keys();

        var garage_neigh_data = new Array();

        garage_of_neigh.forEach(garage => {
            count = 0;
            for (i = 0; i < garage_dataFilter.length; i++) {
                if (garage_dataFilter[i].GarageType === garage)
                    count += 1
            }

            var garage_obj = {
                GarageType: garage,
                GarageCount: count,
            }

            garage_neigh_data.push(garage_obj)
        });

        garage_neigh_data = {
            "children": garage_neigh_data
        }

        // heating neighborhood data
        var heat_dataFilter = data.map(function(d) {
            if (d.Neighborhood === selectedGroup)
                return {
                    Neighborhood: d.Neighborhood,
                    HeatingType: d.HeatingType
                }
            if (selectedGroup === "all")
                return d;
        })

        heat_dataFilter = heat_dataFilter.filter(function(x) {
            return x !== undefined;
        });

        var heat_of_neigh = d3.map(heat_dataFilter, function(d) {
            return d.HeatingType;
        }).keys();

        var heat_neigh_data = new Array();

        heat_of_neigh.forEach(heating => {
            count = 0;
            for (i = 0; i < heat_dataFilter.length; i++) {
                if (heat_dataFilter[i].HeatingType === heating)
                    count += 1
            }

            var heat_obj = {
                HeatingType: heating,
                HeatingCount: count
            }

            heat_neigh_data.push(heat_obj)
        });

        heat_neigh_data = {
            "children": heat_neigh_data
        }

        d3.selectAll('g.node').remove();
        d3.selectAll('svg.bubble').remove();

        // garage Bubble
        var bubbleGarage = d3.pack(garage_neigh_data)
            .size([diameter, diameter])
            .padding(1.5);

        var svgBubbleGarage = d3.select("#viz-bubble-garage")
            .append("svg")
            .attr("width", diameter + 150)
            .attr("height", diameter)
            .attr("class", "bubble");

        var nodesGarage = d3.hierarchy(garage_neigh_data)
            .sum(function(d) {
                return d.GarageCount;
            });

        var nodeGarage = svgBubbleGarage.selectAll(".node")
            .data(bubbleGarage(nodesGarage).descendants())
            .enter()
            .filter(function(d) {
                return !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("opacity", 1)
            .attr("font-weight", "bold")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("mouseover", mouseoverBubble)
            .on("mouseout", mouseoutBubble);

        nodeGarage.append("circle")
            .attr("class", "bubble")
            .transition()
            .duration(600)
            .attr("r", function(d) {
                // console.log(d.r)
                return d.r;
            })
            .style("fill", function(d, i) {
                return colorBubble(i);
            });

        svgBubbleGarage.append("rect")
            .attr("fill", 'white')
            .attr("height", 36)
            .attr("width", 200)
            .attr("x", 20)
            .attr("y", 10)
            .attr("rx", 20)
            .attr("ry", 20)
            .attr("opacity", 0.85)

        svgBubbleGarage.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .attr("font-family", "Ubuntu, sans-serif")
            .attr("font-size", 24)
            .attr("font-weight", "bold")
            .attr("transform", "translate(" + 120 + ", " + 30 + ")")
            .attr("fill", "black")
            .text('Garage Type');

        nodeGarage.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text(function(d) {
                return d.data.GarageType;
            })
            .attr("font-family", "sans-serif")
            .attr("fill", "black");

        nodeGarage.append("text")
            .attr("dy", "1.3em")
            .attr("font-weight", "bold")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.GarageCount;
            })
            .attr("font-family", "sans-serif")
            .attr("fill", "black");


        // heating Bubble
        var bubbleHeat = d3.pack(heat_neigh_data)
            .size([diameter, diameter])
            .padding(1.5);

        var svgBubbleHeat = d3.select("#viz-bubble-heat")
            .append("svg")
            .attr("width", diameter + 150)
            .attr("height", diameter)
            .attr("class", "bubble");

        var nodesHeat = d3.hierarchy(heat_neigh_data)
            .sum(function(d) {
                return d.HeatingCount;
            });

        var nodeHeat = svgBubbleHeat.selectAll(".node")
            .data(bubbleHeat(nodesHeat).descendants())
            .enter()
            .filter(function(d) {
                return !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("opacity", 1)
            .attr("font-weight", "bold")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("mouseover", mouseoverBubble)
            .on("mouseout", mouseoutBubble);

        nodeHeat.append("circle")
            .attr("class", "bubble")
            .transition()
            .duration(600)
            .attr("r", function(d) {
                // console.log(d.r)
                return d.r;
            })
            .style("fill", function(d, i) {
                return colorBubble(i);
            });

        svgBubbleHeat.append("rect")
            .attr("fill", 'white')
            .attr("height", 36)
            .attr("width", 200)
            .attr("x", 20)
            .attr("y", 10)
            .attr("rx", 20)
            .attr("ry", 20)
            .attr("opacity", 0.85)

        svgBubbleHeat.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .attr("font-family", "Ubuntu, sans-serif")
            .attr("font-size", 24)
            .attr("font-weight", "bold")
            .attr("transform", "translate(" + 120 + ", " + 30 + ")")
            .attr("fill", "black")
            .text('Heating Type');

        nodeHeat.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.HeatingType;
            })
            .attr("font-family", "sans-serif")
            .attr("fill", "black");

        nodeHeat.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.HeatingCount;
            })
            .attr("font-family", "sans-serif")
            .attr("fill", "black");

        // garage QUALITY neighborhood data
        var garageQC_dataFilter = data.map(function(d) {
            if (d.Neighborhood === selectedGroup)
                return {
                    Neighborhood: d.Neighborhood,
                    GarageQC: d.GarageQC
                }
            if (selectedGroup === "all")
                return d;
        })

        garageQC_dataFilter = garageQC_dataFilter.filter(function(x) {
            return x !== undefined;
        });

        var garageQC_of_neigh = d3.map(garageQC_dataFilter, function(d) {
            return d.GarageQC;
        }).keys();

        var garageQC_neigh_data = new Array();

        garageQC_of_neigh.forEach(garageQC => {
            count = 0;
            for (i = 0; i < garageQC_dataFilter.length; i++) {
                if (garageQC_dataFilter[i].GarageQC === garageQC)
                    count += 1
            }

            var garage_obj = {
                GarageQC: garageQC,
                GarageQCCount: count,
            }

            garageQC_neigh_data.push(garage_obj)
        });

        // heating neighborhood data
        var heatQC_dataFilter = data.map(function(d) {
            if (d.Neighborhood === selectedGroup)
                return {
                    Neighborhood: d.Neighborhood,
                    HeatQC: d.HeatQC
                }
            if (selectedGroup === "all")
                return d;
        })

        heatQC_dataFilter = heatQC_dataFilter.filter(function(x) {
            return x !== undefined;
        });

        var heatQC_of_neigh = d3.map(heatQC_dataFilter, function(d) {
            return d.HeatQC;
        }).keys();

        var heatQC_neigh_data = new Array();

        heatQC_of_neigh.forEach(heatQC => {
            count = 0;
            for (i = 0; i < heatQC_dataFilter.length; i++) {
                if (heatQC_dataFilter[i].HeatQC === heatQC)
                    count += 1
            }

            var heat_obj = {
                HeatQC: heatQC,
                HeatQCCount: count
            }

            heatQC_neigh_data.push(heat_obj)
        });

        d3.selectAll('svg.bar').remove();

        // garage - NEIGHBORHOOD
        // set the ranges
        var y_garage = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        var x_garage = d3.scaleLinear()
            .range([0, width]);

        console.log(garageQC_neigh_data)
        console.log(heatQC_data)

        var svgGarage = d3.select("#viz-bar-garage")
            .append("svg")
            .attr("class", "bar")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        x_garage.domain([0, d3.max(garageQC_neigh_data, function(d) {
            return d.GarageQCCount;
        })])
        y_garage.domain(garageQC_neigh_data.map(function(d) {
            return d.GarageQC;
        }));

        svgGarage.selectAll(".bar")
            .data(garageQC_neigh_data)
            .enter()
            .append("rect")
            .transition()
            .duration(800)
            .attr("class", "bar")
            .style("fill", function(d, i) {
                return colorBar(i);
            })
            .attr("width", function(d) {
                return x_garage(d.GarageQCCount);
            })
            .attr("y", function(d) {
                return y_garage(d.GarageQC);
            })
            .attr("height", y_garage.bandwidth());

        // add the x Axis
        xAxisGarage = d3.axisBottom(x_garage);
        xAxisGarage.ticks(3);
        svgGarage.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisGarage)

        // add the y Axis
        yAxisGarage = d3.axisLeft(y_garage);
        svgGarage.append("g")
            .call(yAxisGarage)
            .call(g => g.selectAll(".tick text").attr("font-weight", "bold"))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove());

        svgGarage.selectAll("barLabel")
            .data(garageQC_neigh_data)
            .enter()
            .append("text")
            .transition()
            .duration(800)
            .text(function(d) {
                return d.GarageQCCount;
            })
            .attr("y", function(d, i) {
                return y_garage(d.GarageQC) + 5 + y_garage.bandwidth() / 2;
                // return y_garage(d.GarageQCCount) + y_garage.bandwidth() / 2;
            })
            .attr("x", function(d) {
                return x_garage(d.GarageQCCount) + 20;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .attr("text-anchor", "middle");

        svgGarage.append('text')
            .text('Count')
            .attr('x', 350)
            .attr('y', 400)
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .attr("text-anchor", "middle");

        svgGarage.append("text")
            .text('Garage Quality')
            .attr('x', 300)
            .attr('y', 20)
            .style("text-anchor", "middle")
            .attr("font-family", "Ubuntu, sans-serif")
            .attr("font-size", 24)
            .attr("font-weight", "bold")
            .attr("fill", "black");

        // set the ranges - HEATING
        var y_heat = d3.scaleBand()
            .range([height, 0])
            .padding(0.1);

        var x_heat = d3.scaleLinear()
            .range([0, width]);

        var svgHeat = d3.select("#viz-bar-heat")
            .append("svg")
            .attr("class", "bar")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        x_heat.domain([0, d3.max(heatQC_neigh_data, function(d) {
            return d.HeatQCCount;
        })])
        y_heat.domain(heatQC_neigh_data.map(function(d) {
            return d.HeatQC;
        }));

        svgHeat.selectAll(".bar")
            .data(heatQC_neigh_data)
            .enter()
            .append("rect")
            .transition()
            .duration(800)
            .attr("class", "bar")
            .style("fill", function(d, i) {
                return colorBar(i);
            })
            .attr("width", function(d) {
                return x_heat(d.HeatQCCount);
            })
            .attr("y", function(d) {
                return y_heat(d.HeatQC);
            })
            .attr("height", y_heat.bandwidth());

        // add the x Axis
        xAxisHeat = d3.axisBottom(x_heat);
        xAxisHeat.ticks(3);
        svgHeat.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxisHeat)

        // add the y Axis
        yAxisHeat = d3.axisLeft(y_heat);
        svgHeat.append("g")
            .call(yAxisHeat)
            .call(g => g.selectAll(".tick text").attr("font-weight", "bold"))
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll(".tick line").remove());

        svgHeat.selectAll("barLabel")
            .data(heatQC_neigh_data)
            .enter()
            .append("text")
            .transition()
            .duration(800)
            .text(function(d) {
                return d.HeatQCCount;
            })
            .attr("y", function(d, i) {
                return y_heat(d.HeatQC) + 5 + y_heat.bandwidth() / 2;
                // return y_garage(d.GarageQCCount) + y_garage.bandwidth() / 2;
            })
            .attr("x", function(d) {
                return x_heat(d.HeatQCCount) + 20;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .attr("text-anchor", "middle");

        svgHeat.append('text')
            .text('Count')
            .attr('x', 350)
            .attr('y', 400)
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", "black")
            .attr("text-anchor", "middle");

        svgHeat.append("text")
            .text('Heating Quality')
            .attr('x', 300)
            .attr('y', 20)
            .style("text-anchor", "middle")
            .attr("font-family", "Ubuntu, sans-serif")
            .attr("font-size", 24)
            .attr("font-weight", "bold")
            .attr("fill", "black");

    }

    function mouseoverBubble() {
        d3.select(this)
            .transition()
            .duration(300)
            .attr("font-size", 28)
            .attr("opacity", 0.8);

    }

    function mouseoutBubble() {
        d3.select(this)
            .transition()
            .duration(200)
            .attr("font-size", 16)
            .attr("opacity", 1);
    }

});