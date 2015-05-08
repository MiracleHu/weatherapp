var app = angular.module("app",[]);
app.controller('cityListCtl',function($scope){
	$scope.cityLists = [{
		name:"Santa Clara"
		
	},{
		name:"San Jose"
	},{
		name:"Tokyo"
	}];
	$scope.remove = function(){
		$scope.cityLists.pop();
	};
});