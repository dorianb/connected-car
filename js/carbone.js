var filename = "data/features_data_10000_paris.csv"
//var filename = "data/features_data_10000_geneve.csv"

var svg = d3.select("#hamdi");
var margin = {top: 10, right: 30, bottom: 30, left: 30};
//var width = +svg.attr("width") - margin.left - margin.right;
var w = svg.node().getBoundingClientRect().width - margin.left - margin.right;
var h = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;
//console.log("w", w)
//console.log("h", h)
//create global variable 'mydata' to store CSV data;
var mydata ;
var timeTrajet;
//var w = 960;
//var h = 500;

var colorScale = d3.scale.linear()
    .range([d3.rgb("green"), d3.rgb("red")])
    .domain([0, 12]);
//radius scale for consumption
var radiusScale = d3.scale.linear()
    .range([8, 50])
    .domain([0, 30]);

var distinctTrajects = new Set();
var distinctVehicules = new Set();
var t0_absolu;  //first frame time
var t1_absolu; //last frame time
var time_table = [];

d3.csv(filename)
	.row(function (d, i) {
        distinctTrajects.add(d["id_veh_traj"])
        distinctVehicules.add(d["id_VIN"])
        return {
            date: d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.PTCL),
            consommation: +d.Consommation,
            moteur: +d.Moteur_type,
            lat06: +d.LAT06,
            long06: +d.LON06,
            lat12: +d.LAT12,
            long12: +d.LON12,
            lat18: +d.LAT18,
            long18: +d.LON18,
            lat24: +d.LAT24,
            long24: +d.LON24,
            lat30: +d.LAT30,
            long30: +d.LON30,
            lat36: +d.LAT36,
            long36: +d.LON36,
            lat42: +d.LAT42,
            long42: +d.LON42,
            lat48: +d.LAT48,
            long48: +d.LON48,
            lat54: +d.LAT54,
            long54: +d.LON54,
            lat60: +d.LAT60,
            long60: +d.LON60,
            id_VIN: d.id_VIN,
            id_trajet: d.id_trajet,
            id_veh_traj: d.id_veh_traj
		};
	})
	.get(function (error, rows) {
		// Handle error or set up visualization here
		//console.log("Loaded " + rows.length + " rows");
		if (rows.length > 0) {
			//console.log("carbonFirst row: ", rows[0])
			//console.log("carbonLast  row: ", rows[rows.length-1])
            //console.log("rabonrow 28: ", rows[27])
            mydata = rows
            t0_absolu = rows[0].date
            t1_absolu = rows[rows.length-1].date
            //console.log("carbont0_absolu", t0_absolu)
            //console.log("carbont1_absolu", t1_absolu)
		}
	});

setTimeout(function(){
    //distinctVehiculesList = [...distinctVehicules];

    var svg = d3.select("#hamdi").append("svg")
         .attr("width", w)
         .attr("height", h);

         distinctTrajects.forEach(function(trrr)  {
             //var monTrajet = getLineData("V00001_5")[0]
             var monTrajet = getLineData(trrr)[0]
             //dataTrajet = getLineData("V00001_5")[1]
             dataTrajet = getLineData(trrr)[1]
             timeTrajet = getLineData(trrr)[2]
             num6secondes = monTrajet.length
             //console.log("timeTrajet", timeTrajet)


             for (var i = 0; i < monTrajet.length; i+=10) {
                 //console.log("@@@@@@", dataTrajet[Math.floor(i/10)].consommation)
                 var circle = svg.append("circle")
                    .classed('veh', true)
                    .attr("r", function(d) {
                        return radiusScale(dataTrajet[Math.floor(i/10)].consommation) })
                    .style("opacity", 0.9);

                 //console.log("i", i)
                 //console.log("@@@", monTrajet.slice(i, i+10))
                 var subpath = svg.selectAll("subpath")
                     .data([monTrajet.slice(i, i+10)])
                     .enter()
                     .append("path")
                     .classed("path", true);
                //console.log("@@subpath.node here", subpath.node())
                animateCirle(circle, subpath, dataTrajet, Math.floor(i/10));
             }
         });

},1000);

function animateCirle(circle, subpath, dataTrajet, i){
    //console.log("circle", circle);
    //console.log("subpath", subpath);
    //console.log("dataTrajet", dataTrajet);

    subpath.style("stroke", "#ddd")
    .style("stroke-dasharray", "1,15")
    .style("opacity", 0.6)
    .style("stroke-opacity", 0.6)
    .attr("d", d3.svg.line()
    .tension(0) // Catmull–Rom
    .interpolate("cardinal-close"));

    //console.log("@@subpath", subpath)
    //console.log("@@subpath.node", subpath.node())

    circle.transition()
    .delay(i*1000 + timeTrajet[i])
    .duration(1000)
    .attrTween("transform", translateAlong(subpath.node()))
    .ease("linear")
    .style("fill", colorScale(dataTrajet[i].consommation))
    .remove()
}

// Returns an attrTween for translating along the specified path element.
function translateAlong(path) {
  var l = path.getTotalLength();
  return function(d, i, a) {
    return function(t) {
      var p = path.getPointAtLength(t * l);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

function getLineData(id_veh_traj){
    var unTrajet = mydata.filter(function(d)
    {
            if( d["id_veh_traj"] == id_veh_traj)
            {
                return d;
            }
        });
    //unTrajet
    var lineData = unTrajet.map(function(obj){
        var rObj = [
            [obj.lat06,  obj.long06],
            [obj.lat12,  obj.long12],
            [obj.lat18,  obj.long18],
            [obj.lat24,  obj.long24],
            [obj.lat30,  obj.long30],
            [obj.lat36,  obj.long36],
            [obj.lat42,  obj.long42],
            [obj.lat48,  obj.long48],
            [obj.lat54,  obj.long54],
            [obj.lat60,  obj.long60],
        ];
        return rObj;
    });
    temp = []
    for (var i = 0; i < lineData.length; i++) {
        row = lineData[i]
        for (var j = 0; j < row.length; j++) {
            temp.push(row[j]);
        }
    };
    res_path = [];
    time_path = [];
    var lat = d3.scale.linear()
    .domain([48.81, 48.95])  //Paris A13
    //.domain([45.83, 46.392])  //Geneve
    .range([h, 0]);

    var lon = d3.scale.linear()
    .domain([1.97, 2.211])  // Paris A13
    //.domain([5.829, 6.6654]) //Geneve
    .range([0, w]);

    var time = d3.time.scale()
        .domain([t0_absolu, t1_absolu])
        .range([0, 300*1000])

    for (var i = 0; i < temp.length; i++) {
        //res_path.push([lat(temp[i][0]), lon(temp[i][1])])
        res_path.push([lon(temp[i][1]), lat(temp[i][0])])
        if (i%10===0) {
            time_path.push(time(unTrajet[i/10].date))
        }
    }
    return [res_path, unTrajet, time_path];
}
