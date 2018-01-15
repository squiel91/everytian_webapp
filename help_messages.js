var help_messages = {
	// General
	checkProgress: {
		message: 'Click on the bottom left to check your progress in real time.',
		fixed: true,
		container: '.exercise_container',
		el: '#progress',
		position: {
			vertical: 'above',
			horizontal: 'left'
		},
		next: 'checkSettings'
	},
	checkSettings: {
		message: 'Click on the bottom right to mannage your settings and secure your progress.',
		fixed: true,
		container: '.exercise_container',
		el: '#settings',
		position: {
			vertical: 'above',
			horizontal: 'right'
		}
	},
	// Words
	markWord: {
		message: 'Click on the word you are not sure about. Try it!',
		container: '.exercise_container',
		el: '.container_body',
		position: {
			vertical: 'center',
			horizontal: 'center'
		},
		next: 'checkProgress'
	},
	unmarkWord: {
		message: 'Unmark a word you already feel familiar with.',
		el: ''
	},
	// Exercises
	// MO
	MoChooseOption: {
		message: 'Choose the correct answer. Or try at least :)',
		container: '.exercise_container',
		el: '.option_container:first',
		position: {
			vertical: 'center',
			horizontal: 'right'
		},
		next: 'check'
	},
	check: {
		message: 'Whenever you are ready press "CHECK".',
		container: '.exercise_container',
		fixed: true,
		el: '#practice',
		position: {
			vertical: 'above',
			horizontal: 'center'
		}
	},
	audio: {
		message: 'Click on play to listen to the audio.',
		container: '.exercise_container',
		el: '.audio:first',
		position: {
			vertical: 'below',
			horizontal: 'center'
		},
		next: 'audio_limited'
	},
	audio_limited: {
		message: 'You have limited reproductions so listen carefully!',
		container: '.exercise_container',
		el: '.audio:first',
		position: {
			vertical: 'below',
			horizontal: 'center'
		},
		next: 'MoChooseOption'
	},
	transcript: {
		message: 'This is the transcript of the audio you just listened.',
		container: '.exercise_container',
		el: '.container_body',
		position: {
			vertical: 'center',
			horizontal: 'center'
		},
		next: 'markWord'
	},
	// Right order
	rightOrder: {
		message: 'Drag the fragments in order to make sense.',
		container: '.exercise_container',
		el: '#segments_panel',
		container: '',
		position: {
			vertical: 'center',
			horizontal: 'center'
		}
	},
	// Embeded
	embeded: {
		message: 'Choose the correct option form the drop down.',
		container: '.exercise_container',
		el: '.container_body',
		position: {
			vertical: 'top',
			horizontal: 'center'
		}
	}
}