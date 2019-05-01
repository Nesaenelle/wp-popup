// $(document).ready(function() {
//  var state = {
//      step: 0
//  };
//  var $progressbar = $('.wp-popup__progressbar');
//  var $selectedOverlay;
//  var $selectedText;
//  $('.wp-popup__overlays-list__item').on('click', function() {
//      $('.wp-popup__overlays-list__item').removeClass('selected');
//      $(this).addClass('selected');



//      if ($selectedText && $selectedText[0]) {
//          $selectedText.remove();
//      }

//      $selectedText = $('<div class="wp-popup__overlays-list__item--selected">\
//      	<svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11">\
//     <path fill="#FFF" fill-rule="evenodd" d="M14 2.2L5.386 11l-.002-.001V11L0 5.5l2.153-2.2 3.231 3.3L11.847 0z"/>\
// </svg>Selected</div>');
//      $(this).find('.wp-popup__overlays-list__item--image').append($selectedText);

//      $progressbar.attr('data-step', '1');

//      $selectedOverlay = $(this);
//  });
// });




(function() {
    var app = new Vue({
        el: '#overlay-app',
        data: {
            step: 0,
            overlays: OVERLAY_DATA,
            overlayName: '',
            selectedOverlay: null,
            selectOverlayError: false,
            overlayNameError: false
        },
        methods: {
            selectOverlay: function(overlay) {
                this.selectedOverlay = overlay;
                this.step = 1;
                this.selectOverlayError = false;
            },
            back: function() {
                this.step--;
                if (this.step === 0) {
                    this.selectedOverlay = null;
                }
            },
            nextStep: function() {
                if (this.step === 0 || this.step === 1) {
                    if (this.selectedOverlay) {
                    	if(this.overlayName) {
                    		this.step++;	
                    		this.overlayNameError = false;
                    	} else {
                    		this.overlayNameError = true;
                    		this.$refs['overlayName'].focus();
                    	}
                    	this.selectOverlayError = false;
                    } else {
                        this.selectOverlayError = true;
                    }
                } else if (this.step === 2) {
                    this.step++;
                } else if (this.step === 3) {
                	this.step++;
                } else if (this.step === 4) {
                	this.step++;
                } else if (this.step === 5) {
                	this.step++;
                }
            },
            done: function() {

            }
        }
    })
})();