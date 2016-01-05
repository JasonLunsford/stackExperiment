angular.module('beetleLoop.services')
	.service('UserBoxService', UserBoxService);

	UserBoxService.$inject = ['$meteor'];

	function UserBoxService($meteor) {
    	var userBoxService      = this,
            userBoxSubObj       = $meteor.subscribe('userBox'),
            userId;

        /* Basic Getters/Setters */

        userBoxService.getUserId = function() { return userId; };

        userBoxService.setUserId = function(id) { userId = id; };

        userBoxService.fetchUserIdFromCookie = function() {
            // pull user ID stored in a cookie / session state / some persistent storage,
            // store, and then return
            // userBoxService.setUserId(value.from.storage);
            // return value.from.storage
        };

        /* Meteor Method API Calls */

        // expects an object w 'username' and 'email' properties
        userBoxService.addUser = function(userObj) {
            return $meteor.call('addUser', userObj);
        };

        userBoxService.assignToProject = function(projectId) {
            return $meteor.call('assignToProject', projectId, userId);
        };

        userBoxService.getUserProjects = function() {
            return $meteor.call('getUserProjects', userId);
        };

        userBoxService.removeFromProject = function(projectId) {
            return $meteor.call('removeFromProject', projectId, userId);
        };

        userBoxService.removeUser = function() {
            return $meteor.call('removeUser', userId);
        };

        userBoxService.updateUserEmail = function(emailAddress) {
            return $meteor.call('updateUserEmail', emailAddress, userId);
        };

        userBoxService.updateUserName = function(userName) {
            return $meteor.call('updateUserName', userName, userId);
        };

	}