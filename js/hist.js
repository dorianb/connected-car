
// ajouter le code javascript (.js) --> le code qui gere le graphe
// ajouter ce qu'il faut dans le html --> balises
// import du javascript dans le html (avant le main)
// appeler les fonction définie dans le fichier javascript (ne doit pas appeler de fonction (juste les definir)
// dans le main il faut appeler les fonction dans le js

// le hist.js contient le code html c'est évident ---> mais il ne devrait pas


var  histVariable;


function setSelector_hist(id_list, objects) {
  var list = document.getElementById(id_list).getElementsByTagName("div")[0];

  for(object in objects) {
    var a = document.createElement("a");
    a.setAttribute("class", "list-group-item");
    a.setAttribute("onclick", "setSelectorValue_hist(this)");

    var label = document.createElement("label");
    label.setAttribute("value", objects[object]);
    label.innerHTML = String(objects[object]);

    a.appendChild(label);
    list.appendChild(a);
  }
};


function setSelectorValue_hist(elem) {
  var parentNode = elem.parentNode.parentNode;
  var button = d3.select(parentNode)
    .select("button")
    .node();

  d3.select(button.firstChild)
    .text(elem.text + ' ');

  histVariable = elem.text;
	redrawHist();
  //redrawMap();
};



function create_histogram(data, id) {

    var color = "steelblue";


if(histVariable) {
	var values = data.map(function(x){ return x[histVariable]} );
        }
        else {
	var values = data.map(function(x){ return x.fuelConsumption} );
        }

    //var values = data.map(function(x){ return x.fuelConsumption} );
    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 20, right: 30, bottom: 30, left: 30};

    var width = d3.select(id).node().getBoundingClientRect().width - margin.left - margin.right;
    var height = d3.select(id).node().getBoundingClientRect().height - margin.top - margin.bottom;

    var max = d3.max(values);
    var min = d3.min(values);
    var x = d3.scale.linear()
    	.domain([min, max])
    	.range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
    	.bins(x.ticks(20))
        (values);

    var yMax = d3.max(data, function(d){return d.length});
    var yMin = d3.min(data, function(d){return d.length});
    var colorScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var y = d3.scale.linear()
    	.domain([0, yMax])
    	.range([height, 0]);

    var xAxis = d3.svg.axis()
    	.scale(x)
    	.orient("bottom");

    var svg = d3.select(id).append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
    	.data(data)
    	.enter().append("g")
    	.attr("class", "bar")
    	.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
    	.attr("x", 1)
    	.attr("width", (x(data[0].dx) - x(0)) - 1)
    	.attr("height", function(d) { return height - y(d.y); })
    	.attr("fill", function(d) { return colorScale(d.y) });

    bar.append("text")
    	.attr("dy", ".75em")
    	.attr("y", -12)
    	.attr("x", (x(data[0].dx) - x(0)) / 2)
    	.attr("text-anchor", "middle")
    	.text(function(d) { return formatCount(d.y); });

    svg.append("g")
    	.attr("class", "x axis")
    	.attr("transform", "translate(0," + height + ")")
    	.call(xAxis);
};

function update_hist(data,id){
    console.log("Updating histogram",id);
    var svg = d3.select(id).select("svg").remove();

    create_histogram(data,id);

};
