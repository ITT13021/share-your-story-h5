shareStoryApp.factory('User', function ($resource) {
	var api = 'http://127.0.0.1:8000/api'
	return {
		login: $resource(api + '/login'),
		register: $resource(api + '/user/?v=1')
	}
});