var puntuation = {
	',': true, '“': true, '。': true, '”': true, ':': true, '.': true, '?': true, '!': true, '/': true,
	 ' ': true, '✔': true, '✘': true, '、': true, 'Arrange': true, 'it': true, ']': true, '-': true, 'order': true, 
	'proper': true, '[': true, '’': true, '‘': true, '(': true, ')': true, 'ā': true, '×': true, 'Zh': true, 'ō': true,
	'j': true, 'yu': true, 'ǐ': true, 'ū': true, 'á': true, 'à': true, '，': true, '：': true, '\n': true, '？': true,
	' 」': true, ' 「': true, 'the': true, 'Choose': true, '！': true, 'image': true, 'correct': true, 'answer': true, 
	'corresponding': true, 'wether': true, 'Decide': true, 'in': true, '；': true, 'blanks': true, 'Fill': true, 
	'corresponds': true, 'sentence': true, 'related': true, '》': true, '《': true, 'or': true, 'true': true,
	'false': true, '„': true, '—': true
}

// expect a string of chinese words each segmented with a SEG_SYMBOL
// returns a list of jQuery spans with the words on it
function add_action_segment(sentence, action_function, emphasize) {
	var SEG_SYMBOL = '·'
	return _.map(
		sentence.split(SEG_SYMBOL), 
		word => {
			var word_elem = word == '\n'? $('<br>'):$('<span>', {"class": "segmented word"}).text(word)
			if (!puntuation[word]) {
			    if (emphasize == word) {
			        word_elem.css('font-weight', 'bold')
			    } else {
			        word_elem.click(action_function);   
			    }
			}
			var backed = mdb.get(Word, {'id': word});
			if (backed && backed.unknown) word_elem.addClass('unknown');
			return word_elem;
		}
	);
}

function prompt_word(evt) {
	var element = $(evt.target);
	var word_hanzi = element.text();
	if (convert_trad) {
		word_hanzi = converter.t2s(word_hanzi)
	}
	word = mdb.get(Word, {id: word_hanzi}) || new Word(word_hanzi)
	if (in_correction) {
		if (!word.unknown) {
			for (displaying_word of displaying_words[word_hanzi]) {
				displaying_word.addClass('unknown');
			}
			word.not_recalled(true)
		}
		word.DOMS = displaying_words[word_hanzi];
		router.stack(word.DOM())
	} else {
		if (word.unknown) {
			for (displaying_word of displaying_words[word_hanzi]) {
				displaying_word.removeClass('unknown');
			}
			word.not_recalled(false)
		} else {
			for (displaying_word of displaying_words[word_hanzi]) {
				displaying_word.addClass('unknown');
			}
			word.not_recalled(true) 
		}
	}
}

function prompt_words(sentence, emphasize) {
	var added_words = add_action_segment(sentence, prompt_word, emphasize);
	for (var added_word of added_words) {
		var word = added_word.text();
		if (!puntuation[word]) {
			if (word in displaying_words) {
				displaying_words[word].push(added_word); 
			} else {
				displaying_words[word] = [added_word];
			}
		}
	}
	return added_words;
}

Vue.component('example-sentence', {
    template: `<li class="example_item"><div ref="promptable"><img src="https://cdn0.iconfinder.com/data/icons/tuts/256/google_translate.png" style="width:15pt" v-if="english" @click="showing_translation=!showing_translation"></div><div v-if="showing_translation" class="english-translation">{{ english }}</div></li>`,
    props: [
        'chinese',
        'english',
        'emphasize'
    ],
    mounted: function() {
        $(this.$refs.promptable).prepend(prompt_words(this.chinese, this.emphasize))
    },
    data: function() {
            return {
                showing_translation: false
        }
    }
})

class Word {
	assing_from_json(word_json) {
		if (!this.id) this.id = word_json.id
		if (!this.hanzi) this.hanzi = word_json.id

		this.update(word_json)
		
		// if (!this.pinyin &&!this.translations) {
		// 	this.fetch()
		// }

        // no conviene moverlo a el update? creo que si
		if (this.container) {
			this.container.hanzi = this.hanzi,
		    this.container.pinyin = this.pinyin,
		    this.container.audio = this.audio,
		    this.container.translations = this.translations,
		    this.container.measure = this.measure,
		    this.container.examples = this.examples,
		    this.container.level = this.level
		    this.container.fetching = this.fetching
			this.container.fetching_error = this.fetching_error
		}

		if (this.unknown_while_fetching === true) {
			this.unknown = true
			this.save()
		}

		this.DOMS = []

		if(mdb) {
			mdb.add(this);
		}

	}

	not_recalled(not_rec) {
		if (this.fetching) {
			this.unknown_while_fetching = not_rec
		} else {
			this.unknown = not_rec
			this.save()
		}
		if (this.DOMS) {
			for (var dom of this.DOMS) {
				if (this.unknown) {
					dom.addClass('unknown')
				} else {
					dom.removeClass('unknown')
				}
			} 
		}

	}

	fetch() {
		this.fetching = true
		$.ajax({
            type: 'GET',
            url: this.endpoint,
            context: this,
            dataType: "json",
            data: {'word': this.id},
            success: function( data ) {
				this.fetching = false
				if ('error' in data) {
					this.fetching_error = true
					this.assing_from_json(data)
				} else {
					this.assing_from_json(data)
				}
			},
            error: function (xhr, status, errorThrown) {
                this.word_explanation.fetching_error = true
                this.assing_from_json(data)
            }
        });
	}

	constructor(word_id_or_json){
		this.fetching = false
		this.fetching_error = false
		this.endpoint = 'api/words.php'

		if (typeof(word_id_or_json) == 'string') {
			this.id = word_id_or_json;
			this.hanzi = this.id;
			this.fetch()
		} else {
			var word_json = word_id_or_json
			this.assing_from_json(word_json)
		}
	}

	update(new_fields) {
		if(new_fields.pinyin !== undefined) this.pinyin = new_fields.pinyin
		if(new_fields.translations != undefined) this.translations = new_fields.translations
		if(new_fields.level !== undefined) this.level = new_fields.level
		if(new_fields.audio !== undefined) this.audio = new_fields.audio
		if(new_fields.measure !== undefined) this.measure = new_fields.measure
        if(new_fields.examples !== undefined) this.examples = new_fields.examples
		if(new_fields.unknown !== undefined) this.unknown = new_fields.unknown !== undefined? new_fields.unknown : true
	}

	toJSON(mini) {
		var json_obj = {
			id: this.hanzi,
			unknown: this.unknown
		}

		if (!mini) {
			json_obj.pinyin = this.pinyin
			json_obj.audio = this.audio
			json_obj.translations = this.translations
			json_obj.measure = this.measure
			json_obj.examples = this.examples
			json_obj.level = this.level
		}
		
		if (this.reviewing) {
			json_obj.reviewing = this.reviewing
		}

		return json_obj;
	}

	DOM() {
		var current_word = this

		this.container = new Vue({
			template: `
			<div id="word_explanation">
				<div class="hanzi">
					{{ show_hanzi }}
					<span class="audio_cool" v-if="!fetching_error && !fetching && audio" v-on:click="play">
						<audio v-bind:src="audio_url" autoplay></audio>
					</span>				
				</div>
				<template v-if="fetching_error">
					<div class="fetching">Ups! We coudn't find the word.</div>
				</template>
				<template v-else>
					<template v-if="fetching">
						<div class="fetching">⛁ Loading...</div>
					</template>
					<template v-else>
						<div class='pinyin'>{{ pinyin }}</div>
						<img v-if="isHSK" v-bind:src='level_sitcker_url' class="level">
						<ul>
							<li v-for="translation in translations">
								  {{ translation }}
							</li>
							<li class="measures" v-if="measure.length > 0">MW: {{ measure.join(', ') }}</li>
						</ul>
						<button v-if="unknown" class="change_status" v-on:click="change_to_known">Mark as easy</button>
				        <button v-else class="change_status" v-on:click="change_to_unknown">Mark as challanging</button>
						<div v-if="examples.length > 0" class="examples">
						    <ul>
						        <li v-for="example in examples">
						            <example-sentence :emphasize="hanzi" :chinese="example.cmn" :english="example.eng"></example-sentence>
						        </li>
						    </ul>
						</div>
						<a v-bind:href='tatoeba_url' v-if="examples.length >= 6" target="_blank" class="link tatoeba">More examples in Tatoeba →</a>
						<a v-bind:href='google_url' target="_blank" class="link google-img">Images in Google →</a>
					</template>
				</template>
			</div>`,
			methods: {
				change_to_known: function(evt) {
					current_word.not_recalled(false)
					this.unknown = false
				},
				change_to_unknown: function(evt) {
					current_word.not_recalled(true)
					this.unknown = true
				},
				play: function (evt) {
					var audio_element = $(evt.target).children()[0]
					audio_element.currentTime = 0
					audio_element.play()
				}
			},
			computed: {
				audio_url: function() {
					return 'audio/words/' + this.hanzi + '.mp3'
				},
				tatoeba_url: function() {
					return 'https://tatoeba.org/eng/sentences/search?query="' + this.hanzi + '"&from=cmn&to=und'
				},
				google_url: function() {
					return 'https://www.google.com/search?q=' + this.hanzi + '&tbm=isch'
				},
				level_sitcker_url: function() {
					return 'img/hsk' + this.level + '_big.png'
				},
				isHSK: function() {
					if (this.level) {
						return true
					} else {
						return false
					}
				},
				show_hanzi: function() {
					if (convert_trad) {
						return converter.s2t(this.hanzi)
					} else {
						return this.hanzi
					}
				}
			},
			data: {
			  	hanzi: this.hanzi,
			  	fetching: this.fetching,
			    pinyin: this.pinyin,
			    audio: this.audio,
			    translations: this.translations,
			    level: this.level,
			    measure: this.measure,
			    examples: this.examples,
			    fetching_error: this.fetching_error,
			    unknown: this.unknown
		  	}
		})
		return $(this.container.$mount().$el)
	}

	save() {
		mdb.add(this, true)
	}
}