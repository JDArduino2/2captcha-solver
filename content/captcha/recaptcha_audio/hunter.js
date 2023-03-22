(() => {

    setInterval(function () {
        if (window.___grecaptcha_cfg === undefined) return;
        if (___grecaptcha_cfg.clients === undefined) return;

        for (let widgetId in ___grecaptcha_cfg.clients) {
            let widget = ___grecaptcha_cfg.clients[widgetId];

            if (isCaptchaWidgetRegistered("recaptcha", widget.id)) continue;

            let widgetInfo = getRecaptchaWidgetInfo(widget);

            registerCaptchaWidget(widgetInfo);
        }
    }, 2000);

    let getRecaptchaWidgetInfo = function (widget) {

    };

})()