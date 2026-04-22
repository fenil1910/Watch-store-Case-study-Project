var app = angular.module('watchApp', []);

app.controller('MainController', function($scope, $http) {
    $scope.watches = [];
    $scope.cart = [];
    $scope.currentUser = null;
    $scope.showAdmin = false;
    $scope.showLoginModal = false;

    // Load Watches
    $scope.init = function() {
        $http.get('http://localhost:3000/api/watches').then(function(res) {
            $scope.watches = res.data;
        });
    };
    $scope.init();

    // FIXED LOGIN LOGIC
    $scope.openLogin = function() { $scope.showLoginModal = true; };

   $scope.login = function() {
    // Adding .trim() makes it ignore accidental spaces
    var inputUser = $scope.formUser ? $scope.formUser.trim() : "";
    var inputPass = $scope.formPass ? $scope.formPass.trim() : "";

    if (inputUser === 'admin' && inputPass === '123') {
        $scope.currentUser = { name: 'Fenil', role: 'admin' };
        $scope.showLoginModal = false;
        alert("Welcome Admin!");
    } else if (inputUser === 'user' && inputPass === '123') {
        $scope.currentUser = { name: 'Guest User', role: 'user' };
        $scope.showLoginModal = false;
        alert("Welcome User!");
    } else {
        alert("Invalid Credentials! Try admin/123 or user/123");
    }
};

    $scope.logout = function() {
        $scope.currentUser = null;
        $scope.showAdmin = false;
    };

    // USER FEATURE: Cart
    $scope.addToCart = function(watch) {
        if(!$scope.currentUser) {
            alert("Please login as a user to buy!");
            return;
        }
        $scope.cart.push(watch);
        alert(watch.model + " added to your cart!");
    };

    // ADMIN FEATURE: Update Price
    $scope.updatePrice = function(watch) {
        if(!watch.newPrice) return alert("Enter a new price first");
        
        $http.put('http://localhost:3000/api/watches/' + watch._id, { price: watch.newPrice })
            .then(function(res) {
                watch.price = watch.newPrice; // Update UI
                alert("Database Updated Successfully!");
            });
    };
});