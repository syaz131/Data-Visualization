neighborhood_list = []
age = []
houseSold = []
houseage_obj_data = new Array()

var svgBarHouse = d3.select("#viz-bar-house"),
    // .attr("class", "bar-house"),
    margin = { top: 20, right: 20, bottom: 50, left: 50 },
    width = +svgBarHouse.attr("width") - margin.left - margin.right,
    height = +svgBarHouse.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var gBarHouse = svgBarHouse.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

rowConverter = function(d) {
    return {
        Neighborhood: d.Neighborhood,
        YrSold: +d.YrSold,
        YearBuilt: +d.YearBuilt
    }
}

d3.csv("house price.csv", rowConverter).then(function(data) {

    allNeighbourhood = d3.map(data, function(d) {
        return d.Neighborhood;
    }).keys();

    passedData = []
    passedData = data
    countYear = []
    selectedNeighborhood = 0;

    for (i = 0; i < data.length; i++) {
        if (data[i].Neighborhood == allNeighbourhood[selectedNeighborhood]) {
            count = 0
            count = data[i].YrSold - data[i].YearBuilt
            if (count != -1) {
                age.push(count)
            }
        }
    };

    for (i = 0; i < age.length; i++) {
        count = 0
        for (j = 0; j < age.length; j++) {
            if (age[j] == age[i])
                count += 1
        };
        countYear.push(count)
    };

    for (i = 0; i < age.length; i++) {
        var housesoldyear_object = {
            houseCount: countYear[i],
            Age: age[i]
        }
        houseage_obj_data.push(housesoldyear_object);
    }

    sortedHouse = houseage_obj_data.slice().sort((a, b) => d3.ascending(a.Age, b.Age))
    mapped_houseage = d3.map(houseage_obj_data, function(d) {
        return d.Age
    }).keys();

    var obj = {};

    for (var i = 0, len = sortedHouse.length; i < len; i++)
        obj[sortedHouse[i]['Age']] = sortedHouse[i];

    sortedHouse = new Array();
    for (var key in obj)
        sortedHouse.push(obj[key]);

    x.domain(sortedHouse.map(function(d) {
        return d.Age;
    }));

    y.domain([0, d3.max(sortedHouse, function(d) {
        return d.houseCount;
    })]);

    gBarHouse.append("g")
        //.attr("class", "axis axis--x")
        .call(d3.axisBottom(x))
        .attr("transform", "translate(0," + height + ")")

    gBarHouse.append("g")
        //.attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks())
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

    gBarHouse.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr('font-weight', 'bold')
        .attr("x", width / 2 + 50)
        .attr("y", height + 40)
        .text("House Age");

    gBarHouse.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr('font-weight', 'bold')
        .attr("y", -50)
        .attr("x", (-height / 2) + 50)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Number of House Sold");

    gBarHouse.append("text")
        .attr("class", "title")
        .attr("text-anchor", "end")
        .attr('font-weight', 'bold')
        .attr("x", 600)
        .attr("y", 20)
        .text("College Creek");

    gBarHouse.selectAll(".bar")
        .data(sortedHouse)
        .enter().append("rect")
        .style("fill", "#a6cee3")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.Age) - 5;
        })
        .attr("width", 10)
        .attr("y", function(d) {
            return y(d.houseCount);
        })
        .attr("height", function(d) { return height - y(d.houseCount); });


});

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function updateBar(value, passedData) {
    document.getElementById("myDropdown").classList.remove("show")

    selectedNeighborhood = value
    data = passedData
    age = []
    countYear = []

    for (i = 0; i < data.length; i++) {
        if (data[i].Neighborhood == allNeighbourhood[selectedNeighborhood]) {
            count = 0
            count = data[i].YrSold - data[i].YearBuilt
            if (count != -1) {
                age.push(count)
            }
        }
    };

    for (i = 0; i < age.length; i++) {
        count = 0
        for (j = 0; j < age.length; j++) {
            if (age[j] == age[i])
                count += 1
        };
        countYear.push(count)
    };

    houseage_obj_data = []

    for (i = 0; i < age.length; i++) {
        var housesoldyear_object = {
            houseCount: countYear[i],
            Age: age[i]
        }

        houseage_obj_data.push(housesoldyear_object);

    }

    sortedHouse = []
    sortedHouse = houseage_obj_data.slice().sort((a, b) => d3.ascending(a.Age, b.Age))

    mapped_houseage = d3.map(houseage_obj_data, function(d) {
        return d.Age
    }).keys();

    var obj = {};

    for (var i = 0, len = sortedHouse.length; i < len; i++)
        obj[sortedHouse[i]['Age']] = sortedHouse[i];

    sortedHouse = new Array();
    for (var key in obj)
        sortedHouse.push(obj[key]);

    neighborhoodName = ["College Creek", "Veenker", "Crawford", "Northridge", "Mitchell",
        "Somerset", "Northwest Ames", "Old Town", "Brookside", "Sawyer",
        "Northridge Heights", "North Ames", "Sawyer West", "Iowa Rail Road",
        "Meadow Village", "Edwards", "Timberland", "Gilbert", "Stone Brook",
        "Clear Creek", "Northpark Villa", "Bloomington Heights", "Briardale",
        "Iowa State University", "Bluestem"
    ]

    newtitle = neighborhoodName[value]
        // d3.selectAll(".bar").remove()
        // d3.selectAll(".domain").remove()
        // d3.selectAll(".tick line").remove()
        // d3.selectAll(".tick text").remove()
        // d3.selectAll(".title").remove()
    d3.selectAll("svg#viz-bar-house rect.bar").remove()
    d3.selectAll("svg#viz-bar-house path.domain").remove()
    d3.selectAll("svg#viz-bar-house g.tick").remove()
    d3.selectAll("svg#viz-bar-house g.tick text").remove()
    d3.selectAll("svg#viz-bar-house text.title").remove()

    x.domain(sortedHouse.map(function(d) {
        return d.Age;
    }));

    y.domain([0, d3.max(sortedHouse, function(d) {
        return d.houseCount;
    })]);

    gBarHouse.append("g")
        //.attr("class", "axis axis--x")
        .call(d3.axisBottom(x))
        .attr("transform", "translate(0," + height + ")")

    gBarHouse.append("g")
        //.attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(30))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end");

    gBarHouse.append("text")
        .attr("class", "title")
        .attr("text-anchor", "end")
        .attr('font-weight', 'bold')
        .attr("x", 600)
        .attr("y", 20)
        .text(newtitle);

    colorfill = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f",
        "#ff7f00", "#cab2d6", "#6a3d9a", "#7570b3", "#b15928", "#8dd3c7", "#666666", "#bebada", "#fb8072", "#80b1d3",
        "#1b9e77", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f", "#e7298a", "#e6ab02"
    ]

    gBarHouse.selectAll(".bar")
        .data(sortedHouse)
        .enter()
        .append("rect")
        .style("fill", colorfill[value])
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.Age) - 5;
        })
        .attr("width", 10)
        .attr("y", function(d) {
            return y(d.houseCount);
        })
        .attr("height", function(d) { return height - y(d.houseCount); });
}