(function() {

    var configs = {
        4: {
            "text1": {
                "max_length": 20, // символов
                "font": "Roboto Slab",
                "max_size": 20, //в пикселях
                "min_size": 15,
                "min_length": 8
            },
            "text2": {
                "max_length": 20, // символов
                "font": "Roboto Slab",
                "max_size": 20, //в пикселях
                "min_size": 15,
                "min_length": 8
            }
        },
        5: {
            "text1": {
                "max_length": 40, // символов
                "font": "Roboto Slab",
                "max_size": 18, //в пикселях
                "min_size": 10,
                "min_length": 8
            },
            "text2": {
                "max_length": 40, // символов
                "font": "Roboto Slab",
                "max_size": 20, //в пикселях
                "min_size": 15,
                "min_length": 8
            },
            "text3": {
                "max_length": 40, // символов
                "font": "Roboto Slab",
                "max_size": 20, //в пикселях
                "min_size": 15,
                "min_length": 8
            },
            "text4": {
                "max_length": 40, // символов
                "font": "Roboto Slab",
                "max_size": 20, //в пикселях
                "min_size": 15,
                "min_length": 8
            }
        },
    };

    function set_style(field, text = "", id) {
        text = strip_html_tags(text);

        var current_config = configs[id][field];
        var id = tinymce.activeEditor.id;
        var editor = tinyMCE.get(id);
        var node = editor.selection.getNode();
        //тут нужно установить основную часть стилей
        //стартовый размер шрифта и подключить нужный шрифт
        //но лучше это делать в init, код это позволяет 

        var min_length = current_config["min_length"];
        var fontSize = editor.dom.getStyle(node, 'font-size', true);
        fontSize = fontSize.replace("/px/i", '');
        fontSize = parseInt(fontSize);

        if (text.length > min_length) { // в min_length должено добавляться 1-3 символа на каждую итткрацию уменьшения шрифта, а так же сделать ограничение по максимальному значению символов
            if (fontSize > current_config["min_size"]) {
                fontSize = fontSize - 1; 
                fontSize = fontSize + "px";
                editor.dom.setStyle(node, 'font-size', fontSize);
            }
        }

    }

    function strip_html_tags(str) {
        if ((str === null) || (str === '')) {
            return false;
        } else {
            str = str.toString();
            return str.replace(/<[^>]*>/g, '');
        }
    }

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
        inserted: function(element, b, vnode) {
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
            overlayName: 'Overlay_' + (new Date()).toLocaleDateString() + '_' + (new Date()).toLocaleTimeString(),
            overlayText: {
                text1: '',
                text2: '',
                text3: '',
                text4: '',
                text5: ''
            },
            ruleModel: { content: '', condition: '', subject: '', amount: '-' },
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
                        max_chars: "10",
                        // fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
                        images_upload_url: 'postAcceptor.php',
                        toolbar: " undo redo | code | forecolor | backcolor | sizeselect | bold italic | fontselect |  customInsertButton | alignleft aligncenter alignright | removeformat | link | image ",
                        setup: function(ed) {
                            // ed.on('change', function(e) {
                            //     vm.overlayText[ref] = ed.getContent();

                            //     if (vm.overlayTextFilled) {
                            //         vm.step = 3;
                            //         vm.overlayContentError = false;
                            //     } else {
                            //         vm.step = 2;
                            //     }
                            // });
                            // ed.on('keydown', function(e) {
                            //    var current_config = configs[vm.selectedOverlay.id][ref];
                            //    var text = strip_html_tags( ed.getContent());
                            //    if(text.length >= current_config.max_length && e.keyCode !== 8) {
                            //        return false;
                            //    }
                            // });
                            
                            ed.on('keyup', function(e) {

                                set_style(ref, ed.getContent(), vm.selectedOverlay.id);

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
                                onAction: function(_) {
                                    var size = 32;

                                    var editor = ed;
                                    var node = editor.selection.getNode();
                                    var fontSize = editor.dom.getStyle(node, 'font-size', true);
                                    var length = $(ed.getBody()).text().length;
                                    var newSize = (length > 1) ? (size * ((100 - length) / 100) + "px") : (size + 'px');

                                    editor.dom.setStyle(node, 'font-size', newSize);

                                    vm.removeAllEditors();
                                }
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
                var file = event.target;
                var reader = new FileReader();

                reader.onloadend = function() {
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