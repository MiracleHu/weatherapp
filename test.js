
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

$.each(weajson.hourly.data,function(key,value){
	var hour = formatAMPM(value.time);
	var iconUrl = value.icon;
	var temperature = Math.floor(value.temperature);
	var $timeWeaLiItem = $("<li><p>"+hour+"</p><p><img src='icons/"+iconUrl+".png'></p><p>"+temperature+"˚</p></li>");
	$(".time-wea-ul").append($timeWeaLiItem)

});


$.each(weajson.daily.data,function(key,value){
	var day = weekday(value.time);
	var dayIcon = value.icon;
	var tempMax = Math.floor(value.temperatureMax);
	var tempMin = Math.floor(value.temperatureMin);
	var $dayItem = $("<li><ul><li>"+day+"</li><li><img src='icons/"+dayIcon+".png'/></li><li>"+tempMax+"˚</li><li>"+tempMin+"˚</li></ul></li>");
	$(".forecast-list").append($timeWeaLiItem)
});


function appendHourly(){
	var hourlyData=weajson.hourly.data;
	for (var i = 0; i < 11; i++) {
		var hour = formatAMPM(hourlyData[i].time);
		var iconUrl = hourlyData[i].icon;
		var temperature = Math.floor(hourlyData[i].temperature);
		var $timeWeaItem = $("<li><p>"+hour+"</p><p><img src='icons/"+iconUrl+".png'></p><p>"+temperature+"˚</p></li>");
		$(".page2 .time-wea-ul").append($timeWeaItem)
};	
}

var dailyData = weajson.daily.data[0];
var $detail=$(
		"<li><ul><li>Sunrise:</li><li>"+formatAMPM(dailyData.sunriseTime)+"</li></ul></li>"

			 "<li><ul><li>Sunset:</li><li>"+formatAMPM(dailyData.sunsetTime)+"</li></ul></li>"

			 "<li><ul><li>Chance of Rain:</li><li>"+dailyData.precipProbability*100+"%</li></ul></li>"

			 "<li><ul><li>Humidity:</li><li>"+dailyData.humidity*100+"%</li></ul></li>"

			 "<li><ul><li>Wind:</li><li>"+dailyData.windSpeed+"mph "+windDir(dailyData.windBearing)+"</li></ul></li>"

			 "<li><ul><li>Feels like:</li><li>"+Math.floor(weajson.currently.apparentTemperature)+"˚</li></ul></li>"

			 "<li><ul><li>Precipitation:</li><li>"+dailyData.precipIntensity+" in</li></ul></li>"

			 "<li><ul><li>Pressure:</li><li>"+dailyData.pressure+" mb</li></ul></li>"

			"<li><ul><li>Visibility:</li><li>"+dailyData.visibility+" mi</li></ul></li>"
	);