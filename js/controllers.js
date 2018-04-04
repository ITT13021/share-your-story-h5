shareStoryApp.controller('IndexCtrl', function () {
    console.log('1');
});
shareStoryApp.controller('LoginCtrl', function ($scope, User, $rootScope) {
    $scope.username = $rootScope.user ? $rootScope.user.username : '';
    $scope.password = $rootScope.user ? $rootScope.user.password : '';
    // 关闭错误提示
    $scope.closeLoginErr = function () {
        $scope.loginErr = !$scope.loginErr;
    };

    // 登录
    $scope.login = function () {
        if ($scope.username && $scope.password) {
            User.login.save({'username': $scope.username, 'password': $scope.password}, function (res) {
            }, function (err) {
                $scope.loginErr = true;
                $scope.errMessage = '登录失败！请检查您输入的数据是否正确！'
            })
        } else {
            $scope.loginErr = true;
            $scope.errMessage = '您输入的数据不完整!'
        }

    }
})
.controller('RegisterCtrl', function ($scope, User, $state, $rootScope) {
    $scope.passwordDifferent = true;
    $scope.passwordConfirm = function () {
        if ($scope.password_2)
            $scope.passwordDifferent = $scope.password_1 == $scope.password_2;
    };

    $scope.register = function () {
        if (!$scope.passwordDifferent) {
            $scope.loginErr = true;
            $scope.errMessage = '两次密码不一致哦！'
        }
        else {
            User.register.save({'username': $scope.username, 'cellphone': $scope.cellphone, 'password': $scope.password_1}, function (res) {
                $rootScope.user = {};
                $rootScope.user.username = $scope.username;
                $rootScope.user.password = $scope.password_1;
                $state.go('login')
            }, function (err) {
                $scope.loginErr = true;
                $scope.errMessage = '注册失败！'
            })
        }
    }

});