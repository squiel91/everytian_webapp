// function audio_or_pinyin(word, prefix, text){
// 	if (!word.audio || localStorage['pinyin'] == 'true') {
// 		if (!text) {
// 			return $('<div class="pinyin">' + numlat(word.pinyin) + '</div>')
// 		} else {
// 			return '<div class="pinyin">' + numlat(word.pinyin) + '</div>'
// 		}
// 	} else {
// 		var url_audio = 'audio/' + reviewing_word.hanzi + '.mp3'
// 		if (!prefix) {
// 			prefix = ''
// 		}
// 		if (!text) {
// 			return $(prefix + '<audio src="' + url_audio + '" controls autoplay>');
// 		} else {
// 			return prefix + '<audio src="' + url_audio + '" controls autoplay>';
// 		}
// 	}
	
// }


// class TextExercise {
// 	constructor(actual_word){
// 		actual_exercise = this;
// 		reviewing_word = actual_word
// 		var container = $('<div class="word exercise"></div>');
// 		if (actual_word.image){
// 			container.append($('<img style="width:100%" src="' + actual_word.image + '">'));
// 		}
// 		var list_translations = $('<ul id="translations" class="detail">');
// 		$.each(actual_word.translations, function(index, translation){
// 			list_translations.append($('<li>' + translation + '</li>'));
// 		});
// 		container.append(list_translations);
// 		container.append($('<div class="heading" id="label_example">examples:</div>'));
		
// 		var list_examples = process_examples(actual_word.examples, actual_word.hanzi);
// 		container.append(list_examples);
// 		recall_main_button.removeClass('correct').removeClass('wrong').text("Skip");


// 		var input = $('<input type="text" placeholder="Write the chinese word!">').keyup(function (evt) {
// 			var code = evt.keyCode || evt.which;
// 			if (input.val() != '') {
// 				recall_main_button.text("Check");
// 			} else {
// 				recall_main_button.text("Skip");
// 			}
// 			if(code == 13) { //Enter keycode
// 				actual_exercise.correct();
// 			}
// 		});

// 		recall_main_action = actual_exercise.correct;

// 		var input_container = $("<div class='input_container'></div>");

// 		// actual_word.save(); Doesnt seem necesary
// 		container.append(input_container.append(input));
// 		// input.focus();goes after its appended to body

// 		self.container = container;
// 	}

// 	DOM(){
// 		return self.container;
// 	}

// 	correct(answer) {
// 		recall_main_action = null;
// 		input.prop('disabled', true);
// 		if (input.val() == reviewing_word.hanzi || input.val().replace(/ /g,'').toLowerCase() == reviewing_word.pinyin.replace(/ /g,'').toLowerCase()) {
// 			if (reviewing_word.audio) {
// 				var url_audio = 'audio/' + reviewing_word.hanzi + '.mp3'
// 				var audio_elem = $('<audio src="' + url_audio + '" controls autoplay>');
// 				container.prepend(audio_elem);
// 			}
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(true)));
// 			recall_main_button.text("Correct!");
// 			recall_main_button.addClass('correct');
// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				revise();
// 			}, 4000);;

// 		} else {
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(false)));
// 			recall_main_button.text("Wrong!");
// 			recall_main_button.addClass('wrong');

// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				learn(me);
// 			}, 1000, reviewing_word);
// 		}
// 	}
// }

// class HanziDefinition {
// 	constructor(actual_word){
// 		actual_exercise = this;
// 		reviewing_word = actual_word
// 			var container = $('<div class="word exercise"><div id="hanzi" class="detail">' + 
// 			actual_word.hanzi + '</div></div>');

// 		var list_defs = []
// 		for (var i=0; i < 4; i++) {
// 			var random_word = null;
// 			if (i) {
// 				random_word = random_choice(all_words);
// 			} else {
// 				random_word = actual_word;
// 			}
// 			var defs = random_word.translations.join(", ")
// 			list_defs.push('<div class="options"><input style="display: none;"\
// 			type="radio" name="answer" onclick="recall_main_button.text(\'Check\');" value="'+ random_word.hanzi +  '" \
// 			id="'+ random_word.hanzi +'"><label class="highlightable" for="' + random_word.hanzi +'">' + defs + '</label></div>')
// 		}
// 		container.append($('<div class="heading" id="label_example">Select the correct translation:</div>'));
// 		container.append(shuffle(list_defs));
// 		container.append($('<div class="heading" id="label_example">examples:</div>'));
		
// 		var list_examples = process_examples(actual_word.examples, actual_word.hanzi);

// 		recall_main_button.removeClass('correct').removeClass('wrong').text("Skip");

// 		recall_main_action = actual_exercise.correct;var	input_container = $("<div class='input_container'></div>");

// 		// actual_word.save(); Doesnt seem necesary
// 		container.append(input_container.append(list_examples));
// 		// input.focus();goes after its appended to body

// 		self.container = container;
// 	}

// 	DOM(){
// 		return self.container;
// 	}

// 	correct(answer) {
// 		recall_main_action = null;

// 		var answer = $('input[name=answer]:checked').val();
// 		if (answer == reviewing_word.hanzi) {
// 			if (reviewing_word.audio) {
// 				var url_audio = 'audio/' + reviewing_word.hanzi + '.mp3'
// 				var audio_elem = $('<audio src="' + url_audio + '" controls autoplay>');
// 				container.prepend(audio_elem);
// 			}
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(true)));
// 			recall_main_button.text("Correct!");
// 			recall_main_button.addClass('correct');
// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				revise();
// 			}, 4000);;

// 		} else {
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(false)));
// 			recall_main_button.text("Wrong!");
// 			recall_main_button.addClass('wrong');

// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				learn(me);
// 			}, 1000, reviewing_word);
// 		}
// 	}
// }

// class HanziAudio {
// 		constructor(actual_word){
// 		actual_exercise = this;
// 		reviewing_word = actual_word
// 			var container = $('<div class="word exercise"><div class="word"><div id="hanzi" class="detail">' + 
// 			actual_word.hanzi + '</div></div>');

// 		var list_audio = [];
// 		for (var i=0; i < 4; i++) {
// 			var random_word = null;
// 			if (i) {
// 				do {
// 					random_word = random_choice(all_words);
// 				} while(!random_word.audio)
// 			} else {
// 				random_word = actual_word;
// 			}
// 			list_audio.push('<div class="options"><input style="display: none;"\
// 			type="radio" name="answer" onclick="recall_main_button.text(\'Check\');" value="'+ random_word.hanzi +  '" \
// 			id="'+ random_word.hanzi +'"><label class="highlightable" for="' + random_word.hanzi +'" >' + audio_or_pinyin(random_word, '[select]', true) + '</label></div>')
// 		}
// 		container.append($('<div class="heading" id="label_example">Select the correct audio:</div>'));
// 		container.append(shuffle(list_audio));
// 		container.append($('<div class="heading" id="label_example">examples:</div>'));
		
// 		var list_examples = process_examples(actual_word.examples, actual_word.hanzi);

// 		recall_main_button.removeClass('correct').removeClass('wrong').text("Skip");

// 		recall_main_action = actual_exercise.correct;var	input_container = $("<div class='input_container'></div>");

// 		// actual_word.save(); Doesnt seem necesary
// 		container.append(input_container.append(list_examples));
// 		// input.focus();goes after its appended to body

// 		self.container = container;
// 	}

// 	DOM(){
// 		return self.container;
// 	}

// 	correct(answer) {
// 		recall_main_action = null;

// 		var answer = $('input[name=answer]:checked').val();
// 		if (answer == reviewing_word.hanzi) {
// 			if (reviewing_word.audio) {
// 				var url_audio = 'audio/' + reviewing_word.hanzi + '.mp3'
// 				var audio_elem = $('<audio src="' + url_audio + '" controls>');
// 				container.prepend(audio_elem);
// 			}
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(true)));
// 			recall_main_button.text("Correct!");
// 			recall_main_button.addClass('correct');
// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				revise();
// 			}, 4000);;

// 		} else {
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(false)));
// 			recall_main_button.text("Wrong!");
// 			recall_main_button.addClass('wrong');

// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				learn(me);
// 			}, 1000, reviewing_word);
// 		}
// 	}
// }

// class AudioHanzi {
// 	constructor(actual_word){
// 		actual_exercise = this;
// 		reviewing_word = actual_word;
// 		var	container = $('<div class="word exercise"></div>');
// 		container.append(audio_or_pinyin(actual_word));

// 		var list_hanzi = []
// 		for (var i=0; i < 4; i++) {
// 			var random_word = null;
// 			if (i) {
// 				random_word = random_choice(all_words);
// 			} else {
// 				random_word = actual_word;
// 			}

// 			list_hanzi.push('<div class="options"><input style="display: none;"\
// 			type="radio" name="answer" onclick="recall_main_button.text(\'Check\');" value="'+ random_word.hanzi +  '" \
// 			id="'+ random_word.hanzi +'"><label class="highlightable" for="' + random_word.hanzi +'">' + random_word.hanzi + '</label></div>')
// 		}
// 		container.append($('<div class="heading" id="label_example">Select the correct chinese word:</div>'));
// 		container.append(shuffle(list_hanzi));
// 		container.append($('<div class="heading" id="label_example">examples:</div>'));
		
// 		var list_examples = process_examples(actual_word.examples, actual_word.hanzi);

// 		recall_main_button.removeClass('correct').removeClass('wrong').text("Skip");

// 		recall_main_action = actual_exercise.correct;var	input_container = $("<div class='input_container'></div>");

// 		// actual_word.save(); Doesnt seem necesary
// 		container.append(input_container.append(list_examples));
// 		// input.focus();goes after its appended to body

// 		self.container = container;
// 	}

// 	DOM(){
// 		return self.container;
// 	}

// 	correct(answer) {
// 		recall_main_action = null;

// 		var answer = $('input[name=answer]:checked').val();
// 		if (answer == reviewing_word.hanzi) {
// 			if (reviewing_word.audio) {
// 				var url_audio = 'audio/' + reviewing_word.hanzi + '.mp3'
// 				var audio_elem = $('<audio src="' + url_audio + '" controls>');
// 				container.prepend(audio_elem);
// 			}
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(true)));
// 			recall_main_button.text("Correct!");
// 			recall_main_button.addClass('correct');
// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				revise();
// 			}, 4000);;

// 		} else {
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(false)));
// 			recall_main_button.text("Wrong!");
// 			recall_main_button.addClass('wrong');

// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				learn(me);
// 			}, 1000, reviewing_word);
// 		}
// 	}
// }

// class AudioDefinition {
// 	constructor(actual_word){
// 		actual_exercise = this;
// 		reviewing_word = actual_word
// 		var	container = $('<div class="word exercise"></div>');
// 		container.append(audio_or_pinyin(actual_word));

// 		var list_defs = []
// 		for (var i=0; i < 4; i++) {
// 			var random_word = null;
// 			if (i) {
// 				random_word = random_choice(all_words);
// 			} else {
// 				random_word = actual_word;
// 			}
// 			var defs = random_word.translations.join(", ")
// 			list_defs.push('<div class="options"><input style="display: none;"\
// 			type="radio" name="answer" onclick="recall_main_button.text(\'Check\');" value="'+ random_word.hanzi +  '" \
// 			id="'+ random_word.hanzi +'"><label class="highlightable" for="' + random_word.hanzi +'">' + defs + '</label></div>')
// 		}
// 		container.append($('<div class="heading" id="label_example">Select the correct translation:</div>'));
// 		container.append(shuffle(list_defs));
// 		container.append($('<div class="heading" id="label_example">examples:</div>'));
		
// 		var list_examples = process_examples(actual_word.examples, actual_word.hanzi);

// 		recall_main_button.removeClass('correct').removeClass('wrong').text("Skip");

// 		recall_main_action = actual_exercise.correct;var	input_container = $("<div class='input_container'></div>");

// 		// actual_word.save(); Doesnt seem necesary
// 		container.append(input_container.append(list_examples));
// 		// input.focus();goes after its appended to body

// 		self.container = container;
// 	}

// 	DOM(){
// 		return self.container;
// 	}

// 	correct(answer) {
// 		recall_main_action = null;

// 		var answer = $('input[name=answer]:checked').val();
// 		if (answer == reviewing_word.hanzi) {
// 			if (reviewing_word.audio) {
// 				var url_audio = 'audio/' + reviewing_word.hanzi + '.mp3'
// 				var audio_elem = $('<audio src="' + url_audio + '" controls>');
// 				container.prepend(audio_elem);
// 			}
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(true)));
// 			recall_main_button.text("Correct!");
// 			recall_main_button.addClass('correct');
// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				revise();
// 			}, 4000);;

// 		} else {
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(false)));
// 			recall_main_button.text("Wrong!");
// 			recall_main_button.addClass('wrong');

// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				learn(me);
// 			}, 1000, reviewing_word);
// 		}
// 	}

// }

// class DefinitionAudio {
// 	constructor(actual_word){
// 		actual_exercise = this;
// 		reviewing_word = actual_word
// 		var	container = $('<div class="word exercise"><div class="word"><div id="translation" class="detail">' + 
// 			actual_word.translations.join(", ") + '</div></div>');

// 		var list_audio = [];
// 		for (var i=0; i < 4; i++) {
// 			var random_word = null;
// 			if (i) {
// 				do {
// 					random_word = random_choice(all_words);
// 				} while(!random_word.audio)
// 			} else {
// 				random_word = actual_word;
// 			}

// 			list_audio.push('<div class="options"><input style="display: none;"\
// 			type="radio" name="answer" onclick="recall_main_button.text(\'Check\');" value="'+ random_word.hanzi +  '" \
// 			id="'+ random_word.hanzi +'"><label class="highlightable" for="' + random_word.hanzi +'">' + audio_or_pinyin(random_word, '[select]', true) + '</label></div>')
// 		}
// 		container.append($('<div class="heading" id="label_example">Select the correct audio:</div>'));
// 		container.append(shuffle(list_audio));
// 		container.append($('<div class="heading" id="label_example">examples:</div>'));
		
// 		var list_examples = process_examples(actual_word.examples, actual_word.hanzi);

// 		recall_main_button.removeClass('correct').removeClass('wrong').text("Skip");

// 		recall_main_action = actual_exercise.correct;var	input_container = $("<div class='input_container'></div>");

// 		// actual_word.save(); Doesnt seem necesary
// 		container.append(input_container.append(list_examples));
// 		// input.focus();goes after its appended to body

// 		self.container = container;
// 	}

// 	DOM(){
// 		return self.container;
// 	}

// 	correct(answer) {
// 		recall_main_action = null;

// 		var answer = $('input[name=answer]:checked').val();
// 		if (answer == reviewing_word.hanzi) {
// 			if (reviewing_word.audio) {
// 				var url_audio = 'audio/' + reviewing_word.hanzi + '.mp3'
// 				var audio_elem = $('<audio src="' + url_audio + '" controls>');
// 				container.prepend(audio_elem);
// 			}
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(true)));
// 			recall_main_button.text("Correct!");
// 			recall_main_button.addClass('correct');
// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				revise();
// 			}, 4000);;

// 		} else {
// 			input_container.append("Reviewing in " + readable_lapse(reviewing_word.reschredule(false)));
// 			recall_main_button.text("Wrong!");
// 			recall_main_button.addClass('wrong');

// 			setTimeout(function (me) { 
// 				recall_main_button.removeClass('correct').removeClass('wrong');
// 				during_recall_exercise = false;
// 				learn(me);
// 			}, 1000, reviewing_word);
// 		}
// 	}
// }

class DefinitionHanzi {
	constructor(actual_word){
		this.for_word = actual_word
		this.answer = actual_word.hanzi;
		var	container = $('<div class="word exercise"><div class="word"><div id="translation" class="detail">' + 
			actual_word.translations.join(", ") + '</div></div>');

		var list_hanzi = []
		for (var i=0; i < 4; i++) {
			var random_word = null;
			if (i) {
				random_word = random_choice(all_words);
			} else {
				random_word = actual_word;
			}

			list_hanzi.push(
				$('<div/>', {'class': 'option_container'}).append(
					$('<input>', {'type': 'radio', 'id': 'option_' + random_word.hanzi, value: random_word.hanzi, 'name': 'for_DefinitionHanzi'}),
					$('<label/>', {'for': 'option_' + random_word.hanzi}).text(random_word.hanzi)
				)
			)
		}
		container.append($('<div class="heading" id="label_example">Select the correct chinese word:</div>'));
		container.append(shuffle(list_hanzi));

		recall_main_button.removeClass('correct').removeClass('wrong').text("Skip");

		// recall_main_action = actual_exercise.correct; Im doing it somwhere else. maybe here is better
		this.input_container = $("<div class='input_container'></div>");	

		self.container = container;
	}

	DOM(){
		during_recall_exercise = true
		return self.container;
	}

	correct() {
		recall_main_action = null;

		var answer = $('input[name=for_DefinitionHanzi]:checked').val();
		var right = answer == this.answer 
		recall_main_button.after("Reviewing in " + readable_lapse(this.for_word.reschredule(right)));
		// if (this.audio) {
		// 	var url_audio = 'audio/' + this.hanzi + '.mp3'
		// 	var audio_elem = $('<audio src="' + url_audio + '" controls>');
		// 	container.prepend(audio_elem);
		// }
		// this.input_container.append("Reviewing in " + readable_lapse(this.reschredule(true)));
		if (right) {
			recall_main_button.addClass('correct').text("Correct!");
			setTimeout(function (me) { 
				recall_main_button.removeClass('correct').removeClass('wrong');
				during_recall_exercise = false;
				revise_recall()
			}, 4000, this);

		} else {
			recall_main_button.addClass('wrong').text("Wrong!");

			setTimeout(function (me) { 
				recall_main_button.removeClass('correct').removeClass('wrong');
				during_recall_exercise = true;
				revise_recall()
				recall_main_button.text('Next')
				router.stack(me.for_word.DOM().append(recall_main_button.click(()=>during_recall_exercise = false)), true);
			}, 1000, this);
		}
	}
}
