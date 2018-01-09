const vue_select_options = {
  props: ['options'],
  computed: {
  	list_options: function() {
    	return (this.options.length > 1? ['All levels' ] : []).concat(this.options)
    },
    chosen_value: function() {
    	return this.list_options[this.chosen_index]
    }
  },
  methods: {
  	choose: function(index) {
    	this.chosen_index = index;
      this.is_hidden = true
    },
    close: function() {
        this.is_hidden = true
    }
  },
  data: function() {
    	return {
      	    is_hidden: true,
            chosen_index: 0,
            chosen_val: 'all'
      }
  },
  template: `
    <div class="vue_select">
      <div class="vue_header" ref="chosen_el" @click="is_hidden = !is_hidden">{{ chosen_value }}</div>
      <transition name="flip">
          <div ref="options_el" class="vue_options" @click="close()" v-if="!is_hidden">
                <div class="options_cell">
                    <div class="options_container">
                        <div class="options_card" @click.stop="">
                            <div class="vue_option" v-for="option, i in list_options" @click="choose(i)">
                                <label class="radio" :class="{checked: i == chosen_index}"></label>
                                <span>{{ option }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
  	</div>`,
    watch: {
    	chosen_value: function(new_value) {
    	    this.chosen_val = new_value == 'All levels'? 'all' : new_value.split(' ')[1]
    	    evolution(this.chosen_val)
      }
    }
};

const VueSelect = Vue.extend(vue_select_options);

const Select = Vue.extend({
  props: ['id', 'options', 'in_correction'],
  methods: {
  	choose: function(index) {
  	    if (!this.in_correction) {
            this.chosen_index = index;
            this.is_hidden = true
  	    }
    },
    close: function() {
        this.is_hidden = true
    }
  },
  created: function() {
        this.options.splice(4)
        char_limit = 40
        trimming_index = 1
        for (var k = 0; k < this.options.length; k++) {
            char_limit -= this.options[k].replace(/·/g, '').length
            if (k > 0 && char_limit < 0) {
                trimming_index = k
                break
            }
        }
        this.options.splice(k)
        var correct_value = this.options.shift();
        var shuffled_incorrect_options = _.shuffle(this.options)
        this.correct_index = _.random(0, shuffled_incorrect_options.length)
        shuffled_incorrect_options.splice(this.correct_index, 0, correct_value)
        this.options = shuffled_incorrect_options
  },
  mounted: function() {
      for (var i = 0; i < this.options.length; i++) {
          $(this.$refs.option_index[i]).append(prompt_words(this.options[i]))
      }
  },
  data: function() {
    	return {
      	    is_hidden: true,
            chosen_index: undefined,
            correct_index: 0
      }
  },
  computed: {
      chosen_value: function() {
          if (this.chosen_index === undefined) {
              return '______'
          }
          return this.options[this.chosen_index].replace(/·/g, '')
      }
  },
  template: `
    <div class="select">
      <div class="select_header" :class="{correct:  in_correction && chosen_index == correct_index, incorrect:  in_correction && chosen_index != correct_index}" ref="chosen_el" @click="is_hidden = !is_hidden">{{ chosen_value }}</div>
      <transition name="flip">
          <div ref="options_el" class="vue_options" @click="close()" v-show="!is_hidden">
                <div class="options_cell">
                    <div class="options_container">
                        <div ref="options" class="options_card" @click.stop="">
                            <div class="vue_option" v-for="option, i in options">
                                <table class="with_options">
	                                <tr>
		                                <td class="with_input">
                                            <label class="radio" @click="choose(i)" :class="{
                                                checked: !in_correction && i == chosen_index, 
                                                correct: in_correction && correct_index == i && chosen_index == correct_index, 
                                                incorrect: in_correction && chosen_index == i && chosen_index != correct_index, 
                                                this_response: in_correction && correct_index == i && chosen_index != correct_index
                                            }"></label>
                                        </td>
                                        <td>
                                            <span ref="option_index"></span>
                                            <span class="mark_correct" v-if="in_correction && correct_index == i && chosen_index == correct_index">correct!</span>
                                            <span class="mark_incorrect" v-if="in_correction && chosen_index == i && chosen_index != correct_index">wrong!</span>
                                            <span class="mark_neutral" v-if="in_correction && correct_index == i && chosen_index != correct_index">was this one</span>
                                    	</td>
	                                </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
  	</div>`
});

// const select = new VueSelect({
//   propsData: {
//     options: ['HSK 4', 'HSK 5']
//   }
// }).$mount('#select_level');