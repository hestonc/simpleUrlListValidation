'use strict';

const q = require('q'),
    request = require('request-promise'),
    url = require('url'),
    validUrl = require('valid-url');


/**
 * Accepts a list of URLs.  List of URLs that will be checked as well formed and return success.
 * @param urls List of URLs to be checked.
 * @return List of URLs with issues and what they are.
 */
function validateUrls(urls, done) {
    // return array of pairs of urls and reasons why they are bad
    let badUrls = [],
        httpUrlChecks = [];

    // make sure there are urls to validate
    if (!urls || urls.length == 0) {
        done(badUrls);
        return;
    }

    // check to see if it's maformed.
    for (const argUrg of urls) {
        let whatsWrong =  isUrlMalformed(argUrg);

        if (!whatsWrong) {

            // check to see if it returns success.
            httpUrlChecks.push(doesUrlReturnSuccess(argUrg));

        }
        else {
            const badUrl = {
                url: argUrg,
                reason: whatsWrong
            };
            badUrls.push(badUrl);
        }
    }

    if (httpUrlChecks.length > 0) {
        // something to check loop through urls
        q.allSettled(httpUrlChecks)
            .then(function (results) {
                for (const result of results) {
                    if (result.state == 'rejected') {
                        const badUrl = {
                            url: result.reason.options.uri,
                            reason: parseReason(result.reason)
                        };
                        badUrls.push(badUrl);
                    }
                    else {
                        // console.log("passed");
                    }
                }
            })
            .catch(function (err) {
                console.error(err);
            })
            .done(function () {
                done(badUrls);
            });
    }
    else {
        done(badUrls);
    }
}


/**
 * Parses the reason and returns a hopefully better error message
 */
function parseReason(reason) {
    let message = reason.message;
    if (reason.name === 'RequestError') {
        if (reason.cause.code == 'ENOTFOUND') {
            message = 'DNS address could not be found';
        }
    }
    else if (reason.name === 'StatusCodeError') {
        message = `URL returned ${reason.statusCode}`;
    }
    return message;
}

/**
 * Checks if an url is malformed.  Returns falsy if the URL looks okay
 * @param url
 * @returns a string with why the url failed
 */
function isUrlMalformed(argUrg) {
    let reason; // undefined
    // first check with valid-url upfront
    if (validUrl.isWebUri(argUrg) === undefined) {
        // try parsing for an error
        reason = whyIsUrlMalformed(argUrg);
    }
    return reason;
}

/**
 * will parse the url and look to see why it is not well formed,
 * hopefully returning a reason why.  Currently doesn't do much 
 * as I ran out of time.
 * @param argUrl
 * @returns {string}
 */
function whyIsUrlMalformed(argUrl) {
    let reason = 'URL is not valid';

    // does it have a valid scheme?
    // let urlObj =  url.parse(argUrl, true, true);

    return reason;
}

/**
 * Makes an http get call to the url passed in, returns 
 * a promise.
 * @param argUrl  url to hit
 */
function doesUrlReturnSuccess(argUrl) {
    var options = {
        method: 'GET',
        uri: argUrl
    };

    return request(options);
}

module.exports = {
    // exposed for testing purposes
    doesUrlReturnSuccess: doesUrlReturnSuccess,
    isUrlMalformed: isUrlMalformed,
    
    
    validateUrls: validateUrls
};
