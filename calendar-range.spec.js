describe('CalendarRange', function() {



  it('should return the proper object for the given date', function() {
    var date = new Date();
    var prepared = CalendarRange.prepareDate(date);

    var day = date.getDate();
    expect(prepared.weekday).toBe(day != 0 && day != 6);
    expect(prepared.day).toBe(date.getDate());
    expect(prepared.year).toBe(date.getFullYear());
    expect(prepared.month).toBe(date.getMonth());
    expect(prepared.date).toEqual(date);
  });

  it('should return a valid date range for Feb 2014', function() {
    // we know for sure that this month is what it is in terms of dimensions
    var date = new Date(2014, 1, 10);

    var range = CalendarRange.getMonthlyRange(date);

    expect(range.first) .toEqual(new Date('2014-1-26'));
    expect(range.start) .toEqual(new Date('2014-2-1'));
    expect(range.end)   .toEqual(new Date('2014-2-28'));
    expect(range.last)  .toEqual(new Date('2014-3-1'));

    expect(range.days.length).toBe(35);

    for(var i=0;i<range.days.length;i++) {
      var current = range.days[i];
      expect(CalendarRange.prepareDate(current.date)).toEqual(current);
    }
  });

});
