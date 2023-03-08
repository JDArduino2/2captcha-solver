CaptchaProcessors.register({

    captchaType: "amazon_waf",

    canBeProcessed: function(widget, config) {
        if (!config.enabledForAmazonWaf) return false;

        if (!widget.sitekey) return false;

        return true;
    },

    attachButton: function(widget, config, button) {
        let helper = this.getHelper(widget);
        if (helper.find('.captcha-solver').length !== 0) {
            return;
        }

        button.css({
            width: helper.outerWidth() + "px"
        });

        button[0].dataset.disposable = true;

        helper.append(button);

        if (config.autoSolveAmazonWaf) button.click();
    },

    getParams: function(widget, config) {
        let params = {
            url: location.href,
            sitekey : widget.sitekey
        };

        return params;
    },

    onSolved: function(widget, answer) {
        let helper = this.getHelper(widget);
        helper.find("input[name=challenge.input]").val(answer);
    },

    getForm: function(widget) {
        return this.getHelper(widget).closest("form");
    },

    getCallback: function(widget) {
        return null;
    },

    getHelper: function(widget) {
        let container = $("#" + widget.inputId);
        return container.parent();
    },

});
