/*
Template Name: Nazox - Responsive Bootstrap 4 Admin Dashboard
Author: Themesdesign
Contact: themesdesign.in@gmail.com
File: Dashboard Init Js File
*/

// Line-column chart

var myInit = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
    mode: 'cors',
    cache: 'default'
};

a = '';

var data = fetch('../data/test.json').then(function (res) {
    return res.json();
}).then(function (data) {
    a = data;
    console.log(a);
});

dataSet = JSON.parse(a);

function CreateTableFromJSON() {
    var myBooks = [
        {
            "Book ID": "1",
            "Book Name": "Computer Architecture",
            "Category": "Computers",
            "Price": "125.60"
        },
        {
            "Book ID": "2",
            "Book Name": "Asp.Net 4 Blue Book",
            "Category": "Programming",
            "Price": "56.00"
        },
        {
            "Book ID": "3",
            "Book Name": "Popular Science",
            "Category": "Science",
            "Price": "210.40"
        }
    ]

    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
    for (var i = 0; i < myBooks.length; i++) {
        for (var key in myBooks[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < myBooks.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = myBooks[i][col[j]];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
} // Works

CreateTableFromJSON();






// Radialchart 1

var radialoptions = {
    series: [72],
    chart: {
        type: 'radialBar',
        wight: 60,
        height: 60,
        sparkline: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    colors: ['#5664d2'],
    stroke: {
        lineCap: 'round'
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '70%'
            },
            track: {
                margin: 0,
            },

            dataLabels: {
                show: false
            }
        }
    }
};

var radialchart = new ApexCharts(document.querySelector("#radialchart-1"), radialoptions);
radialchart.render();


// Radialchart 2

var radialoptions = {
    series: [65],
    chart: {
        type: 'radialBar',
        wight: 60,
        height: 60,
        sparkline: {
            enabled: true
        }
    },
    dataLabels: {
        enabled: false
    },
    colors: ['#1cbb8c'],
    stroke: {
        lineCap: 'round'
    },
    plotOptions: {
        radialBar: {
            hollow: {
                margin: 0,
                size: '70%'
            },
            track: {
                margin: 0,
            },

            dataLabels: {
                show: false
            }
        }
    }
};

var radialchart = new ApexCharts(document.querySelector("#radialchart-2"), radialoptions);
radialchart.render();


// sparkline chart

var options = {
    series: [{
        data: [23, 32, 27, 38, 27, 32, 27, 34, 26, 31, 28]
    }],
    chart: {
        type: 'line',
        width: 80,
        height: 35,
        sparkline: {
            enabled: true
        }
    },
    stroke: {
        width: [3],
        curve: 'smooth'
    },
    colors: ['#5664d2'],

    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};

var chart = new ApexCharts(document.querySelector("#spak-chart1"), options);
chart.render();


var options = {
    series: [{
        data: [24, 62, 42, 84, 63, 25, 44, 46, 54, 28, 54]
    }],
    chart: {
        type: 'line',
        width: 80,
        height: 35,
        sparkline: {
            enabled: true
        }
    },
    stroke: {
        width: [3],
        curve: 'smooth'
    },
    colors: ['#5664d2'],
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};

var chart = new ApexCharts(document.querySelector("#spak-chart2"), options);
chart.render();


var options = {
    series: [{
        data: [42, 31, 42, 34, 46, 38, 44, 36, 42, 32, 54]
    }],
    chart: {
        type: 'line',
        width: 80,
        height: 35,
        sparkline: {
            enabled: true
        }
    },
    stroke: {
        width: [3],
        curve: 'smooth'
    },
    colors: ['#5664d2'],
    tooltip: {
        fixed: {
            enabled: false
        },
        x: {
            show: false
        },
        y: {
            title: {
                formatter: function (seriesName) {
                    return ''
                }
            }
        },
        marker: {
            show: false
        }
    }
};

var chart = new ApexCharts(document.querySelector("#spak-chart3"), options);
chart.render();

// vectormap

$('#usa-vectormap').vectorMap({
    map: 'us_merc_en',
    backgroundColor: 'transparent',
    regionStyle: {
        initial: {
            fill: '#e8ecf4',
            stroke: '#74788d',
            'stroke-width': 1,
            "stroke-opacity": 0.4,
        }
    },

});



// datatable
$(document).ready(function () {
    $('.datatable').DataTable({
        "lengthMenu": [5, 10, 25, 50],
        "pageLength": 5,
        "columns": [
            { 'orderable': false },
            { 'orderable': true },
            { 'orderable': true },
            { 'orderable': true },
            { 'orderable': true },
            { 'orderable': true },
            { 'orderable': false }
        ],
        "order": [[1, "asc"]],
        "language": {
            "paginate": {
                "previous": "<i class='mdi mdi-chevron-left'>",
                "next": "<i class='mdi mdi-chevron-right'>"
            }
        },
        "drawCallback": function () {
            $('.dataTables_paginate > .pagination').addClass('pagination-rounded');
        }
    });
});