shareStoryApp.factory('User', function ($resource) {
    var api_url = window.location.hostname;
	var api = api_url.indexOf('35') != 0 ? 'http://' + api_url + ':8000/api/' : '/api/';
	return {
		login: $resource(api + 'user/login'),
		user: $resource(api + 'user/user/:id/?v=1', {}, {'update': {method: 'PUT'}}),
        province: $resource(api + 'user/province/?v=1'),
        city: $resource(api + 'user/city/?v=1'),
        school: $resource(api + 'user/school/?v=1')
	}
})
.factory('Products', function ($resource) {
    var api_url = window.location.hostname;
    var api = api_url.indexOf('35') != 0 ? 'http://' + api_url + ':8000/api/' : '/api/';
    return {
        products: $resource(api + 'products/products/:id/?v=1', {}, {'update': {method: 'PUT'}}),
        productsclassification: $resource(api + 'products/productsclassification/?v=1'),
        productscollect: $resource(api + 'products/productscollect/:id/?v=1'),
        productsmessage: $resource(api + 'products/productsmessage/?v=1')
    }
})
.factory('News', function ($resource) {
    var api_url = window.location.hostname;
    var api = api_url.indexOf('35') != 0 ? 'http://' + api_url + ':8000/api/' : '/api/';
    return {
        news: $resource(api + 'news/news')
    }
});
