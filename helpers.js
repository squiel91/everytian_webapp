function getRandInt(array_in) {
	return Math.floor(Math.random() * (array_in.length));
}


function random_choice(array) {
	return array[getRandInt(array)]
}

function jsonString(str) {
	var parsed = null; 
	try {
		var parsed = JSON.parse(str);
	} catch (e) {
		parsed = false;
	}
	return parsed;
}

function create_audio(url_audio, error_handler, autoplay) {

	var audio_element = $('<audio src= "' + url_audio + '">').on('error', error_handler).hide();
	if (autoplay) {
		audio_element.attr("autoplay"," ");
	}
	return $('<span>', {'class': 'audio_cool'}).click(() => {audio_element[0].currentTime = 0; audio_element[0].play()});
}

function create_new_audio(url_audio, max_replays, error_handler, autoplay) {
	var state = 'ready'
	var action = $('<span/>', {'class': 'action play'})
	var audio_element = $('<audio style="display: none;" src= "' + url_audio + '">').on('error', error_handler);
	var played_times = 0
	var played = $('<div/>', {'class': 'played'}).text(played_times + '/'+ max_replays)
	var time = $('<div/>', {'class': 'time'}).text('- seg')
	var inner_bar = $('<div class=\'inner_bar\'></div>')
	var bar = $('<div class=\'bar_container\'></div>').append(inner_bar)
	var info_container = $('<div class=\'info_container\'></div>')
	info_container.append(bar, played, time)
	setInterval(function () {
		if (!isNaN(audio_element[0].duration)) {
			inner_bar.css('width', (audio_element[0].currentTime / audio_element[0].duration) * 100 + '%')
			time.text(parseInt(audio_element[0].duration - audio_element[0].currentTime)  + ' sec')
		}
	}, 100)
	if (autoplay) {
		audio_element.attr("autoplay"," ");
		action.removeClass('stop').removeClass('play').addClass('loading')
		audio_element.on('playing', function () {
			action.removeClass('play').removeClass('loading').addClass('stop')
		})
	}
	
	// if (autoplay) {
	// 	audio_element.attr("autoplay"," ");
	// }
	return $('<div>', {'class': 'audio'}).append(audio_element, action, info_container).click(() => {
		if (audio_element[0].currentTime > 0) {
			audio_element[0].pause()
			audio_element[0].currentTime = 0
			action.removeClass('stop').removeClass('loading').addClass('play')
			played.text(played_times + '/'+ max_replays)
		} else {	
			if (in_correction || played_times < max_replays) {
				action.removeClass('stop').removeClass('play').addClass('loading')
				audio_element[0].currentTime = 0
				audio_element[0].play()

				audio_element.on('playing', function () {
					action.removeClass('play').removeClass('loading').addClass('stop')
				})
				if(!in_correction) played_times += 1;
				audio_element.on('ended', function () {
					action.removeClass('stop').removeClass('loading').addClass('play')
					audio_element[0].currentTime = 0
				})
				played.text(played_times + '/'+ max_replays)
			} else {
				played.text('No more listening times')
			}
		}
		
	});
}

function readable_lapse(ms) {
	if (ms < 1000) {
		return ms + " ms";
	}
	if (ms >= 1000 && ms < 1000 * 60) {
		return Math.round((ms / 1000) * 100) / 100 + " seconds";
	}
	if (ms >= 1000 * 60 && ms < 1000 * 60 * 60) {
		return Math.round((ms / (1000 * 60) * 100)) / 100 + " minutes";
	}
	if (ms >= 1000 * 60 * 60 && ms < 1000 * 60 * 60 * 24) {
		return Math.round((ms / (1000 * 60 * 60) * 100)) / 100 + " hours";
	}
	if (ms >= 1000 * 60 * 60 * 24 && ms < 1000 * 60 * 60 * 24 * 7) {
		return Math.round((ms / (1000 * 60 * 60 * 24) * 100)) / 100 + " days";
	}
	if (ms >= 1000 * 60 * 60 * 24 * 7 && ms < 1000 * 60 * 60 * 24 * 7 * 4) {
		return Math.round((ms / (1000 * 60 * 60 * 24 * 7) * 100)) / 100 + " weeks";
	}
	if (ms >= 1000 * 60 * 60 * 24 * 7 * 4) {
		return Math.round((ms / (1000 * 60 * 60 * 24 * 7 * 4) * 100)) / 100 + " months";
	}
}


function numlat(input) {
	car = input.toLowerCase().replace(":", "");
	car = car.replace(/a5/g, "a");
	car = car.replace(/e5/g, "e");
	car = car.replace(/i5/g, "i");
	car = car.replace(/o5/g, "o");
	car = car.replace(/u5/g, "u");
	car = car.replace(/ü5/g, "ü");
	car = car.replace(/r5/g, "r");

	car = car.replace(/a1/g, "ā");
	car = car.replace(/a2/g, "á");
	car = car.replace(/a3/g, "ǎ");
	car = car.replace(/a4/g, "à"); 
	car = car.replace(/e1/g, "ē");
	car = car.replace(/e2/g, "é");
	car = car.replace(/e3/g, "ě");
	car = car.replace(/e4/g, "è"); 
	car = car.replace(/i1/g, "ī");
	car = car.replace(/i2/g, "í");
	car = car.replace(/i3/g, "ǐ");
	car = car.replace(/i4/g, "ì"); 
	car = car.replace(/o1/g, "ō"); 
	car = car.replace(/o2/g, "ó");
	car = car.replace(/o3/g, "ǒ");
	car = car.replace(/o4/g, "ò");
	car = car.replace(/u1/g, "ū");
	car = car.replace(/u2/g, "ú");
	car = car.replace(/u3/g, "ǔ");
	car = car.replace(/u4/g, "ù"); 
	car = car.replace(/ü1/g, "ǖ"); 
	car = car.replace(/ü2/g, "ǘ");
	car = car.replace(/ü3/g, "ǚ");
	car = car.replace(/ü4/g, "ǜ"); 
	car = car.replace(/an1/g, "ān");
	car = car.replace(/an2/g, "án");
	car = car.replace(/an3/g, "ǎn");
	car = car.replace(/an4/g, "àn");
	car = car.replace(/ang1/g, "āng");
	car = car.replace(/ang2/g, "áng");
	car = car.replace(/ang3/g, "ǎng");
	car = car.replace(/ang4/g, "àng");
	car = car.replace(/en1/g, "ēn");
	car = car.replace(/en2/g, "én");
	car = car.replace(/en3/g, "ěn");
	car = car.replace(/en4/g, "èn");
	car = car.replace(/eng1/g, "ēng");
	car = car.replace(/eng2/g, "éng");
	car = car.replace(/eng3/g, "ěng");
	car = car.replace(/eng4/g, "èng");
	car = car.replace(/in1/g, "īn");
	car = car.replace(/in2/g, "ín");
	car = car.replace(/in3/g, "ǐn");
	car = car.replace(/in4/g, "ìn"); 
	car = car.replace(/ing1/g, "īng");
	car = car.replace(/ing2/g, "íng");
	car = car.replace(/ing3/g, "ǐng");
	car = car.replace(/ing4/g, "ìng");
	car = car.replace(/ong1/g, "ōng");
	car = car.replace(/ong2/g, "óng");
	car = car.replace(/ong3/g, "ǒng");
	car = car.replace(/ong4/g, "òng");
	car = car.replace(/un1/g, "ūn");
	car = car.replace(/un2/g, "ún");
	car = car.replace(/un3/g, "ǔn");
	car = car.replace(/un4/g, "ùn"); 
	car = car.replace(/er2/g, "ér");
	car = car.replace(/er3/g, "ěr");
	car = car.replace(/er4/g, "èr");
	car = car.replace(/aō/g, "āo"); 
	car = car.replace(/aó/g, "áo");
	car = car.replace(/aǒ/g, "ǎo");
	car = car.replace(/aò/g, "ào");
	car = car.replace(/oū/g, "ōu"); 
	car = car.replace(/oú/g, "óu");
	car = car.replace(/oǔ/g, "ǒu");
	car = car.replace(/où/g, "òu");
	car = car.replace(/aī/g, "āi");
	car = car.replace(/aí/g, "ái");
	car = car.replace(/aǐ/g, "ǎi");
	car = car.replace(/aì/g, "ài"); 
	car = car.replace(/eī/g, "ēi");
	car = car.replace(/eí/g, "éi");
	car = car.replace(/eǐ/g, "ěi");
	car = car.replace(/eì/g, "èi"); 
	return car;
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}

function fuzzed(number, fuzz_window) {
	if (fuzz_window) {
		fuzz_window = 0.5;
	}
	return (Math.random() - fuzz_window) * number + number

}

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1;
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};