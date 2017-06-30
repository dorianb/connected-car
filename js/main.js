var filename = "data/features_a13_complete_15K1.csv"


//chargement des données --> cf loader.js
loadData(filename, function(data) {

  displayMap(data);
  displayTimesSeries(data);
  setSelector("selector", getSelections());
  setSelector_hist("selector2", getSelections());

  setFilterComponent("vehicle", getVehicles());
  setFilterComponent("trip", getTrips());
  // Call your main function here
  // Data loaded is stored in dataset global object
  // To add features to it, modify loader.js
  create_histogram(data,"#histogram2");
  create_histogram(data,"#histogram1");
  initialize(data);
});


function redraw() {
  resetFilterComponent("vehicle", getVehicles());
  resetFilterComponent("trip", getTrips());

  var filteredData = getFilteredDataSet();
  console.log(getAgregateDataSet("id_vehicle", "fuelConsumption"));

  drawMap(filteredData);
  update_hist(filteredData,"#histogram1");
  update_timesSeries(filteredData);
};

function redrawMap() {
  var filteredData = getFilteredDataSet();
  setColor(filteredData);
  drawMap(filteredData);
};

function redrawHist(){
  var filteredData = getFilteredDataSet();
  var data = getDataSet();
  //setColor(filteredData);
  update_hist(data,"#histogram2");
  update_hist(filteredData,"#histogram1");

};


function setFilter() {
  setSelectedVehicles(getActive("vehicle"));
  setSelectedTrips(getActive("trip"));

  redraw();
};
