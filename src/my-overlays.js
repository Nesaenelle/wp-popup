(function() {
    var app = new Vue({
        el: '#my-overlays-app',
        data: {
            overlays: OVERLAY_DATA,
            newOverlay: true,
            showModal: false,
            modalData: null
        },
        computed: {

        },
        mounted: function() {
            var vm = this;
            window.addEventListener('click', function(e) {
                if (vm.showModal && !vm.$refs['modal'].contains(e.target)) {
                   vm.showModal = false;
                }
            }, false);
        },
        methods: {
            closeModal: function() {
                this.showModal = false;
            },
            openModal: function(overlay) {
                this.showModal = true;
                this.modalData = overlay;
            },
            removeOverlay: function(overlay, index) {
                this.overlays.splice(index, 1);
            }
        }
    })
})();