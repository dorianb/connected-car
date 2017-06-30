function displayTimesSeries(data) {

    var width = d3.select("#times_series").node().getBoundingClientRect().width;
    var height = d3.select("#times_series").node().getBoundingClientRect().height;

    MG.data_graphic({
        data: data,
        width: width,
        height: height,
        area: false,
        color: '#8C001A',
        animate_on_load: true,
        linked: false,
        target: document.getElementById('times_series'),
        x_accessor: 'date',
        y_accessor: 'fuelConsumption',
        y_scale_type: 'linear',
        yax_count: 3,
        x_label: 'Temps',
        x_extended_ticks: true,
        y_label: 'Consommation (L/100km)'
    });
};

function update_timesSeries(data) {
    console.log("Updating time series");
    var svg = d3.select("#times_series").select("svg").remove();
    displayTimesSeries(data);
};
