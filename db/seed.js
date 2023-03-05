const { 
    client, 
    getAllUsers, 
    createUser, 
    updateUser, 
    createPost, 
    updatePost,
    getAllPosts,
    getPostsByUser,
    getUserById,
    addTagsToPost,
    createTags,
    createPostTag,
    getPostById,
    getPostsByTagName
     } = require('./index.js');

const dropTables = async() => {
    try {
        console.log("Starting to drop tables...");
        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
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
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true
        );
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id),
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        CREATE TABLE tags (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        );
        CREATE TABLE post_tags (
            "postId" INTEGER REFERENCES posts(id) UNIQUE,
            "tagId" INTEGER REFERENCES tags(id) UNIQUE
        );
    `);
    console.log("Finished building tables!");
    } catch(err) {
      console.error("Error building tables!");
      throw err;
    }
}

const createInitialUsers = async() => {
    try {
        console.log("Starting to create users...");
        await createUser({id: 1, username: 'albert', name: 'Al Bert', password: 'bertie99', location: 'Sydney, Australia', active: true});
        await createUser({id: 2, username: 'sandra', name: 'Just Sandra', password: '2sandy4me', location: "Ain't tellin", active: true});
        await createUser({ id: 3, username: 'glamgal', name: 'Joshua', password: 'soglam', location: 'Upper East Side', active: true });
        console.log("Finished creating users!");
    } catch(err){
      console.error("Error creating users!");
      throw err;
    }
}

const createInitialPosts = async() => {
    try {
        const [albert, sandra, glamgal] = await getAllUsers();
        console.log("Starting to create posts...");
        await createPost({
            authorId: albert.id,
            title: "First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
            tags: ["#happy", "#youcandoanything"]
        });
        await createPost({
            authorId: sandra.id,
            title: "How does this work?",
            content: "Hello I'm Sandra!",
            tags: ["#happy", "#worst-day-ever"]
        });
        await createPost({
            authorId: glamgal.id,
            title: "Living the glam life",
            content: "Hello, I am so glamorous!",
            tags: ["#happy", "#youcandoanything", "catmandoeverything"]
        });
        console.log("Finished creating post!");

    } catch(err){
      console.log("Error creating posts!");
      throw err;
    }
}

const rebuildDB = async() => {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialPosts();
    } catch(err) {
      console.log(err)
      throw err;
    }
}

const testDB = async() => {
    try {
        console.log("Starting to test database...");
        console.log("Calling getAllUsers");
        const users = await getAllUsers();
        console.log("Result:", users);
        console.log("Calling updateUser on users[0]");
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);
        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);
        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
            title: "New Title",
            content: "Updated Content"
        });
        console.log("Result:", updatePostResult);
        console.log("Calling updatePost on posts[1], only updating tags");
        const updatePostTagsResult = await updatePost(posts[1].id, {
            tags: ["#youcandoanything", "#redfish", "#bluefish"]
        });
        console.log("Result:", updatePostTagsResult);
        console.log("Calling getUserById with 1");
        const albert = await getUserById(1);
        console.log("Result:", albert);
        console.log("Calling getPostsByTagName with #happy");
        const postsWithHappy = await getPostsByTagName("#happy");
        console.log("Result:", postsWithHappy);
        console.log("Finished database test!");
    } catch(err) {
        console.error("Error testing database");
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());