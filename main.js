// global variables
levels = localStorage['levels']? JSON.parse(localStorage['levels']) : []

// global for recall_exercises
var recall_main_button = $('#recall_main_button')
var during_recall_exercise = false
var recall_main_action = null

var email = localStorage['email']
var pass = localStorage['pass']

var in_correction = false

// pleh.messages = help_messages

var mdb = new MiniDB([Exercise, Word]);

var all_words = mdb.get(Word) // this is just for the exercise. Should refactor to use mdb

var router = new Router([
	'practice_tab',
	'vocabulary_tab',
	'progress_tab',
	'settings_tab',
	'about_tab'
]);

displaying_words = {};

if (email) {
	$('.just_logged').show();
	$('.just_not_logged').hide();
} else {
	$('.just_logged').hide();
	$('.just_not_logged').show();
}

setInterval(() => mdb.sync(), 5000);


var docker

// Offline words
$(() => {
    if (localStorage['offline_words']) {
        $('input#offline_words').prop('disabled', true).prop('checked', true)
    }
})

function offline_words() {
    $('input#offline_words').prop('disabled', true)
    $.ajax({
        type: "GET",
        url: "api/words.php",
        dataType: "json",
        data: {'level': Math.max(...levels), 'from_1': true},
        success: function (words_json) {
            $.each(words_json, function(index, word_json) {
                mdb.update(Word, word_json);
            });                                      
            localStorage['offline_words'] = 'true'
        },
        error: function (xhr, status, errorThrown) {
            $('input#offline_words').prop('checked', false).prop('disabled', false)
            alert("Sorry! There was an error downloading the exercises. Can you try again?")
        }
    }); 
}

// Word spacing
var word_spacing = false

$(() => {
    if (localStorage['word_spacing'] == 'true') {
        word_spacing = true
        $('input#word_spacing').prop('checked', true)
    }
})

function change_word_spacing(event) {
    word_spacing = $(event.target).prop('checked')
    localStorage['word_spacing'] = word_spacing
    if (in_correction) {
        var exercise_container = $('.exercise_container')
        exercise_container.removeClass('word_spacing')
        if (word_spacing) {
            exercise_container.addClass('word_spacing')
        }
    }
}

// Convert Simplified-Traditional
var convert_trad = false

$(() => {
    if (localStorage['convert_trad'] == 'true') {
        convert_trad = true
        $('input#convert_trad').prop('checked', true)
    }
})

function change_traditional(evt) {
    var traditional = $(evt.target).prop('checked')
    convert_trad = traditional
    localStorage['convert_trad'] = convert_trad
    converter.tranElement($('.exercise_container')[0], convert_trad)
}

$(() => {

    $('#feedback_submit').click(feedback_submit)
	docker = new Docker()
    $('#anki').click(download_anki)
	revise()
})

// revise_recall()
// setInterval(revise_recall, 5000, true)
const vue_select = new VueSelect(
    {
        propsData: {
        options: levels.map((l) => 'HSK ' + l)
    }
}).$mount('#select_level'); 
        
function evolution(level) {
    
    if (!level){
        level = vue_select.chosen_val
    }

	var total_score_listening = 0; 
	var user_score_listening = 0;
	var total_score_reading = 0;
	var user_score_reading = 0;
	
	if (!level || level == 'all') {
	    var done_exercises = mdb.get(Exercise, {filter: e => e.score != null })
	    var all_exercises_qty = mdb.get(Exercise).length   
	} else {
	    var done_exercises = mdb.get(Exercise, {filter: e => e.score != null && e.json.level == level })
	    var all_exercises_qty = mdb.get(Exercise, {filter: e => e.json.level == level }).length
	}
	var done_exercises_qty = done_exercises.length

	for (var exercise of done_exercises) {
		if (exercise.type == 'multiple_choice_embeded' ||
		 	exercise.type == 'right_order' || !(exercise.exercise.audio)) {
			user_score_reading += exercise.score;
			total_score_reading += exercise.max_score;
		} else {
			user_score_listening += exercise.score;
			total_score_listening += exercise.max_score;
		}
	}
	var total_score = total_score_listening + total_score_reading;
	var user_score = user_score_listening + user_score_reading;

    function progress(section_id, score, total) {
        var section = $('#' + section_id)
        section.find('#total').text(total)
        section.find('#score').text(score)
        var percentage = parseInt((score / total) * 100)
        if (isNaN(percentage)) percentage = 0
        section.find('#percentage').text(percentage)
        section.find('.progress_bar').css('background-size', percentage + '%')
    }

    function recommend(user_score, total_score) {
        var message = ''
        if (total_score == 0) {
            message = 'Start practicing! It will get you closer to pass the exam :)'
        } else {
            if (user_score / total_score > 0.6) {
                message = 'You are doing great!\nKeep practicing so we can advice you better.'
            } else {
               message = 'You can do it better!\nKeep practicing so we can advice you better.'
            }
        }
        $('#advice')[0].innerText = message
    }

    function challenging_words(hsk_words_by_index) {
        // 0 not HSK. Rest corresponding to the index
        var total_words = 0
        var words_levels = $('#words_levels').empty()
        for (var i = 6; i >= 1; i--) {
            if (hsk_words_by_index[i]) {
                total_words += hsk_words_by_index[i]
                var words_level = $(`<div class="level"></div>`)
                for (var j = 1; j <= hsk_words_by_index[i]; j++) {
                    words_level.append($(`<div class="word_dot"></div>`))
                }
                words_level.append($(`<div class="hsk_level">| HSK ${i}</div>`))
                words_levels.append(words_level)
            }
        }
        if (total_words == 0) {
            $('.challenging_words_section #qty_challenging_words').text('No') 
            $('.challenging_words_section #yet_challenging_words').show() 
            $('.challenging_words_section #anki').addClass('disabled') 
        } else {
            $('.challenging_words_section #anki').removeClass('disabled')
            $('.challenging_words_section #yet_challenging_words').hide() 
            $('.challenging_words_section #qty_challenging_words').text(total_words) 
        } 

        if (total_words == 1) $('.challenging_words_section #word_words').hide()
    }

    challenging_words([
        0,
        mdb.get(Word, {filter: w => w.unknown && w.level == 1 }).length,
        mdb.get(Word, {filter: w => w.unknown && w.level == 2 }).length,
        mdb.get(Word, {filter: w => w.unknown && w.level == 3 }).length,
        mdb.get(Word, {filter: w => w.unknown && w.level == 4 }).length,
        mdb.get(Word, {filter: w => w.unknown && w.level == 5 }).length,
        mdb.get(Word, {filter: w => w.unknown && w.level == 6 }).length
    ])

    progress('overall_score', user_score, total_score)
    progress('reading_score', user_score_reading, total_score_reading)
    progress('listening_score', user_score_listening, total_score_listening)
    progress('exercises_completed', done_exercises_qty, all_exercises_qty)

    recommend(user_score, total_score)
}

function valid_email(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

function sign_up() {
	var sign_email;
    var sign_pass;
    var sign_pass_reapeat;
    var sign_level;
    var errors;

	sign_level = JSON.stringify(levels);
    sign_email = $('#email').val();
    sign_pass = $('#pass').val();
    errors = false;

    $('#error_email').empty();
    $('#error_pass').empty();

    if (!valid_email(sign_email)) {
        errors = true;
        $('#error_email').text('Invalid email');
    }

    if (sign_pass.length < 6) {
        errors = true;
        $('#error_pass').text('Should have 6 characters at least');
    }

    if(!errors) {
        var loader = $('<div class="loading_cover"><div class="loader"></div></div>')
        $('body').append(loader);
        $.ajax({
            type: "POST",
            url: "api/users.php",
            dataType: "json",
            data: {'email': sign_email, 'pass': sign_pass, 'level': sign_level, 'sign': 'up'},
            success: function (user_status) {
                if (!user_status.succesfully) {
                    errors = true;
                    if (user_status.existing_email) {
                        $('#error_email').text('Email already exists.');
                    }
                    if (user_status.invalid_email) {
                        $('#error_email').text('Invalid email.');
                    }
                    if (user_status.invalid_pass) {
                        $('#error_pass').text('Incorrect password.');
                    }
                }

                if(errors) {
                    loader.remove();
                } else {
                	loader.remove();
                    localStorage['email'] = sign_email;
                    localStorage['pass'] = sign_pass;
                    email = sign_email;
                    pass = sign_pass;
                    $('.just_logged').fadeIn();
					$('.just_not_logged').fadeOut();

                }
            },
            error: function (xhr, status, errorThrown) {
                loader.remove();
                errors = true;
                alert("Sorry! There was an error comunicating with the server. Can you try again?")
            }
        });
    }
}

function revise(exercise) {
    if (!exercise) {
        if (window.location.search.startsWith('?exercise=')) {
            var exercise_id = window.location.search.split('=')[1]
            var exercise = mdb.get(Exercise, {id: exercise_id})
            if (!exercise) {
                $.getJSON( "api/exercises.php", {id: exercise_id}, function( data ) {
                    revise(new Exercise(data))
                })
                return
            }
        } else {
           var exercise = mdb.get(Exercise, {filter: j => j.score == null, sample: true})
        }
    }
	if (exercise){
        window.history.replaceState({exercise: exercise.id}, '', '?exercise=' + exercise.id);
		router.on('practice_tab').stack(exercise.DOM().append($('#local_options')), true);
		docker.action('SKIP', function () { // TODO: check here if im not indefinetely stacking actions in docker
	 		docker.default()
            window.history.replaceState({}, '', '?');
            revise()
	 	})
        // switch(exercise.type) {
        //     case 'multiple_choice':
        //         pleh.help('MoChooseOption')
        //         break;
        //     case 'right_order':
        //         pleh.help('rightOrder')
        //         break;
        //     case 'multiple_choice_embeded':
        //         pleh.help('embeded')
        // }

	} else {
        // If there is no level defined is because it comes from a redirection
        if (levels.length == 0){
            window.location.replace("sign.html");
        } else {
		  router.on('practice_tab').stack($('<div>', {'class': 'placeholder'}).text('Congratulations! No more exercises for now.'), true);
        }
	}
}

function zoom_in() {
    $('#practice_tab').css('font-size', parseInt($('#practice_tab').css('font-size').split('px')[0]) + 2 + 'px')
}
function zoom_out() {
    $('#practice_tab').css('font-size', parseInt($('#practice_tab').css('font-size').split('px')[0]) - 2 + 'px')
}

function close_social() {
    $('#share_block').hide()
    $('.option').show()
}

function close_feedback() {
    $('#feedback_block').hide()
    $('.option').show()
}

function share() {
    $('#feedback_block').hide()
    $('.option').hide()
    $('#share_block').show()
}

function feedback() {
    $('#share_block').hide()
    $('.option').hide()
    $('#feedback_success').hide()
    $('#feedback_loading').hide()
    $('#feedback_error').hide()
    $('#feedback_type').show()
    $('#feedback_message').show()
    $('#feedback_submit').text('Send Feedback').show()
    $('#feedback_block').show()
    $('#feedback_email').show()
}


function feedback_submit() {
    $('#feedback_submit').text('Sending...')
    $.ajax({
            type: "POST",
            url: "api/dumps.php",
            dataType: "json",
            data: {
                'd':  JSON.stringify({
                    type: 'feedback',
                    exercise: window.location.search, 
                    user: typeof email == 'undefined'? undefined : email,
                    reason: $('#feedback_type').val(),
                    message: $('#feedback_message').val()
                })
            },
            success: function (status) {
                $('#feedback_sending').hide()
                if(!status.error) {
                    $('#feedback_submit').text('Send Feedback')
                    $('#feedback_type').hide()
                    $('#feedback_message').hide()
                    $('#feedback_submit').hide()
                    $('#feedback_email').hide()
                    $('#feedback_success').show()
                } else {
                    $('#feedback_error').show()
                    $('#feedback_submit').text('Send Feedback')

                }
            },
            error: function (xhr, status, errorThrown) {
                $('#feedback_sending').hide()
                $('#feedback_error').show()
                $('#feedback_submit').text('Send Feedback')
            }
        });
    {}
}

function download_anki(evt) {
    if (!$(evt.target).hasClass('disabled')) {
        var unknown_word = mdb.get(Word, {filter: w => w.unknown })
        text = ''
        for (var unk_word of unknown_word) {
            text += `${unk_word.id}\t${unk_word.pinyin}\t${unk_word.translations.join(', ')}\t${unk_word.level}\n`
        }
        download('everytian_anki.csv', text)
    }
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function numb_selected(jquery_elm) {
    var selected = 0
    for (var dom_elm of jquery_elm) {
        if($(dom_elm).prop('checked')) {
            selected += 1    
        }
    }
    return selected
}

var last_number = levels.length

var selecting_level = false
var intentionaly_opened = false

$(() => {
    for (var level of levels) {
        $(".multiple_select input[value=" + level + "]").prop("checked", true)
    }
        
    $('.change_level .multiple_select .header').click(function() {
        if (selecting_level) {
            $('.change_level .multiple_select').animate({height: ($('.change_level .header').height() + 23)}, 250)
            $('.change_level .multiple_select .selecting_level').fadeOut(150)
            $('.change_level .multiple_select .button').fadeOut(150)
            intentionaly_opened = false
        }else {
            intentionaly_opened = true
            $('.change_level .multiple_select .selecting_level').fadeIn(400)
            if (numb_selected($('input[type=checkbox]')) > 0) {
                $('.change_level .multiple_select .button').fadeIn(400)
                $('.change_level .multiple_select').animate({height: '+=' + ($('.change_level .selecting_level').outerHeight() + $('.change_level .button').outerHeight() + 15)}, 200)
            } else {
                $('.change_level .multiple_select').animate({height: '+=' + ($('.change_level .selecting_level').outerHeight())}, 200)   
            }
        }
        selecting_level = !selecting_level
    })
    
    $('.change_level input[type=checkbox]').click(function () {
        var selected = numb_selected($('.change_level input[type=checkbox]'))
        if(selected > 0) {
            if (selected == 1 && last_number == 0) {
                $('.change_level .multiple_select .button').fadeIn(400) 
                $('.change_level .multiple_select').animate({height: '+=' + ($('.change_level .button').outerHeight() + 15)}, 200)   
            }
        } else {
            $('.change_level .multiple_select').animate({height: '-=' + ($('.change_level .button').outerHeight()  + 15)}, 200)
            $('.change_level .multiple_select .button').fadeOut(150)
        }
        last_number = selected
    })
    
    $('.change_level .button').click(function(evt) {
        var old_levels = levels
        var new_levels = {}
        for (var checkbox of $('input[type=checkbox]:checked')) {
            new_levels[$(checkbox).val()] = false
        }

        var loader = $('<div class="loading_cover"><div class="loader"></div></div>')
        $('body').append(loader);
        for (var current_level of Object.keys(new_levels)) {
            let requested_level = parseInt(current_level)
            $.ajax({
                type: "GET",
                url: "api/exercises.php",
                dataType: "json",
                data: {'level': requested_level},
                success: function (exercise_json) {
                    $.each(exercise_json, function(index, exercise_json) {
                        if (!mdb.get(Exercise, {'id': exercise_json.id})) {
                            mdb.add(new Exercise(exercise_json));
                        }
                    });
                    new_levels[requested_level] = true
                    if (Object.keys(new_levels).reduce(function(partial, key) { return partial && new_levels[key]}, true)) {
                        levels = Object.keys(new_levels).map(l => parseInt(l))
                        localStorage['levels'] = JSON.stringify(levels)
                        for (var old_level of old_levels) {
                            if (!new_levels[old_level]) {
                                // only removes the undone
                                mdb.remove(Exercise, {filter: (e) => e.score == null && e.json.level == old_level})
                            }
                        }
                        if (email) {
                            $.ajax({
                                type: "POST",
                                url: "api/users.php",
                                dataType: "json",
                                data: {'email': email, 'pass': pass, 'level': levels, 'sign': 'change_level'},
                                success: function (user_status) {
                                    if (!user_status.succesfully) {
                                        alert('There was an error changing your level in the server! Try changing the level again or contact me at ezequiel@everytian.com')
                                    }
                                },
                                error: function (xhr, status, errorThrown) {
                                    loader.remove();
                                    errors = true;
                                    alert("Sorry! There was an error comunicating with the server. Can you try again?")
                                }
                            });  
                        }                               
                        $('.change_level .multiple_select').animate({height: ($('.change_level .header').height() + 23)}, 250)
                        $('.change_level .multiple_select .selecting_level').fadeOut(150)
                        $('.change_level .multiple_select .button').fadeOut(150)
                        selecting_level = false
                        loader.remove();
                        vue_select.options = levels.map((l) => 'HSK ' + l)
                    }
                },
                error: function (xhr, status, errorThrown) {
                    loader.remove();
                    errors = true;
                    alert("Sorry! There was an error downloading the exercises. Can you try again?")
                }
            });
        } 
            
            // $('.change_level .login').hide()
        // }
    })
})