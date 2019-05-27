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
        inserted: function(element,b,vnode){
            var model = b.expression.split('.');
            var valueEl = element.querySelector('.wp-popup__dropdown__value');
            var listEl = element.querySelector('.wp-popup__dropdown__list');
            var listItems = element.querySelectorAll('.wp-popup__dropdown__list--item');
            var initValue = listItems[0].getAttribute('data-id');
     
            vnode.context[model[0]][model[1]] = initValue;

            valueEl.addEventListener('click', function(e) {
                e.stopPropagation();
                element.classList.add('opened');
            }, false);

            listItems.forEach(function(elem) {
               elem.addEventListener('click', function(e) {
                   var val = elem.getAttribute('data-id');
                   element.classList.remove('opened');
                   vnode.context[model[0]][model[1]] = val;
               }, false);    
            });

            window.addEventListener('click', function(e) {
                if (!listEl.contains(e.target)) {
                    element.classList.remove('opened');
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
            overlayName: 'Overlay_' + (new Date()).toLocaleDateString() + '_' + (new Date()).toLocaleTimeString() ,
            overlayText: {
                text1: '',
                text2: '',
                text3: '',
                text4: '',
                text5: ''
            },
            ruleModel: {content: '', condition: '', subject: '', amount: '-'},
            selectedOverlay: null,
            selectOverlayError: false,
            // overlayNameError: false,
            overlayContentError: false
        },
        computed: {
            overlayTextFilled: function() {
                return this.overlayText.text1 && (this.overlayText.text2 || this.overlayText.text3 || this.overlayText.text4 || this.overlayText.text5);
            }
        },
        mounted: function() {
            // var vm = this;
            // window.addEventListener('click', function(e) {
            //     if (tinymce.editors.length > 0 ||
            //         (document.querySelector('.tox') && !document.querySelector('.tox').contains(e.target)) 
            //         // || 
            //         // (document.querySelector('.tox-menu') && !document.querySelector('.tox-menu').contains(e.target))
            //        ) {
            //         vm.removeAllEditors();
            //     }
            // }, false);
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
                        plugins: "image, link",
                        // fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                        images_upload_url: 'postAcceptor.php',
                        toolbar: " undo redo | code | forecolor | backcolor | sizeselect | bold italic | fontselect |  customInsertButton | alignleft aligncenter alignright | removeformat | link | image ",
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

                           ed.ui.registry.addButton('customInsertButton', {
                              text: 'Close',
                              onAction: function (_) {
                                // ed.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
                                vm.removeAllEditors();
                              }
                            });
                        }
                    });

                    var id= tinymce.activeEditor.id;
                    var editor = tinyMCE.get(id);
                    var node = editor.selection.getNode();
                    var fontSize = editor.dom.getStyle(node, 'font-size', true);
                    console.log(fontSize);
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
                        text1: '',
                        text2: '',
                        text3: '',
                        text4: '',
                        text5: ''
                    };
                }
            },
            nextStep: function() {
                if (this.step === 0 || this.step === 1) {
                    if (this.selectedOverlay) {
                        this.step++;
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

            },
            onLoadImage: function(event) {
                var vm = this;
                var file    = event.target;
                var reader  = new FileReader();

                reader.onloadend = function () {
                  vm.selectedOverlay.img = reader.result;
                  vm.selectedOverlay.mobImg = reader.result;
                }

                if (file) {
                  reader.readAsDataURL(file.files[0]);
                } else {
                  vm.selectedOverlay.img = "";
                  vm.selectedOverlay.mobImg = "";
                }
            },
            removeNotification: function(event) {
                event.target.parentNode.remove();
            }
        }
    });

})();