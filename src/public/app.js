var intervalo;
var i=0, j=0;
var topicc, sensorn;
const Arry=[];
const Arrx=['', '','','','','','','','',''];
const estado=['OFF','ON'];





$(async function(){
        $('#btn-refresh').on('change',function(){
        var mode= $(this).prop('checked');
        if(mode){
            fajax();
            intervalo =setInterval(fajax, 1000);

        }
        else{
            clearInterval(intervalo);
            let graf=  document.getElementById('graf').style.display="none"
        }
        })
        $('#btn-refresh2').on('change',function(){
            var mode= $(this).prop('checked');
            if(mode){
                cargarwidget();
                intervalo =setInterval(cargarwidget, 1000);
    
            }
            else{
                clearInterval(intervalo);
                let graf=  document.getElementById('graf').style.display="none"
            }
            })

})


function cargarwidget(){
    date = new Date()
    $.ajax({
        url: '../iot/g-view-ajax',
        success: function (sensors){
            let statuss1=$('#s1')
            let dateup1=$('#dateup1')
            let dateup1last=$('#dateup1last')
            let statuss2=$('#s2')
            let dateup2=$('#dateup2')
            let idcuadros1=$('#idcuadros1');
            console.log(sensors)
            statuss1.text('');
            dateup1.text('');
            
            sensors.lastopen.forEach(lo=>{
                var last=new Date(lo.date);
                dateup1last.text(" last opening " + last.getHours()+":"+last.getMinutes()+":"+last.getSeconds())
            })

            sensors.sp.forEach(sp=>{
                var dateday=new Date(sp.date);
                var values1=sp.value;
                idcuadros1.removeClass("bg-c-green") || idcuadros1.removeClass("bg-c-pink")
                if(values1==1){
                    statuss1.text("Abierta");
                    idcuadros1.addClass('card  bg-c-green update-card')
                }
                else{
                    statuss1.text("Cerrada");
                    idcuadros1.addClass("card  bg-c-pink update-card")
                }
                dateup1.append(" update : " + dateday.getHours()+":"+dateday.getMinutes()+":"+dateday.getSeconds());
            })
            sensors.st.forEach(st=>{
                var dateday2=new Date(st.date);
                var values2=st.value;
                statuss2.text(values2);
                dateup2.text(" update : " + dateday2.getHours()+":"+dateday2.getMinutes()+":"+dateday2.getSeconds());
            })
            
        }
        
    })
}






function fajax(){
    date = new Date()
    $.ajax({
        url: '../iot/all-ajax',
        success: function (sensors){
            let tbody = $('tbody');
            let graf=  document.getElementById('graf').style.display="block"
            let tabla= document.getElementById('tbody')
            let statuss1=$('#s1')
            let dateup1=$('#dateup1')
            let dateup1last=$('#dateup1last')
            let statuss2=$('#s2')
            let dateup2=$('#dateup2')
            let idcuadros1=$('#idcuadros1');
            let idcuadros2=$('#idcuadros2');
            statuss1.text('');
            dateup1.text('');
            
            sensors.lastopen.forEach(lo=>{
                //alert(lo.date)
                var last=new Date(lo.date);
                dateup1last.text(" last opening " + last.getHours()+":"+last.getMinutes()+":"+last.getSeconds())
            })

            sensors.sp.forEach(sp=>{
                var dateday=new Date(sp.date);
                var values1=sp.value;
                idcuadros1.removeClass("bg-c-green") || idcuadros1.removeClass("bg-c-pink")
                if(values1==1){
                    statuss1.text("Abierta");
                    idcuadros1.addClass('card  bg-c-green update-card')
                }
                else{
                    statuss1.text("Cerrada");
                    idcuadros1.addClass("card  bg-c-pink update-card")
                }
                dateup1.append(" update : " + dateday.getHours()+":"+dateday.getMinutes()+":"+dateday.getSeconds());
            })

            
            sensors.st.forEach(st=>{
                var dateday2=new Date(st.date);
                var values2=st.value;
                statuss2.text(values2);
                dateup2.text(" update : " + dateday2.getHours()+":"+dateday2.getMinutes()+":"+dateday2.getSeconds());
            })
           
            var index=0;
            sensors.sensors.forEach(sensor => {
                var dat= new Date(sensor.date)
                
                topicc=sensor.topic;
                sensorn=sensor.name;
                if(i==0){
                    tbody.html('');

                }
               
                if(i<10){
                    
                    Arry[i]=sensor.value;
                    Arrx[i]=dat.getHours()+":"+dat.getMinutes()+":"+dat.getSeconds();
                    i=i+1;
                }
                else{                   
                    Arry[10]=sensor.value;
                    Arrx[10]=dat.getHours()+":"+dat.getMinutes()+":"+dat.getSeconds();
                    Arry.shift();
                    Arrx.shift();  
                    tabla.removeChild(tabla.firstElementChild);
                }
                cha(sensors,sensor.status,dat);
                
                tbody.append(`
                <tr>
                    <th scope="row">${index}</th>  
                    <td>${sensor.topic}</td>
                    <td>${sensor.value}</td>
                    <td>${dat}</td>
                </tr>
                `)
            });
            //console.log(sensors);
        }
    })
}
function cha(sensors,status,dat){
    /* chart.js chart examples */
    // chart colors
    var colors = ['#007bff','#28a745','#333333','#c3e6cb','#dc3545','#6c757d'];
    var mensax="";
    if(status){
        mensax= "estado " + estado[status];
    }
    else{
        mensax= "";
    }
        
    /* large line chart */
    var chLine = document.getElementById("chLine");
    var chartData;
    console.log(Arry)
    console.log(Arrx) 
    chartData = {
        labels: [Arrx[0],Arrx[1],Arrx[2],Arrx[3],Arrx[4],Arrx[5],Arrx[6],Arrx[7],Arrx[8],Arrx[9]],
        datasets: [{
            data: [Arry[0],Arry[1],Arry[2],Arry[3],Arry[4],Arry[5],Arry[6],Arry[7],Arry[8],Arry[9]],
            backgroundColor: 'transparent',
            borderColor: colors[0],
            borderWidth: 4,
            pointBackgroundColor: colors[0]
        }]
        };


    if (chLine) {new Chart(chLine, {
        type: 'line',
        
        data: chartData,
        options: {
            animation: {
                duration: 0
            },
            title: {
                display: true,
                text:"Tópico "+topicc+ ", "+ mensax+ " ("+ dat+")"
            },
            scales: {
                xAxes: [
                    {
                        position: "botton",
                        scaleLabel: {
                            display: true,
                            labelString: "Hora",
                            fontFamily: "Montserrat",
                            fontColor: "black",
                        },
                        ticks: {
                            fontFamily: "Montserrat",
                            beginAtZero: true
                        }
                    }
                ],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Valor",
                    fontFamily: "Montserrat",
                    fontColor: "black",
                },
                ticks: {
                beginAtZero: true
                }
            }]
            },
            legend: {
            display: false
            }
        }
        });
    }

}