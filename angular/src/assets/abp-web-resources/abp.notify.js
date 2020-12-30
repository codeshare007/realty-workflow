var abp = abp || {};
(function () {

    /* DEFAULTS *************************************************/

    var defaultOptions = {
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        padding: 0,
        toast: true,
        animation: false
    };

    /* NOTIFICATION *********************************************/

    var showNotification = function (type, message, title, options) {
        var icon = options.imageClass ? '<i class="mr-2 text-white ' + options.imageClass + '"></i>' : '';

        if (title) {
            options.title = icon + '<span class="text-white">' + title + '</span>';
        }

        options.html = (title ? '' : icon) + '<span class="text-white">' + message + '</span>';
        var combinedOptions = Object.assign({}, defaultOptions, options);
        Swal.fire(combinedOptions);
    };

    abp.notify.success = function (message, title, options) {
        showNotification('success', message, title,
            Object.assign({
                background: '#34bfa3',
                imageClass: 'fa fa-check-circle'
            }, options));
    };

    abp.notify.info = function (message, title, options) {
        showNotification('info', message, title, Object.assign({
            background: '#36a3f7',
            imageClass: 'fa fa-info-circle'
        }, options));
    };

    abp.notify.warn = function (message, title, options) {
        showNotification('warning', message, title, Object.assign({
            background: '#ffb822',
            imageClass: 'fa fa-exclamation-triangle'
        }, options));
    };

    abp.notify.error = function (message, title, options) {
        showNotification('error', message, title, Object.assign({
            background: '#f4516c',
            imageClass: 'fa fa-exclamation-circle'
        }, options));
    };

})();
