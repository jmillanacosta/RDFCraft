// Create default db

db.createUser({
  user: 'maptool',
  pwd: 'passwd',
  roles: [
    {
      role: 'readWrite',
      db: 'mapping_db',
    },
  ],
});

// Create admin user in UserDocument collection

db.UserDocument.insert({
  username: 'admin',
  password: '$2b$12$3N55TWmQjPlYkqrR5SVONeO88VetuL31Jjuie61MYI5KZzQdHYj0W',
  roles: ['admin'],
});
