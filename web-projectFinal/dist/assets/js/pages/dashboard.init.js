var pollingData,fivethirtyeightData,myInit={method:"GET",headers:{"Content-Type":"application/json"},mode:"cors",cache:"default"};function populateWordCloud(e,t){var r;for(d in document.getElementById("topic1").innerHTML="",document.getElementById("topic2").innerHTML="",document.getElementById("topic3").innerHTML="",document.getElementById("topic4").innerHTML="",document.getElementById("topic5").innerHTML="",e)e[d].date==t&&(r=e[d].topics);var a=[];for(cT in r){var n=r[cT];for(words in n)a.push({x:words,value:n[words],category:words});createWordCloud(a,parseInt(cT)+1)}}function CreateTableFromJSON(e,t){var r,a=[];for(d in e)e[d].date==t&&(r=e[d].tweets);for(f in r)dict={Text:r[f].text,Username:r[f].user_name,"Sarcasm Value":r[f].sarcasm_value},a.push(dict);for(var n=[],o=0;o<a.length;o++)for(var i in a[o])-1===n.indexOf(i)&&n.push(i);var l=document.createElement("table");l.setAttribute("class","table table-centered datatable dt-responsive nowrap"),l.setAttribute("style","border-collapse: collapse; border-spacing: 0; width: 100%;");var s=l.insertRow(-1);s.setAttribute("class","thead-light");for(o=0;o<n.length;o++){var u=document.createElement("th");u.innerHTML=n[o],s.appendChild(u)}for(o=0;o<a.length;o++){s=l.insertRow(-1);for(var c=0;c<n.length;c++)s.insertCell(-1).innerHTML=a[o][n[c]]}dateArr=t.split("-"),day=dateArr[2],month={"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September",10:"October",11:"November",12:"December"}[dateArr[1]],year=dateArr[0],newForm=day+"-"+month+"-"+year;var p=document.getElementById("tweetsTableTitle");p.innerHTML="",p.innerHTML="Tweets Table "+newForm;p=document.getElementById("tweetTable");p.innerHTML="",p.appendChild(l)}function createWordCloud(e,t){e=anychart.tagCloud(e);e.title("Topic"+t),e.angles([0]),e.colorRange(!1),e.colorRange().length("80%"),e.container("topic"+t),e.draw()}function createChart(e,t,r,a){a={chart:{height:350,type:"line",zoom:{enabled:!0},toolbar:{show:!0}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:3},series:[{name:"Tweet Sentiment",data:t},{name:"Five Thirty Eight",data:r}],colors:["#5664d2","#1cbb8c"],xaxis:{type:"datetime",categories:a},yaxis:{title:{text:"sentiment"},min:0,max:100},grid:{borderColor:"#f1f1f1",padding:{bottom:15}},tooltip:{x:{format:"dd/MM/yy HH:mm"}},legend:{offsetY:7}};new ApexCharts(document.querySelector("#"+e),a).render()}a="",fetch("https://projects.fivethirtyeight.com/polls/president-general/national/polling-average.json").then(function(e){return e.ok?e.json():Promise.reject(e)}).then(function(e){return fivethirtyeightData=e,fetch("https://cors-anywhere.herokuapp.com/http://138.91.35.252/output/processed.json",{headers:{"x-requested-with":"xmlhttprequest"}})}).then(function(e){return e.ok?e.json():Promise.reject(e)}).then(function(e){for(pD in totalDateArr=[],fteBidenArr=[],fteTrumpArr=[],bidenCompoundArr=[],trumpCompoundArr=[],pollingData=e){for(item in curDate=pollingData[pD].date,fivethirtyeightData)if(fivethirtyeightData[item].date==curDate)if("Joseph R. Biden Jr."==fivethirtyeightData[item].candidate)for(i=0;i<24;i++)fteBidenArr.push(Math.trunc(fivethirtyeightData[item].pct_trend_adjusted.toFixed(2)));else for(i=0;i<24;i++)fteTrumpArr.push(Math.trunc(fivethirtyeightData[item].pct_trend_adjusted.toFixed(2)));for(s in sentiments=pollingData[pD].sentiments,sentiments)try{if(curS=sentiments[s],Array.isArray(curS.biden)&&curS.biden.length||Array.isArray(curS.trump)&&curS.trump.length)continue;curS.hour<=9?totalDateArr.push(curDate+"T0"+curS.hour+":00:00"):10<=curS.hour&&totalDateArr.push(curDate+"T"+curS.hour+":00:00"),bidenCompoundArr.push(50+Math.trunc(100*curS.biden.compounded.toFixed(2))),trumpCompoundArr.push(50+Math.trunc(100*curS.trump.compounded.toFixed(2)))}catch(e){bidenCompoundArr.push(50),trumpCompoundArr.push(50)}}firstDate=pollingData[0].date,lastDate=pollingData[pollingData.length-1].date,firstDateArr=firstDate.split("-"),lastDateArr=lastDate.split("-"),$("#dateRange").ionRangeSlider({skin:"big",type:"single",grid:!0,min:dateToTS(new Date(firstDateArr[0],firstDateArr[1]-1,firstDateArr[2])),max:dateToTS(new Date(lastDateArr[0],lastDateArr[1]-1,lastDateArr[2])),from:dateToTS(new Date(firstDateArr[0],firstDateArr[1]-1,firstDateArr[2])),prettify:tsToDate,onFinish:function(e){dateArr=e.from_pretty.split(" "),day=dateArr[1].substring(0,2),month={January:"01",February:"02",March:"03",April:"04",May:"05",June:"06",July:"07",August:"08",September:"09",October:"10",November:"11",December:"12"}[dateArr[0]],year=dateArr[2],newForm=year+"-"+month+"-"+day;e=JSON.parse(sessionStorage.getItem("pollingData"));populateWordCloud(e,newForm),CreateTableFromJSON(e,newForm)}}),sessionStorage.setItem("pollingData",JSON.stringify(pollingData)),populateWordCloud(pollingData,pollingData[0].date),createChart("trumpSentimentChart",trumpCompoundArr,fteTrumpArr,totalDateArr),createChart("bidenSentimentChart",bidenCompoundArr,fteBidenArr,totalDateArr),CreateTableFromJSON(pollingData,firstDate)}).catch(function(e){console.warn(e)});var lang="en-US";function dateToTS(e){return e.valueOf()}function tsToDate(e){return new Date(e).toLocaleDateString(lang,{year:"numeric",month:"long",day:"numeric"})}