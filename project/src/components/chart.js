<html>

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
</head>
<style>
button {
    background-color: #008CBA;
    font-size: 14px;
    border-radius: 8px;
    color: white;
}
</style>

<body>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.1/Chart.min.js"></script>
    <script src="https://unpkg.com/vue-chartjs/dist/vue-chartjs.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/1.0.0-rc.3/lodash.min.js"></script>
    <!--
    https://github.com/apertureless/vue-chartjs
    -->
<div class="app">
    <% info %>
    <br></br>
    <% date %>
    <% type %>
    <Pie :chart-data="pdata" :options="options"></Pie>
    <bar-chart :chart-data="bdata" :options="b_options"></bar-chart>
    <button v-on:click="get_datas(0,'today')" >當天</button>
    <button v-on:click="get_datas(-6,'week')" >最近一週</button>
    <button v-on:click="get_datas(0,'month')" >當月</button>
    <button v-on:click="get_datas(0,'premonth')" >上個月</button>
</div>


</body>
<script>
const horizonalLinePlugin = {
  id: 'horizontalLine',
  afterDraw: function(chartInstance) {
    var yValue;
    var yScale = chartInstance.scales["y-axis-0"];
    var canvas = chartInstance.chart;
    var ctx = canvas.ctx;
    var index;
    var line;
    var style;

    if (chartInstance.options.horizontalLine) {

      for (index = 0; index < chartInstance.options.horizontalLine.length; index++) {
        line = chartInstance.options.horizontalLine[index];

        if (!line.style) {
          style = "#080808";
        } else {
          style = line.style;
        }

        if (line.y) {
          yValue = yScale.getPixelForValue(line.y);
        } else {
          yValue = 0;
        }
        ctx.lineWidth = 3;
  		ctx.lineWidth = 3;

        if (yValue) {
          window.chart = chartInstance;
          ctx.beginPath();
          ctx.moveTo(0, yValue);
          ctx.lineTo(canvas.width, yValue);
          ctx.strokeStyle = style;
          ctx.stroke();
        }

        if (line.text) {
          ctx.fillStyle = style;
          ctx.fillText(line.text, 0, yValue + ctx.lineWidth);
        }
      }
      return;
    }
  }
}
function getToday(type){
    let date = new Date();
        // 获取当前月份
         var nowMonth = date.getMonth() + 1;
        // // 获取当前是几号
         var strDate = date.getDate();
        // // 添加分隔符“-”
         var seperator = "-";
        if (nowMonth >= 1 && nowMonth <= 9) {
               nowMonth = "0" + nowMonth;
        }
        // 对月份进行处理，1-9号在前面添加一个“0”
         if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
            }
        //    // 最后拼接字符串，得到一个格式为(yyyy-MM-dd)的日期
        var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
        return nowDate
}

function setFunc(dest, index) {
    if(!dest[index]){
        return 0
    }else{
        return dest[index]
    }
}
let labels1='HK$1-HK$500';
let labels2='HK$500-HK$1000';
let labels3='>HK$1000';
let labels1_c='#1EFFFF';
let labels2_c='#f87979';
let labels3_c='#3D5B96';
let labels=['12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
var row={{=XML(datas)}};
function get_values(day,premonth,type){
    let i=0,j=0,l=0;
    let values_500={},values_1000={},values_0={};
    _.map(row,function(v,k){
        let data_ts=Date.parse((v.ts).substring(0,10)).valueOf()
        let new_day_ts=Date.parse(day).valueOf()
        let discounted_amount=Number(v.discounted_amount)
        let ts=((v.ts).substring(11,13)).toString()
        let index=0
        if(ts > '11'){
            let time = ts-12
            if(type==='today'){
                if(data_ts===new_day_ts){
                    if(discounted_amount<= Number(500)){
                        i++
                        values_500[time]=i
                    }else if(discounted_amount > Number(500) && discounted_amount < Number(1000)){
                        j++
                       values_1000[time]=j
                    }else{
                        l++
                       values_0[time]=l
                    }
                }
     }else if(type==='week'){
                let date=new Date()
                const Today=Date.parse(date).valueOf()
                if(Today > data_ts && data_ts >= new_day_ts){
                    if(discounted_amount<= Number(500)){
                        i++
                        values_500[time]=i
                    }else if(discounted_amount > Number(500) && discounted_amount < Number(1000)){
                        j++
                       values_1000[time]=j
                    }else{
                        l++
                       values_0[time]=l
                    }
                }
            }else if((type==='month' || type==='premonth') && new_day_ts >= data_ts && data_ts >= Date.parse(premonth).valueOf()){
                if(discounted_amount<= Number(500)){
                    i++
                    values_500[time]=i
                }else if(discounted_amount > Number(500) && discounted_amount < Number(1000)){
                    j++
                    values_1000[time]=j
                }else{
                    l++
                    values_0[time]=l
                }
            }
        }
    })
  let total=i+j+l;
    let data1=(Math.round(i / total * 10000) / 100.00 )|| 0;
    let data2=(Math.round(j / total * 10000) / 100.00 )|| 0;
    let data3=(Math.round(l / total * 10000) / 100.00 )|| 0;
    let pie_ary=[data1,data2,data3];


    let data_500=[],data_1000=[],data_0=[];
    let value_0=0,value_500=0,value_1000=0;
    for (i = 0; i < labels.length; i++) {
        value_500=this.setFunc(values_500,i)
        value_1000=this.setFunc(values_1000,i)
        value_0=this.setFunc(values_0,i)
        data_500.push(value_500)
        data_1000.push(value_1000)
        data_0.push(value_0)
    }
    return {'data_500':data_500,'data_1000':data_1000,'data_0':data_0,'pie_ary':pie_ary}
}
Vue.component('bar-chart', {
  extends: VueChartJs.Bar,
  mixins: [VueChartJs.mixins.reactiveProp],
  props: ['options'],
  beforeMount () {
    this.addPlugin(horizonalLinePlugin)
  },
  mounted () {
    this.renderChart(this.chartData,this.options)
  }
})

Vue.component('Pie', {
    extends:VueChartJs.Pie,
    mixins: [VueChartJs.mixins.reactiveProp],
    props: ['options'],
    mounted ()  {
        this.renderChart(this.chartData,this.options)
    }
})
var vm = new Vue({
    el: '.app',
    delimiters: ['<%', '%>'],
    data: {
        info:'交易紀錄',
        date:this.getToday('today'),
        premonth:'',
        type:'today',
        options: {responsive: true, maintainAspectRatio: false},
        b_options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    stacked: true,
                    categoryPercentage: 0.5,
                    barPercentage: 1
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        },
   pdata: {
          labels: [labels1, labels2, labels3],
          datasets: [
            {
              backgroundColor: [
                labels1_c,
                labels2_c,
                labels3_c
              ],
              data: data.pie_ary
            }
          ]
        },
 bdata: {
          labels: labels,
          datasets: [
             {
              label: labels1,
              backgroundColor: labels1_c,
              data: data.data_500
            },
            {
              label: labels2,
              backgroundColor: labels2_c,
              data: data.data_1000
            },
            {
              label: labels3,
              backgroundColor: labels3_c,
              data: data.data_0
            },
          ]
        }

    },
  methods: {
        get_datas(AddDayCount,type){
            let date = new Date();
            var nowDate='',premonth='';
            if(type==='week'){
                date.setDate(date.getDate()+AddDayCount);
                let y = date.getFullYear();
                let m = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);//获取当前月份的日期，不足10补0
                let d = date.getDate()<10?"0"+date.getDate():date.getDate();//获取当前几号，不足10补0
                nowDate=y+"-"+m+"-"+d
            }else if(type==='today'){
                var nowMonth = date.getMonth() + 1;
                var strDate = date.getDate();
                var seperator = "-";
                if (nowMonth >= 1 && nowMonth <= 9) {
                    nowMonth = "0" + nowMonth;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
            }else if(type==='month'){
   let m = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);//获取当前月份的日期
                let y = date.getFullYear();
                let d = date.getDate()<10?"0"+date.getDate():date.getDate();//获取当前几号，不足10补0
                if(d>'25'){
                    nowDate=y+"-"+m+"-"+28
                    premonth=y+"-"+m+"-"+26
                }else{
                    let days = new Date(y, m, 0);
                    days = days.getDate(); //获取当前日期中月的天数
                    let year2 = y;
                    let month2 = parseInt(m) - 1;
                    if (month2 === 0) {
                        year2 = parseInt(year2) - 1;
                        month2 = 12;
                    }
                    if (month2 < 10) {
                        month2 = '0' + month2;
                    }
                    //當月
                    nowDate=y+"-"+m+"-"+28
                    //上個月
                    premonth = year2 + '-' + month2 + '-' + 26;
                    this.premonth=premonth
                }  }else if(type==='premonth'){
                let y = date.getFullYear();
                let m = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1);//获取当前月份的日期
                let d = date.getDate()<10?"0"+date.getDate():date.getDate();//获取当前几号，不足10补0

                let days = new Date(y, m, 0);
                let year2 = y;
                let month2 = parseInt(m) - 1;
                if (month2 === 0) {
                    year2 = parseInt(year2) - 1;
                    month2 = 12;
                }
                if (month2 < 10) {
                    month2 = '0' + month2;
                }
                if(d>25){
                    nowDate=y+"-"+m+"-"+25
                    premonth=year2+"-"+month2+"-"+26
                }else{
                    //上個月
                    nowDate = year2 + '-' + month2 + '-' + 28;

                    let year3 = year2;
                    let month3 = parseInt(month2) - 1;
                    if (month3 === 0) {
                        year3 = parseInt(year3) - 1;
                        month3 = 12;
                    }
                    if (month3 < 10) {
                        month3 = '0' + month3;
                    }  //上上個月
                    premonth = year3 + '-' + month3 + '-' + 26;
                }
            }
			this.date=nowDate
            this.type=type
            this.premonth=premonth
            let data=get_values(nowDate,premonth,type)
            this.pdata = {
                labels: [labels1, labels2, labels3],
                datasets: [
                    {
                      backgroundColor: [
                        labels1_c,
                        labels2_c,
                        labels3_c
                      ],
                      data:data.pie_ary
                    }
                ]
            }
 this.bdata = {
              labels: labels,
              datasets: [
                 {
                  label: labels1,
                  backgroundColor: labels1_c,
                  data: data.data_500
                },
                {
                  label: labels2,
                  backgroundColor: labels2_c,
                  data: data.data_1000
                },
                {
                  label: labels3,
                  backgroundColor: labels3_c,
                  data: data.data_0
                }
              ]
            }
        }
    }
})
</script>
</html>
