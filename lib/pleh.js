var pleh = {
	active: true,
	_create_help: function create_help(message) {
		var modal = $('<div/>', {'class': 'pleh'})
		var text = $('<p/>').text(message)
		var dismiss = $('<p/>', {'class': 'dismiss'}).text('Click to dismiss')
		return modal.append(text, dismiss)	
	},
	add_help: function add_help(message, source_element, position_options, next) {
		//	 position_options = {
		//		vertical: above, top (default), center, bottom or below
		//		horizontal: left (default), center, or right
		//	}

		var help_modal = pleh._create_help(message)

		
		source_element.click(function() {
			help_modal.fadeOut(100, function() {
				help_modal.detach()
				if (next) {
					pleh.help(next)
				}
	  		});
		})
		$('body').append(
			help_modal.click(function() {
				help_modal.fadeOut(100, function() {
					help_modal.detach()
					if (next) {
						pleh.help(next)
					}
		  		});
			})
		)

		var modal_height = help_modal.height()
		
		help_modal.css('display', 'none')

		var vertical_correction = 0
		var horizontal_correction = 0

		if (position_options) {
			var vertical_position = position_options.vertical
			var horizontal_position = position_options.horizontal

			
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
	},
	reset: function() {
		for (var message_name in messages) {
			messages[message_name].showed = false
			if (localStorage['pleh|' + message_name]) {
				delete localStorage['pleh|' + message_name]
			}
		}
	}
	help: function(name_help) {
		if (pleh.active && !localStorage['pleh|' + name_help]) {
			var help_info = pleh.messages[name_help]
			if(!help_info.showed) {
				pleh.add_help(
					help_info.text,
					$(help_info.el), 
					help_info.position, 
					help_info.next
				)
				help_info.showed = true
				localStorage['pleh|' + name_help] = 'done'
			}
		}
	},
	messages: {}
}