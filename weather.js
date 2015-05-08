$(document).ready(function loadPage(){

	var apiUrl1="https://api.forecast.io/forecast/542acae280c8065152a9c33f13878a07/37.3544,-121.969";
	var apiUrl2="https://api.forecast.io/forecast/542acae280c8065152a9c33f13878a07/39.9167,116.383";
	var locationUrl="http://coen268.peterbergstrom.com/locationautocomplete.php";
	// loadData();
	// cfToggle();

	// setInterval(loadData,50000);
	function loadData(){
		console.log("loadData santaclara");
		$.ajax({ 
			jsonp: 'callback', 	
			url: apiUrl1,
			dataType: "jsonp",
			success: function(weajson1) {
				weatherInit(weajson1,2);
			},
			error: function(jqXHR){     
				alert("Error Happend");  
			}
		});

		console.log("loadData beijing");
		$.ajax({ 
			jsonp: 'callback', 	
			url: apiUrl2,
			dataType: "jsonp",
			success: function(weajson2) {
					// debugger;
					var debugtime = weajson2;
					weatherInit(debugtime,3);
				},
				error: function(jqXHR){     
					alert("Error Happend");  
				}
			});
	}

	function weatherInit(weajson,pageNum){
		drawData();
		function formatAMPM(eporchtime) {
			var date = new Date(eporchtime*1000);
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12;
		  hours = hours ? hours : 12; // the hour '0' should be '12'
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours + ':' + minutes + ' ' + ampm;
		  return strTime;
		};
		function hourAMPM(eporchtime) {
			var date = new Date(eporchtime*1000);
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12;
		  hours = hours ? hours : 12; // the hour '0' should be '12'
		  minutes = minutes < 10 ? '0'+minutes : minutes;
		  var strTime = hours +' ' + ampm;
		  return strTime;
		};
		function weekday(eporchtime) {
			var date = new Date(eporchtime*1000);
			var weekdays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			return weekdays[date.getDay()];
		};
		function appendHourly(){
			var timeWeaUlName=".page"+pageNum+" .time-wea-ul";
			var $timeWeaUl = $(timeWeaUlName);
			$timeWeaUl.empty();
			var hourlyData=weajson.hourly.data;
			for (var i = 0; i < 26; i++) {
				var hour = hourAMPM(hourlyData[i].time);
				var iconUrl = hourlyData[i].icon;
				var temperature = Math.floor(hourlyData[i].temperature);
				var $timeWeaItem = $("<li><p>"+hour+"</p><p><img src='icons/"+iconUrl+".png'></p><p>"+temperature+"˚</p></li>");
				$timeWeaUl.append($timeWeaItem)
			};	
		};
		function windDir(bering){
			var directon = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"];
			var index = bering - 22.5;
			if (index < 0) index += 360;
			index = parseInt(index / 45);
			return(directon[index]);
		};

		function appendWeaDetail(){
			var weaDetailUlName=".page"+pageNum+" .wea-detail-ul"
			var $weaDetailUl = $(weaDetailUlName);
			$weaDetailUl.empty();
			var dailyData = weajson.daily.data[0];
			$weaDetailUl.append($("<li><ul><li>Sunrise:</li><li>"+formatAMPM(dailyData.sunriseTime)+"</li></ul></li>"));
			$weaDetailUl.append($("<li><ul><li>Sunset:</li><li>"+formatAMPM(dailyData.sunsetTime)+"</li></ul></li>"));
			$weaDetailUl.append($("<li><ul><li>Chance of Rain:</li><li>"+dailyData.precipProbability*100+"%</li></ul></li>"));
			$weaDetailUl.append($("<li><ul><li>Humidity:</li><li>"+dailyData.humidity*100+"%</li></ul></li>"));
			$weaDetailUl.append($("<li><ul><li>Wind:</li><li>"+dailyData.windSpeed+" mph "+windDir(dailyData.windBearing)+"</li></ul></li>"));
			$weaDetailUl.append($("<li><ul><li>Feels like:</li><li>"+Math.floor(weajson.currently.apparentTemperature)+"˚</li></ul></li>"));
			$weaDetailUl.append($("<li><ul><li>Precipitation:</li><li>"+dailyData.precipIntensity+" in</li></ul></li>"));
			$weaDetailUl.append($("<li><ul><li>Pressure:</li><li>"+Math.floor(dailyData.pressure*0.02952756)+" in</li></ul></li>"));
			$weaDetailUl.append($("<li><ul><li>Visibility:</li><li>"+(dailyData.visibility||"--")+" mi</li></ul></li>"));
		};
		function drawData(){
			var citylisttimeName = ".citylist-"+(pageNum-1)+" .time";
			var citylisttempName = ".citylist-"+(pageNum-1)+" .temp,.page"+pageNum+" .m-temp";
			var mweaName = ".page"+pageNum+" .m-wea";
			var todayName = ".page"+pageNum+" .today";
			var tTempName = ".page"+pageNum+" .t-temp";
			var yTempName = ".page"+pageNum+" .y-temp";

			$(citylisttimeName).html(formatAMPM(weajson.currently.time));
			$(citylisttempName).html(Math.floor(weajson.currently.temperature)+'˚');
			$(mweaName).html(weajson.currently.summary);
			$(todayName).html(weekday(weajson.daily.data[0].time));
			$(tTempName).html(Math.floor(weajson.daily.data[0].temperatureMax)+'˚');
			$(yTempName).html(Math.floor(weajson.daily.data[0].temperatureMin)+'˚');

			var forecastListName = ".page"+pageNum+" .forecast-list";
			var $forecastList = $(forecastListName);
			$forecastList.empty();
			$.each(weajson.daily.data,function(key,value){
				var day = weekday(value.time);
				var dayIcon = value.icon;
				var tempMax = Math.floor(value.temperatureMax);
				var tempMin = Math.floor(value.temperatureMin);
				var $dayItem = $("<li><ul><li>"+day+"</li><li><img src='icons/"+dayIcon+".png'/></li><li>"+tempMax+"˚</li><li>"+tempMin+"˚</li></ul></li>");
				$forecastList.append($dayItem);
			});

			appendHourly();

			var weaBroadcastName = ".page"+pageNum+" .wea-broadcast p";
			$(weaBroadcastName).html("Today: "+weajson.daily.summary);
			appendWeaDetail();
		}
	}
	function cfToggle(){
		$('.cfButt').on('click', function(){
			$('.degF').toggleClass('trans');
			var setF = $('.degC').toggleClass('trans').hasClass('trans');
			if(setF){
				console.log('change to F temp');
				apiUrl1="https://api.forecast.io/forecast/542acae280c8065152a9c33f13878a07/37.3544,-121.969";
				apiUrl2="https://api.forecast.io/forecast/542acae280c8065152a9c33f13878a07/39.9167,116.383";
				loadData();
			}else{
				console.log('change to C temp');
				apiUrl1="https://api.forecast.io/forecast/542acae280c8065152a9c33f13878a07/37.3544,-121.969?units=si";
				apiUrl2="https://api.forecast.io/forecast/542acae280c8065152a9c33f13878a07/39.9167,116.383?units=si";
				loadData();
			}
		});

	}

	function addCityToCityList(){
		var $citylistItem=$([
			'<a href="">',
				'<ul>',
					'<li class="cityList">',
						'<div class="left-side">',
							'<p class="time">--</p>',
							'<p class="location">','$(this).data("displayName")','</p>',
						'</div>',
						'<div class="temp">--</div>',
					'</li>',
				'</ul>',
			'</a>'].join(''));
		$('.page1').append($citylistItem);
		alert("add success");
	}
	function showCityLists(locationObj){
		$.each(locationObj,function(key,value){
			// console.log(value.displayName);
			var $pList=$("<p>"+value.formatted_address+"</p>");
			$pList.data("displayName",value.displayName);
			$pList.data("lat",value.lat);
			$pList.data("lng",value.lng);
			// $(".findCityList").append("<p data-lat="+value.lat+" data-lng="+value.lng+" data-displayName= "+value.displayName+">"+value.formatted_address+"</p>");
			$(".findCityList").append($pList);
		});

		$(".findCityList p").click(function(){
				alert("The city you choose is: "+$(this).data("displayName")+" The lat is : "+$(this).data("lat"));
				addCityToCityList();
			});
	}

	function getCityListData(inputValue){
		// console.log("requestLocation");
		$.ajax({ 
			jsonp: 'callback', 	
			url: locationUrl+"?query="+inputValue,
			dataType: "jsonp",
			success: function(locationJson) {
				// console.log(locationJson[0].formatted_address);
				showCityLists(locationJson);
			},
			error: function(jqXHR){     
				alert("Error Happend");  
			}
		});
	}	

	$("input").keyup(function(){
		$(".findCityList").empty();
		// console.log($(this).val());
		getCityListData($(this).val());
	});
	

});

