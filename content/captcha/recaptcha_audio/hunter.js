(() => {

    let clicked = false;

    setInterval(function () {
        const clickButton = document.querySelector('.recaptcha-checkbox-border');
        if (clickButton && !clicked) {
            clickButton.click();
            clicked = true;
        }

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
        if (audioElement) {
            const audioUrl = audioElement.src;
            const audioBody = await downloadAudio(audioUrl);
            addWidgetInfo(audioBody, widgetId);
        }
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
        const audioSelector = 'audio#audio-source';
        let audioElement = document.querySelector(audioSelector);
        if (!audioElement) {
            const audioButton = document.querySelector('#recaptcha-audio-button');
            await dispatchEnter(audioButton);
            audioElement = document.querySelector(audioSelector);

            const result = await Promise.race([
                new Promise(resolve => {
                    findNode(document, audioSelector, 5000).then(
                        el => {
                            delay(500).then(() => resolve({audioElement: el}));
                        }
                    );
                }),
                new Promise(resolve => {
                    isBlocked(10000).then(blocked => resolve({blocked}));
                })
            ]);

            if (result.blocked) {
                return;
            }

            audioElement = result.audioElement;
        }

        await simulateAudioInput(audioElement);
    }

    const findNode = function (node, selector, timeout) {
        return new Promise(resolve => {
            const ms = 100;
            const timer = setInterval(() => {
                const el = node.querySelector(selector)
                if (el || timeout <= 0) {
                    clearInterval(timer);
                    resolve(el);
                }
                timeout -= ms;
            }, ms);
        })
    }

    const simulateAudioInput = async function (audioElement) {
        if (!audioElement) {
            return;
        }

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
        await simulateKeyboardEnter(node);
    }

    const simulateKeyboardEnter = function (node) {
        const keyEvent = {
            code: 'Enter',
            key: 'Enter',
            keyCode: 13,
            which: 13,
            view: window,
            bubbles: true,
            composed: true,
            cancelable: true
        };

        node.focus();
        node.dispatchEvent(new KeyboardEvent('keydown', keyEvent));
        node.dispatchEvent(new KeyboardEvent('keypress', keyEvent));
        node.click();
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