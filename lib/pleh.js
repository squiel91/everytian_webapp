var pleh = {
	active: true, // false to disable help
	_create_help: function create_help(message) {
		var modal = $('<div/>', {'class': 'pleh'})
		var text = $('<p/>').text(message)
		var dismiss = $('<p/>', {'class': 'dismiss'}).text('Click to dismiss')
		return modal.append(text, dismiss)	
	},
	reset: function() { // run to reset all messages (all messages will be shown one more time)
		for (var message_name in this.messages) {
			this.messages[message_name].showed = false
			if (localStorage['pleh|' + message_name]) {
				delete localStorage['pleh|' + message_name]
			}
		}
	},
	all_showed() {
		for (var message_name in this.messages) {
			if (!this.messages[message_name].showed 
				|| localStorage['pleh|' + message_name] !=  'true') {
				return false
			}
		}
		return true
	},
	help: function(options) {
		/*	
			if it is a string it looks for the help options on the messages attributes.
			Otherwise a dictionary must be provided with the following attributes:
				*message: text to be displayed in the message 
				*el: string selector where the message is going to be pointing at
				name: in case you only want the message to be displayed only once (default none)
				container: string selector where the message will be attatched (default: body)
				position: {
					vertical: above, top (default), center, bottom or below
					horizontal: left (default), center, or right
				}
				next: next help to be displayed (either a string or object) (default: none)
		
			* = mandatory
		*/

		var name = undefined
		if (typeof options == 'string') {
			name = options 
			options = pleh.messages[name]
		} else if (options.name) {
			name = options.name
		}

		if (pleh.active 
			&& !options.showed
			&& (!name || (localStorage['pleh|' + name] != 'true'))) {

			var help_modal = pleh._create_help(options.message)

			function fadeOut(evt) {
				evt.data.modal.fadeOut(100, function() {
					evt.data.modal.detach()
					if (evt.data.next) {
						pleh.help(evt.data.next)
					}
		  		})
		  	}

			var source_element = $(options.el).click({modal: help_modal, next: options.next}, fadeOut)

			$(options.container || 'body').append(
				help_modal.click({modal: help_modal, next: options.next}, fadeOut)
			)

			var modal_height = help_modal.height()
			
			help_modal.css('display', 'none')

			if (options.fixed) help_modal.css('position', 'fixed') 

			var vertical_correction = 0
			var horizontal_correction = 0

			if (options.position) {
				var vertical_position = options.position.vertical
				var horizontal_position = options.position.horizontal
				
				separation = 0

				switch (vertical_position) {
					case 'above':
						vertical_correction = -separation - modal_height
						break
					case 'center':
						vertical_correction = (source_element.height() / 2) - (modal_height / 2)
						break
					case 'bottom':
						vertical_correction = source_element.height() - modal_height - separation 
						break
					case 'below':
						vertical_correction = source_element.height() + separation

				}

				switch (horizontal_position) {
					case 'right':
						horizontal_correction = -help_modal.width() + source_element.width()
						break
					case 'center':
						horizontal_correction = (source_element.width() / 2) - (help_modal.width() / 2) 
				}
			}

			var position_source = source_element.position()

			help_modal
				.css('top', (position_source.top + vertical_correction) + 'px')
				.css('left', (position_source.left + horizontal_correction) + 'px')
				.fadeIn(100)

			if (name) {
				options.showed = true
				localStorage['pleh|' + name] = 'true'
			}
		}
	},
	messages: {}
}