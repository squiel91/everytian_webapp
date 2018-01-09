var mdb = new MiniDB([Exercise, Word]);

function numb_selected(jquery_elm) {
    var selected = 0
    for (var dom_elm of jquery_elm) {
        if($(dom_elm).prop('checked')) {
            selected += 1    
        }
    }
    return selected
}

var last_number = 0

selecting_level = false
intentionaly_opened = false
var sign = false
$(() => {
    
    $("button.change_method").click(() => {
        sign = !sign
        if (sign) {
            $(".signing_up").hide()
            $(".signing_in").show()
        } else {
            $(".signing_in").hide()
            $(".signing_up").show()
        }
    })
        
    $('.select .header').click(function() {
        if (selecting_level) {
            $('.select').animate({height: ($('.header').height() + 23)}, 250)
            $('.select .selecting_level').fadeOut(150)
            $('.select .button').fadeOut(150)
            intentionaly_opened = false
        }else {
            intentionaly_opened = true
            $('.select .selecting_level').fadeIn(400)
            if (numb_selected($('input[type=checkbox]')) > 0) {
                $('.select .button').fadeIn(400)
                $('.select').animate({height: '+=' + ($('.selecting_level').outerHeight() + $('.button').outerHeight() + 15)}, 200)
            } else {
                $('.select').animate({height: '+=' + ($('.selecting_level').outerHeight())}, 200)   
            }
        }
        selecting_level = !selecting_level
    })
    
    $('input[type=checkbox]').click(function () {
        var selected = numb_selected($('input[type=checkbox]'))
        if(selected > 0) {
            if (selected == 1 && last_number == 0) {
                $('.select .button').fadeIn(400) 
                $('.select').animate({height: '+=' + ($('.button').outerHeight() + 15)}, 200)   
            }
        } else {
            $('.select').animate({height: '-=' + ($('.button').outerHeight()  + 15)}, 200)
            $('.select .button').fadeOut(150)
        }
        last_number = selected
    })
    
    $('.button').click(function(evt) {
        var levels = {}
        for (var checkbox of $('input[type=checkbox]:checked')) {
            levels[$(checkbox).val()] = false
        }
        // var select = $(evt.target)
        // var option = select.val()

        // if (option == 'login') {
            // $('.login').show()
        // } else {

        var loader = $('<div class="loading_cover"><div class="loader"></div></div>')
        $('body').append(loader);
        for (var current_level of Object.keys(levels)) {
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
                    levels[requested_level] = true
                    if (Object.keys(levels).reduce(function(partial, key) { return partial && levels[key]}, true)) {
                        localStorage['levels'] = JSON.stringify(Object.keys(levels).map(l => parseInt(l)))
                        window.location.replace("index.html")  
                    }
                },
                error: function (xhr, status, errorThrown) {
                    loader.remove();
                    errors = true;
                    alert("Sorry! There was an error downloading the exercises. Can you try again?")
                }
            });
        } 
            
            // $('.login').hide()
        // }
    })

    $('input').on("keydown", function(evt) {
        if(evt.which === 13) {
            login()
        }
    })  
    
    $('button.signup').click(login)
})

function login() {
    email = $('#email').val();
    pass = $('#pass').val();
    errors = false;

    $('#error_email').empty();
    $('#error_pass').empty();

    if (!valid_email(email)) {
        errors = true;
        $('#error_email').text('Invalid email');
    }

    if (pass.length < 6) {
        errors = true;
        $('#error_pass').text('Password should have 6 characters minimum');
    }

    if (!errors) {
        var loader = $('<div class="loading_cover"><div class="loader"></div></div>')
        $('body').append(loader);
        $.ajax({
            type: "POST",
            url: "api/users.php",
            dataType: "json",
            data: {'email': email, 'pass': pass, 'sign': 'in'},
            success: function (user_status) {
                if (!user_status.succesfully) {
                    errors = true;
                    if (!user_status.existing_email) {
                        $('#error_email').text('Email does not exist');
                    }
                    if (user_status.invalid_email) {
                        $('#error_email').text('Invalid email');
                    }
                    if (user_status.invalid_pass) {
                        $('#error_pass').text('Not matching password');
                    }
                    loader.remove();
                } else {
                    var user_levels = JSON.parse(user_status.level)

                    var levels = {}
                    for (var user_level of user_levels) {
                        levels[user_level] = false
                    }
                    for (var current_level of Object.keys(levels)) {
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
                                levels[requested_level] = true
                                if (Object.keys(levels).reduce(function(partial, key) { return partial && levels[key]}, true)) {
                                    localStorage['levels'] = JSON.stringify(Object.keys(levels).map(l => parseInt(l)))
                                    localStorage['email'] = email;
                                    localStorage['pass'] = pass;
                                    mdb.after_sync = error => {
                                        if (error) {
                                            loader.remove();
                                            errors = true;
                                            alert("Sorry! There was an error with your exercises. Can you try again?")
                                        } else {
                                            window.location.replace("index.html");
                                        }
                                    };
                                    mdb.sync();   
                                }
                            },
                            error: function (xhr, status, errorThrown) {
                                loader.remove();
                                errors = true;
                                alert("Sorry! There was an error downloading the exercises. Can you try again?")
                            }
                        });
                    } 
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

function valid_email(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}