// Peter McNeely
// Note: This application may be implemented either with global functions or with an OO-based method approach.
// You may choose either approach.

var context; // the graphics context of the canvas; similar to a swing ContentPane
var canvas;  // the canvas element; similar to a java swing JFrame

var chart;   // the chartjs object (assuming you're using chartjs)
var chartData;  // data object to be supplied to the chart (if using chartjs)

// Note: You may add additional global variables if needed, but be sure to document them.

// This function is invoked when the document has finished loading (it should be invoked on the body load event).
$().ready(init);
function init() {
    "use strict";
    canvas = $("#chart1")[0]; // get the DOM canvas element
    context  = canvas.getContext("2d"); // get the context from the canvas
    chart =  new Chart(context);// initialize the chart
    Chart.defaults.global.responsive = true; // make the chart responsive

    // setup the button handler to call a function that updates the page
    $("#update").click(updateDisplay);
    // adds the enter functionality to the text box.
    $("#filter").keydown( function(e){
        if (e.which === 13){
            updateDisplay();
    }});
    // Removes the Default of the enter button reloading the page.

    // call the below function that creates the "default" page that displays the full table and chart for the entire result set
    createDefaultDisplay();
}


// This function creates the "default" page.
// Note: You may add parameters to this function if needed, but be sure to document them.
function createDefaultDisplay() {
    "use strict";
    // Initialize the "data" object used by the Chartjs chart
    initializeData();
    // Initialize the inner html of the table to "", and then iterate through the result set, adding
    // table rows and table data
    let table = $("#table1").html("");
    let tableData = "<tbody>";
    for (let e in results){
        tableData += addElement(e);
    }
    // As you iterate through the result set, insert the appropriate values into the "data" object
    // that will be used by the Chartjs object.

    // When done iterating, set the inner html of the table

    table.html(tableData + "</tbody>");

    // Also display the chart.

    // Note: The Chartjs chart object supposedly supports an update() method, but I've found that it
    // doesn't seem to work as documented. This hack is another way of rebuilding the chart whenever
    // it needs to be re-created.
    // see http://www.chartjs.org/docs/#getting-started
    createChart();
}


// This function is called whenever the Apply/Update button is pressed.
// When it is called, it applies the specified filter expression to the result set, and
// redraws the table and chart with only the filtered results.
// Note: You may add parameters to this function if needed, but be sure to document them.
function updateDisplay() {
    "use strict";
    // Re-initialize the "data" object used by the Chartjs chart. You're going to repopulate it
    // with only the data that the filter does not remove.
    initializeData();

    // Determine which radio button is currently selected.
    let button = $("input[type=radio]:checked").val();

    let expression = $(".form-control").val();
    expression = expression.toUpperCase();
    // Retrieve the filter expression. You'll use this to determine what rows of the result set to show and hide.
    // Refer to the documentation on JavaScript String object's methods to figure out how to use the filter
    // expression to exclude results that don't match the filter expression.
    let table = $("#table1").html("");
    let tableData = "<tbody>";
    for (let e in results) {
        let value = "";
        switch (button) {
            case "Name":
                value = results[e].name.toUpperCase();
                break;
            case "IP":
                value = results[e].ip.toUpperCase();
                break;
            case "Session":
                value = results[e].sessionid.toUpperCase();
                break;
            case "Time":
                value = results[e].time.toUpperCase();
                break;
        }
        if ($("input[type=checkbox]").is(":checked")) {
            if (value.match(expression) !== null) {
                tableData += addElement(e);
            }
        } else {
            if (value.indexOf(expression) !== -1) {
                tableData += addElement(e);
            }
        }
    }
    // When done iterating, set the inner html of the table and re-display a filtered chart.
    // Note that you're not actually removing data from the result set - you're only showing the filtered
    // subset. Thus, the indices of the subset should match those of the original data set.
    table.html(tableData + "</tbody>");
    createChart();
}

/**
 * Instantiates data to be repopulated every time.
 */
function initializeData(){
    "use strict";
    chartData = {
        labels: [],
        datasets: [{
            data:[],
            backgroundColor: []

        }]
    };
}

/**
 * Creates a chart with the newly specified data
 */
function createChart(){
    "use strict";
    if( chart !== null ) {
        chart.destroy();
    }
    chart = new Chart(context,{
        type: "bar",
        title: "Execution Times",
        data: chartData,
        options: {
            legend: {
                display: false
            }
        }
    });
}

/**
 * Adds an element to the chart
 * @param e the element to be added
 * @returns {string} the string associated with the Elements to be added
 */
function addElement(e){
    "use strict";
    chartData.labels.push(e);
    chartData.datasets[0].data.push(parseInt(results[e].time));
    chartData.datasets[0].backgroundColor.push(randomColor());
    return "<tr><td>" + e + "</td><td>" + results[e].name + "</td><td>"+ results[e].time +"</td><td>"+results[e].ip + "</td><td>" +
        results[e].sessionid + "</td></tr>";
}

/**
 * Assigns a random color to every bar in the table
 * @returns {string} the string associated with the color for the bar
 */
function randomColor(){
    "use strict";
    let red = Math.floor(Math.random()*256);
    let green = Math.floor(Math.random()*256);
    let blue = Math.floor(Math.random()*256);
    return "rgba("+red+", "+ green+", "+ blue + ", 0.8)";
}
