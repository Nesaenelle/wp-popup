(function() {

    Vue.directive('number', {
        inserted: function(el) {
            var input = el.querySelector('input');
            var initValue = input.getAttribute('init-value');
            var maxValue = parseInt(input.getAttribute('max-value'));
            var prefix = input.getAttribute('prefix') || '';
            var upArrow = document.createElement('div');
            var downArrow = document.createElement('div');

            upArrow.classList.add('wp-popup__number-input--up');
            downArrow.classList.add('wp-popup__number-input--down');

            input.setAttribute('readonly', true);
            input.value = initValue + prefix;

            el.appendChild(upArrow);
            el.appendChild(downArrow);

            upArrow.addEventListener('click', function() {
                var curValue = parseInt(input.value)
                if (curValue < maxValue) {
                    input.value = parseInt(input.value) + 1 + prefix;
                }

            }, false);
            downArrow.addEventListener('click', function() {
                var curValue = parseInt(input.value)
                if (curValue > 0) {
                    input.value = parseInt(input.value) - 1 + prefix;
                }
            }, false);
        }
    });

    Vue.directive('dropdown', {
        inserted: function(el,b,vnode){
            var model = b.expression.split('.');
            var valueEl = el.querySelector('.wp-popup__dropdown__value');
            var listEl = el.querySelector('.wp-popup__dropdown__list');
            var listItems = el.querySelectorAll('.wp-popup__dropdown__list--item');
            var initValue = listItems[0].getAttribute('data-id');
     
            vnode.context[model[0]][model[1]] = initValue;

            valueEl.addEventListener('click', function(e) {
                e.stopPropagation();
                listEl.classList.add('opened');
            }, false);

            listItems.forEach(function(el) {
               el.addEventListener('click', function(e) {
                   var val = el.getAttribute('data-id');
                   listEl.classList.remove('opened');
                   vnode.context[model[0]][model[1]] = val;
               }, false);    
            });

            window.addEventListener('click', function(e) {
                if (!listEl.contains(e.target)) {
                    listEl.classList.remove('opened');
                }
            }, false);
        }
    });

    var app = new Vue({
        el: '#overlay-app',
        data: {
            step: 0,
            overlays: OVERLAY_DATA,
            rules: RULES_DATA,
            subjects: SUBJECT_DATA,
            conditions: CONDITION_DATA,
            overlayName: '',
            overlayText: {
                text1: '',
                text2: '',
                text3: '',
                text4: ''
            },
            ruleModel: {content: '', condition: '', subject: '', amount: '-'},
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

                                if (vm.overlayTextFilled) {
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
                if (this.step === 2) {
                    this.overlayText = {
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
                    if (this.overlayTextFilled) {
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
            removeRule: function(rule, index) {
                this.rules.splice(index, 1);
            },
            addRule: function() {
                this.rules.push({
                    title: 'Rule #' + (this.rules.length + 1), 
                    condition: this.ruleModel.condition, 
                    content: this.ruleModel.content, 
                    subject: this.ruleModel.subject,
                    amount: this.ruleModel.amount
                });
            },
            clearAllRules: function() {
                this.rules = [];
            },
            done: function() {

            }
        }
    });

})();