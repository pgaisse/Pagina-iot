//$(window).on("load", cargargraf);

//$(document).ready(function () {
 //   cargargraf();

//});
var topic="", currettopic="";
$(window).on("load", gethour)
function gethour(){
    var today= new Date();
    var todayb=new Date(today.getTime());
    var todaya= new Date(today.getTime() - 1000 * 60*60 );
    $('#date1').val(todaya.getFullYear() + '-' + ('0' + (todaya.getMonth() + 1)).slice(-2) + '-' + ('0' + todaya.getDate()).slice(-2)+'T'+('0' + todaya.getHours()).slice(-2)+':'+('0' + todaya.getMinutes()).slice(-2));
    $('#date2').val(todayb.getFullYear() + '-' + ('0' + (todayb.getMonth() + 1)).slice(-2) + '-' + ('0' + todayb.getDate()).slice(-2)+'T'+('0' + todayb.getHours()).slice(-2)+':'+('0' + todayb.getMinutes()).slice(-2));
  
   // console.log(today.toISOString())
}

$(document).on("change",'#myRange', function (e){
    
    let res=e.target.value;
    $('#slidelabel').text(res);
})


function cargargraf(){
    $.ajax({
        url: '../iot/all-ajax',
        success: function (sensors){
            var datosgraf=[];
            $('#cardgraphshow').css('display','block');
            sensors.graf.forEach(graf => {            
            var date = new Date(graf.date)
            datosgraf.push({ date:date ,value: graf.value})    
            });
            datosgraf.reverse();
            //datosgraf = datosgraf.filter(dato   =>  dato    !== "__proto__");
           // console.log("datos dinamicos",datosgraf);
            bha(datosgraf);
        }
        
    })
}

function recibecurrentreg(){
    let value="";    
    $.ajax({
        url: '../iot/sendcurrentreg',
        success: function (reg){   
                 
            reg.lastreg.forEach(regi=>{           
                value=regi.value;
            })
            if (value==1){
                $('#valueh4').text("Estado : Encendido");
            }
            else if(value==0){
                $('#valueh4').text("Estado : Apagado");
            }
            else{
                $('#valueh4').text("Estado : Indefinido");
            }
            console.log("value : ", value);
        }
    })
}
function bha(sensors) {
        //console.log("desde custom ",graf)
        var amchart = AmCharts.makeChart("sales-analytics", {
            "type": "serial",
            "theme": "light",
            "marginTop": 0,
            "marginRight": 100,
            "dataProvider": sensors,
            "graphs": [{
                "id": "g1",
                "balloonText": "[[date]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                "bullet": "round",
                "bulletSize": 8,
                "lineColor": "#fe5d70",
                "lineThickness": 1,
                "negativeLineColor": "#fe9365",
                "type": "smoothedLine",
                "valueField": "value"
            }],
            "chartScrollbar": {
                "graph": "g1",
                "gridAlpha": 0,
                "color": "#888888",
                "scrollbarHeight": 55,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "#888888",
                "graphFillAlpha": 0,
                "autoGridCount": true,
                "selectedGraphFillAlpha": 0,
                "graphLineAlpha": 0.2,
                "graphLineColor": "#c2c2c2",
                "selectedGraphLineColor": "#888888",
                "selectedGraphLineAlpha": 1
    
            },
            "chartCursor": {
                "categoryBalloonDateFormat": "YYYY-MM-DD HH:NN:SS",
                "cursorAlpha": 0,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "valueLineAlpha": 0.5,
                "fullWidth": true
            },
            "dataDateFormat": "YYYY-MM-DD HH:NN:SS",
            "categoryField": "date",
            "categoryAxis": {
                "minPeriod": "ss",
                "parseDates": true,
                "gridAlpha": 0,
                "minorGridAlpha": 0,
                "minorGridEnabled": true
            },
            "export": {
                "enabled": true
            }
        });
        amchart.addListener("rendered", zoomChart);
        if (amchart.zoomChart) {
            amchart.zoomChart();
        }
    
        function zoomChart() {
            amchart.zoomToIndexes(Math.round(amchart.dataProvider.length * 0.4), Math.round(amchart.dataProvider.length * 0.55));
            
        }
    }
    function actiontopicset(val){
       // console.log("currenttopic: ",currenttopic, " val: ",val)
        $.ajax({
            url:'../iot/new-reg',
            method:'POST',
            data:{
                topic:currenttopic,
                value:val
            },
            success: function (response){
                if(response=="OK"){
                    //console.log(response);
                    console.log("Current Topic :",currenttopic);
                    recibecurrentreg()
                }

                
            }
    
        })
       
    }
    function actiontopicget(name,top){    
        currenttopic=top;
        $('#topich4').text(name);
        $('#content-but').css('display','block');
        console.log("dato pintado")
        
    }

function datostopic(top){
    topic= top;       

    let date1= $('#date1');
    let date2= $('#date2');
    let vmin= $('#vmin');
    let vmax= $('#vmax');
    
    $.ajax({
        url:'../iot/post-graph',
        method:'POST',
        data:{
            topic: top,
            date1: date1.val(),
            date2: date2.val(),
            vmin: vmin.val(),
            vmax: vmax.val(),
            
        },
        success: function (response){
            //console.log(response);
            console.log("todo OK  topic, llamando funcion graph");
            cargargraf();
        }

    })
}

$('#formgraphshow').on('submit', function(e){
    e.preventDefault()
    let date1= $('#date1');
    let date2= $('#date2');
    let vmin= $('#vmin');
    let vmax= $('#vmax');
    let interval= $('#interval');
    $.ajax({
        url:'../iot/post-graph',
        method:'POST',
        data:{
            topic: topic,
            date1: date1.val(),
            date2: date2.val(),
            vmin: vmin.val(),
            vmax: vmax.val(),
            interval:  interval.val()
        },
        success: function (response){
            //console.log(response);
            console.log("todo OK, llamando funcion graph");
            cargargraf();
        }

    })
})

 
    
    

