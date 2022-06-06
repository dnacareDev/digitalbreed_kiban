





// 라인차트
function drawLineChart(){
  new Chart(document.getElementById("lineChart"), {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [
          {
            label: '테스트 데이터셋1',
            data: [10,3,30,23,10,5,50],
            borderColor: "#F75320",
            fill: false,
            lineTension: 0
          },
          {
            label: '테스트 데이터셋2',
            data: [10,33,20,24,15,5,50],
            borderColor: "#45BBE0",
            fill: false,
            lineTension: 0
          },
          {
            label: '테스트 데이터셋3',
            data: [10,35,30,24,10,45,9],
            borderColor: "#FD9802",
            fill: false,
            lineTension: 0
          },
        ]
    },
    options: {
        responsive: true,
        legend: {display: false},
        title: {display: false,},
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Month'
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Amount'
                }
            }]
        }
    }
  });
}
drawLineChart();

// 파이차트
function drawPieChart(){

// var labels = ["January", "February", "March", "April", "May", "June", "July"];
// var data = [65, 59, 80, 81, 56, 55, 20];
// var options = {
//   pieceLabel: {
//     render: function(d) { return d.label + " (" + d.percentage + "%)" },
//     fontColor: '#000',
//     position: 'default',
//     segment: true
//   }
// };
// var colors = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'];
// var ctx = document.getElementById("pie").getContext('2d');
// var chart = new Chart(ctx, {
//   type: 'doughnut',
//   data: {
//     labels: labels,
//     datasets: [{
//       backgroundColor: colors,
//       data: data
//     }]
//   },
//   options: options
// });


      new Chart(document.getElementById("pieChart"),{
        type: 'pie',
        data: {
          labels: ["확인완료", "진행완료"],
          datasets: [{
            data: [70, 30],
            backgroundColor:["#45BBE0", "#8892D6"],
            borderWidth: 0,
        }]},
        options: {
          responsive: true,
          legend: false,
          maintainAspectRatio : false,
          animation: false, 
          pieceLabel:{
            mode:"label",
            position:"outside", 
            fontSize: 11,
            fontStyle: 'bold',
          },
        }
      });
}
drawPieChart();

// 막대차트
function drawStackChart(){
  if(!document.getElementById("stackChart")){return}
  // 스택 그래프 
  var ctx = document.getElementById("stackChart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["고객1","고객2","고객3","고객4","고객5","고객6","고객7","고객8","고객9"],
      datasets: [{
        label: '분석1',
        backgroundColor: "#8892D6",
        data: [12, 59, 5, 56, 58,12, 59, 87, 45],
      }, {
        label: '분석2',
        backgroundColor: "#45BBE0",
        data: [100, 59, 45, 56, 58,12, 59, 85, 23],
      }, {
        label: '분석3',
        backgroundColor: "#F06292",
        data: [102, 59, 55, 56, 58,12, 59, 65, 51],
      }, {
        label: '분석4',
        backgroundColor: "#78C250",
        data: [10, 59, 24, 56, 58, 12, 59, 12, 74],
      }],
    },
  options: {
      tooltips: {
        displayColors: true,
        callbacks:{
          mode: 'x',
        },
      },
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: {
            display: false,
          }
        }],
        yAxes: [{
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
          type: 'linear',
        }]
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: { position: 'bottom' },
    }
  });
}
drawStackChart();