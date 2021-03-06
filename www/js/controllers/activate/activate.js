vendorView.controller('vendorAppCtrl' , ['$scope','$timeout','$cordovaDevice', function($scope,$timeout,$cordovaDevice){
  
  // Return all city name and city id 
  $scope.cities = [];
  firebase.database().ref('city').once('value', function(snapshot){
    angular.forEach(snapshot.val(),function(value){
      $timeout(function(){
        $scope.cities.push(value);
      },100)
    });
  });

  // Returns vendor name and vendor Id from database on page load
  var timeStamp = new Date().getTime();
  var deviceId =  (Math.random()+' ').substring(2,10)+(Math.random()+' ').substring(2,10);

  // Get Vendors Based On That Particular City
  $scope.search = function(cityId){ 
    console.log(cityId);
    $scope.allVendors = [];
    firebase.database().ref('vendor/'+cityId).once('value', function(snapshot){
      angular.forEach(snapshot.val(),function(value){
       var vendorObj = {
          id : value.vendorId,
          name : value.vendorName,
          cityName : value.address.cityName,
          landmark : value.address.landmark
        }
        $scope.allVendors.push(vendorObj);
        console.log($scope.allVendors);
    
      });
    });
  };

  // Get Vendor Full Name
  $scope.saveId = function(item) {
    $scope.vendorId = item.id;
    console.log(item);
    $timeout(function(){
     $scope.fullName=item.name+','+item.landmark+','+item.cityName;
    },100)
    $scope.allVendors=[];
  };

  // updates vendorTab object in database by sending activation date and deviceId to database
  $scope.updateTabList = function(code){
    console.log(code);
    console.log('hello');
    firebase.database().ref('/vendorTab/'+$scope.vendorId).orderByChild("code").equalTo(code).on('child_added', function(snapshot){
      console.log("Hello");
      console.log(snapshot.val());
      var tabId = snapshot.val().tabId;
      window.localStorage.setItem('tabId',tabId);
      window.localStorage.setItem('vendorId',$scope.vendorId);
      console.log("Tab Activated");
      // var deviceId = $cordovaDevice.getUUID();
      // console.log(deviceId);
      var updates = {};
      updates['/vendorTab/' + $scope.vendorId +'/' +tabId + '/ activationDate'] = timeStamp;
      updates['/vendorTab/' + $scope.vendorId +'/' +tabId + '/ deviceId'] = deviceId;
      firebase.database().ref().update(updates);
      var statusFlag = 0;
      window.localStorage.setItem('statusFlag',statusFlag);
      window.location= "#/start";
    });
  };
}])
