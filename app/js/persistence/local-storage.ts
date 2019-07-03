import * as angular from 'angular'

export interface ILocalStorage {

}

angular.module('myApp.services').factory('LocalStorage', ['$rootScope', '$timeout', 'WebStorage', 'Utils', function ($rootScope, $timeout, WebStorage, Utils) {
    let LocalStorage = {

        mainMinimizedKey: 'cc_main_minimized',
        moreMinimizedKey: 'cc_more_minimized',

        // Tokens
        tokenKey: 'cc_token',
        UIDKey: 'cc_uid',
        tokenExpiryKey: 'cc_token_expiry',

        // API Details
        apiDetailsKey: 'cc_api_details',

        roomsKey: 'cc_rooms',
        usersKey: 'cc_users',

        onlineCountKey: 'cc_online_count',
        timestampKey: 'cc_timestamp',

        lastVisited: 'cc_last_visited',

        rooms: {},
        users: {},

        init: function () {
            const rooms = this.getProperty(this.roomsKey);

            if(rooms && rooms.length) {
                let room = null;
                for(let i = 0; i < rooms.length; i++) {
                    room = rooms[i];
                    this.rooms[room.meta.rid] = room;
                }
            }

            const sus = this.getProperty(this.usersKey);
            if(sus && sus.length) {
                let su = null;

                for(let i = 0; i < sus.length; i++) {
                    su = sus[i];
                    this.users[su.meta.uid] = su;
                }
            }

            return this;
        },

        isOffline: function () {
            return this.getProperty('cc_offline');
        },

        setOffline: function (offline) {
            this.setProperty('cc_offline', offline);
        },

        isMuted: function () {
            return this.getProperty('cc_muted');
        },

        setMuted: function (muted) {
            this.setProperty('cc_muted', muted);
        },

        storeRooms: function (rooms) {
            let room;
            let sr = [];
            for(let key in rooms) {
                if(rooms.hasOwnProperty(key)) {
                    room = rooms[key];
                    sr.push(room.serialize());
                }
            }
            this.setProperty(this.roomsKey, sr);
        },

        storeUsers: function (users) {
            let user;
            let su = [];
            for(let key in users) {
                if(users.hasOwnProperty(key)) {
                    user = users[key];
                    su.push(user.serialize());
                }
            }
            this.setProperty(this.usersKey, su);
        },

        sync: function () {
            WebStorage.sync();
        },

        updateRoomFromStore: function (room) {
            let sr = this.rooms[room.rid()];
            if(sr) {
                room.deserialize(sr);
            }
        },

        updateUserFromStore: function (user) {
            let su = this.users[user.uid()];
            if(su) {
                user.deserialize(su);
                return true;
            }
            return false;
        },

        getLastVisited: function () {
            return this.getProperty(this.lastVisited);
        },

        setLastVisited: function () {
            this.setProperty(this.lastVisited, new Date().getTime());
        },

        setProperty: function(key, value) {
            if(!this.cacheCleared) {
                WebStorage.setProperty(key, value);
            }
        },

        getProperty: function (key) {
            let c = WebStorage.getProperty(key);

            if(!Utils.unORNull(c)) {
                let e;
                try {
                    e = eval(c);
                }
                catch (error) {
                    e = c;
                }
                return e;
            }
            else {
                return null;
            }
        },

        removeProperty: function (key) {
            this.setProperty(key, null);
        },

        clearCache: function () {
            this.removeProperty(this.roomsKey);
            this.removeProperty(this.usersKey);
            this.removeProperty(this.lastVisited);
            this.clearToken();
            this.cacheCleared = true;
        },

        clearCacheWithTimestamp: function (timestamp) {
            if(!timestamp) return;

            let currentTimestamp = this.getProperty(this.timestampKey);
            if(!currentTimestamp || timestamp > currentTimestamp) {
                this.removeProperty(this.roomsKey);
                this.removeProperty(this.usersKey);
                this.clearToken();
                this.setProperty(this.timestampKey, timestamp);
                this.cacheCleared = true;
            }
        },

        clearToken: function () {
            this.removeProperty(this.tokenKey);
            this.removeProperty(this.UIDKey);
            this.removeProperty(this.tokenExpiryKey);
            this.removeProperty(this.apiDetailsKey);
        }
    };
    return LocalStorage.init();
}]);