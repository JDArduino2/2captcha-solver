CaptchaProcessors.register({

    captchaType: "recaptcha_audio",

    canBeProcessed: function(widget, config) {
        if (!config.enabledForRecaptchaAudio) return false;

        if (!widget.body) return false;

        return true;
    },

    attachButton: function(widget, config, button) {
        let input = $("#" + widget.containerId).closest('body');
        input.after(button);

        if (config.autoSolveRecaptchaAudio) {
            button.click();
        }
    },

    onSolved: function(widget, answer) {
        this.inputAnswer(answer).then();
    },

    inputAnswer: async function(answer) {
        const input = document.querySelector('#audio-response');
        input.value = answer;
        input.dispatchEvent(new Event('input', {
            bubbles: true,
            data: answer,
        }));
        await this.delay(100);

        const submitButton = document.querySelector('#recaptcha-verify-button');
        submitButton.click();
    },

    getForm: function(widget) {
        const container = document.getElementById(widget.containerId);
        return container.closest("form");
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

    delay: function (timeout) {
        return new Promise(resolve => window.setTimeout(resolve, timeout));
    }
});