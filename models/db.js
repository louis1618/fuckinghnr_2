const { MongoClient } = require('mongodb');

let db, usersCollection, postsCollection, commentsCollection;

async function connectToDatabase() {
    const uri = process.env.MONGODB_URI;
    const dbName = process.env.DATABASE_NAME;

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db(dbName);
        usersCollection = db.collection('users');
        postsCollection = db.collection('posts');
        commentsCollection = db.collection('posts_comments');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = {
    connectToDatabase,
    getUsersCollection: () => usersCollection,
    getPostsCollection: () => postsCollection,
    getCommentsCollection: () => commentsCollection,
};
