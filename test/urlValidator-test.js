
const should = require('should'),
    urlValidator = require('../urlValidator');

describe('doesUrlReturnSuccess', function(){
    it('should return successfully with a valid URL', function() {
        let goodUrl = 'http://google.com';
        
        return urlValidator.doesUrlReturnSuccess(goodUrl).should.be.fulfilled();
    });

    it('should return an error with an invalid URL', function() {
        let badUrl = 'http://not.a.valid.url';

        return urlValidator.doesUrlReturnSuccess(badUrl).should.be.rejected();
    });
});

describe('isUrlMalformed', function(){
    it('should return successfully with a valid URL', function(){
        let goodUrl = 'http://google.com';
        var result = urlValidator.isUrlMalformed(goodUrl);
        should.not.exist(result);
    })

    it('should return failure with an invalid url', function(){
        const badUrl = 'http//babd.com';
        var result = urlValidator.isUrlMalformed(badUrl);
        should.exist(result);
    })
});

describe ('validateUrls', function(){
    it('should return 1 url if passed 1 good url and 1 bad url', function(done) {
        let urls = ['http://google.com', 'http://not.a.valid.url.foo'];
        
        urlValidator.validateUrls(urls, function(badUrls){
            should.exist(badUrls);
            (badUrls.length).should.equal(1);
            done();
        })
    });

    it('should return 2 url if passed 1 good url and 2 bad urls', function(done) {
        let urls = [
            'http://google.com',
            'http://not.a.valid.url.foo',
            'http:notgood.foo',
            'http:// fo .com',
            'http//notfoo.com'
        ];

        urlValidator.validateUrls(urls, function(badUrls){
            should.exist(badUrls);
            (badUrls.length).should.equal(4);

            done();
        })
    });
})

