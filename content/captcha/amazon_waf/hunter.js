(() => {

    setInterval(function () {
        let input = document.querySelector("input[name='smart-token']");
        if (!input) return;

        if (isCaptchaWidgetRegistered("amazon_waf", 0)) return;

        getAmazonWafWidgetInfo(input);
    }, 2000);

    const getAmazonWafData = function () {
        let src;
        const iframes = document.querySelectorAll('iframe');

        return null;
    };

    const getAmazonWafWidgetInfo = function (input) {
        const sitekey = getAmazonWafData();

        if (sitekey) {
            if (!input.id) {
                input.id = "amazon_waf-input-" + sitekey;
            }

            registerCaptchaWidget({
                captchaType: "amazon_waf",
                widgetId: sitekey,
                sitekey: sitekey,
                inputId: input.id,
            });
        }
    };
})()