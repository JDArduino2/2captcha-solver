(() => {

    setInterval(function () {
        const helpButton = document.querySelector('#recaptcha-help-button');
        if (helpButton) {
            helpButton.remove();

            const helpButtonHolder = document.querySelector('.help-button-holder');
            if (!helpButtonHolder.id) {
                let widgetId = parseInt(Date.now() / 1000);
                helpButtonHolder.id = "help-button-holder-" + widgetId;

                solveWithAudio(widgetId).catch(console.error);
            }
        }

    }, 1000);

    const solveWithAudio = async function (widgetId) {
        const blocked = await isBlocked();
        if (blocked) return;

        const audioElement = await getAudioElement();
        const audioUrl = audioElement.src;
        const audioBody = await downloadAudio(audioUrl);
        addWidgetInfo(audioBody, widgetId);
    }

    const isBlocked = function (timeout = 0) {
        const selector = '.rc-doscaptcha-body';
        return new Promise(resolve => {
            setTimeout(function () {
                resolve(document.querySelector(selector));
            }, timeout)
        });
    }

    const getAudioElement = async function () {
        let audioElement = document.querySelector('audio#audio-source');
        if (!audioElement) {
            const audioButton = document.querySelector('#recaptcha-audio-button');
            audioButton.focus();
            await dispatchEnter(audioButton);
        }

        await simulateAudioInput(audioElement);
    }

    const simulateAudioInput = async function (audioElement) {
        const muteAudio = function () {
            audioElement.muted = true;
        };
        const unmuteAudio = function () {
            removeCallbacks();
            audioElement.muted = false;
        };

        audioElement.addEventListener('playing', muteAudio, {
            capture: true,
            once: true
        });
        audioElement.addEventListener('ended', unmuteAudio, {
            capture: true,
            once: true
        });

        const removeCallbacks = function () {
            window.clearTimeout(timeoutId);
            audioElement.removeEventListener('playing', muteAudio, {
                capture: true,
                once: true
            });
            audioElement.removeEventListener('ended', unmuteAudio, {
                capture: true,
                once: true
            });
        };

        const timeoutId = window.setTimeout(unmuteAudio, 10000);
        const playButton = document.querySelector(
            '.rc-audiochallenge-play-button > button'
        );
        await dispatchEnter(playButton);
    }

    const dispatchEnter = async function (node) {
        node.focus();
        await delay(200);
        await simulateKeyboardEnter();
    }

    const simulateKeyboardEnter = function () {
        const keyboardEvent = document.createEvent('KeyboardEvent');
        initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';
        keyboardEvent[initMethod]('keydown', true, true, window, false, false, false, false, 13, 0);
        document.dispatchEvent(keyboardEvent);
    }

    const delay = function (timeout) {
        return new Promise(resolve => window.setTimeout(resolve, timeout));
    }

    const downloadAudio = async function (audioUrl) {
        const audioRsp = await fetch(audioUrl);
        const audioContent = await audioRsp.arrayBuffer();
        return btoa(String.fromCharCode.apply(null, new Uint8Array(audioContent)));
    }

    const addWidgetInfo = function (body, widgetId) {
        let widgetInfo = {
            captchaType: "recaptcha",
            widgetId: widgetId,
            containerId: "help-button-holder-" + widgetId,
            body: body,
            lang: document.documentElement.lang
        }

        registerCaptchaWidget(widgetInfo);

        return widgetId;
    }
})()