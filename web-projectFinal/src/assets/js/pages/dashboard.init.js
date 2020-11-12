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
    //return fetch('https://cors-anywhere.herokuapp.com/http://138.91.35.252/output/processed.json', { headers: { 'x-requested-with': 'xmlhttprequest' } });

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

    bidenPositiveArr = [];
    bidenNegativeArr = [];

    trumpPositiveArr = [];
    trumpNegativeArr = [];

    bidenCompoundArr = [];
    trumpCompoundArr = [];

    aggreTrumpCompoundArr = [];
    aggreBidenCompoundArr = [];
    // ["2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00", "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00", "2018-09-19T06:30:00"]
    for (pD in pollingData) {
        curDate = pollingData[pD]['date'];

        totalDateArr.push(curDate);

        sumPositiveTrump = 0.0;
        sumNegativeTrump = 0.0;
        sumPositiveBiden = 0.0;
        sumNegativeBiden = 0.0;

        sumCompoundTrump = 0.0;
        sumCompoundBiden = 0.0;

        // Five thirty eight data
        for (item in fivethirtyeightData) {
            if (fivethirtyeightData[item]['date'] == curDate) {
                if (fivethirtyeightData[item]['candidate'] == 'Joseph R. Biden Jr.') {

                    fteBidenArr.push(Math.trunc(fivethirtyeightData[item]['pct_trend_adjusted'].toFixed(2)));

                }
                else {

                    fteTrumpArr.push(Math.trunc(fivethirtyeightData[item]['pct_trend_adjusted'].toFixed(2)));

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


                /* if (curS['hour'] <= 9) {
                    totalDateArr.push(curDate + 'T0' + curS['hour'] + ':00:00');
                } else if (curS['hour'] >= 10) {
                    totalDateArr.push(curDate + 'T' + curS['hour'] + ':00:00');
                } */

                sumPositiveTrump += parseFloat(curS['trump']['positive'].toFixed(2));
                sumNegativeTrump += parseFloat(curS['trump']['negative'].toFixed(2));
                sumPositiveBiden += parseFloat(curS['biden']['positive'].toFixed(2));
                sumNegativeBiden += parseFloat(curS['biden']['negative'].toFixed(2));

                sumCompoundTrump += parseFloat(curS['trump']['compounded'].toFixed(2));
                sumCompoundBiden += parseFloat(curS['biden']['compounded'].toFixed(2));

                bidenCompoundArr.push(curS['biden']['compounded'].toFixed(2));
                trumpCompoundArr.push(curS['trump']['compounded'].toFixed(2));


                //bidenPositiveArr.push(curS['biden']['positive'].toFixed(2));
                //bidenNegativeArr.push(curS['biden']['negative'].toFixed(2));


                //trumpPositiveArr.push(curS['trump']['positive'].toFixed(2));
                //trumpNegativeArr.push(curS['trump']['negative'].toFixed(2));
            } catch (err) {
                bidenCompoundArr.push(0);
                trumpCompoundArr.push(0);

                sumPositiveTrump += 0;
                sumNegativeTrump += 0;
                sumPositiveBiden += 0;
                sumNegativeBiden += 0;

                sumCompoundTrump += 0;
                sumCompoundBiden += 0;
                // bidenPositiveArr.push(0);
                // bidenNegativeArr.push(0);

                // trumpPositiveArr.push(0);
                // trumpNegativeArr.push(0);
            }


        }
        avgPositiveTrump = sumPositiveTrump / 24.0;
        avgNegativeTrump = sumNegativeTrump / 24.0;
        avgPositiveBiden = sumPositiveBiden / 24.0;
        avgNegativeBiden = sumNegativeBiden / 24.0;

        avgCompoundTrump = sumCompoundTrump / 24.0;
        avgCompoundBiden = sumCompoundBiden / 24.0;

        console.log('---------------------------');
        console.log('Avg Positive Trump: ' + avgPositiveTrump);
        console.log('Sum Positive Trump: ' + sumPositiveTrump);
        //for (i = 0; i < 24; i++) {
        bidenPositiveArr.push(Math.trunc((avgPositiveBiden.toFixed(2) * 100)));
        bidenNegativeArr.push(Math.trunc((avgNegativeBiden.toFixed(2) * 100)));

        trumpPositiveArr.push(Math.trunc((avgPositiveTrump.toFixed(2) * 100)));
        trumpNegativeArr.push(Math.trunc((avgNegativeTrump.toFixed(2) * 100)));

        aggreTrumpCompoundArr.push(Math.trunc((avgCompoundTrump.toFixed(2) * 100)));
        aggreBidenCompoundArr.push(Math.trunc((avgCompoundBiden.toFixed(2) * 100)));
        //}
    }

    firstDate = pollingData[0]['date'];
    lastDate = pollingData[pollingData.length - 1]['date'];
    firstDateArr = firstDate.split('-');
    lastDateArr = lastDate.split('-');

    $("#dateRange").ionRangeSlider({
        skin: "big",
        type: "single",
        grid: true,
        min: dateToTS(new Date(firstDateArr[0], firstDateArr[1] - 1, firstDateArr[2])),
        max: dateToTS(new Date(lastDateArr[0], lastDateArr[1] - 1, lastDateArr[2])),
        from: dateToTS(new Date(firstDateArr[0], firstDateArr[1] - 1, firstDateArr[2])),
        prettify: tsToDate,
        onFinish: function (data) {
            var months = {
                'January': '01',
                'February': '02',
                'March': '03',
                'April': '04',
                'May': '05',
                'June': '06',
                'July': '07',
                'August': '08',
                'September': '09',
                'October': '10',
                'November': '11',
                'December': '12'
            }
            dateArr = data.from_pretty.split(' ');
            day = dateArr[1].substring(0, 2);
            if (day.substr(-1) == ',') {
                day = '0' + day.substr(0, 1);
            }
            console.log(day);
            month = months[dateArr[0]];
            year = dateArr[2];
            newForm = year + '-' + month + '-' + day;

            var pData = JSON.parse(sessionStorage.getItem('pollingData'));
            populateWordCloud(pData, newForm);
            CreateTableFromJSON(pData, newForm);
        }
    });

    sessionStorage.setItem('pollingData', JSON.stringify(pollingData));

    populateWordCloud(pollingData, pollingData[0]['date']);
    createChart('trumpSentimentChart', aggreTrumpCompoundArr, fteTrumpArr, totalDateArr);
    createChart('bidenSentimentChart', aggreBidenCompoundArr, fteBidenArr, totalDateArr);

    CreateTableFromJSON(pollingData, firstDate);


    createSentiChart('trumpPosNegChart', trumpPositiveArr, trumpNegativeArr, totalDateArr);
    createSentiChart('bidenPosNegChart', bidenPositiveArr, bidenNegativeArr, totalDateArr);
    createTrumpVBidenChart("trumpBidenSentimentChart", aggreTrumpCompoundArr, aggreBidenCompoundArr, totalDateArr);
}).catch(function (error) {
    console.warn(error);
});


var prData;
// Call the API
fetch('https://cors-anywhere.herokuapp.com/http://138.91.35.252/output/correlation.json', { headers: { 'x-requested-with': 'xmlhttprequest' } }).then(function (response) {
    if (response.ok) {
        return response.json();
    } else {
        return Promise.reject(response);
    }
}).then(function (data) {

    // Store the post data to a variable
    prData = data;

    var tP = document.getElementById('trumpPValue');
    var tR = document.getElementById('trumpRValue');

    var bP = document.getElementById('bidenPValue');
    var bR = document.getElementById('bidenRValue');

    tP.innerHTML = "P Value: " + prData['trump_p'];
    tR.innerHTML = "R Value: " + prData['trump_r'];
    bP.innerHTML = "P Value: " + prData['biden_p'];
    bR.innerHTML = "R Value: " + prData['biden_r'];

});

// Word cloud populate
function populateWordCloud(data, date) {
    var t1 = document.getElementById('topic1');
    t1.innerHTML = '';
    var t2 = document.getElementById('topic2');
    t2.innerHTML = '';
    var t3 = document.getElementById('topic3');
    t3.innerHTML = '';
    var t4 = document.getElementById('topic4');
    t4.innerHTML = '';
    var t5 = document.getElementById('topic5');
    t5.innerHTML = '';


    var curTopics;

    for (d in data) {
        if (data[d]['date'] == date) {
            curTopics = data[d]['topics'];
        }
    }

    var topicsWordArr = [];

    for (cT in curTopics) {
        var item = curTopics[cT];
        for (words in item) {

            topicsWordArr.push(
                {
                    'x': words,
                    'value': item[words],
                    'category': words
                }
            );


        }
        createWordCloud(topicsWordArr, (parseInt(cT) + 1));

    }
}


function CreateTableFromJSON(data, date) {
    var tweetsDisplay = [];
    var filter;
    for (d in data) {
        if (data[d]['date'] == date) {
            filter = data[d]['tweets'];
        }
    }

    for (f in filter) {
        dict = {
            'Tweet': filter[f]['text'],
            // 'Processed Tweet': filter[f]['processed_text'],
            'Overall Sentiment': filter[f]['compounded'],
            'Positive Sentiment': filter[f]['positive'],
            'Neutral Sentiment': filter[f]['neutral'],
            'Negative Sentiment': filter[f]['negative'],
            'Sarcasm Value': filter[f]['sarcasm_value'],
        }

        tweetsDisplay.push(dict);
    }


    // EXTRACT VALUE FOR HTML HEADER. 
    // ('Book ID', 'Book Name', 'Category' and 'Price')
    var col = [];
    for (var i = 0; i < tweetsDisplay.length; i++) {
        for (var key in tweetsDisplay[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    table.setAttribute('class', "table table-centered datatable dt-responsive nowrap");
    table.setAttribute('style', "border-collapse: collapse; border-spacing: 0; width: 100%;");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.
    tr.setAttribute('class', 'thead-light');
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < tweetsDisplay.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = tweetsDisplay[i][col[j]];
        }
    }

    var months = {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }
    dateArr = date.split('-');
    day = dateArr[2];
    month = months[dateArr[1]];
    year = dateArr[0];
    newForm = day + '-' + month + '-' + year;
    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var tweetsTableTitle = document.getElementById('tweetsTableTitle');
    tweetsTableTitle.innerHTML = '';
    tweetsTableTitle.innerHTML = "Tweets of the Day: " + newForm;
    var divContainer = document.getElementById("tweetTable");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
} // Works




function createWordCloud(data, number) {

    // create a tag (word) cloud chart
    var chart = anychart.tagCloud(data);

    // set a chart title
    chart.title('Topic' + number)
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
            name: 'Twitter',
            type: 'line',
            data: X1
        }, {
            name: 'Five Thirty Eight',
            type: 'line',
            data: X2
        }],
        colors: ['#00ACEE', '#E07B39'],
        xaxis: {
            type: 'datetime',
            categories: Y,
        },
        yaxis: [
            {
                seriesName: 'Tweet Sentiment',
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#00ACEE'
                },
                labels: {
                    style: {
                        colors: '#00E396',
                    }
                },
                title: {
                    text: "Tweet sentiments",
                    style: {
                        color: '#00E396',
                    }
                },
            },
            {
                seriesName: 'FiveThirtyEight',
                opposite: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#E07B39'
                },
                labels: {
                    style: {
                        colors: '#FEB019',
                    },
                },
                title: {
                    text: "FiveThirtyEight Sentiment",
                    style: {
                        color: '#FEB019',
                    }
                }
            },
        ],
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
        },
        annotations: {
            xaxis: [
                {
                    x: new Date('3 Nov 2020 00:00:00').getTime(),
                    borderColor: '#775DD0',
                    label: {
                        style: {
                            color: '#fff',
                        },
                        text: 'Election day - 3 Nov'
                    }
                },

                {
                    x: new Date('22 Oct 2020 00:00:00').getTime(),
                    borderColor: '#775DD0',
                    label: {
                        style: {
                            color: '#fff',
                        },
                        text: 'Third Presidential Debate - 22 Oct'
                    }
                }
            ]
        }
    }

    var chart = new ApexCharts(
        document.querySelector('#' + chartID),
        options
    );

    chart.render();
}

function createSentiChart(chartID, X1, X2, Y) {

    var options = {
        chart: {
            height: 350,
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
            name: 'Positive',
            type: 'line',
            data: X1
        }, {
            name: 'Negative',
            type: 'line',
            data: X2
        }],
        colors: ['#00E396', '#FEB019'],
        xaxis: {
            type: 'datetime',
            categories: Y,
        },
        yaxis: [
            {
                seriesName: 'Tweet Sentiment',
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#00E396'
                },
                labels: {
                    style: {
                        colors: '#00E396',
                    }
                },
                title: {
                    text: "Tweet sentiments",
                    style: {
                        color: '#00E396',
                    }
                },
            },
        ],
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
        },
        annotations: {
            xaxis: [
                {
                    x: new Date('3 Nov 2020 00:00:00').getTime(),
                    borderColor: '#775DD0',
                    label: {
                        style: {
                            color: '#fff',
                        },
                        text: 'Election day - 3 Nov'
                    }
                },

                {
                    x: new Date('22 Oct 2020 00:00:00').getTime(),
                    borderColor: '#775DD0',
                    label: {
                        style: {
                            color: '#fff',
                        },
                        text: 'Third Presidential Debate - 22 Oct'
                    }
                }
            ]
        }

    }

    var chart = new ApexCharts(
        document.querySelector('#' + chartID),
        options
    );

    chart.render();
}

function createTrumpVBidenChart(chartID, X1, X2, Y) {

    var options = {
        chart: {
            height: 350,
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
            name: 'Trump',
            type: 'line',
            data: X1
        }, {
            name: 'Biden',
            type: 'line',
            data: X2
        }],
        colors: ['#CA1504', '#000E89'],
        xaxis: {
            type: 'datetime',
            categories: Y,
        },
        yaxis: [
            {
                seriesName: 'Tweet Sentiment',
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#000000'
                },
                labels: {
                    style: {
                        colors: '#00E396',
                    }
                },
                title: {
                    text: "Tweet sentiments",
                    style: {
                        color: '#00E396',
                    }
                },
            },
        ],
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
        },
        annotations: {
            xaxis: [
                {
                    x: new Date('3 Nov 2020 00:00:00').getTime(),
                    borderColor: '#775DD0',
                    label: {
                        style: {
                            color: '#fff',
                        },
                        text: 'Election day - 3 Nov'
                    }
                },

                {
                    x: new Date('22 Oct 2020 00:00:00').getTime(),
                    borderColor: '#775DD0',
                    label: {
                        style: {
                            color: '#fff',
                        },
                        text: 'Third Presidential Debate - 22 Oct'
                    }
                }
            ]
        }

    }

    var chart = new ApexCharts(
        document.querySelector('#' + chartID),
        options
    );

    chart.render();
}



var lang = "en-US";

function dateToTS(date) {
    return date.valueOf();
}

function tsToDate(ts) {
    var d = new Date(ts);

    return d.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

