
(function() {
    var app = new Vue({
        el: '#overlay-app',
        data: {
            step: 0,
            overlays: OVERLAY_DATA,
            overlayName: '',
            overlayText: {
                text1: 'example',
                text2: 'example',
                text3: 'example',
                text4: ''
            },
            selectedOverlay: null,
            selectOverlayError: false,
            overlayNameError: false,
            overlayContentError: false
        },
        computed: {
        	overlayTextFilled: function() {
        		return this.overlayText.text1 && this.overlayText.text2 && this.overlayText.text3 && this.overlayText.text4;
        	}
        },
        mounted: function() {
        	var vm = this;
        	window.addEventListener('click', function(e) {
        		if (tinymce.editors.length > 0 && !document.querySelector('.tox').contains(e.target)) {
        			vm.removeAllEditors();
        		}
        	}, false);
        },
        methods: {
            selectOverlay: function(overlay) {
                this.selectedOverlay = overlay;
                this.step = 1;
                this.selectOverlayError = false;
            },
            changeText: function(ref) {
                var vm = this;
                if ((this.step === 2 || this.step === 3) && this.$refs[ref]) {
                	vm.removeAllEditors();
                    var tiny = tinymce.init({
                        target: this.$refs[ref],
                        menubar: false,
                        setup: function(ed) {
                            ed.on('change', function(e) {
                                vm.overlayText[ref] = ed.getContent();

                                if(vm.overlayTextFilled) {
                                	vm.step = 3;
                                	vm.overlayContentError = false;
                                } else {
                                	vm.step = 2;
                                }
                            });
                            ed.on('blur', function(e) {

                            });
                        }
                    });
                }

            },
            removeAllEditors: function() {
            	if (tinymce.editors.length > 0) {
            	    for (i = 0; i < tinymce.editors.length; i++) {
            	        tinyMCE.editors[i].remove();
            	    }
            	}
            },
            back: function() {
                this.step--;
                if (this.step === 0) {
                    this.selectedOverlay = null;
                }
                if(this.step === 2) {
                	this.overlayText ={
		                text1: 'example',
		                text2: 'example',
		                text3: 'example',
		                text4: ''
		            };
                }
            },
            nextStep: function() {
                if (this.step === 0 || this.step === 1) {
                    if (this.selectedOverlay) {
                        if (this.overlayName) {
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
                } else if (this.step === 2 || this.step === 3) {	
                    if(this.overlayTextFilled) {
 						this.step++;
 						this.overlayContentError = false;
                    } else {
                    	this.overlayContentError = true;
                    }
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