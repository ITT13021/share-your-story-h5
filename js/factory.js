shareStoryApp.factory('User', function ($resource) {
	var api = 'http://127.0.0.1:8000/api/';
	return {
		login: $resource(api + 'user/login'),
		register: $resource(api + 'user/user/?v=1'),
        province: $resource(api + 'user/province/?v=1')
	}
})
.factory('Products', function ($resource) {
    var api = 'http://127.0.0.1:8000/api/';
    return {
        products: $resource(api + 'products/products'),
        productsclassification: $resource(api + 'products/productsclassification'),
        productscollect: $resource(api + 'products/productscollect'),
        productsmessage: $resource(api + 'products/productsmessage')
    }
});