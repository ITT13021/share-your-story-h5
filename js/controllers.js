shareStoryApp.controller('IndexCtrl', function () {
	console.log('1');
})
shareStoryApp.controller('LoginCtrl', function ($scope, User) {
	$scope.cellphone = null
	$scope.password = null
	$scope.login = function(){
		User.login.save({'cellphone': $scope.cellphone, 'password': $scope.password},function(res){
			console.log(res)
		})
	}
})
.controller('RegisterCtrl', function ($scope, User) {
	$scope.passwordDifferent = true;
	$scope.passwordConfirm = function(){
		if($scope.password_2)
			$scope.passwordDifferent = $scope.password_1 == $scope.password_2;
	}

	$scope.register =function(){
		if(!$scope.passwordDifferent) alert("密码不一致哦！")
		else{
			User.register.save({'username': $scope.username, 'cellphone': $scope.cellphone, 'password': $scope.password_1}, function(res){
				console.log(res)
			})
		}
	}

})