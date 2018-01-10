var help_messages = {
	// General
	checkProgress: {
		text: 'You can press here to check your progress in real time',
		el: '#progress',
		position: {
			vertical: 'above',
			horizontal: 'left'
		},
		next: 'checkSettings'
	},
	checkSettings: {
		text: 'You can press here to mannage your settings.',
		el: '#settings',
		position: {
			vertical: 'above',
			horizontal: 'right'
		}
	},
	// Words
	markWord: {
		text: 'Touch a word you are not sure about...',
		el: '.container_body',
		position: {
			vertical: 'bottom',
			horizontal: 'center'
		},
		next: 'checkProgress'
	},
	unmarkWord: {
		text: 'Unmark a word you already feel familiar with.',
		el: ''
	},
	// Exercises
	// MO
	MoChooseOption: {
		text: 'Choose the correct answer. Or try at least :)',
		el: '.container_MO:first',
		position: {
			vertical: 'center',
			horizontal: 'right'
		},
		next: 'check'
	},
	check: {
		text: 'When you are ready press "CHECK".',
		el: '#practice',
		position: {
			vertical: 'above',
			horizontal: 'center'
		}
	},
	audio: {
		text: 'Listen to the audio.',
		el: '.audio:first',
		position: {
			vertical: 'below',
			horizontal: 'center'
		},
		next: 'audio_limited'
	},
	audio_limited: {
		text: 'You have limited times to listen it so use them carefully!',
		el: '.audio:first',
		position: {
			vertical: 'below',
			horizontal: 'center'
		},
		next: 'MoChooseOption'
	},
	transcript: {
		text: 'This is the transcript of the audio you just listened',
		el: '.container_body',
		position: {
			vertical: 'center',
			horizontal: 'center'
		},
		next: 'markWord'
	},
	// Right order
	rightOrder: {
		text: 'Arrange the fragments in order to make sense.',
		el: '#segments_panel',
		position: {
			vertical: 'top',
			horizontal: 'right'
		}
	},
	// Embeded
	embeded: {
		text: 'Choose the correct option form the drop down.',
		el: '.container_body',
		position: {
			vertical: 'top',
			horizontal: 'center'
		}
	}
}