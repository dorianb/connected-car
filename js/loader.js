var dataset = [];
var selected_vehicles = [];
var selected_trips = [];
var selections = [];
var selected_motor_type = [];
var selected_day = [];
var selected_horaire = [];
var selected_duree = [];


function loadData(filename, done) {
  d3.csv(filename)
    .row(function(d, i) {
      return {
        id_vehicle: d.id_VIN,
        id_trip: d.id_veh_traj,
        fuelConsumption: +d["Consommation L/100km"],
        residuals: +d.residuals,
        differentialMileageCumul: +d.Delta_mileage,
        latitude: +d.LAT06,
        longitude: +d.LON06,
        LatLng: new L.LatLng(+d.LAT06, +d.LON06),
        trame: +d.Id_trame, 
        type_moteur: +d.Moteur_type,
        poids_veh: +d.Poids,
        horaire: +d.horaire,
        jour: +d.weekday,
        duree: +d.duree_trajet,
        date: d3.time.format("%Y-%m-%d %H:%M:%S").parse(d.PTCL)

      };
    })
    .get(function(error, rows) {
      console.log("Loaded " + rows.length + " rows");
      if (rows.length > 0) {
        console.log("First row: ", rows[0]);
        console.log("random row 2: ", rows[256]);
        console.log("Last  row: ", rows[rows.length-1]);

        selections = Object.keys(rows[0]);
      }

      dataset = rows;
      done(dataset);
    });
};

function getSelections() {
  return selections;
};

function getVehicles() {
  return [...new Set(getDataSet().map(function(row) {
    return row.id_vehicle;
  }))].sort();
};

function getTrips() {
  return [...new Set(getDataSet().map(function(row) {
    return row.id_trip;
  }))].sort(function(a, b) {
    return a - b;
  });
};

function getAgregateDataSet(group, variable) {
  console.log("Aggregate");
  console.log(_.groupBy(dataset, group));
  return Array.from(_.groupBy(dataset, group)).map(function(element) {
    return element.reduce(function(a, b) {
      return a[variable] + b[variable];
    });
  });
};

function getMotorType(){
  return [...new Set(getDataSet().map(function(row){
    return row.type_moteur;
  }))].sort();
};

function getHoraire(){
  return [...new Set(getDataSet().map(function(row){
    return row.horaire;
  }))].sort();

};

function getDay(){
  return [...new Set(getDataSet().map(function(row){
    return row.jour;
  }))].sort();

};

function getDuree(){
  return [...new Set(getDataSet().map(function(row){
    return row.duree;
  }))].sort();
};

function getFilteredDataSet() {
  console.log(selected_vehicles);
  console.log("Trip filter:");
  console.log(selected_trips);
  console.log(selected_motor_type);
  console.log(selected_horaire);
  console.log(selected_day);
  console.log(selected_duree);
  return dataset.filter(function(row) {
    if(selected_vehicles.indexOf(row.id_vehicle) > -1 || selected_trips.indexOf(row.id_trip) > -1|| selected_motor_type.indexOf(row.type_moteur) > -1|| selected_horaire.indexOf(row.horaire) > -1|| selected_day.indexOf(row.jour) > -1|| selected_duree.indexOf(row.duree) > -1) {
      return true;
    }
    else if(selected_vehicles.length == 0 && selected_trips.length == 0 && selected_motor_type.length == 0 && selected_horaire.length == 0 && selected_day.length == 0 && selected_duree.length == 0) {
      return true;
    }
    else {
      return false;
    }
  });
};

function getDataSet() {
  return dataset;
};

function setSelectedVehicles(items) {
  selected_vehicles = items;
};

function setSelectedTrips(items) {
  selected_trips = items;
};

function getSelectedVehicles() {
  return selected_vehicles;
};

function getSelectedTrips() {
  return selected_trips;
};

function setSelectedMotorType(items){
  selected_motor_type = items;
};

function getSelectedMotorType(){
  return selected_motor_type;
};

function setSelectedHoraire(items){
  selected_horaire = items;
};

function getSelectedHoraire(){
  return selected_horaire;
};

function setSelectedDay(items){
  selected_day = items;
};

function getSelectedDay(){
  return selected_day;
};

function setSelectedDuree(items){
  selected_duree = items;
};

function getSelectedDuree(){
  return selected_duree;
};
