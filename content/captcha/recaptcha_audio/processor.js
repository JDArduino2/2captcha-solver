CaptchaProcessors.register({

    captchaType: "recaptcha_audio",

    canBeProcessed: function(widget, config) {
        if (!config.enabledForRecaptchaAudio) return false;

        let binded = this.getBindedElements(widget);

        return !(!binded.button && !binded.textarea);
    },

    attachButton: function(widget, config, button) {
        let binded = this.getBindedElements(widget);

        if (binded.textarea) {
            binded.textarea.parent().css({height: "auto"})
            binded.textarea.parent().after(button);
        } else {
            binded.button.after(button);
        }

        if (config.autoSolveRecaptchaAudio) {
            button.click();
        }
    },

    onSolved: function(widget, answer) {
        let textarea = this.getBindedElements(widget).textarea;

        if (!textarea) {
            textarea = this.getForm(widget).find("textarea[name=g-recaptcha-response]");
        }

        textarea.val(answer);
    },

    getForm: function(widget) {
        let binded = this.getBindedElements(widget);

        if (binded.textarea) {
            return binded.textarea.closest("form");
        }

        return binded.button.closest("form");
    },

    getCallback: function(widget) {
        return widget.callback;
    },

    getParams: function(widget, config) {
        let params = {
            sitekey: widget.sitekey,
            url: location.href,
        };

        return params;
    },

    getBindedElements: function(widget) {
        // let elements = {
        //     button: null,
        //     textarea: null,
        // };
        //
        // if (widget.bindedButtonId) {
        //     let button = $("#" + widget.bindedButtonId);
        //     if (button.length) elements.button = button;
        // } else {
        //     let textarea = $("#" + widget.containerId + " textarea[name=g-recaptcha-response]");
        //     if (textarea.length) elements.textarea = textarea;
        // }
        //
        // return elements;
    },

});