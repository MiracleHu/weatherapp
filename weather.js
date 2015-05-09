$(document).ready(function(){
	
	// creatPages(37.3544,-121.969,"Beijing",3);
	function fullHour(eporchtime){
		var date = new Date(eporchtime*1000);
		var hours = date.getHours();
		return hours;
	}
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
	}
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
	}
	function weekday(eporchtime) {
		var date = new Date(eporchtime*1000);
		var weekdays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		return weekdays[date.getDay()];
	}
	function windDir(bering){
		var directon = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"];
		var index = bering - 22.5;
		if (index < 0) index += 360;
		index = parseInt(index / 45);
		return(directon[index]);
	}

	function creatPages(lat,log,name,pagenum){
		var baseUrl="https://api.forecast.io/forecast/542acae280c8065152a9c33f13878a07/";
		var requestUrl=baseUrl+lat+','+log;
		$.ajax({ 
				jsonp: 'callback', 	
				url: requestUrl,
				dataType: "jsonp",
				success: function(weajson) {
					appendPage(weajson,pagenum,name);
					addCityToCityList(weajson,pagenum,name);
				},
				error: function(jqXHR){     
					alert("Error Happend");  
				}
			});
	}

	function appendPage(weadata,pagenum,name){
		var $page = $("<div class='page"+pagenum+" pages hide dayTime'></div>");
		fullHour(weadata.currently.time)>19 ? $page.addClass("nightTime"):$page.removeClass("nightTime");
		var $mainInfo=$([
					'<div class="mainInfo">',
						'<p class="m-city">',name,'</p>',
						'<p class="m-wea">',weadata.currently.summary,'</p>',
						'<p class="m-temp">',Math.floor(weadata.currently.temperature),'˚</p>',
						'<table class="twoWea">',
							'<tr>',
								'<td class="today" style="width:25%">',weekday(weadata.daily.data[0].time),'</td>',
								'<td class="y-day" style="width:25%">Today</td>',
								'<td class="t-temp" style="width:25%">',Math.floor(weadata.daily.data[0].temperatureMax),'˚</td>',
								'<td class="y-temp" style="width:25%">',Math.floor(weadata.daily.data[0].temperatureMin),'˚</td>',
							'</tr>',
						'</table>',
					'</div>'
				].join(''));

		$page.append($mainInfo);

		var $timeWea=$("<div class='time-wea'></div>");
		var $timeWeaUl=$("<ul class='time-wea-ul'></ul>");
		for (var i = 0; i < 26; i++) {
					var $hourlyList=$([
								'<li>', 
									'<p>',hourAMPM(weadata.hourly.data[i].time),'</p>',
									'<p><img src="icons/',weadata.hourly.data[i].icon,'.png"></p>',
									'<p>',Math.floor(weadata.hourly.data[i].temperature),'˚</p>',
								'</li>'
							].join(''));
					$timeWeaUl.append($hourlyList);
				};

		$timeWea.append($timeWeaUl);	
		$page.append($timeWea);

		var $dailyForecast=$("<section class='forecast'></section>");
		var $dailyForecastList=$("<ul class='forecast-list'></ul>");
		$.each(weadata.daily.data,function(key,value){
					var day = weekday(value.time);
					var dayIcon = value.icon;
					var tempMax = Math.floor(value.temperatureMax);
					var tempMin = Math.floor(value.temperatureMin);
					var $dayItem = $("<li><ul><li>"+day+"</li><li><img src='icons/"+dayIcon+".png'/></li><li>"+tempMax+"˚</li><li>"+tempMin+"˚</li></ul></li>");
					$dailyForecastList.append($dayItem);
				});

		$dailyForecast.append($dailyForecastList);
		$page.append($dailyForecast);

		var $todaySumm=$("<div class='wea-broadcast'><p>"+weadata.daily.summary+"</p></div>");
		var $weaDetailUl=$([
						'<div class="wea-detail">',
							'<ul class="wea-detail-ul">',
								'<li>',
									'<ul>',
										'<li>Sunrise:</li>',
										'<li>',formatAMPM(weadata.daily.data[0].sunriseTime),'</li>',
								  '</ul>', 
							 '</li>',
							 '<li>', 
									'<ul>',
										'<li>Sunset:</li>',
										'<li>',formatAMPM(weadata.daily.data[0].sunsetTime),'</li>',
								  '</ul>', 
							 '</li>',
							 '<li>', 
									'<ul>',
										'<li>Chance of Rain:</li>',
										'<li>',weadata.daily.data[0].precipProbability*100,'%</li>',
								  '</ul>', 
							 '</li>',
							 '<li>', 
									'<ul>',
										'<li>Humidity:</li>',
										'<li>',weadata.daily.data[0].humidity*100,'%</li>',
								  '</ul>', 
							 '</li>',
							 '<li>', 
									'<ul>',
										'<li>Wind:</li>',
										'<li>',weadata.daily.data[0].windSpeed,' mph ',windDir(weadata.daily.data[0].windBearing),'</li>',
								  '</ul>', 
							 '</li>',
							 '<li>', 
									'<ul>',
										'<li>Feels like:</li>',
										'<li>',Math.floor(weadata.currently.apparentTemperature),'˚</li>',
								  '</ul>', 
							 '</li>',
							 '<li>', 
									'<ul>',
										'<li>Precipitation:</li>',
										'<li>',weadata.daily.data[0].precipIntensity,' in</li>',
								  '</ul>', 
							 '</li>',
							 '<li>', 
									'<ul>',
										'<li>Pressure:</li>',
										'<li>',Math.floor(weadata.daily.data[0].pressure*0.02952756),' in</li>',
								  '</ul>', 
							 '</li>',
							'<li>', 
									'<ul>',
										'<li>Visibility:</li>',
										'<li>',(weadata.daily.data[0].visibility||"--"),' mi</li>',
								  '</ul>', 
							 '</li>',
							'</ul>',
						'</div>'
					].join(''));
		
		var $footer=$([
					'<footer class="daytimeFooter">',
						'<ul class="navg">',
							'<li class="cfButt"><span class="degC trans">&nbsp ˚C</span>/<span class="degF">˚F</span></li>',
							'<li class="left-page">◀</li>',
							'<li class="dot-left">●</li>',
							'<li class="dot-right">●</li>',
							'<li class="right-page">▶</li>',
							'<li class="mainPage">☰</li>',
						'</ul>',
					'</footer>'
				].join(''));
		$page.append($todaySumm);
		$page.append($weaDetailUl);
		$page.append($footer);
		$("body").append($page);

	}
	// search the city
	function addCityToCityList(weadata,pagenum,name){
		
		var $citylistItem=$([
			'<a href="#" data-id=',pagenum,' class="list',pagenum,'">',
				'<ul>',
					'<li class="cityList dayTime">',
						'<div class="left-side">',
							'<p class="time">',formatAMPM(weadata.currently.time),'</p>',
							'<p class="location">',name,'</p>',
						'</div>',
						'<div class="temp">',Math.floor(weadata.currently.temperature),'˚</div>',
					'</li>',
				'</ul>',
			'</a>'].join(''));
		// $citylistItem.data("id",pagenum);
		$('.page1').append($citylistItem);
		// alert("add success");
	}
	function showCityLists(locationObj){
		$.each(locationObj,function(key,value){
			// console.log(value.displayName);
			var $pList=$("<p>"+value.formatted_address+"</p>");
			$pList.data("displayName",value.displayName);
			$pList.data("lat",value.lat);
			$pList.data("lng",value.lng);
			$pList.data("id",value.id);
			// $(".findCityList").append("<p data-lat="+value.lat+" data-lng="+value.lng+" data-displayName= "+value.displayName+">"+value.formatted_address+"</p>");
			$(".findCityList").append($pList);
		});

		$(".findCityList p").click(function(){
				// alert("The city you choose is: "+$(this).data("displayName")+" The lat is : "+$(this).data("lat"));
				creatPages($(this).data("lat"),$(this).data("lng"),$(this).data("displayName"),$(this).data("id"));
				$('.page1').show();
				$('.locContainer').hide();
			});
	}
	function getCityListData(inputValue){
		// console.log("requestLocation");
		var locationUrl="http://coen268.peterbergstrom.com/locationautocomplete.php";
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
	 
	$('#addCity').click(function(){
		$('.page1').hide();
		$('.locContainer').show();
	});

	$('#cancel').click(function(){
		$('.page1').show();
		$('.locContainer').hide();
	});

	$('.page1').on('click',"a",function(){
		var redirectId='.page'+$(this).data('id');
		console.log(redirectId);
		$('.pages').hide();
		$(redirectId).show();
		$(redirectId).on('click','.mainPage',function(){
			$('.pages').hide();
			$('.page1').show();
		});
	});

});



