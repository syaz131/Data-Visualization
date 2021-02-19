neighborhood_list = []
avg_price_list = []
avg_area_list = []
neigh_obj_data = new Array()

aa_arr = [
    [-76.4849607, 38.9867785], //CollgCr
    [-119.958099, 36.255299], //Veenker
    [-83.030563, 42.706703], //Crawfor
    [-75.826103, 43.212502], //NoRidge
    [-92.957463, 45.055285], //Mitchel
    //5
    [-84.60461, 37.092109], //Somerst
    [-87.856097, 42.319405], //NWAmes
    [-68.645763, 44.934787], //OldTown
    [-118.165794, 34.153351], //BrkSide
    [-78.845001, 43.064701], //Sawyer
    //10
    [-71.079275, 42.573995], //NridgHt
    [-90.048646, 38.21237], //NAmes
    [-82.538602, 27.336483], //SawyerW
    [-80.81432, 33.585601], //IDOTRR
    [-74.235603, 40.86859], //MeadowV
    //15
    [-106.5942, 39.6450], //Edwards
    [-72.492105, 43.889786], //Timber
    [-111.801682, 33.360355], //Gilbert
    [-84.0569, 35.950802], //StoneBr
    [-104.56, 39.49], //ClearCr
    //20
    [-95.648949, 36.339039], //NPkVill
    [-89.033, 40.4806], //Blmngtn
    [-81.46286, 41.344753], //BrDale
    [-93.6465, 42.0267], //SWISU
    [-118.125603, 47.525002] //Blueste
    //25
]

rowConverter = function(d) {
    return {
        Neighborhood: d.Neighborhood,
        SalePrice: parseFloat(d.SalePrice),
        LotArea: parseFloat(d.LotArea)
    }
}

d3.csv("train.csv", rowConverter).then(function(data) {
    d3.json("https://gist.githubusercontent.com/michellechandra/0b2ce4923dc9b5809922/raw/a476b9098ba0244718b496697c5b350460d32f99/us-states.json").then(function(json) {

        neighborhood_list = d3.map(data, function(d) {
            return d.Neighborhood;
        }).keys();

        for (i = 0; i < neighborhood_list.length; i++) {
            average_price = d3.mean(data.filter(d => d.Neighborhood === neighborhood_list[i]), d => d.SalePrice)
            average_area = d3.mean(data.filter(d => d.Neighborhood === neighborhood_list[i]), d => d.LotArea)

            // assign 2 coordinates - dont know why
            coordinate = aa_arr[i];
            // coordinate2 = bb_arr[i];

            var neigh_object = {
                Avg_price: average_price,
                Avg_area: average_area,
                Neighborhood: neighborhood_list[i],
                Coordinate: coordinate
            }

            neigh_obj_data.push(neigh_object);
        }

        // Define the div for the tooltip
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var areaMin = d3.min(neigh_obj_data, function(d) {
            return d.Avg_area;
        });

        var areaMax = d3.max(neigh_obj_data, function(d) {
            return d.Avg_area;
        });

        var rScale = d3.scaleSqrt()
            .domain([0, areaMax])
            .range([2, 15]);

        var priceMin = d3.min(neigh_obj_data, function(d) {
            return d.Avg_price;
        });

        var priceMax = d3.max(neigh_obj_data, function(d) {
            return d.Avg_price;
        });

        var colorRange = d3.scaleLinear()
            .domain([priceMin, priceMax])
            .range([d3.rgb("#fee6ce"), d3.rgb('#d94801 ')]);

        ////////// map plot ////////////////////////
        var width = 750
        var height = 550

        //svgMap
        let svgMap = d3.select("#viz-map")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // D3 Projection
        var projection = d3.geoAlbersUsa()
            .translate([width / 2, height / 2]) // translate to center of screen
            .scale([900]);

        // Define path generator
        var geoPath = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
            .projection(projection); // tell path generator to use albersUsa projection

        svgMap.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", geoPath)
            .style("stroke", "#fff")
            .style("stroke-width", "1")
            .style("fill", "rgb(213,222,217)");

        svgMap.selectAll("circle")
            .data(neigh_obj_data)
            .enter()
            .append("circle")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("cx", function(d) {
                return projection(d.Coordinate)[0];
            })
            .attr("cy", function(d) {
                return projection(d.Coordinate)[1];
            })
            //start change here
            .attr("r", function(d) {
                return rScale(d.Avg_area);
            })
            .attr("fill", function(d) {
                value = d.Avg_price
                if (value)
                    return colorRange(d.Avg_price);
                else
                    return colorRange(priceMin)
            })
            .attr("opacity", 0.8)
            .on("mouseover", function(d) {
                div.transition()
                    .duration(300)
                    .style("opacity", .95);
                div.html("<b>" + d.Neighborhood + "</b><br/>" + 'Avg. Area : ' + parseInt(d.Avg_area) + " sq ft" + "<br/>" + 'Avg. Sale Price : $' + parseInt(d.Avg_price))
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 60) + "px");
                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('stroke', 'black')
                    .attr('opacity', 1);
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("stroke", "white")
                    .attr("stroke-width", 2)
                    .attr('opacity', 0.8);
            });

        var x = 620
        var y = 320
        var radius = [5, 10, 15]
        var areaMinMax = [areaMin, areaMax]
        var size = 34

        /////// color and size legend /////////
        //rect - background
        svgMap.append("rect")
            .attr("fill", 'whitesmoke') //whitesmoke
            .attr("opacity", 0.7)
            .attr("width", 140)
            .attr("height", 190)
            .attr("rx", 8)
            .attr("ry", 8)
            .attr("x", x - 10)
            .attr("y", y - 30)
            .text("Lot Area (sq ft)");

        //color
        svgMap.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", 120)
            .attr("height", 20)
            .attr("opacity", 1)
            .attr("fill", "url(#grad1)")

        // text for neighborhood name
        svgMap.selectAll("neighborhood-name")
            .data(neigh_obj_data)
            .enter()
            .append("text")
            .attr("font-size", 12)
            .attr("x", function(d) {
                return projection(d.Coordinate)[0] - 20;
            })
            .attr("y", function(d) {
                return projection(d.Coordinate)[1] + 20;
            })
            .text(function(d) {
                return d.Neighborhood;
            });

        svgMap.append("text")
            .attr("font-size", 12)
            .attr('font-weight', 'bold')
            .attr("x", x + 5)
            .attr("y", y - 7)
            .text("Sale Price ($)");

        svgMap.append("text")
            .attr("font-size", 12)
            .attr('font-weight', 'bold')
            .attr("x", x + 5)
            .attr("y", y + 34)
            .text(parseInt(priceMin));

        svgMap.append("text")
            .attr("font-size", 12)
            .attr('font-weight', 'bold')
            .attr("x", x + 78)
            .attr("y", y + 34)
            .text(parseInt(priceMax));

        // size
        svgMap.append("text")
            .attr("font-size", 12)
            .attr('font-weight', 'bold')
            .attr("x", x + 5)
            .attr("y", y + 78)
            .text("Lot Area (sq ft)");

        svgMap.selectAll("myRadius")
            .data(radius)
            .enter()
            .append('circle')
            .attr('cx', function(d, i) {
                return x + i * (size + 7) + (size / 2)
            })
            .attr('cy', y + 103)
            .attr('r', function(d) {
                return d;
            })
            .attr('fill', "lightgray")
            .attr('opacity', 1)
            .attr('stroke', 'black')
            .text(function(d) {
                return d
            });

        svgMap.selectAll("myLabel")
            .data(areaMinMax)
            .enter()
            .append("text")
            .attr("x", function(d, i) {
                return x + 5 + i * 80
            })
            .attr("y", y + 134)
            .attr("font-size", 12)
            .attr("text-anchor", "left")
            .attr('font-weight', 'bold')
            .style("alignment-baseline", "middle")
            .text(function(d) {
                return parseInt(d);
            });
        /////// color and size legend /////////
        ///////////////////////////////////////
        ///////////////////////////////////////
        ///////////////////////////////////////
        ////////// scatter plot ///////////////
        var width = 750,
            height = 550;

        var padding = 80;

        var svgScatter = d3.select("#viz-scatter")
            .append("svg")
            .attr('class', 'axis')
            .attr('width', width)
            .attr('height', height);

        var priceMin = d3.min(data, function(d) {
            return d.SalePrice;
        });
        var priceMax = d3.max(data, function(d) {
            return d.SalePrice;
        });

        var areaMin = d3.min(data, function(d) {
            return d.LotArea;
        });
        var areaMax = d3.max(data, function(d) {
            return d.LotArea;
        });

        var areaScale = d3.scaleLinear()
            .domain([areaMin - 2000, areaMax + 1000])
            .range([padding, width - padding]);

        var priceScale = d3.scaleLinear()
            .domain([priceMin - 6000, priceMax + 1000])
            .range([height - padding, padding]);


        var colorPalette = d3.scaleOrdinal(["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f",
            "#ff7f00", "#cab2d6", "#6a3d9a", "#7570b3", "#b15928", "#8dd3c7", "#666666", "#bebada", "#fb8072", "#80b1d3",
            "#1b9e77", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f", "#e7298a", "#e6ab02"
        ]);

        neighbor = d3.map(data, function(d) {
            return d.Neighborhood;
        }).keys();

        colorPalette.domain(neighbor);




        //////// start draw circle //////////////
        svgScatter.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function(d) {
                return areaScale(d.LotArea);
            })
            .attr('cy', function(d) {
                return priceScale(d.SalePrice)
            })
            .attr('r', 3)
            .attr('fill', function(d) {
                return colorPalette(d.Neighborhood);
            })
            .attr('opacity', 0.8)
            .on("mouseover", function(d) {
                div.transition()
                    .duration(100)
                    .style("opacity", 1);
                div.html("<b>" + d.Neighborhood + "</b><br/>" + 'Avg. Area : ' + parseInt(d.LotArea) + " sq ft" + "<br/>" + 'Avg. Sale Price : $' + parseInt(d.SalePrice))
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 50) + "px");
                d3.select(this)
                    .attr('stroke', 'black')
                    .attr('opacity', 1);
            })
            .on("mouseout", function(d) {
                div.transition()
                    .duration(100)
                    .style("opacity", 0);
                d3.select(this)
                    .attr('stroke', 'none')
                    .attr('opacity', 0.8);
            });

        // Draw the axis
        var xAxis = d3.axisBottom()
            .scale(areaScale)

        var yAxis = d3.axisLeft()
            .scale(priceScale)

        svgScatter.append('g')
            .attr('class', 'axis x-axis')
            .attr("transform", "translate(0," + (height - padding) + ")")
            .call(xAxis)

        svgScatter.append('g')
            .attr('class', 'axis y-axis')
            .attr("transform", "translate(" + padding + ",0)")
            .call(yAxis);
        ////////// end draw circle //////////////


        /////////////////// Select neighborhood //////////////////
        d3.select("#selectNeighborScatter")
            .selectAll('myNeighbor')
            .data(neighbor)
            .enter()
            .append('option')
            .text(function(d) {
                return d;
            })
            .attr("value", function(d) {
                return d;
            });
        /////////////////// Select neighborhood //////////////////




        /////// Draw regression line /////////////////////
        var lg = calcLinear(data, "LotArea", "SalePrice", d3.min(data, function(d) {
                return d.LotArea
            }),
            d3.max(data, function(d) {
                return d.LotArea
            }));

        svgScatter.append("line")
            .attr("class", "regression")
            .attr("x1", areaScale(lg.ptA.x))
            .attr("y1", priceScale(lg.ptA.y))
            .attr("x2", areaScale(lg.ptB.x))
            .attr("y2", priceScale(lg.ptB.y));
        /////// Draw regression line /////////////////////



        ///////// start label ////////////
        var size = 10
        var xLabels = 600
        var yLabels = 40

        svgScatter.selectAll("mydots")
            .data(neighbor)
            .enter()
            .append("rect")
            .attr("x", xLabels - 5)
            .attr("y", function(d, i) {
                return yLabels + i * (size + 7)
            })
            .attr("width", size)
            .attr("height", size)
            .attr('opacity', 1)
            .style("fill", function(d) {
                return colorPalette(d)
            })

        svgScatter.selectAll("mylabels")
            .data(neighbor)
            .enter()
            .append("text")
            .attr("x", xLabels + size * 1)
            .attr("y", function(d, i) {
                return yLabels + i * (size + 7) + (size / 2)
            })
            .style("fill", function(d) {
                return colorPalette(d)
            })
            .text(function(d) {
                return d
            })
            .attr("text-anchor", "left")
            .attr('font-size', 12)
            .attr('font-weight', 'bold')
            .style("alignment-baseline", "middle")

        svgScatter.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr('font-weight', 'bold')
            .attr("x", width / 2 + 50)
            .attr("y", height - 40)
            .text("Lot Area (sq ft)");

        svgScatter.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr('font-weight', 'bold')
            .attr("y", 10)
            .attr("x", (-height / 2) + 50)
            .attr("dy", "1em")
            .attr("transform", "rotate(-90)")
            .text("Sale Price ($)");

        y_slope = 80
        x_slope = 550


        svgScatter.append("text")
            .attr("class", "reg-label")
            .attr("text-anchor", "end")
            .attr("y", y_slope)
            .attr("x", x_slope)
            .attr("dy", "1em")
            .text(function(d) {
                return "Slope : " + lg.slope.toFixed(2)
            });

        svgScatter.append("text")
            .attr("class", "reg-label")
            .attr("text-anchor", "end")
            .attr("y", y_slope + 20)
            .attr("x", x_slope + 10)
            .attr("dy", "1em")
            .text(function(d) {
                return "Intercept : " + parseInt(lg.intercept)
            });
        ///////// end label ////////////

        // select neighbor functions
        d3.select("#selectNeighborScatter").on("change", function(d) {
            var selectedOption = d3.select(this).property("value")
            updateScatter(selectedOption)
        })

        // update scatter plot function
        function updateScatter(selectedGroup) {
            var dataFilter = data.map(function(d) {

                if (d.Neighborhood === selectedGroup)
                    return {
                        LotArea: d.LotArea,
                        SalePrice: d.SalePrice,
                        Neighborhood: d.Neighborhood
                    }

                if (selectedGroup === "all")
                    return d;

            })

            svgScatter.selectAll("line.regression").remove(); //check name at element browser
            svgScatter.selectAll("circle").remove();
            svgScatter.selectAll("g.axis.x-axis").remove();
            svgScatter.selectAll("g.axis.y-axis").remove();

            dataFilter = dataFilter.filter(function(x) {
                return x !== undefined;
            });


            // new axis and scale
            priceMin = d3.min(dataFilter, function(d) {
                return d.SalePrice;
            });
            priceMax = d3.max(dataFilter, function(d) {
                return d.SalePrice;
            });

            areaMin = d3.min(dataFilter, function(d) {
                return d.LotArea;
            });
            areaMax = d3.max(dataFilter, function(d) {
                return d.LotArea;
            });

            areaScale = d3.scaleLinear()
                .domain([areaMin - 2000, areaMax + 1000])
                .range([padding, width - padding]);

            priceScale = d3.scaleLinear()
                .domain([priceMin - 6000, priceMax + 1000])
                .range([height - padding, padding]);

            // Draw the axis
            xAxis = d3.axisBottom()
                .scale(areaScale)

            yAxis = d3.axisLeft()
                .scale(priceScale)

            svgScatter.append('g')
                .attr('class', 'axis x-axis')
                .attr("transform", "translate(0," + (height - padding) + ")")
                .call(xAxis)

            svgScatter.append('g')
                .attr('class', 'axis y-axis')
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis);


            //draw circle
            svgScatter.selectAll('circle')
                .data(dataFilter)
                .enter()
                .append('circle')
                .transition()
                .duration(500)
                .attr('cx', function(d) {
                    return areaScale(d.LotArea);
                })
                .attr('cy', function(d) {
                    return priceScale(d.SalePrice)
                })
                .attr('r', 3)
                .attr('fill', function(d) {
                    return colorPalette(d.Neighborhood);
                })
                .attr('opacity', 0.8);
            // cannot mouseover - err unknown type: mouseover



            var lg = calcLinear(dataFilter, "LotArea", "SalePrice", d3.min(dataFilter, function(d) {
                    return d.LotArea
                }),
                d3.max(dataFilter, function(d) {
                    return d.LotArea
                }));

            path = svgScatter.append("line")
                .attr("class", "regression")
                .attr("x1", areaScale(lg.ptA.x))
                .attr("y1", priceScale(lg.ptA.y))
                .attr("x2", areaScale(lg.ptB.x))
                .attr("y2", priceScale(lg.ptB.y));

            var totalLength = path.node().getTotalLength();

            svgScatter.selectAll("text.reg-label").remove()
            path.attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(3000)
                .attr("stroke-dashoffset", 0);

            svgScatter.append("text")
                .attr("class", "reg-label")
                .attr("text-anchor", "end")
                .attr("y", y_slope)
                .attr("x", x_slope)
                .attr("dy", "1em")
                .text(function(d) {
                    return "Slope : " + lg.slope.toFixed(2)
                });

            svgScatter.append("text")
                .attr("class", "reg-label")
                .attr("text-anchor", "end")
                .attr("y", y_slope + 20)
                .attr("x", x_slope + 10)
                .attr("dy", "1em")
                .text(function(d) {
                    return "Intercept : " + parseInt(lg.intercept)
                });
        }

        // regression functions
        function calcLinear(data, x, y, minX, maxX) {

            var n = data.length;
            var pts = [];
            data.forEach(function(d, i) {
                var obj = {};
                obj.x = d[x];
                obj.y = d[y];
                obj.mult = obj.x * obj.y;
                pts.push(obj);
            });

            var sum = 0;
            var xSum = 0;
            var ySum = 0;
            var sumSq = 0;
            pts.forEach(function(pt) {
                sum = sum + pt.mult;
                xSum = xSum + pt.x;
                ySum = ySum + pt.y;
                sumSq = sumSq + (pt.x * pt.x);
            });
            var a = sum * n;
            var b = xSum * ySum;
            var c = sumSq * n;
            var d = xSum * xSum;

            var m = (a - b) / (c - d);

            var e = ySum;
            var f = m * xSum;
            var b = (e - f) / n;

            return {
                ptA: {
                    x: minX,
                    y: m * minX + b
                },
                ptB: {
                    x: maxX,
                    y: m * maxX + b
                },
                intercept: b,
                slope: m,
            }
        }
    });
});