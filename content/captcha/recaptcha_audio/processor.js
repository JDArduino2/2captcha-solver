CaptchaProcessors.register({

    captchaType: "recaptcha_audio",

    canBeProcessed: function(widget, config) {
        if (!config.enabledForRecaptchaAudio) return false;

        const binded = this.getBindedElements(widget);
        return !(!binded.button && !binded.textarea);
    },

    attachButton: function(widget, config, button) {
        if (config.autoSolveRecaptchaAudio) {
            button.click();
        }
    },

    onSolved: function(widget, answer) {
        let input = document.getElementById(widget.inputId);

        input.value = answer;

        input.dispatchEvent(new Event('input', {
            bubbles: true,
            data: answer,
        }));
    },

    getForm: function(widget) {
        const binded = this.getBindedElements(widget);

        if (binded.textarea) {
            return binded.textarea.closest("form");
        }

        return binded.button.closest("form");
    },

    getCallback: function(widget) {
        return widget.callback;
    },

    getParams: async function(widget, config) {
        let params = {
            body: widget.audio,
            lang: widget.lang
        };

        return params;
    },

    getBindedElements: function(widget) {
        const elements = {
            button: null,
            textarea: null,
        };

        if (widget.bindedButtonId) {
            let button = $("#" + widget.bindedButtonId);
            if (button.length) elements.button = button;
        } else {
            let textarea = $("#" + widget.containerId + " textarea[name=g-recaptcha-response]");
            if (textarea.length) elements.textarea = textarea;
        }

        return elements;
    },
});