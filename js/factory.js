shareStoryApp.factory('User', function ($resource) {
	var api = 'http://127.0.0.1:8000/api/';
	return {
		login: $resource(api + 'user/login'),
		register: $resource(api + 'user/user/?v=1'),
        province: $resource(api + 'user/province/?v=1'),
        city: $resource(api + 'user/city/?v=1'),
        school: $resource(api + 'user/school/?v=1')
	}
})
.factory('Products', function ($resource) {
    var api = 'http://127.0.0.1:8000/api/';
    return {
        products: $resource(api + 'products/products/:id/?v=1', {}, {'update': {method: 'PUT'}}),
        productsclassification: $resource(api + 'products/productsclassification'),
        productscollect: $resource(api + 'products/productscollect/:id/?v=1'),
        productsmessage: $resource(api + 'products/productsmessage/?v=1')
    }
})
.factory('News', function ($resource) {
    var api = 'http://127.0.0.1:8000/api/';
    return {
        news: $resource(api + 'news/news')
    }
});