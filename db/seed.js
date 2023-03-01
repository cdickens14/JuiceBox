const { client, getAllUsers, createUser } = require('./index.js');

const createInitialUsers = async() => {
    try {
        console.log("Starting to create users...");
        const albert = await createUser({username: 'albert', password: 'bertie99'});
        const sandra = await createUser({username: 'sandra', password: '2sandy4me'});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam'});
        console.log("Finished creating users!");
    } catch(err){
      console.error("Error creating users!");
      throw err;
    }
}
const dropTables = async() => {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
        DROP TABLE IF EXISTS users;
        `);
        console.log("Finished dropping tables!");
    } catch(err) {
      console.error("Error dropping tables!");
      throw err;
    }
}

const createTables = async() => {
    try {
        console.log("Starting to build tables...");
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
    `);
    console.log("Finished building tables!");
    } catch(err) {
      console.error("Error building tables!");
      throw err;
    }
}

const rebuildDB = async() => {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch(err) {
      console.log(err);
    }
}

const testDB = async() => {
    try {
        console.log("Starting to test database...");
        //client.connect();
        const users = await getAllUsers();
        console.log("getAllUsers:", users);
        console.log("Finished database test!");
    } catch(err) {
        console.error("Error testing database");
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());