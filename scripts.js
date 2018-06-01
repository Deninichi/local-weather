jQuery(document).ready(function($) {
	var ip = '';
	var city = '';
	var country = '';
	var appid = '53a9fbec72594e103b01de6af3353f71';
	var units = 'metric';
	var colors = '';

	var d = new Date($.now());
	
	showDate(d);
	getWeather( units );

	$('.units span').click(function(event) {
		$('.units span').removeClass('active');
		$('.units span').css('background', 'none');
		$(this).addClass('active');
		$(this).css('background', colors.background );

		units = $(this).attr('id');

		getWeather( units );
	});

	function getWeather( units ){
		$.get("https://ipinfo.io/json", function (response) {
			//console.log(response);
		    ip = response.ip;
		    city = response.city;
		    country = response.country;

		    $('.city').text( city+', '+country );

		    $.get("http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+appid+"&units="+units, function (weather) {

		    	//console.log(weather);
				var icon = 'http://openweathermap.org/img/w/'+weather.weather["0"].icon+'.png';
				var sunrise = new Date( weather.sys.sunrise * 1000 );
				var sunset = new Date( weather.sys.sunset * 1000 );
				colors = getColors( weather.weather["0"].main );

				$('body').css( 'background', colors.background );
				$('.units span.active').css( 'background', colors.background );
				
				$('.weather-icon').attr( 'src', icon );

				if ( units == 'imperial' )
					$('.temp').hide().html( Math.round( weather.main.temp )+' &#8457;' ).fadeIn();
				else
					$('.temp').hide().html( Math.round( weather.main.temp )+' &#8451;' ).fadeIn();

				$('.main-weather').html( weather.weather["0"].main );

				if ( units == 'imperial' )
					$('.wind').hide().html( windSpeed( weather.wind.speed, units )+', '+weather.wind.speed.toFixed(1)+' mi/hr, '+ windDerection(weather.wind.deg)).fadeIn();
				else
					$('.wind').hide().html( windSpeed( weather.wind.speed, units )+', '+weather.wind.speed.toFixed(1)+' m/s, '+ windDerection(weather.wind.deg)).fadeIn();

				$('.cloudiness').html( weather.weather["0"].description );
				$('.humidity').html(weather.main.humidity+'%');
				$('.sunrise').html( addZero(sunrise.getHours())+":"+addZero(sunrise.getMinutes()) );
				$('.sunset').html( addZero(sunset.getHours())+":"+addZero(sunset.getMinutes()) );
				
			}, "json");

		}, "jsonp");
	}

	function addZero( num ){
		return ("0"+num).slice(-2);
	}

	function showDate( date ){
		var monthNames = ["January", "February", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
		];

		$('.date').html(date.getDate()+' '+monthNames[date.getMonth()]+', '+date.getHours()+':'+date.getMinutes());
	}
	
	function windDerection( num ){
	    var val = Math.round( (num/45) );
	    var arr = ["North","Northeast","East", "Southeast","South","Southwest","West","Northwest"];
	    
	    return arr[( val % 8 )];
	}

	function windSpeed( num, units ){
	    if ( units == 'imperial' )
	    	num = num*0.44704;

	    var val = num.toFixed(1);

		if ( val >= 0 && val < 0.2 ) {
			return 'Calm';
		} else if ( val >= 0.3 && val < 1.5 ) {
			return 'Light Air';
		} else if ( val >= 1.6 && val < 3.3 ) {
			return 'Light Breeze';
		} else if ( val >= 3.4 && val < 5.4 ) {
			return 'Gentle Breeze';
		} else if ( val >= 5.5 && val < 7.9 ) {
			return 'Moderate Breeze';
		} else if ( val >= 8.0 && val < 10.7 ) {
			return 'Fresh Breeze';
		} else if ( val >= 10.8 && val < 13.8 ) {
			return 'Strong Breeze';
		} else if ( val >= 13.9 && val < 17.1 ) {
			return 'Near Gale';
		} else if ( val >= 17.2 && val < 20.7 ) {
			return 'Gale';
		} else if ( val >= 20.8 && val < 24.4 ) {
			return 'Severe Gale';
		} else if ( val >= 24.5 && val < 28.4 ) {
			return 'Storm';
		} else if ( val >= 28.5 && val < 32.6 ) {
			return 'Violent Storm';
		} else if ( val >= 32.7 ) {
			return 'Hurricane';
		}
	}

	function getColors( weather ){
		var colors = {
			'Clear' : {
				'background' : '#FFC107',
				'text' : '#FFC107',
			},
			'Clouds' : {
				'background' : '#5c9ab9',
				'text' : '#5c9ab9',
			},
			'Drizzle' : {
				'background' : '#88979e',
				'text' : '#88979e',
			},
			'Rain' : {
				'background' : '#7173a0',
				'text' : '#7173a0',
			},
			'Thunderstorm' : {
				'background' : '#393c4c',
				'text' : '#393c4c',
			},
			'Extreme' : {
				'background' : '#111113',
				'text' : '#111113',
			},
			'Snow' : {
				'background' : '#d8d8d8',
				'text' : '#d8d8d8',
			},
			'Atmosphere' : {
				'background' : '#a5a5a5',
				'text' : '#a5a5a5',
			},
		};

		if ( colors[weather] )
			return colors[weather];

		return colors['Clear']
	}
});