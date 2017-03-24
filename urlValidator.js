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
                        // console.log(`rejected ${result.reason.options.uri}`);
                        // console.log(`cause ${result.reason.message}`);
                        const badUrl = {
                            url: result.reason.options.uri,
                            reason: result.reason.message
                        };
                        badUrls.push(badUrl);
                    }
                    else {
                        console.log("passed");
                    }
                }
            })
            .catch(function (err) {
                console.log('error!', err);
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
    // console.log(`${argUrg} is checked and returns ${reason}`);
    return reason;
}

function whyIsUrlMalformed(argUrl) {
    let reason = 'url is not valid';

    // does it have a valid scheme?
    let urlObj =  url.parse(argUrl, true, true);
    console.log(urlObj)

    return reason;
}

// exported for testing purposes only
function doesUrlReturnSuccess(argUrl) {
    var options = {
        method: 'GET',
        uri: argUrl
    };

    return request(options);
}

module.exports = {
    doesUrlReturnSuccess: doesUrlReturnSuccess,
    isUrlMalformed: isUrlMalformed,
    validateUrls: validateUrls
};
