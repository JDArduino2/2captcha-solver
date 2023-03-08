AwsWafIntegration.getValidate = function () {
    return {
        token: document.querySelector("input[name=amazon_waf_token]").value,
    };
}

AwsWafIntegration.hasToken = function () {
    return true;
}