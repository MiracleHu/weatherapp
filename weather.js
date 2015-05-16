$(document).ready(function(){
	init();
	var storeArray;
	function init(){
		if(sessionStorage.initArray!== undefined){
			storeArray=JSON.parse(sessionStorage.initArray);
			for (var i=0;i<storeArray.length;i++){
				appendPage(storeArray[i].weajson,storeArray[i].pagenum,storeArray[i].name);
				addCityToCityList(storeArray[i].weajson,storeArray[i].pagenum,storeArray[i].name);
			}
		}else{
			storeArray = [];
		}
	}
	function formatTime(eporchtime,offset){
		var local = new Date();
		var offsetminutes = local.getTimezoneOffset();
		var date = new Date(eporchtime*1000+offsetminutes*60*1000+offset*60*60*1000);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var hourminutesAMPM = hours + ':' + minutes + ' ' + ampm;
	  var hourAMPM = hours +' ' + ampm;
	  var weekdays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		return{
			fullHour:date.getHours(),
			formatAMPM:hourminutesAMPM,
			hourAMPM:hourAMPM,
			weekday:weekdays[date.getDay()]
		};
	}
	function windDir(bering){
		var directon = ["NE", "E", "SE", "S", "SW", "W", "NW", "N"];
		var index = bering - 22.5;
		if (index < 0) index += 360;
		index = parseInt(index / 45);
		return(directon[index]);
	}
	function formatCelsius(ftemp){
		return Math.round((ftemp-32)/1.8);
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
					toggleCF();
					if(typeof(Storage) !== "undefined") {
						storeArray.push({
						weajson:weajson,
						pagenum:pagenum,
						name:name
						});
						sessionStorage.initArray=JSON.stringify(storeArray);
					}
				},
				error: function(jqXHR){     
					alert("Error Happend");  
				}
			});
	}

	function appendPage(weadata,pagenum,name){
		var $page = $("<div class='page"+pagenum+" pages hide dayTime'></div>");
		formatTime(weadata.currently.time,weadata.offset).fullHour>19 ? $page.addClass("nightTime"):$page.removeClass("nightTime");
		var $mainInfo=$([
					'<div class="mainInfo">',
						'<p class="m-city">',name,'</p>',
						'<p class="m-wea">',weadata.currently.summary,'</p>',
						'<p class="m-temp f-temp">',Math.floor(weadata.currently.temperature),'˚</p>',
						'<p class="m-temp hide c-temp">',formatCelsius(weadata.currently.temperature),'˚</p>',
						'<table class="twoWea">',
							'<tr>',
								'<td class="today" style="width:25%">',formatTime(weadata.daily.data[0].time,weadata.offset).weekday,'</td>',
								'<td class="y-day" style="width:25%">Today</td>',
								'<td class="t-temp f-temp" style="width:25%">',Math.floor(weadata.daily.data[0].temperatureMax),'˚</td>',
								'<td class="t-temp hide c-temp" style="width:25%">',formatCelsius(weadata.daily.data[0].temperatureMax),'˚</td>',
								'<td class="y-temp f-temp" style="width:25%">',Math.floor(weadata.daily.data[0].temperatureMin),'˚</td>',
								'<td class="y-temp hide c-temp" style="width:25%">',formatCelsius(weadata.daily.data[0].temperatureMin),'˚</td>',
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
									'<p>',formatTime(weadata.hourly.data[i].time,weadata.offset).hourAMPM,'</p>',
									'<p><img src="icons/',weadata.hourly.data[i].icon,'.png"></p>',
									// '<p class="f-temp">',Math.floor(weadata.hourly.data[i].temperature),'˚</p>',
									'<p><span class="f-temp">',Math.floor(weadata.hourly.data[i].temperature),'˚</span><span class="hide c-temp">',formatCelsius(weadata.hourly.data[i].temperature),'˚</span></p>',
								'</li>'
							].join(''));
					$timeWeaUl.append($hourlyList);
				};

		$timeWea.append($timeWeaUl);	
		$page.append($timeWea);

		var $dailyForecast=$("<section class='forecast'></section>");
		var $dailyForecastList=$("<ul class='forecast-list'></ul>");
		$.each(weadata.daily.data,function(key,value){
			var day = formatTime(value.time,weadata.offset).weekday;
			var $dayItem = $("<li class='f-temp'><ul><li>"+day+"</li><li><img src='icons/"+value.icon+".png'/></li><li>"+Math.floor(value.temperatureMax)+"˚</li><li>"+Math.floor(value.temperatureMin)+"˚</li></ul></li>");
			var $dayItemCtemp = $("<li class='hide c-temp'><ul><li>"+day+"</li><li><img src='icons/"+value.icon+".png'/></li><li>"+formatCelsius(value.temperatureMax)+"˚</li><li>"+formatCelsius(value.temperatureMin)+"˚</li></ul></li>");
			$dailyForecastList.append($dayItem);
			$dailyForecastList.append($dayItemCtemp);
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
									'<li>',formatTime(weadata.daily.data[0].sunriseTime,weadata.offset).formatAMPM,'</li>',
							  '</ul>', 
						 '</li>',
						 '<li>', 
								'<ul>',
									'<li>Sunset:</li>',
									'<li>',formatTime(weadata.daily.data[0].sunsetTime,weadata.offset).formatAMPM,'</li>',
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
								'<ul class="f-temp">',
									'<li>Feels like:</li>',
									'<li>',Math.floor(weadata.currently.apparentTemperature),'˚</li>',
							  '</ul>',
							  '<ul class="hide c-temp">',
									'<li>Feels like:</li>',
									'<li>',formatCelsius(weadata.currently.apparentTemperature),'˚</li>',
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
			'<a href="#" data-offset=',weadata.offset,' data-id=',pagenum,' class="list',pagenum,'">',
					'<div class="cityList dayTime">',
						'<div class="left-side">',
							'<p class="time">',formatTime(weadata.currently.time,weadata.offset).formatAMPM,'</p>',
							'<p class="location">',name,'</p>',
						'</div>',
						// '<div class="temp f-temp">',Math.floor(weadata.currently.temperature),'˚</div>',
						'<div class="temp"><span class="f-temp">',Math.floor(weadata.currently.temperature),'˚</span><span class="hide c-temp">',formatCelsius(weadata.currently.temperature),'˚</span></div>',
					'</div>',
			'</a>'].join(''));
		// $citylistItem.data("id",pagenum);
		$('.page1').append($citylistItem);
		// alert("add success");
	}
	function showSearchCityLists(locationObj){
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
	}
	function getCityListData(inputValue){
		// console.log("requestLocation");
		var locationUrl="http://coen268.peterbergstrom.com/locationautocomplete.php";
		$.ajax({ 
			jsonp: 'callback', 	
			url: locationUrl+"?query="+inputValue,
			dataType: "jsonp",
			success: function(locationJson) {
				showSearchCityLists(locationJson);
			},
			error: function(jqXHR){     
				alert("Error Happend");  
			}
		});
	}	

	$("input").keypress(function(){
		$(".findCityList").empty();
		getCityListData($(this).val());

	});
	// creatPages here
	$(".findCityList").on('click','p',function(){
		// judge the same city begin
		var samecity=false;
		if (storeArray.length===0) {
			console.log('empty storeArray');
		}else{
			for (var i = 0; i < storeArray.length; i++) {
				if (storeArray[i].pagenum===$(this).data("id")) {
					console.log('The same city');
					samecity=true;
				}
			}
		}
		// judge the same city end
		if (!samecity) {
			creatPages($(this).data("lat"),$(this).data("lng"),$(this).data("displayName"),$(this).data("id"));
			samecity=false;
		}
		
		$('.page1').show();
		$('.locContainer').hide();
		$(".findCityList").empty();
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
		// console.log(redirectId);
		$('.pages').hide();
		$(redirectId).show();
		$(redirectId).on('click','.mainPage',function(){
			$('.pages').hide();
			$('.page1').show();
		});
	});

	$('.cfButt').on('click',function(){
		$('.degF').toggleClass('trans');
		var setF = $('.degC').toggleClass('trans').hasClass('trans');
		if(setF){
		  // console.log('change to F temp');
		  $(".f-temp").show();
		  $(".c-temp").hide();
		}else{
			// console.log('change to C temp');
			$(".f-temp").hide();
		  $(".c-temp").show();
		  }
	});
	
	setInterval(function(){
		$('.page1').children('a').each(function () {
    $(this).find('.time').html(formatTime(Date.now()/1000,$(this).data('offset')).formatAMPM)
		});
	},1000);

});



