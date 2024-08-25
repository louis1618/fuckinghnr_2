const { getPostsCollection, getUsersCollection } = require('../models/db');
const { ObjectId } = require('mongodb');

async function getPost(req, res) {
    if (req.session.user) {
        try {
            const postId = req.params.id;
            const post = await getPostsCollection().findOne({ _id: new ObjectId(postId) });

            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.json(post);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching post' });
        }
    } else {
        res.status(403).json({ message: '권한이 없습니다.' });
    }
}

async function getAllPosts(req, res) {
    if (req.session.user) {
        try {
            const posts = await getPostsCollection().find().toArray();
            res.json(posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
            res.status(500).json({ message: '서버 오류가 발생했습니다.' });
        }
    } else {
        res.status(403).json({ message: '권한이 없습니다.' });
    }
}

async function createPost(req, res) {
    try {
        const { user } = req.session;
        if (!user || user.rank === undefined) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const newPost = req.body;
        const userId = new ObjectId(user.id);
        const userData = await getUsersCollection().findOne({ _id: userId });

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (newPost.title && newPost.description && (newPost.tags === undefined || (Array.isArray(newPost.tags) && (newPost.tags.length === 0 || newPost.tags.length > 0)))) {
            newPost.rank = user.rank === 5 ? "관리자" : "유저";
            newPost.date = formatDate(new Date());
            newPost.createdAt = new Date();
            newPost.author = userData.username;
            newPost.a_id = userData._id;
        
            await getPostsCollection().insertOne(newPost);
            const posts = await getPostsCollection().find().toArray();
            res.status(201).json(posts);
        } else {
            res.status(400).json({ message: '비정상적인 행동이 감지되었습니다.' });
        }    
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
}

module.exports = { getPost, getAllPosts, createPost };
