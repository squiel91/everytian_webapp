PRACTICE_DEFAULT_TEXT = 'PRACTICE'

class Docker {
	constructor () {
		this.tab_names = ['practice', 'progress', 'settings']
		this.current_tab = 'practice'
		this.action_stack = []
		this.text_stack = []
		this.router = router

		this.docker_el = $('#dockbar')
		this.practice_button_el = this.docker_el.find('#practice')
		this.progress_button_el = this.docker_el.find('#progress')
		this.settings_button_el = this.docker_el.find('#settings')

		var docker = this
		this.practice_button_el.click(() => docker.main_button('practice'))
		this.progress_button_el.click(() => docker.change('progress'))
		this.settings_button_el.click(() => docker.change('settings'))
	}

	change(tab_name) {
		if (this.tab_names.indexOf(tab_name) < 0) {
			console.log(`WARNING: ${tab_name} is not a valid tab name.`)
			return
		}

		if (this.current_tab != tab_name) {
			for (var iter_tab_name of this.tab_names) {
				if (iter_tab_name == tab_name) {
					this.docker_el.addClass(iter_tab_name)
				} else {
					this.docker_el.removeClass(iter_tab_name)
				}
			}
			switch (tab_name) {
				case 'practice':
					this.practice_button_el.find('p')
						.css('left', this.current_tab == 'settings'? '-20pt' : '20pt')
						.animate({'left': '0pt'}, 100)
					break
				case 'progress':
					evolution()
					this.practice_button_el.find('p').empty().append($('<img src="img/back_practice.svg" style=" width: 40pt; position: relative; bottom: 4pt; ">'))
					this.progress_button_el.find('p')
						.css('left', '40pt')
						.animate({'left': '45pt'}, 200)
					this.practice_button_el.find('p')
						.css('left', '-20pt')
						.animate({'left': '0pt'}, 100)
					break
				case 'settings':
					this.practice_button_el.find('p').empty().append($('<img src="img/back_practice.svg" style=" width: 40pt; position: relative; bottom: 4pt; ">'))
					this.settings_button_el.find('p')
						.css('right', '40pt')
						.animate({'right': '45pt'}, 200)
					this.practice_button_el.find('p')
						.css('left', '20pt')
						.animate({'left': '0pt'}, 100)

			}
			this.current_tab = tab_name
			this.router.change(`${tab_name}_tab`)
		}
	}

	action(button_text, button_action) {
		this.text_stack.push(button_text)
		if (typeof button_text == 'string') {
		    this.practice_button_el.find('p').text(button_text)	    
		} else {
		   this.practice_button_el.find('p').empty().append(button_text) 
		}
		this.action_stack.push(button_action)
	}

	main_button() {
		if (this.current_tab == 'practice') {
			if (this.action_stack.length > 0) {
				var to_run_action = this.action_stack.pop()
				this.text_stack.pop()
				if (this.text_stack.length > 0) {
				    let button_text = this.text_stack[this.text_stack.length - 1]
				    if (typeof button_text == 'string') {
            		    this.practice_button_el.find('p').text(button_text)	    
            		} else {
            		   this.practice_button_el.find('p').empty().append(button_text) 
            		}
				// 	this.practice_button_el.find('p')
				// 		.text(this.text_stack[this.text_stack.length - 1])
				} else {
					this.practice_button_el.find('p').text(PRACTICE_DEFAULT_TEXT)
				}
				to_run_action()
			}
		} else {
			if (this.text_stack.length > 0) {
			    let button_text = this.text_stack[this.text_stack.length - 1]
			    if (typeof button_text == 'string') {
        		    this.practice_button_el.find('p').text(button_text)	    
        		} else {
        		   this.practice_button_el.find('p').empty().append(button_text) 
        		}
			} else {
				this.practice_button_el.find('p').text(PRACTICE_DEFAULT_TEXT)
			}
			this.change('practice')
		}
	}

	mark_correct() {
		this.default()
		this.practice_button_el.addClass('right')
	}

	mark_incorrect() {
		this.default()
		this.practice_button_el.addClass('wrong')
	}

	mark_more_or_less() {
		this.default()
		this.practice_button_el.addClass('more_or_less')
	}

	default() {
		this.practice_button_el
			.removeClass('wrong')
			.removeClass('right')
			.removeClass('more_or_less')
	}
}

class Tab {
	constructor(name, router) {
		this.button_state_stack = []
		this.view_stack = []
		this.el = $('#' + name)
		this.current_view = null
		this.router = router
	}

	stack(new_view, base) {
		if (base) {
			this.view_stack = []
			this.el.empty()
		} else {
			this.view_stack.push(this.el.children().detach())
		}
		this.current_view = new_view
		this.el.append(new_view)
		var tab = this
		if (this.view_stack.length > 0) docker.action($('<img src="img/close.svg" style=" width: 25pt; position: relative; bottom: 5pt; ">'), function() {
			tab.unstack()
		})
			// this.router.back(true)
	}

	unstack () {
		this.current_view = this.view_stack.pop();
		// this.el.children().detach(); // here I should do a simple empty
		this.el.empty().append(this.current_view);
		if (this.view_stack.length == 0) this.router.back(false)
	}

	display(show) {
		if(show) {
			this.el.show()
		} else {
			this.el.hide()
		}
		if (this.view_stack.lenght > 0) this.router.back(true) 
		else this.router.back(false) 
	}
}

class Router {
	constructor(tab_names) {
		this.tabs = {}
		for (var tab_name of tab_names) {
			this.tabs[tab_name] = new Tab(tab_name, this)
		}

		this.back_el = $('#back').click(() => this.unstack()).hide();
		
		this.change(tab_names[0]);
	}

	change(tab_name) {
		if (this.current_tab) this.current_tab.display(false)
		this.current_tab = this.tabs[tab_name]
		this.current_tab.display(true)
	}

	back(show) {
		if(show) {
			this.back_el.show()
		} else {
			this.back_el.hide()
		}
	}

	on(tab_name) {
		return this.tabs[tab_name]
	}

	stack(new_view, base) {
		this.current_tab.stack(new_view, base)
	}

	unstack () {
		this.current_tab.unstack()
	}
}