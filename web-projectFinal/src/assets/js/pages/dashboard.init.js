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

var pollingData, fivethirtyeightData;

// Call the API
fetch('https://projects.fivethirtyeight.com/polls/president-general/national/polling-average.json').then(function (response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}).then(function (data) {

    // Store the post data to a variable
    fivethirtyeightData = data;

    // Fetch another API
    return fetch('http://138.91.35.252/output/processed.json');

}).then(function (response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}).then(function (pollData) {
    pollingData = pollData;

    totalDateArr = [];

    fteBidenArr = [];
    fteTrumpArr = [];

    bidenCompoundArr = [];
    trumpCompoundArr = [];
    // ["2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00", "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00", "2018-09-19T06:30:00"]
    for (pD in pollingData) {
        curDate = pollingData[pD]['date'];

        // Five thirty eight data
        for (item in fivethirtyeightData) {
            if (fivethirtyeightData[item]['date'] == curDate) {
                if (fivethirtyeightData[item]['candidate'] == 'Joseph R. Biden Jr.') {
                    for (i = 0; i < 24; i++) {
                        fteBidenArr.push(Math.trunc(fivethirtyeightData[item]['pct_trend_adjusted'].toFixed(2)));
                    }
                }
                else {
                    for (i = 0; i < 24; i++) {
                        fteTrumpArr.push(Math.trunc(fivethirtyeightData[item]['pct_trend_adjusted'].toFixed(2)));
                    }
                }

            }
        }

        sentiments = pollingData[pD]['sentiments'];
        // Sentiments
        for (s in sentiments) {
            try {
                curS = sentiments[s];
                if ((Array.isArray(curS['biden']) && curS['biden'].length) || (Array.isArray(curS['trump']) && curS['trump'].length)) {
                    continue;
                }


                if (curS['hour'] <= 9) {
                    totalDateArr.push(curDate + 'T0' + curS['hour'] + ':00:00');
                } else if (curS['hour'] >= 10) {
                    totalDateArr.push(curDate + 'T' + curS['hour'] + ':00:00');
                }

                bidenCompoundArr.push(50 + Math.trunc(curS['biden']['compounded'].toFixed(2) * 100));
                trumpCompoundArr.push(50 + Math.trunc(curS['trump']['compounded'].toFixed(2) * 100));

            } catch (err) {
                bidenCompoundArr.push(50);
                trumpCompoundArr.push(50);
            }
        }
    }

    curTopics = pollingData[0]['topics'];

    var topicsWordArr = [];

    for (cT in curTopics) {
        var item = curTopics[cT];
        for (words in item) {
            console.log(words);
            console.log(item[words]);

            topicsWordArr.push(
                {
                    'x': words,
                    'value': item[words],
                    'category': words
                }
            );


        }
        createWordCloud(topicsWordArr, 1);

    }

    createChart('trumpSentimentChart', trumpCompoundArr, fteTrumpArr, totalDateArr);
    createChart('bidenSentimentChart', bidenCompoundArr, fteBidenArr, totalDateArr);

}).catch(function (error) {
    console.warn(error);
});



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

function createWordCloud(data, number) {


    // create a tag (word) cloud chart
    var chart = anychart.tagCloud(data);

    // set a chart title
    chart.title('15 most spoken languages')
    // set an array of angles at which the words will be laid out
    chart.angles([0])
    // enable a color range
    chart.colorRange(false);
    // set the color range length
    chart.colorRange().length('80%');

    // display the word cloud chart
    chart.container("topic" + number);
    chart.draw();

}


function createChart(chartID, X1, X2, Y) {

    var options = {
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: true
            },
            toolbar: {
                show: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3,
        },
        series: [{
            name: 'Tweet Sentiment',
            data: X1
        }, {
            name: 'Five Thirty Eight',
            data: X2
        }],
        colors: ['#5664d2', '#1cbb8c'],
        xaxis: {
            type: 'datetime',
            categories: Y,
        },
        yaxis: {
            title: {
                text: 'sentiment'
            },
            min: 0,
            max: 100
        },
        grid: {
            borderColor: '#f1f1f1',
            padding: {
                bottom: 15
            }
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        },
        legend: {
            offsetY: 7
        }
    }

    var chart = new ApexCharts(
        document.querySelector('#' + chartID),
        options
    );

    chart.render();
}
