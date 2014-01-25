describe('check timemachine', function() {

  beforeEach(function() {
    jasmine.Clock.useMock();
  });

  afterEach(function() {
    timemachine.reset();
    timemachine.config({});
  });

  describe('check Date constructor', function() {

    it('should default to Thu, 01 Jan 1970 00:00:00 GMT', function() {
      expect(new Date().toUTCString()).toBe('Thu, 01 Jan 1970 00:00:00 GMT');
    });

    it('should now be set to December 25, 1991 13:12:59 via dateString', function() {
      timemachine.config({
        dateString: 'December 25, 1991 13:12:59'
      });
      expect(new Date().toUTCString()).toBe('Wed, 25 Dec 1991 12:12:59 GMT');
    });

    it('should now be set to December 25, 1991 13:12:59 via timestamp', function() {
      timemachine.config({
        timestamp: 693663179000
      });
      expect(new Date().toUTCString()).toBe('Wed, 25 Dec 1991 12:12:59 GMT');
    });

    it('should stay the same for instantiation with millisecond param', function() {
      expect(new Date(1).toUTCString()).toBe('Thu, 01 Jan 1970 00:00:00 GMT');
    });

    it('should stay the same for instantiation with dateString', function() {
      expect(new Date('December 25, 1991 13:12:59').toUTCString()).toBe('Wed, 25 Dec 1991 12:12:59 GMT');
    });

    it('should stay the same for instantiation with year, month, day, hours, minutes, seconds, milliseconds', function() {
      expect(new Date(1990, 12, 25, 12, 12, 59, 1).toUTCString()).toBe('Fri, 25 Jan 1991 11:12:59 GMT');
    });

    it('should reset', function() {
      timemachine.reset();
      expect(new Date().toUTCString()).not.toBe('Thu, 01 Jan 1970 00:00:00 GMT');
    });

    it('should add a time difference as milliseconds', function() {
      timemachine.config({
        difference: 10000 // 10 seconds
      });
      expect(new Date().toUTCString()).toBe('Thu, 01 Jan 1970 00:00:10 GMT');
    });

    it('should not tick by default', function() {
      expect(new Date().toUTCString()).toBe('Thu, 01 Jan 1970 00:00:00 GMT');
      jasmine.Clock.tick(1000);
      expect(new Date().toUTCString()).toBe('Thu, 01 Jan 1970 00:00:00 GMT');
    });

    it('should tick when enabled', function() {
      timemachine.config({
        tick: true
      });
      expect(new Date().toUTCString()).toBe('Thu, 01 Jan 1970 00:00:00 GMT');
      sleep(1000);
      expect(new Date().toUTCString()).toBe('Thu, 01 Jan 1970 00:00:01 GMT');
    });

  });

  describe('check Date.now()', function() {

    it('should return adjusted timestamp', function() {
      expect(Date.now()).toBe(0);
    });

    it('should reset', function() {
      timemachine.reset();
      expect(Date.now()).not.toBe(0);
    });

    it('should add a time difference as milliseconds', function() {
      timemachine.config({
        difference: 10000 // 10 seconds
      });
      expect(Date.now()).toBe(10000);
    });

    it('should not tick by default', function() {
      expect(Date.now()).toBe(0);
      sleep(1000);
      expect(Date.now()).toBe(0);
    });

    it('should tick when enabled', function() {
      timemachine.config({
        tick: true
      });
      expect(Date.now()).toBe(0);
      sleep(1000);
      expect(Date.now()).toBe(1000);
    });

  });

});

function sleep(ms) {
  var start = new Date.OriginalDate().getTime(),
    expire = start + ms;
  while (new Date.OriginalDate().getTime() < expire) {}
  return;
}