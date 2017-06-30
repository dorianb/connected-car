var map, points, overlay, mapVariable;

var customControl = L.Control.extend({

  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    var container = L.DomUtil.get("selector");
    container.style.display = "block";
    return container;
  },

});

function displayMap(data) {

    var latitude = getValue(data, "latitude");
    var longitude = getValue(data, "longitude");

    displayLeaflet(
      math.mean(latitude),
      math.mean(longitude),
      math.max(latitude) - math.min(latitude),
      math.max(longitude) - math.min(longitude)
    );

    setColor(data);
    drawMap(data);
};

function setSelector(id_list, objects) {
  var list = document.getElementById(id_list).getElementsByTagName("div")[0];

  for(object in objects) {
    var a = document.createElement("a");
    a.setAttribute("class", "list-group-item");
    a.setAttribute("onclick", "setSelectorValue(this)");

    var label = document.createElement("label");
    label.setAttribute("value", objects[object]);
    label.innerHTML = String(objects[object]);

    a.appendChild(label);
    list.appendChild(a);
  }
};

function setSelectorValue(elem) {
  var parentNode = elem.parentNode.parentNode;
  var button = d3.select(parentNode)
    .select("button")
    .node();

  d3.select(button.firstChild)
    .text(elem.text + ' ');

  mapVariable = elem.text;
  redrawMap();
};

function getValue(data, item) {
  return data.map(function(row) {
    return row[item];
  });
};

function displayLeaflet(lat, lon, rangeLat, rangeLon) {

  var zoom = 12 - (math.sqrt(rangeLat) + math.sqrt(rangeLon)) / math.sqrt(rangeLat + rangeLon);
  map = L.map('map').setView([lat, lon], zoom);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
};

function setColor(data) {
  if(mapVariable) {
    color = d3.scale.quantile()
      .domain(data.map(function(row) {
        return row[mapVariable];
      }))
      .range(["green", "yellow", "red"]);
  }
}

function drawMap(data) {
  console.log("Drawing");

  if(overlay) {
    overlay.remove();
  }

  overlay = L.d3SvgOverlay(function(sel, proj) {

    proj.layer.options = {
  		zoomDraw: false,
  		zoomHide: true
  	};

    var bounds = map.getBounds();
    bounds = [bounds["_northEast"], bounds["_southWest"]];

    points = sel.selectAll('.point')
      .data(data);

    points.enter().append('circle')
      .classed('point', true);

    points
      .attr('class', 'point')
      .attr("cx", function (d) { return map.getZoom() / 10; })
      .attr("cy", function (d) { return map.getZoom() / 10; })
      .attr("r", function (d) { return map.getZoom() / 10; })
  		.style("fill", function(d) {
        if(mapVariable) {
          return color(d[mapVariable]);
        }
        else {
          return "black";
        }
      })
      .attr("transform", function(d) {
        return "translate("+
          map.latLngToLayerPoint(d.LatLng).x +","+
          map.latLngToLayerPoint(d.LatLng).y +")";
      });

    map.fitBounds(bounds);
    var z = map.getZoom();
    map.setZoom(z);
  });

  var selector = new customControl();
  selector.addTo(map);

  // Disable zooming when user's cursor enters the element
  selector.getContainer().addEventListener('mouseover', function () {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
  });

  // Re-enable dragging when user's cursor leaves the element
  selector.getContainer().addEventListener('mouseout', function () {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
  });

  overlay.addTo(map);
};
