import * as angular from 'angular'
import * as firebase from 'firebase';

import * as AllowInviteType from "../keys/allow-invite-type";
import * as UserKeys from "../keys/user-keys";
import * as PathKeys from "../keys/path-keys";
import * as NotificationKeys from "../keys/notification-keys";
import * as Keys from "../keys/keys";

export interface IUser {
    online: boolean
    uid(): string
    isMe(): boolean
}

angular.module('myApp.services').factory('User', ['$rootScope', '$timeout', '$q', 'Entity', 'Utils', 'Paths', 'CloudImage', 'Environment', 'NetworkManager',
    function ($rootScope, $timeout, $q, Entity, Utils, Paths, CloudImage, Environment, NetworkManager) {

        function User (uid) {

            this.setImageURL(Environment.defaultProfilePictureURL());
            this.setUID(uid);
            this.setAllowInvites(AllowInviteType.UserAllowInvitesEveryone);

            //this._id = uid
            this.entity = new Entity(PathKeys.UsersPath, uid);
        }

        User.prototype.getMeta = function() {
            if(Utils.unORNull(this.meta)) {
                this.meta = {};
            }
            return this.meta;
        };

        User.prototype.getMetaValue = function(key) {
            return this.getMeta()[key];
        };

        User.prototype.metaValue = function (key) {
            return this.getMetaValue(key);
        };

        User.prototype.setMetaValue = function(key, value) {
            return this.getMeta()[key] = value;
        };

        User.prototype.getName  = function () {
            return this.getMetaValue(UserKeys.UserName);
        };

        User.prototype.setName  = function (name) {
            return this.setMetaValue(UserKeys.UserName, name);
        };

        User.prototype.name = function name (value) {
            if (Utils.unORNull(value)) {
                return this.getName();
            } else {
                this.setName(value);
            }
        };

        User.prototype.getStatus  = function () {
            return this.getMetaValue(UserKeys.UserStatus);
        };

        User.prototype.setStatus  = function (status) {
            return this.setMetaValue(UserKeys.UserStatus, status);
        };

        // For Angular getterSetter binding
        User.prototype.status = function status (value) {
            if (Utils.unORNull(value)) {
                return this.getStatus();
            } else {
                this.setStatus(value);
            }
        };

        User.prototype.getLocation  = function () {
            return this.getMetaValue(UserKeys.UserLocation);
        };

        User.prototype.setLocation  = function (location) {
            return this.setMetaValue(UserKeys.UserLocation, location);
        };

        User.prototype.location = function location (value) {
            if (Utils.unORNull(value)) {
                return this.getLocation();
            } else {
                this.setLocation(value);
            }
        };

        User.prototype.getCountryCode  = function () {
            return this.getMetaValue(UserKeys.UserCountryCode);
        };

        User.prototype.setCountryCode  = function (countryCode) {
            return this.setMetaValue(UserKeys.UserCountryCode, countryCode);
        };

        User.prototype.countryCode = function countryCode (value) {
            if (Utils.unORNull(value)) {
                return this.getCountryCode();
            } else {
                this.setCountryCode(value);
            }
        };

        User.prototype.getGender  = function () {
            return this.getMetaValue(UserKeys.UserGender);
        };

        User.prototype.setGender  = function (gender) {
            return this.setMetaValue(UserKeys.UserGender, gender);
        };

        User.prototype.gender = function gender (value) {
            if (Utils.unORNull(value)) {
                return this.getGender();
            } else {
                this.setGender(value);
            }
        };

        User.prototype.getProfileLink  = function () {
            return this.getMetaValue(UserKeys.UserProfileLink);
        };

        User.prototype.setProfileLink  = function (profileLink) {
            return this.setMetaValue(UserKeys.UserProfileLink, profileLink);
        };

        User.prototype.profileLink = function profileLink (value) {
            if (Utils.unORNull(value)) {
                return this.getProfileLink();
            } else {
                this.setProfileLink(value);
            }
        };

        User.prototype.getHomepageLink  = function () {
            return this.getMetaValue(UserKeys.UserHomepageLink);
        };

        User.prototype.setHomepageLink  = function (homepageLink) {
            return this.setMetaValue(UserKeys.UserHomepageLink, homepageLink);
        };

        User.prototype.homepageLink = function homepageLink (value) {
            if (Utils.unORNull(value)) {
                return this.getHomepageLink();
            } else {
                this.setHomepageLink(value);
            }
        };

        User.prototype.getHomepageText  = function () {
            return this.getMetaValue(UserKeys.UserHomepageText);
        };

        User.prototype.setHomepageText  = function (homepageText) {
            return this.setMetaValue(UserKeys.UserHomepageText, homepageText);
        };

        User.prototype.homepageText = function homepageText (value) {
            if (Utils.unORNull(value)) {
                return this.getHomepageText();
            } else {
                this.setHomepageText(value);
            }
        };

        User.prototype.getProfileHTML  = function () {
            return this.getMetaValue(UserKeys.UserProfileHTML);
        };

        User.prototype.setProfileHTML  = function (profileHTML) {
            return this.setMetaValue(UserKeys.UserProfileHTML, profileHTML);
        };

        User.prototype.profileHTML = function profileHTML (value) {
            if (Utils.unORNull(value)) {
                return this.getProfileHTML();
            } else {
                this.setProfileHTML(value);
            }
        };

        User.prototype.getAllowInvites  = function () {
            return this.getMetaValue(UserKeys.UserAllowInvites);
        };

        User.prototype.setAllowInvites  = function (allowInvites) {
            return this.setMetaValue(UserKeys.UserAllowInvites, allowInvites);
        };

        User.prototype.allowInvites = function allowInvites (value) {
            if (Utils.unORNull(value)) {
                return this.getAllowInvites();
            } else {
                this.setAllowInvites(value);
            }
        };

        User.prototype.getImageURL = function () {
            return this.getMetaValue(UserKeys.UserImageURL);
        };

        User.prototype.setImageURL = function(imageURL) {
            this.setMetaValue(UserKeys.UserImageURL, imageURL);
        };

        User.prototype.imageURL = function imageURL (value) {
            if (Utils.unORNull(value)) {
                return this.getImageURL();
            } else {
                this.setImageURL(value);
            }
        };

        User.prototype.on = function () {

            if(this.entity.pathIsOn[Keys.MetaKey]) {
                return;
            }

            let ref = Paths.userOnlineRef(this.uid());
            ref.on('value', (function (snapshot) {
                if(!Utils.unORNull(snapshot.val())) {
                    this.online = snapshot.val();
                    if(this.online) {
                        $rootScope.$broadcast(NotificationKeys.OnlineUserAddedNotification);
                    }
                    else {
                        $rootScope.$broadcast(NotificationKeys.OnlineUserRemovedNotification);
                    }
                }
            }).bind(this));

            return this.entity.pathOn(Keys.MetaKey, (function (val) {
                if(val) {
                    this.meta = val;

                    // Update the user's thumbnail
                    this.setImage(this.imageURL());

                    // Here we want to update the
                    // - Main box
                    // - Every chat room that includes the user
                    // - User settings popup
                    $rootScope.$broadcast(NotificationKeys.UserValueChangedNotification, this);
                }
            }).bind(this));
        };

        // Stop listening to the Firebase location
        User.prototype.off = function () {
            this.entity.pathOff(Keys.MetaKey);
            Paths.userOnlineRef(this.uid()).off();
        };

        User.prototype.pushMeta = function () {

            let deferred = $q.defer();

            let ref = Paths.userMetaRef(this.uid());
            ref.update(this.meta, (function (error) {
                if(!error) {
                    deferred.resolve();
                    this.entity.updateState(Keys.MetaKey);
                }
                else {
                    deferred.reject(error);
                }
            }).bind(this));

            return deferred.promise;
        };

        User.prototype.canBeInvitedByUser = function (invitingUser) {

            // This function should only ever be called on the root user
            if(this != $rootScope.user) {
                console.log("Can be invited should only be called on the root user");
                return false;
            }

            if(invitingUser == $rootScope.user) {
                return true;
            }

            let allowInvites = this.allowInvites();
            if(Utils.unORNull(allowInvites) || allowInvites == AllowInviteType.UserAllowInvitesEveryone) {
                return true;
            }
            else {
                return false;
            }
        };

        User.prototype.allowInvites = function () {
            return this.getAllowInvites();
        };

        User.prototype.allowInvitesFrom = function (type) {
            return this.allowInvites() == type;
        };

        User.prototype.updateImageURL = function (imageURL) {
            // Compare to the old URL
            let imageChanged = imageURL != this.imageURL();
            if(imageChanged) {
                this.setMetaValue(UserKeys.UserImageURL, imageURL);
                this.setImageURL(imageURL);
                this.setImage(imageURL, false);
                this.pushMeta();
            }
        };

        User.prototype.setImage = function (image, isData) {
            if(image === undefined) {
                // TODO: Improve this
                this.image = Environment.defaultProfilePictureURL();
            }
            else if(isData || image == Environment.defaultProfilePictureURL()) {
                this.image = image;
                this.thumbnail = image;
            }
            else {
                this.image = CloudImage.cloudImage(image, 100, 100);
                this.thumbnail = CloudImage.cloudImage(image, 30, 30);
            }
        };

        User.prototype.isMe = function (): boolean {
            return this.uid() === NetworkManager.auth.currentUserID();
        };

        User.prototype.getThumbnail = function () {
            if(Utils.unORNull(this.thumbnail)) {
                return Environment.defaultProfilePictureURL();
            }
            return this.thumbnail;
        };

        User.prototype.getAvatar = function () {
            if(Utils.unORNull(this.image)) {
                return Environment.defaultProfilePictureURL();
            }
            return this.image;
        };

        User.prototype.hasImage = function () {
            return this.image && this.image != Environment.defaultProfilePictureURL;
        };

        User.prototype.addRoom = function (room) {
            return this.addRoomWithRID(room.rid(), room.type());
        };

        User.prototype.addRoomWithRID = function (rid, type) {

            let deferred = $q.defer();

            let ref = Paths.userRoomsRef(this.uid()).child(rid);

            let data = {
                invitedBy: $rootScope.user.uid()
            };

            ref.update(data, (function (error) {
                if(!error) {
                    deferred.resolve();
                    this.entity.updateState(PathKeys.RoomsPath);
                }
                else {
                    deferred.reject(error);
                }
            }).bind(this));

            //if(type == RoomTypePublic) {
            //    ref.onDisconnect().remove();
            //}

            return deferred.promise;
        };

        User.prototype.removeRoom = function (room) {
            return this.removeRoomWithRID(room.rid());
        };

        User.prototype.removeRoomWithRID = function (rid) {

            let deferred = $q.defer();

            let ref = Paths.userRoomsRef(this.uid()).child(rid);
            ref.remove((function (error) {
                if(!error) {
                    deferred.resolve();
                    this.entity.updateState(PathKeys.RoomsPath);
                }
                else {
                    deferred.reject(error);
                }
            }).bind(this));

            return deferred.promise;
        };

        User.prototype.addFriend = function (friend) {
            if(friend && friend.meta && friend.uid()) {
                return this.addFriendWithUID(friend.uid());
            }
        };

        User.prototype.addFriendWithUID = function (uid) {
            let deferred = $q.defer();

            let ref = Paths.userFriendsRef(this.uid());
            let data = {};
            data[uid] = {uid: uid};

            ref.update(data, (function (error) {
                if(!error) {
                    deferred.resolve();
                    this.entity.updateState(PathKeys.FriendsPath);
                }
                else {
                    deferred.reject(error);
                }
            }).bind(this));

            return deferred.promise;
        };

        User.prototype.uid = function () {
            return this.entity._id;
        };

        User.prototype.setUID = function (uid) {
            return this.meta.uid = uid;
        };

        User.prototype.removeFriend = function (friend) {
            // This method is added to the object when the friend is
            // added initially
            friend.removeFriend();
            friend.removeFriend = null;
            this.entity.updateState(PathKeys.FriendsPath);
        };

        User.prototype.blockUserWithUID = function (uid) {
            let deferred = $q.defer();

            let ref = Paths.userBlockedRef(this.uid());
            let data = {};
            data[uid] = {uid: uid};
            ref.update(data, (function (error) {
                if(error) {
                    deferred.reject(error);
                }
                else {
                    deferred.resolve();
                }
            }).bind(this));
            this.entity.updateState(PathKeys.BlockedPath);
            return deferred.promise;
        };

        User.prototype.markRoomReadTime = function (rid) {

            let deferred = $q.defer();

            let ref = Paths.userRoomsRef(this.uid()).child(rid);

            let data = {};

            data[Keys.ReadKey] = firebase.database.ServerValue.TIMESTAMP;

            ref.update(data, function (error) {
                if(!error) {
                    deferred.resolve();
                }
                else {
                    deferred.reject(error);
                }
            });

            return deferred.promise;
        };

        User.prototype.blockUser = function (block) {
            if(block && block.meta && block.uid()) {
                this.blockUserWithUID(block.uid());
            }
        };

        User.prototype.unblockUser = function (block) {
            block.unblock();
            block.unblock = null;
            this.entity.updateState(PathKeys.BlockedPath);
        };

        User.prototype.serialize = function () {
            return {
                meta: this.meta ? this.meta : {},
                _super: this.entity.serialize()
                //thumbnail: this.thumbnail,
                //image: this.image
            }
        };

        User.prototype.deserialize = function (su) {
            if(su) {
                this.entity.deserialize(su._super);
                this.meta = su.meta;
                //this.setThumbnail(su.thumbnail);
                this.setImage(su.meta[UserKeys.UserImageURL]);
            }
        };

        return User;
}]);
