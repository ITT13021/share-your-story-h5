shareStoryApp.controller('LoginCtrl', function ($scope, User, $rootScope, $state, $cookies) {
    if ($cookies.get('user')) $state.go('home');
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
                $cookies.put("user", res.user);
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
            User.user.save({'username': $scope.username, 'cellphone': $scope.cellphone, 'password': $scope.password_1}, function (res) {
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
    $state.go('home');
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


    // 声明相关变量
    $scope.loginErr = false;
    $scope.selectedProvince = {"id": null, "name": '请选择省份'};
    $scope.selectedCity = {"id": null, "name": '请选择城市'};
    $scope.selectedSchool = {"id": null, "schoolname": '请选择学校'};
    $scope.selectedClassification = {"id": null, "name": '请选择分类'};
    $scope.productPrice = null;
    $scope.productBuyPrice = null;
    $scope.productDescription = null;
    $scope.productName = null;
    $scope.searchContent = '';
    $scope.searchList = {"display": "none"};

    $scope.$watch('searchContent', function (newVal) {
        if ($scope.searchContent != '') $scope.searchList = {};
        else $scope.searchList = {"display": "none"};
    });

    $scope.search = function (classification) {
        if ($scope.searchContent == '') return;
        $state.go('products', {"searchContent": $scope.searchContent, "searchClassification": classification});
    };

    // 关闭错误提示
    $scope.closeLoginErr = function () {
        $scope.loginErr = !$scope.loginErr;
    };

    // 获取用户相关信息
    $scope.user = $cookies.get('user') ? JSON.parse($cookies.get('user')) : null;

    // 登出
    $scope.logOut = function () {
        $cookies.remove("user");
        $scope.user = {};
        $scope.getProducts();
    };

    // 随机产生n张不同的图片
    $scope.getDifferentImg = function (obj) {
        $scope.number = [];
        while ($scope.number.length <= obj.length) {
            var number = Math.floor(Math.random() * 15 + 1);
            if ($scope.number.indexOf(number) == -1) {
                $scope.number.push(number);
                for (var i = 0; i < obj.length; i++) {
                    if (!obj[i].hasOwnProperty('img')) {
                        if (obj[i].name.indexOf('手机') != -1) obj[i].img = "../image/cellphone/" + number + ".jpg";
                        else if (obj[i].name.indexOf('电脑') != -1) obj[i].img = "../image/computer/" + number + ".jpg";
                        else if (obj[i].name.indexOf('书籍') != -1) obj[i].img = "../image/book/" + number + ".jpg";
                        else obj[i].img = "../image/other/" + number + ".jpg";
                        break;
                    }
                }

            }
        }
    };

    // 跳转到分类
    $scope.goToClassification = function (item) {
        $state.go('products', {"searchContent": null, "searchClassification": item});
    };

    $scope.goUser = function (tab) {
        $state.go('user', {'tab': tab})
    };

    // 获取产品数据
    $scope.getProducts = function () {
        Products.products.query({'type': 'home'}, function (res) {
            $scope.allproducts = res;
            $scope.bookProducts = [];
            $scope.electricProducts = [];
            $scope.otherProducts = [];
            _.each($scope.allproducts, function (item) {
                switch (item.classification) {
                    case 1:
                        $scope.electricProducts.push(item);
                        break;
                    case 2:
                        $scope.bookProducts.push(item);
                        break;
                    case 3:
                        $scope.otherProducts.push(item);
                        break
                }
            });
            // 最新推荐电脑图片地址随机生成不重复的
            $scope.getDifferentImg($scope.electricProducts);
            $scope.getDifferentImg($scope.bookProducts);
            $scope.getDifferentImg($scope.otherProducts);
        });
        Products.products.get({'type': 'recommend'}, function (res) {
            $scope.products = res.results;
            // 最新推荐电脑图片地址随机生成不重复的
            $scope.getDifferentImg($scope.products);
        });
    };

    $scope.getProducts();

    $scope.goToDetail = function (product) {
        $cookies.put("product", JSON.stringify(product));
        $state.go('detail')
    };

    // 模态窗发布商品---------------------------------------

    $scope.shareMemory = function () {
        if (!$scope.user.token) {
            var model = $('[data-toggle="sharememorypopover"]');
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000);
            return
        }
        $('#addedProduct').modal('show');
        $scope.getProvince();
        $scope.getProductClassification()
    };

    // 获取省份、城市、学校
    $scope.getProvince = function () {
        User.province.get(function (res) {
            $scope.provinceList = res.results;
        })
    };

    $scope.getCity = function (province) {
        User.city.get({"province": province}, function (res) {
            $scope.cityList = res.results;
        })
    };

    $scope.getSchool = function (city) {
        User.school.get({"city": city}, function (res) {
            $scope.schoolList = res.results;
        })
    };

    $scope.selectProvince = function (province) {
        $scope.selectedProvince = province;
        $scope.getCity(province.id);
    };

    $scope.selectCity = function (city) {
        $scope.selectedCity = city;
        $scope.getSchool(city.id);
    };

    $scope.selectSchool = function (school) {
        $scope.selectedSchool = school;
    };

    // 获取商品分类
    $scope.getProductClassification = function () {
        Products.productsclassification.get(function (res) {
            $scope.productClassificationList = res.results;
        });
    };
    $scope.getProductClassification();

    $scope.selectClassification = function (classification) {
        $scope.selectedClassification = classification
    };

    // 发布商品
    $scope.addProduct = function () {
        if (!$scope.productPrice || !$scope.productName || !$scope.selectedSchool.id || !$scope.selectedClassification.id) {
            var model = $('[data-toggle="addProductpopover"]');
            model[0].dataset.content = "您还有必填项没有填写哦！";
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000);
            return
        }
        $scope.newProduct = {};
        $scope.newProduct = {"price": $scope.productPrice, "buy_price": $scope.productBuyPrice, "description": $scope.productDescription, "name": $scope.productName, "school": $scope.selectedSchool.id, "classification": $scope.selectedClassification.id};
        Products.products.save($scope.newProduct, function (res) {
            $('#addedProduct').modal('hide');
            $scope.loginErr = true;
            $scope.errMessage = '发布成功！';
            $scope.getProducts();
            $scope.selectedProvince = {"id": null, "name": '请选择省份'};
            $scope.selectedCity = {"id": null, "name": '请选择城市'};
            $scope.selectedSchool = {"id": null, "schoolname": '请选择学校'};
            $scope.selectedClassification = {"id": null, "name": '请选择分类'};
            $scope.productPrice = null;
            $scope.productBuyPrice = null;
            $scope.productDescription = null;
            $scope.productName = null;
        }, function (err) {
            var model = $('[data-toggle="addProductpopover"]');
            model[0].dataset.content = "发布失败，请稍后再试！";
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000)
        })
    }

    // 模态窗发布商品end---------------------------------------

})
.controller('DetailCtrl', function ($scope, $state, $rootScope, $cookies, Products) {
    document.getElementById('detail-top-search').focus();
    document.getElementById('detail-top-search').blur();

    // 声明相关变量
    $scope.parentMessage = null;  // 父级留言
    $scope.message = {};
    $scope.want = false;
    $scope.searchContent = '';
    $scope.searchList = {"display": "none"};

    $scope.$watch('searchContent', function (newVal) {
        if ($scope.searchContent != '') $scope.searchList = {};
        else $scope.searchList = {"display": "none"};
    });

    $scope.search = function (classification) {
        if ($scope.searchContent == '') return;
        $state.go('products', {"searchContent": $scope.searchContent, "searchClassification": classification});
    };

    // 监听事件，获取留言
    var ProductMessageDoRefresh = $rootScope.$on('ProductMessageDoRefresh', function (event, data) {
        $scope.getProductMessage();
    });

    $scope.$on("$destroy", function () {
        ProductMessageDoRefresh();
    });

    // 获取用户相关信息和产品内容
    $scope.user = $cookies.get('user') ? JSON.parse($cookies.get('user')) : null;
    $scope.product = JSON.parse($cookies.get("product"));

    // 登录或注册
    $scope.registerOrLogin = function (page) {
        $state.go(page)
    };

    // 登出
    $scope.logOut = function () {
        $cookies.remove("user");
        $scope.user = {};
        $scope.getProducts();
    };

    $scope.goUser = function (tab) {
        $state.go('user', {'tab': tab})
    };

    // 获取产品留言
    $scope.getProductMessage = function () {
        Products.productsmessage.get({'product': $scope.product.id}, function (res) {
            $scope.productMessage = res.results;
        });
    };

    $scope.getProductMessage();

    // 获取商品分类
    $scope.getProductClassification = function () {
        Products.productsclassification.get(function (res) {
            $scope.productClassificationList = res.results;
        });
    };
    $scope.getProductClassification();

    // 上传用户留言
    $scope.uploadMessage = function () {
        var model = $('[data-toggle="messagepopover"]');
        if ($scope.message.message) {
            Products.productsmessage.save({"product": $scope.product.id, "message": $scope.message.message, "parent_message": $scope.parentMessage}, function (res) {
                if ($scope.want) model[0].dataset.content = "我们已将您的心意发送给对方，用心的人将会被认真对待！";
                model.popover('show');
                $scope.message = {};
                $scope.getProductMessage();
            }, function (err) {
                model[0].dataset.content = "发送失败！请稍后再试！";
                model.popover('show');
            })
        }

    };

    // ‘我想要’ 函数
    $scope.iWant = function () {
        var model = $('[data-toggle="wantpopover"]');
        if (!$scope.user || !$scope.user.token) {
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000);
            return
        }
        $scope.want = true;
        document.getElementById('message').focus();
        window.scrollTo(0, document.getElementById('message').offsetTop - 100);
        $scope.message.message = "I WANT !";
    };

    // 收藏
    $scope.collect = function () {
        var model = $('[data-toggle="collectpopover"]');
        if (!$scope.user || !$scope.user.token) {
            model[0].dataset.content = "您还没有登录呢！";
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000);
            return
        }
        Products.productscollect.save({"product": $scope.product.id, "user": $scope.user.id}, function (res) {
            if (res.status) model[0].dataset.content = res.msg;
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000)
        }, function (err) {
            model[0].dataset.content = "收藏失败，请稍后再试！";
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000)
        })
    }
})
.controller('ProductsCtrl', function ($scope, User, $state, $rootScope, $cookies, Products, $stateParams) {
    // 声明相关变量
    $scope.selPage = 1; // 选中页数
    $scope.productSearchContent = '';
    $scope.searchList = {"display": "none"};

    $scope.$watch('productSearchContent', function (newVal) {
        if ($scope.productSearchContent != '') $scope.searchList = {};
        else $scope.searchList = {"display": "none"};
    });

    // 获取路由参数
    $scope.otherSearchContent = $stateParams.searchContent;
    $scope.searchClassification = $stateParams.searchClassification;
    $scope.searchTitle = $scope.searchClassification ? $scope.searchClassification.name : '相关内容';

    // 获取用户相关信息和产品内容
    $scope.user = $cookies.get('user') ? JSON.parse($cookies.get('user')) : null;
    $scope.product = JSON.parse($cookies.get("product"));

    // 登录或注册
    $scope.registerOrLogin = function (page) {
        $state.go(page)
    };

    // 登出
    $scope.logOut = function () {
        $cookies.remove("user");
        $scope.user = {};
        $scope.getProducts();
    };

    $scope.goUser = function (tab) {
        $state.go('user', {'tab': tab})
    };

    // 关闭错误提示
    $scope.closeLoginErr = function () {
        $scope.loginErr = !$scope.loginErr;
    };

    // 随机产生n张不同的图片
    $scope.getDifferentImg = function (obj) {
        $scope.number = [];
        while ($scope.number.length <= obj.length) {
            var number = Math.floor(Math.random() * 15 + 1);
            if ($scope.number.indexOf(number) == -1) {
                $scope.number.push(number);
                for (var i = 0; i < obj.length; i++) {
                    if (!obj[i].hasOwnProperty('img')) {
                        if (obj[i].name.indexOf('手机') != -1) obj[i].img = "../image/cellphone/" + number + ".jpg";
                        else if (obj[i].name.indexOf('电脑') != -1) obj[i].img = "../image/computer/" + number + ".jpg";
                        else if (obj[i].name.indexOf('书籍') != -1) obj[i].img = "../image/book/" + number + ".jpg";
                        else obj[i].img = "../image/other/" + number + ".jpg";
                        break;
                    }
                }

            }
        }
    };

    // 获取商品分类
    $scope.getProductClassification = function () {
        Products.productsclassification.get(function (res) {
            $scope.productClassificationList = res.results;
        });
    };
    $scope.getProductClassification();

    $scope.search = function (classification) {
        $scope.searchTitle = classification ? classification.name : '相关内容';
        if ($scope.productSearchContent == '') return;
        $scope.getProducts(classification, $scope.productSearchContent, 1);
    };

    $scope.setPageCss = function (page, item) {
        item[page][1] = {"color": "white", "background-color": "#dc3545"}
    };

    // 获取产品数据
    $scope.getProducts = function (classification, search, page) {
        Products.products.get({'page': page, 'classification': classification ? classification.id : '', 'search': search}, function (res) {
            $scope.searchProducts = res.results;
            $scope.page = Math.ceil(res.count / 10);
            $scope.searchProducspageList = [];
            for (var i = 1; i <= $scope.page; i++) {
                $scope.searchProducspageList.push([i, {}]);
            }
            if ($scope.searchProducspageList[0]) $scope.setPageCss(page-1, $scope.searchProducspageList);
            $scope.productSearchContent = '';
            // 最新推荐电脑图片地址随机生成不重复的
            $scope.getDifferentImg($scope.searchProducts);
        });
    };

    $scope.getProducts($scope.searchClassification, $scope.otherSearchContent, 1);

    $scope.goToDetail = function (product) {
        $cookies.put("product", JSON.stringify(product));
        $state.go('detail')
    };

    // 模态窗发布商品---------------------------------------

    $scope.shareMemory = function () {
        if (!$scope.user.token) {
            var model = $('[data-toggle="sharememorypopover"]');
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000);
            return
        }
        $('#addedProduct').modal('show');
        $scope.getProvince();
        $scope.getProductClassification()
    };

    // 获取省份、城市、学校
    $scope.getProvince = function () {
        User.province.get(function (res) {
            $scope.provinceList = res.results;
        })
    };

    $scope.getCity = function (province) {
        User.city.get({"province": province}, function (res) {
            $scope.cityList = res.results;
        })
    };

    $scope.getSchool = function (city) {
        User.school.get({"city": city}, function (res) {
            $scope.schoolList = res.results;
        })
    };

    $scope.selectProvince = function (province) {
        $scope.selectedProvince = province;
        $scope.getCity(province.id);
    };

    $scope.selectCity = function (city) {
        $scope.selectedCity = city;
        $scope.getSchool(city.id);
    };

    $scope.selectSchool = function (school) {
        $scope.selectedSchool = school;
    };

    // 获取商品分类
    $scope.getProductClassification = function () {
        Products.productsclassification.get(function (res) {
            $scope.productClassificationList = res.results;
        });
    };

    $scope.selectClassification = function (classification) {
        $scope.selectedClassification = classification
    };

    // 发布商品
    $scope.addProduct = function () {
        if (!$scope.productPrice || !$scope.productName || !$scope.selectedSchool.id || !$scope.selectedClassification.id) {
            var model = $('[data-toggle="addProductpopover"]');
            model[0].dataset.content = "您还有必填项没有填写哦！";
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000);
            return
        }
        $scope.newProduct = {};
        $scope.newProduct = {"price": $scope.productPrice, "buy_price": $scope.productBuyPrice, "description": $scope.productDescription, "name": $scope.productName, "school": $scope.selectedSchool.id, "classification": $scope.selectedClassification.id};
        Products.products.save($scope.newProduct, function (res) {
            $('#addedProduct').modal('hide');
            $scope.loginErr = true;
            $scope.errMessage = '发布成功！';
            $scope.selectedProvince = {"id": null, "name": '请选择省份'};
            $scope.selectedCity = {"id": null, "name": '请选择城市'};
            $scope.selectedSchool = {"id": null, "schoolname": '请选择学校'};
            $scope.selectedClassification = {"id": null, "name": '请选择分类'};
            $scope.productPrice = null;
            $scope.productBuyPrice = null;
            $scope.productDescription = null;
            $scope.productName = null;
        }, function (err) {
            var model = $('[data-toggle="addProductpopover"]');
            model[0].dataset.content = "发布失败，请稍后再试！";
            model.popover('show');
            setTimeout(function () {
                model.popover('hide')
            }, 3000)
        })
    };

    // 模态窗发布商品end---------------------------------------


    // 分页控制---------------------------------

    var getFoucs = function () {
        document.getElementById('detail-top-search').focus();
        document.getElementById('detail-top-search').blur();
    };

    //上一页
    $scope.Previous = function () {
        if ($scope.selPage == 1) return;
        $scope.getProducts($scope.searchClassification, $scope.otherSearchContent, $scope.selPage-1);
        getFoucs();
        $scope.selPage -= 1;
    };
    //下一页
    $scope.Next = function () {
        if ($scope.selPage == $scope.searchProducspageList.length) return;
        $scope.getProducts($scope.searchClassification, $scope.otherSearchContent, $scope.selPage + 1);
        getFoucs();
        $scope.selPage += 1;
    };

    $scope.getPageData = function (page) {
        $scope.selPage = page;
        $scope.getProducts($scope.searchClassification, $scope.otherSearchContent, page);
        getFoucs();
    };

    // 分页控制end---------------------------------

})
.controller('UserCtrl', function ($scope, User, $state, $rootScope, $cookies, Products, News, $stateParams) {

    // 声明变量
    $scope.selPage = 1; // 选中页数
    $scope.nowTab = 'myInformation';    // 当前所在tab
    $scope.selectedProvince = {"id": null, "name": '请选择省份'};
    $scope.selectedCity = {"id": null, "name": '请选择城市'};
    $scope.selectedSchool = {"id": null, "schoolname": '请选择学校'};
    $scope.searchContent = '';
    $scope.searchList = {"display": "none"};

    $scope.$watch('searchContent', function (newVal) {
        if ($scope.searchContent != '') $scope.searchList = {};
        else $scope.searchList = {"display": "none"};
    });

    $scope.search = function (classification) {
        if ($scope.searchContent == '') return;
        $state.go('products', {"searchContent": $scope.searchContent, "searchClassification": classification});
    };

    // 关闭错误提示
    $scope.closeLoginErr = function () {
        $scope.loginErr = !$scope.loginErr;
    };

    // 获取路由参数
    $scope.nowTab = $stateParams.tab ? $stateParams.tab : $scope.nowTab;

    // 获取用户相关信息
    $scope.getUserInfomation = function () {
        $scope.user = $cookies.get('user') ? JSON.parse($cookies.get('user')) : null;
    };
    $scope.getUserInfomation();

    // 获取商品分类
    $scope.getProductClassification = function () {
        Products.productsclassification.get(function (res) {
            $scope.productClassificationList = res.results;
        });
    };
    $scope.getProductClassification();

    // 登出
    $scope.logOut = function () {
        $cookies.remove("user");
        $scope.user = {};
        $state.go('home')
    };

    // 我的资料------------------------------------------------------------------

    $scope.editMyInformation = function () {
        $scope.editMy = true;
        if ($scope.user.school_id) {
            $scope.selectedProvince.id = $scope.user.province_id;
            $scope.selectedProvince.name = $scope.user.province_name;
            $scope.selectedCity.id = $scope.user.city_id;
            $scope.selectedCity.name = $scope.user.city_name;
            $scope.selectedSchool.id = $scope.user.school_id;
            $scope.selectedSchool.schoolname = $scope.user.school_name;
        }

    };

    $scope.updateMyInformation = function () {
        $scope.user.school = $scope.user.school_id;
        User.user.update({id: $scope.user.id}, $scope.user, function (res) {
            $scope.user.school = $scope.selectedSchool.schoolname;
            $cookies.remove('user');
            $cookies.put("user", JSON.stringify($scope.user));
            $scope.getUserInfomation()
        });
        $scope.editMy = false;
    };

    $scope.changeSex = function (sex) {
        switch (sex) {
            case 's':
                $scope.user.sex = 0;
                break;
            case 'b':
                $scope.user.sex = 1;
                break;
            case 'g':
                $scope.user.sex = 2;
                break
        }
    };

    // 我的资料end------------------------------------------------------------------

    // 获取省份、城市、学校
    $scope.getProvince = function () {
        User.province.get(function (res) {
            $scope.provinceList = res.results;
        })
    };

    $scope.getProvince();

    $scope.getCity = function (province) {
        User.city.get({"province": province}, function (res) {
            $scope.cityList = res.results;
        })
    };

    $scope.getSchool = function (city) {
        User.school.get({"city": city}, function (res) {
            $scope.schoolList = res.results;
        })
    };

    $scope.selectProvince = function (province) {
        $scope.selectedProvince = province;
        $scope.getCity(province.id);
    };

    $scope.selectCity = function (city) {
        $scope.selectedCity = city;
        $scope.getSchool(city.id);
    };

    $scope.selectSchool = function (school) {
        $scope.selectedSchool = school;
    };

    //  我的发布------------------------------------------------------------------

    // 获取我的发布
    $scope.getMyProducts = function (page) {
        Products.products.get({'type': 'my', 'page': page}, function (res) {
            $scope.myProducts = res.results;
            $scope.page = Math.ceil(res.count / 4);
            $scope.myProducspageList = [];
            for (var i = 1; i <= $scope.page; i++) {
                $scope.myProducspageList.push([i, {}]);
            }
            if ($scope.myProducspageList[0]) $scope.setPageCss(page - 1, $scope.myProducspageList)
        })
    };

    // 上/下架我发布的商品
    $scope.setProductStatus = function (product, status) {
        Products.products.update({id: product}, {'status': status}, function (res) {
            $scope.loginErr = true;
            $scope.errMessage = status == 1 ? '下架成功！' : '上架成功';
            $scope.getMyProducts(1);
        }, function (err) {
            $scope.loginErr = true;
            $scope.errMessage = status == 1 ? '下架失败！' : '上架失败';
        })
    };

    //  我的发布end------------------------------------------------------------------


    //  收藏------------------------------------------------------------------

    // 获取我收藏的商品
    $scope.getProductCollects = function (page) {
        Products.productscollect.get({'page': page}, function (res) {
            $scope.productCollects = res.results;
            $scope.page = Math.ceil(res.count / 4);
            $scope.myCollectspageList = [];
            for (var i = 1; i <= $scope.page; i++) {
                $scope.myCollectspageList.push([i, {}]);
            }
            if ($scope.myCollectspageList[0]) $scope.setPageCss(page - 1, $scope.myCollectspageList)
        })
    };

    // 取消收藏
    $scope.cancelCollect = function (product) {
        Products.productscollect.delete({"id": product}, function (res) {
            $scope.loginErr = true;
            $scope.errMessage = '取消成功！';
            $scope.getProductCollects(1);
        }, function (err) {
            $scope.loginErr = true;
            $scope.errMessage = '取消失败！';
        })
    };

    //  收藏end------------------------------------------------------------------


    // 我的消息------------------------------------------------------------------

    $scope.getMyNews = function (page) {
        News.news.get({'page': page}, function (res) {
            $scope.myNews = res.results;
            $scope.page = Math.ceil(res.count / 4);
            $scope.myNewList = [];
            for (var i = 1; i <= $scope.page; i++) {
                $scope.myNewList.push([i, {}]);
            }
            if ($scope.myNewList[0]) $scope.setPageCss(page - 1, $scope.myNewList)
        });
    };

    $scope.getNewsDetail = function (news) {
        $scope.newsDetail = news;
    };

    $scope.newDeatilBack = function () {
        $scope.newsDetail = {}
    };

    // 我的消息end------------------------------------------------------------------


    // 设置Tab样式----------------------------------------------------

    $scope.tab_css = [{"background-color": "#FF6F7D"}, {"background-color": "transparent"}];

    var set_css = function () {
        switch ($scope.nowTab) {
            case 'myProducts':
                $scope.myProductsCss = $scope.tab_css[0];
                $scope.myInformationCss = $scope.myCollectCss = $scope.myNewsCss = $scope.tab_css[1];
                break;
            case 'myInformation':
                $scope.myInformationCss = $scope.tab_css[0];
                $scope.myProductsCss = $scope.myCollectCss = $scope.myNewsCss = $scope.tab_css[1];
                break;
            case 'myCollect':
                $scope.myCollectCss = $scope.tab_css[0];
                $scope.myProductsCss = $scope.myInformationCss = $scope.myNewsCss = $scope.tab_css[1];
                break;
            case 'myNews':
                $scope.myNewsCss = $scope.tab_css[0];
                $scope.myProductsCss = $scope.myInformationCss = $scope.myCollectCss = $scope.tab_css[1];
                break;
        }
    };

    // 设置Tab样式----------------------------------------------------

    $scope.getTabContent = function (item) {
        $scope.nowTab = item;
        switch (item) {
            case 'myProducts':
                $scope.getMyProducts(1);
                break;
            case 'myInformation':
                $scope.myInformationCss = $scope.tab_css[0];
                $scope.myProductsCss = $scope.myCollectCss = $scope.myNewsCss = $scope.tab_css[1];
                break;
            case 'myCollect':
                $scope.getProductCollects(1);
                break;
            case 'myNews':
                $scope.getMyNews(1);
                break;
        }
        set_css();
    };

    $scope.getTabContent($scope.nowTab);

    $scope.setPageCss = function (page, item) {
        item[page][1] = {"color": "white", "background-color": "#dc3545"}
    };

    // 分页控制---------------------------------

    //上一页
    $scope.Previous = function (item) {
        if ($scope.selPage == 1) return;
        switch (item) {
            case 'collect':
                $scope.getProductCollects($scope.selPage - 1);
                break;
            case 'myProducts':
                $scope.getMyProducts($scope.selPage - 1);
                break;
            case 'news':
                $scope.getMyNews($scope.selPage - 1);
                break;
        }
        $scope.selPage -= 1;
    };
    //下一页
    $scope.Next = function (item) {
        if ($scope.selPage == $scope.pageList.length) return;
        switch (item) {
            case 'collect':
                $scope.getProductCollects($scope.selPage + 1);
                break;
            case 'myProducts':
                $scope.getMyProducts($scope.selPage + 1);
                break;
            case 'news':
                $scope.getMyNews($scope.selPage + 1);
                break;
        }
        $scope.selPage += 1;
    };

    $scope.getPageData = function (page, tab) {
        $scope.selPage = page;
        switch (tab) {
            case 'collect':
                $scope.getProductCollects($scope.selPage);
                break;
            case 'myProducts':
                $scope.getMyProducts($scope.selPage);
                break;
            case 'news':
                $scope.getMyNews($scope.selPage);
                break;
        }
    };

    // 分页控制end---------------------------------


});