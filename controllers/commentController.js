const { getCommentsCollection, getUsersCollection } = require('../models/db');
const { ObjectId } = require('mongodb');

async function getComments(req, res) {
    const { postId } = req.params;
    const commentsCollection = getCommentsCollection();

    try {
        const comments = await commentsCollection.find({ postId: new ObjectId(postId) }).toArray();
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}

async function createComment(req, res) {
    const { postId, content } = req.body;
    const { user } = req.session;

    if (!user || user.rank === undefined) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const userId = new ObjectId(user.id);
    const commentsCollection = getCommentsCollection();
    const usersCollection = getUsersCollection();

    try {
        const userData = await usersCollection.findOne({ _id: userId });
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newComment = {
            postId: new ObjectId(postId),
            author: userData.username,
            content,
            createdAt: new Date()
        };

        await commentsCollection.insertOne(newComment);
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}

module.exports = { getComments, createComment };
