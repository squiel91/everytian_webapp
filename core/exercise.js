function parse_start(text) {
	if (text.indexOf('-') > -1) {
		return parseInt(text.split('_')[1].split('-')[0])
	} else {
		return parseInt(text.split('_')[1])
	}
}

class MultipleChoice {
	constructor(multiple_choice_json, id, level) {
		this.id = id;
		this.level = level;
		this.question = multiple_choice_json.question;
		this.audio = multiple_choice_json.audio;
		this.options = multiple_choice_json.options; // the first option is the correct one by convention
	}

	DOM() {
		var first = true;
		var options = []	
		for(var k in this.options) {
			var option_id = 'option_' + this.id + '_' + k
			var radio = $('<input>', {
				'type': 'radio',
				'class': 'interaction_sign',
				'id': option_id,
				'name': this.id
			})
			var option = $('<div/>', {'class': 'option_container'})
			if (typeof this.options[k] == 'string') {
				var label = $('<label class="radio" for="' + option_id + '"><div class="inner"></div></label>')
				var option_text = $('<span/>').append(prompt_words(this.options[k]))
				option.append(
					$('<table/>', {'class': 'with_options'}).append(
						$('<tr/>').append(
							$('<td/>', {'class': 'with_input'}).append(radio, label),
							$('<td/>').append(option_text)
						)
					)
				)
			} else {
				radio.addClass('input_on_img')
				var label = $('<label/>', {
				    'for': 'option_' + this.id + '_' + k,
				    'class': 'radio radio_on_image',
				    style: 'position: absolute'
				})
				var image = $('<label/>', {'for': 'option_' + this.id + '_' + k, 'class': 'option_img'}).append(
					$('<img/>', {'src': this.options[k].img, 'for': 'option_' + this.id + '_' + k})
				)
				option.append(radio, label, image)
			}
			if (first) {
				option.addClass('correct')
				first = false;
			}
			options.push(option);
		}

		options = _.shuffle([...[options[0]], ..._.shuffle(options.slice(1, 20))].slice(0, 4));

		var container_MO = $('<div/>', {'class': 'container_MO'})
		var question_container = $('<div/>', {'class': 'question_container'})
		if (this.audio) {
			question_container.hide();
			var container_audio = $('<div/>', {'class': 'container_audio'})
			var audio_element = create_new_audio(this.audio, this.level<4? 2:1, () => {
				container_audio.hide();
    			question_container.show();
			});
			container_audio.append(audio_element);
			container_MO.append(container_audio)
		}	

		if (this.question) {
			container_MO.append(question_container)
			if (typeof this.question == 'string') {
				question_container.append(prompt_words(this.question))
			} else {
				question_container.append($('<img/>', {'src': this.question.img}))
			}
		}
		return container_MO.append(options)
	}
}

class ExerciseMultipleChoice {
	constructor(exercise_json) {
		this.id = exercise_json.id;
		this.type = exercise_json.type;
		this.level = exercise_json.level;
		this.instructions = exercise_json.instructions;
		this.body = exercise_json.body;
		this.audio = exercise_json.audio;
		this.img = exercise_json.img;
		this.multiple_choices = [];
		var multiple_choices_json = exercise_json.multiple_choices;
		var start = parse_start(this.id);
		for (var k in multiple_choices_json) {
			this.multiple_choices.push(new MultipleChoice(multiple_choices_json[k], start + parseInt(k), this.level));
		}
	}

	placing(input, feedback) {
		if (input.next().is("label")) {
		    if (input.next().hasClass("radio_on_image")) {
		        input.next().after(feedback.addClass('mark_on_img'))
		    } else {
		        input.parent().next().append(feedback)   
		    }
		} else {
			input.parent().next().append(feedback)
		}
	}

	correct() {
		var correction = {};
		correction['max_score'] = this.multiple_choices.length;
		var score = 0;
		var answers = [];
		
		$('.exercise_container input').prop('disabled', true);
		$('.container_body').show();
		$('.question_container').show();
		for (var k in this.multiple_choices) {
			var selected = $('input[name=' + this.multiple_choices[k].id + ']:checked')
			var selected_option = selected.length > 0? parseInt(selected.prop('id').split('_')[2]) : null; 
			answers.push(selected_option);
			if (selected_option == 0) {
				score += 1;
				selected.next().css("background-color", "#27ae60").css("border-color", "#27ae60")
				this.placing(selected, $('<span/>', {'class': 'mark_correct'}).text('correct!'))
			} else {
			    var correct = $('#option_' + this.multiple_choices[k].id + '_0')
			    correct.next().css("background-color", "#7f8a8b").css("border-color", "#7f8a8b")
				this.placing(correct, $('<span/>', {'class': 'mark_neutral'}).text('was this one'))
				if (selected_option != null) {
				     selected.next().css("background-color", "#e74c3c").css("border-color", "#e74c3c")
					this.placing(selected, $('<span/>', {'class': 'mark_incorrect'}).text('wrong!'));
				}
			}

		}
		correction['answer'] = answers;
		correction['score'] = score;
		return correction;
	}

	DOM() {
		var container_multiple_choices = $('<div/>', {'class': 'container_multiple_choices'});
		for (var k in this.multiple_choices) {
			container_multiple_choices.append(this.multiple_choices[k].DOM());
		}
		var container_instructions = $('<div/>', {'class': 'container_instructions'}).append(prompt_words(this.instructions));
		var container_body = $('<div/>', {'class': 'container_body'});
		var container_audio = $('<div/>', {'class': 'container_audio'});
		// container_body[0].innerText = this.body;
		if (this.img) {
			container_body.append($(`<img class="cover" src="${this.img}">`));
		}
		if (this.body) {
			container_body.append(prompt_words(this.body));
		}
		if (this.audio) {
			container_body.hide();
			var container_audio = $('<div/>', {'class': 'container_audio'});
			var audio_element = create_new_audio(this.audio, this.level > 3? 1:2, () => {
    			container_audio.hide();
    			container_body.show();
			});
			container_audio.append(audio_element);
		} else {
			container_audio.hide();
		}
		return $('<div/>', {'class': 'exercise_container'}).append(
			container_instructions,
			container_audio,
			container_body,
			container_multiple_choices
		);
	}
}

class ExerciseMultipleChoiceEmbeded {
	constructor(exercise_json) {
		this.id = exercise_json.id;
		this.type = exercise_json.type;
		this.instructions = exercise_json.instructions;
		this.body = exercise_json.body
		this.multiple_choices_embeded = []
	}

	DOM() {
	    var container_body = $('<div/>', {'class': 'container_body'});
	    
	    var start = parse_start(this.id);
		var quantity_embeded = 0
		for (var element of this.body) {
			if (typeof element === 'string') {
			    container_body.append(prompt_words(element));
			} else {
			    var container = document.createElement("div")
			    container.id = 'select_' + (start + quantity_embeded)
			    container_body.append(container);
		        var select = new Select({
                propsData: {
                        id: container.id,
                        options: element.slice(),
                        correction: false
                    }
                }).$mount(container);
                this.multiple_choices_embeded.push(select)
				quantity_embeded += 1;
			}
		}
		var container_instructions = $('<div/>', {'class': 'container_instructions'}).append(prompt_words(this.instructions));
		return $('<div/>', {'class': 'exercise_container'}).append(
			container_instructions,
			container_body
		);
	}
	
	correct() {
		var correction = {};
		correction['max_score'] = this.multiple_choices_embeded.length;
		var score = 0;
		var answers = [];
		
		for (var multiple_choices of this.multiple_choices_embeded) {
		    multiple_choices.in_correction = true
			if (multiple_choices.$data.correct_index == multiple_choices.$data.chosen_index) {
				score += 1;
				answers.push(0); 
			} else {
			    answers.push(-1) // here I should save the user's answer
			}
		}
		correction['answer'] = answers;
		correction['score'] = score;
		return correction;

	}
}

class RightOrder {
	constructor(exercise_json) {
		this.id = exercise_json.id;
		this.type = exercise_json.type;
		this.instructions = exercise_json.instructions;
		this.possible_orders = exercise_json.possible_orders;
	}

	correct() {
		var correction = {};
		var answer = $('#segments_panel').sortable('disable');
		var final_answer = _.map(answer.find('.segment'), elem => $(elem).text()).join('');
		if (convert_trad) {
			final_answer = converter.t2s(final_answer)
		}
		correction['answer'] = final_answer
		correction['max_score'] = 1;
		correction['score'] = 0;
		for (var k in this.possible_orders) {
			if (final_answer == this.possible_orders[k].join('').replace(/·/g, '')) {
			    $('.segments_panel .segment').css('border-color', '#27ae60')
				answer.append($('<div/>', {'class': 'mark_correct', 'style': 'float: left;'}).text('correct!').css('margin-top', '15pt'));
				correction['score'] = 1;
				return correction;
			}
		}
		$('.segments_panel .segment').css('border-color', '#e74c3c')
		answer.append($('<div/>', {'class': 'mark_incorrect', 'style': 'float: left'}).text('wrong!').css('margin-top', '15pt'));
		var correct_response = $('<div>', {'class': 'correct_response', 'style': 'font-size: inherit; color: gray;'}).append(
			$('<span/>', {'class': 'mark_neutral'}).text('possible answer'), 
			$('<span/>').text(' '), 
			prompt_words(this.possible_orders[0].join('·'))
		)
		if (convert_trad) converter.tranElement(correct_response[0], true)
		answer.append(correct_response);
		return correction;
	}

	DOM() {
		var segments_panel = $('<div/>', {'id': 'segments_panel', 'class': 'segments_panel'}).sortable().disableSelection();
		var segments = _.shuffle(this.possible_orders[0]);
		for (var k in segments) {
			segments_panel.append($('<span/>', {'class': 'segment interaction_sign'}).append(prompt_words(segments[k])));
		}
		var container_instructions = $('<div/>', {'class': 'container_instructions'}).append(prompt_words(this.instructions));
		return $('<div/>', {'class': 'exercise_container'}).append(
			container_instructions,
			segments_panel
		)
	}
}

class Exercise {
	constructor(exercise_json) {
		this.json = exercise_json
		this.exercise = null
		this.id = exercise_json.id
		this.type = exercise_json.type
		this.exercise_el = null
		
		if (exercise_json.answer) this.answer = exercise_json.answer;
		if (exercise_json.score != undefined) this.score = exercise_json.score;
		if (exercise_json.max_score) this.max_score = exercise_json.max_score;
		if (exercise_json.date) this.date = exercise_json.date;

		var type = exercise_json.type;
		switch(type) {
	    case 'multiple_choice':
	        this.exercise = new ExerciseMultipleChoice(exercise_json);
	        break;
	    case 'multiple_choice_embeded':
	        this.exercise = new ExerciseMultipleChoiceEmbeded(exercise_json);
	        break;
	    case 'right_order':
	        this.exercise = new RightOrder(exercise_json);
	        break;
	    }
	}

	update(new_fields) {
		if (new_fields.answer != undefined) this.answer = new_fields.answer;
		if (new_fields.score != undefined) this.score = new_fields.score;
		if (new_fields.max_score != undefined) this.max_score = new_fields.max_score;
		if (new_fields.date != undefined) this.date = new_fields.date;
	}

	correct() {
		if (word_spacing) {
			this.exercise_el.addClass('word_spacing')
		}
		in_correction = true;
		var correction = this.exercise.correct();
		correction['date'] = Date.now();
		this.date = correction['date'];
		this.answer = correction.answer;
		this.score = correction.score;
		this.max_score = correction.max_score;

		if (this.score == this.max_score) {
			docker.mark_correct();
		} else {
			if (this.score == 0) {
				docker.mark_incorrect()
			} else {
				docker.mark_more_or_less()
			}
		}

		this.date = correction.date
		this.json['correction'] = correction
		mdb.add(this, true)


		docker.action('NEXT EXERCISE', function () {
		 	docker.default()
		 	window.history.replaceState({}, '', '?');
		 	revise()
		})
		
        if (this.type == 'multiple_choice' && this.exercise.audio) {
            pleh.help('transcript')
        } else {
            pleh.help('markWord')
        }

	}

	toJSON(min) {
		if (min) {
			return {
				id: this.id,
				answer: this.answer,
				score: this.score,
				max_score: this.max_score,
				date: this.date
			}
		} else {
			this.json.answer = this.answer
			this.json.score = this.score
			this.json.max_score = this.max_score
			this.json.date = this.date
			return this.json
		}
	}

	DOM() {
		in_correction = false
		this.exercise_el = this.exercise.DOM()
		if (convert_trad) converter.tranElement(this.exercise_el[0], convert_trad)
		var exercise = this
		var is_skippable = true

		this.exercise_el.find('label.radio, label.option_img').click(function user_interaction() {
			if (is_skippable) {
				docker.action('CHECK', function () {
					exercise.correct()
				})
				is_skippable = false
			}
		})
		this.exercise_el.find('audio').on('playing', function user_interaction() {
			if (is_skippable) {
				docker.action('CHECK', function () {
					exercise.correct()
				})
				is_skippable = false
			}
		})
		this.exercise_el.find('#segments_panel').on('sortchange',  function user_interaction() {
			if (is_skippable) {
				docker.action('CHECK', function () {
					exercise.correct()
				})
				is_skippable = false
			}
		});
		return this.exercise_el
	}
}

