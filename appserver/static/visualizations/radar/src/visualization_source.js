define([
            'jquery',
            'underscore',
            'vizapi/SplunkVisualizationBase',
            'vizapi/SplunkVisualizationUtils',
            'd3',
            'c3',
            'chart.js',
        ],
        function(
            $,
            _,
            SplunkVisualizationBase,
            SplunkVisualizationUtils,
            d3,
            c3,
            Chart
            ) {

    return SplunkVisualizationBase.extend({

        initialize: function() {
            // Save this.$el for convenience
            this.$el = $(this.el);

        },

        getInitialDataParams: function() {
            return ({
                outputMode: SplunkVisualizationBase.ROW_MAJOR_OUTPUT_MODE,
                count: 10000
            });
        },



        updateView: function(data, config) {
                    // Guard for empty data

                    // Clear the div
                    this.$el.empty();


                    var color =d3.scale.category10()
                    var fieldnames=[];
                    for (var i=1 ;i< data.fields.length; i++){
                    fieldnames.push(data.fields[i]["name"])
                    }


                    function convertHex(hex,opacity){
                        hex = hex.replace('#','');
                        r = parseInt(hex.substring(0,2), 16);
                        g = parseInt(hex.substring(2,4), 16);
                        b = parseInt(hex.substring(4,6), 16);

                        result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
                        return result;
                    }


                    //radar chart data
                    datasets=[]
                    for (var i=0;i<data.rows.length;i++){
                      var row=data.rows[i];
                      

                      dataset= {
                          label:row[0],
                          backgroundColor: convertHex(color(i),50),
                          borderColor: color(i),
                          pointBackgroundColor : color(i),
                          pointBorderColor : "#fff",
                          data : Array.prototype.slice.call( row, 1 )
                        }
                      datasets.push(dataset);
                    }

                    var radarData = {
                      labels : fieldnames,
                      datasets : datasets
                    }

                    //options
                    var scaleLineWidth= config["display.visualizations.custom.viz_radar.radar.scaleLineWidth"] ;
                    var scaleLineColor= config["display.visualizations.custom.viz_radar.radar.scaleLineColor"] ;
                    var scaleDisplay= (config["display.visualizations.custom.viz_radar.radar.scaleDisplay"]==1) ? true : false ;
                    var pointStyle= config["display.visualizations.custom.viz_radar.radar.pointStyle"] ;


                    var options = {
                        maintainAspectRatio: false,
                        responsive: true,
                        elements: {
                            point: {
                                pointStyle:pointStyle
                            }
                        },
                        scale: {
                            gridLines:{
                                display:scaleDisplay,
                                lineWidth:parseInt(scaleLineWidth),
                                color:scaleLineColor
                            }
                        }
                    }



                    var canvas=document.createElement('canvas')
                    this.el.appendChild(canvas)
                    var ctx2 = canvas.getContext("2d");
                    console.log(options)
                    var myNewChart = new Chart(ctx2,{
                        type: 'radar',
                        data: radarData,
                        options:options

                                            });


                    
               
                }
    });
});


