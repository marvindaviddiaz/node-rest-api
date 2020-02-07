const db = require('../util/database');


module.exports = class Post {

    constructor(email, password, name, enabled, locked) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.enabled = enabled;
        this.locked = locked;
    }

    static findById(email) {
        return db.execute(`
            select
                email,
                password,
                name,
                enabled,
                locked
            from
                users
            where
                email = ?`, [email]);
    }


    save() {
        return db.execute(`
                    insert into users(email, password, name, enabled, locked)
                    values (?, ? ,? ,?, ?)
            `,
            [this.email, this.password, this.name, this.enabled, this.locked]);
    }

};
