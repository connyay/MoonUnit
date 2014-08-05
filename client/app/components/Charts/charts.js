(function() {
	'use strict';
	angular.module('moonunit.charts', [])
		.factory('Charts', function() {

			//Show last ten items
			var CHART_NUM = 10;
			var PASS_COLOR = '#18bc9c';
			var FAIL_COLOR = '#e74c3c';
			var ERROR_COLOR = '#F39C12';

			return {
				getExecutionTimeChart: function(result_history) {
				var chart_data = {pass : [], fail : [], error: []};
                var result_labels = [];

                //Show the latest result times in the chart
                var prev = null;
                var start = result_history.length > 10 ? CHART_NUM : result_history.length-1;
                for (var a=start; a >= 0; a--){

                	var test_result = result_history[a];
                    result_labels.push(result_history.length-a);
                    chart_data[test_result.result].push(test_result.time);

                    //If there is a result transition we need to add the current result to both lists
                    if (prev !== null && prev.result != test_result.result) {
                    	chart_data[prev.result].push(test_result.time);
                    } else {
                    	//Push null to the other datasets
                    	if (test_result.result != 'pass') chart_data.pass.push(null);
                    	if (test_result.result != 'fail') chart_data.fail.push(null);
                    	if (test_result.result != 'error') chart_data.error.push(null);
                    }

                    prev = test_result;
                }



	            var chartConfig = {
	                 //This is not a highcharts object. It just looks a little like one!
	                 options: {
	                     //This is the Main Highcharts chart config. Any Highchart options are valid here.
	                     //will be ovverriden by values specified below.
	                     chart: {
	                         type: 'area'
	                     },
	                     legend : { enabled: false},
	                     colors: [PASS_COLOR,FAIL_COLOR,ERROR_COLOR],
	                     tooltip: {
	                         style: {
	                             padding: 10,
	                             fontWeight: 'bold'
	                         }
	                     },
		                plotOptions: {
	               			 area: {
	                    		marker: {enabled: result_history.length == 1 ? true : false},
	                    		fillOpacity: 1.0
	                    	}
	                    }
	                 },

	                 //The below properties are watched separately for changes.

	                 //Series object (optional) - a list of series using normal highcharts series options.
	                 series: [{
	                 	 name: "Pass",
	                     data: chart_data.pass
	                 },
	                 {
	                 	name: "Fail",
	                    data: chart_data.fail
	                 },
	                 {
	                 	name: "Error",
	                 	data: chart_data.error
	                 },
	                 ],
	                 //Title configuration (optional)
	                 title: {
	                     text: 'Execution Time'
	                 },
	                 //Boolean to control showng loading status on chart (optional)
	                 loading: false,
	                 //Configuration for the xAxis (optional). Currently only one x axis can be dynamically controlled.
	                 //properties currentMin and currentMax provied 2-way binding to the chart's maximimum and minimum
	                 xAxis: {
	                  categories: result_labels,
	                  //tickmarkPlacement: 'on'
	                 },
	                 yAxis : {
	                    title: {text: 'Seconds'}
	                 },
	                 //Whether to use HighStocks instead of HighCharts (optional). Defaults to false.
	                 useHighStocks: false,
	                 //size (optional) if left out the chart will default to size of the div or something sensible.
	                 size: {
	                   width: 400,
	                   height: 300
	                 },
	                 

	            };
		            return chartConfig;
				}
			};
		});
})();