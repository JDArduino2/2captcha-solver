(() => {
    const GeetestIsLoad = function (fname) {
        let geetestIsLoad = false;
        let tags = { js: 'script', css: 'link' };
        let tagname = tags[fname.split('.').pop()];
        if (tagname !== undefined) {
            let elts = document.getElementsByTagName(tagname);
            for (let i in elts) {
                if ((elts[i].href && elts[i].href.toString().indexOf(fname) > 0)
                    || (elts[i].src && elts[i].src.toString().indexOf(fname) > 0)) {
                    geetestIsLoad = true;
                }
            }
        }
        return geetestIsLoad;
    };

    let originalFunc = window.initGeetest4;

    setInterval(() => {
        if (GeetestIsLoad('gt4.js')) {
            Object.defineProperty(window, "initGeetest4", {
                get: function () {
                    return interceptorFunc;
                },
                set: function (e) {
                    originalFunc = e;
                }, configurable: true
            });
        }
    }, 1)

    let interceptorFunc = function (params, callback) {
        const getCaptchaId = function () {
            if (params && params.captchaId) {
                return params.captchaId
            }

            const scripts = document.querySelectorAll("script");
            let src = findScript(scripts);
            const url = new URL(src);
            return url.searchParams.get("captcha_id");
        };

        const initHelper = function () {
            const captchaId = getCaptchaId();

            registerCaptchaWidget({
                captchaType: "geetest_v4",
                widgetId: captchaId,
                captchaId: captchaId
            });
        };

        const findScript = function (scripts) {
            const scriptUrl = "//gcaptcha4.geetest.com/load";

            for (let i = 0; i < scripts.length; i++) {
                const src = scripts[i].getAttribute("src");
                if (typeof src === "string" && src.indexOf(scriptUrl) > 0) {
                    return src;
                }
            }

            return null;
        }

        const getValidate = function() {
            return {
                captcha_id: document.querySelector("input[name=captcha_id]").value,
                lot_number: document.querySelector("input[name=lot_number]").value,
                pass_token: document.querySelector("input[name=pass_token]").value,
                gen_time: document.querySelector("input[name=gen_time]").value,
                captcha_output: document.querySelector("input[name=captcha_output]").value,
            };
        }

        originalFunc(params, (captchaObj) => {
            let captchaObjProxy = new Proxy(captchaObj, {
                get: function (target, prop) {
                    switch (prop) {
                        case 'onReady':
                        case 'onSuccess':
                            initHelper();
                            return target[prop];
                        case 'getValidate':
                            const captcha_id = document.querySelector("input[name=captcha_id]").value;
                            if (captcha_id) {
                                return getValidate;
                            } else {
                                return target[prop];
                            }
                        default:
                            return target[prop];
                    }
                },
            });

            callback(captchaObjProxy);
        });
    }
})()
