/*
Copyright 2015, 2016 OpenMarket Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

var React = require('react');
var sdk = require('./index');

/*
 * Converts various data models to Entity objects.
 *
 * Entity objects provide an interface for UI components to use to display
 * members in a data-agnostic way. This means they don't need to care if the
 * underlying data model is a RoomMember, User or 3PID data structure, it just
 * cares about rendering.
 */

class Entity {
    constructor(model) {
        this.model = model;
    }

    getJsx() {
        return null;
    }

    matches(queryString) {
        return false;
    }
}

class MemberEntity extends Entity {
    getJsx() {
        var MemberTile = sdk.getComponent("rooms.MemberTile");
        return (
            <MemberTile key={this.model.userId} member={this.model} />
        );
    }

    matches(queryString) {
        return this.model.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    }
}

class UserEntity extends Entity {

    getJsx() {
        var UserTile = sdk.getComponent("rooms.UserTile");
        return (
            <UserTile key={this.model.userId} user={this.model} />
        );
    }

    matches(queryString) {
        var name = this.model.displayName || this.model.userId;
        return name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    }
}


module.exports = {
    /**
     * @param {RoomMember[]} members
     * @return {Entity[]}
     */
    fromRoomMembers: function(members) {
        return members.map(function(m) {
            return new MemberEntity(m);
        });
    },

    /**
     * @param {User[]} users
     * @return {Entity[]}
     */
    fromUsers: function(users) {
        return users.map(function(u) {
            return new UserEntity(u);
        })
    }
};