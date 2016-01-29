var app = angular.module('myApp',['ngRoute','firebase']);

app.constant('FIREBASE_URL', 'https://intense-fire-8003.firebaseio.com/');

app.factory('calArray', function( FIREBASE_URL, $firebaseArray) {
        var ref =  new Firebase( FIREBASE_URL );
        return $firebaseArray(
                   ref.child('calendar')
                );
    });

app.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/', {
    templateUrl:'/files/home.html',
    controller: 'cal_ctrl'
  })
  .when('/home',{
    templateUrl:'/files/home.html',
    controller:'cal_ctrl'
  })
  .when('/:day',{
    templateUrl:'/files/day.html',
    controller: 'day_ctrl'
  })
  .when('/error',{
    template: '<p>Error page not found</p>'
  })
  .otherwise({
    redirectTo:('/error')
  });

}]);

app.value('sel_date', {
  day: '',
  month: '',
  year: ''
});

app.directive('myCalendar', function(){
  return{
        restrict: 'E',
        scope: true,
        templateUrl: '/files/calendar.html'
  }
});

app.controller('cal_ctrl', function($scope, $location, sel_date, calArray){

  
  if(sel_date.year&&sel_date.month&&sel_date.day){
    $scope.date = sel_date;
  }
  else{
    var today = new Date();

    $scope.date = {
      year : today.getFullYear(),
      month : today.getMonth(),
      day: today.getDate()
    };


    $scope.years = [];
    var start_year = today.getFullYear() - 20;
    var end_year = today.getFullYear() + 20;
    for(var i=start_year;i<end_year;i++) {
      $scope.years.push(i);
    }

    //get date range for currenty date
    $scope.date_range = CalendarRange.getMonthlyRange(today);
    //console.log($scope.date_range);

  }

  //console.log(sel_date);
  //console.log($scope.date);

    $scope.cal = calArray;
    //console.log($scope.cal);

    $scope.months = ('January,February,March,April,May,June,July,August,September,October,November,December').split(',');



    //check if the date is in the current month
    $scope.isCurrentMonth = function(cal_month){
    	return $scope.date.month == cal_month;
    };


    $scope.$watchCollection('date', function(date) {
      $scope.currentDate = new Date(date.year, date.month, 1);
      //get date range for a new input date
      $scope.date_range = CalendarRange.getMonthlyRange($scope.currentDate);
      //console.log($scope.date_range);
    });

    $scope.select_day = function(cal_day){

      // get the day, month and year for selected date
      sel_date.day = cal_day.day;
      sel_date.month = cal_day.month;
      sel_date.year = cal_day.year;

      var path = '/' + (cal_day.month+1) + '_' + cal_day.day + '_' + cal_day.year;

      $location.path(path);
    };

  $scope.pre_month = function(){

    var cur_month = new Date($scope.date.year, $scope.date.month, 1);
    var previous_month = new Date(cur_month);
    previous_month.setMonth(cur_month.getMonth()-1);

    $scope.date.year = previous_month.getFullYear();
    $scope.date.month = previous_month.getMonth();
  };

  $scope.next_month = function(){

    var cur_month = new Date($scope.date.year, $scope.date.month, 1);
    var next_month = new Date(cur_month);
    next_month.setMonth(cur_month.getMonth()+1);

    $scope.date.year = next_month.getFullYear();
    $scope.date.month = next_month.getMonth();
  };


});




app.controller('day_ctrl', function($scope, sel_date,calArray){

  $scope.count = 0;

  $scope.show_modal = false;

  $scope.months = ('January,February,March,April,May,June,July,August,September,October,November,December').split(',');
  $scope.hours = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
  

  $scope.sel_date = sel_date;

  $scope.cal = calArray;

  $scope.send_event = function(event){

    $scope.cal.$add({
      year: $scope.sel_date.year,
      month: $scope.sel_date.month,
      day: $scope.sel_date.day,
      hour: $scope.event.hour,
      content: $scope.event.content
    });

    $scope.event.content = ' ';
    $scope.show_modal = false;

  };
  
  $scope.pre_day = function(){

    var cur_day = new Date($scope.sel_date.year, $scope.sel_date.month, $scope.sel_date.day);
    var previous_day = new Date(cur_day);
    previous_day.setDate(cur_day.getDate()-1);

    $scope.sel_date.year = previous_day.getFullYear();
    $scope.sel_date.month = previous_day.getMonth();
    $scope.sel_date.day = previous_day.getDate();  
    sel_date = $scope.sel_date;
  };

  $scope.next_day = function(){

    var cur_day = new Date($scope.sel_date.year, $scope.sel_date.month, $scope.sel_date.day);
    var next_day = new Date(cur_day);
    next_day.setDate(cur_day.getDate()+1);

    $scope.sel_date.year = next_day.getFullYear();
    $scope.sel_date.month = next_day.getMonth();
    $scope.sel_date.day = next_day.getDate();  
    sel_date = $scope.sel_date;
  }; 

});

