var pleh = {
	active: true,
	create_help: function create_help(message) {
		var modal = $('<div/>', {'class': 'pleh'})
		var text = $('<p/>').text(message)
		return modal.append(text)	
	},
	add_help: function add_help(message, source_element, position) {
		// inside - left center right top center bottom
		// outside - below above left center right

		var help_modal = pleh.create_help(message)
		var position_source = source_element.position()
		help_modal.css('display', 'none')
		$('body').click(function() {
			help_modal.fadeOut(100, function() {
				help_modal.detach()
	  		});
		}).append(help_modal)

		var modal_height = help_modal.height()
		
		var vertical_correction = 0
		var horizontal_correction = 0

		if (position) {
			var position_array = position.split('-')
			
			var vertical_position = position_array[0]

			separation = 20

			switch (vertical_position) {
				case 'above':
					vertical_correction = -separation - modal_height
					break
				case 'top':
					vertical_correction = separation
					break
				case 'bottom':
					vertical_correction = source_element.height() - modal_height - separation 
					break
				default: // below
					vertical_correction = source_element.height() + separation
			}
			
			if(position_array.length > 1 && position_array[1] == 'right') {
				horizontal_correction = -help_modal.width() + source_element.width()
			}
		}

		help_modal
			.css('top', (position_source.top + vertical_correction) + 'px')
			.css('left', (position_source.left + horizontal_correction) + 'px')
			.fadeIn(100)
	},
	help: function(names_help) {
		if (typeof names_help == 'string') {
			names_help = [names_help]
		}
		for (name_help of names_help) {
			var help_info = pleh.messages[name_help]
			if(!help_info.showed) {
				pleh.add_help(help_info.text, $(help_info.el), help_info.position ? help_info.position: 'below')
				help_info.showed = true
			}	
		}
	},
	messages: {}
}