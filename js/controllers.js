shareStoryApp.controller('IndexCtrl', function () {
    console.log('1');
});
shareStoryApp.controller('LoginCtrl', function ($scope, User, $rootScope, $state, $cookies) {
    if($cookies.get("token")) $state.go('home');
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
                $rootScope.user = {};
                $rootScope.user.username = $scope.username;
                $rootScope.user.token = res.token;
                $cookies.put("token", res.token);
                $cookies.put("username", $scope.username);
                $state.go('home')
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

})
.controller('HomeCtrl', function ($scope, User, $state, $rootScope, $cookies, Products) {
    console.log('\n' +
        '                   _ooOoo_\n' +
        '                  o8888888o\n' +
        '                  88" . "88\n' +
        '                  (| -_- |)\n' +
        '                  O\\  =  /O\n' +
        '               ____/`---\'\\____\n' +
        '             .\'  \\\\|     |//  `.\n' +
        '            /  \\\\|||  :  |||//  \\\n' +
        '           /  _||||| -:- |||||-  \\\n' +
        '           |   | \\\\\\  -  /// |   |\n' +
        '           | \\_|  \'\'\\---/\'\'  |   |\n' +
        '           \\  .-\\__  `-`  ___/-. /\n' +
        '         ___`. .\'  /--.--\\  `. . __\n' +
        '      ."" \'<  `.___\\_<|>_/___.\'  >\'"".\n' +
        '     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n' +
        '     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /\n' +
        '======`-.____`-.___\\_____/___.-`____.-\'======\n' +
        '                   `=---=\'\n' +
        '^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n' +
        '         佛祖保佑       永无BUG\n' +
        '');
    $scope.user_token = $cookies.get("token");
    $scope.username = $cookies.get("username");

    // 随机产生n张不同的图片
    $scope.getDifferentImg = function (obj) {
        $scope.number = [];
        while ($scope.number.length <= obj.length) {
            var number = Math.floor(Math.random() * 10 + 1);
            if ($scope.number.indexOf(number) == -1) {
                $scope.number.push(number);
                for(var i=0; i<obj.length; i++){
                    if(!obj[i].hasOwnProperty('img')) {
                        obj[i].img = "../image/computer/" + number + ".jpg";
                        break
                    }
                }

            }
        }
    };

    // 获取数据
    Products.products.get(function (res) {
        $scope.products = res.results;
        // 最新推荐电脑图片地址随机生成不重复的
        $scope.getDifferentImg($scope.products);
    });

    $scope.goToDetail = function (product) {
        $cookies.put("product", JSON.stringify(product));
        $state.go('detail')
    }

})
.controller('DetailCtrl', function ($scope, $state, $rootScope, $cookies, Products) {
    $scope.user_token = $cookies.get("token");
    $scope.username = $cookies.get("username");
    $scope.product = JSON.parse($cookies.get("product"));

    $scope.registerOrLogin = function (page) {
        $state.go(page)
    };

    Products.productsmessage.get({'product': $scope.product.id},function (res) {
        $scope.productMessage = res.results;
    })
});