const bcrypt = require('bcrypt');
const { getUsersCollection } = require('../models/db');

const saltRounds = 10;

async function signup(req, res) {
    const { username, password } = req.body;

    try {
        const usersCollection = getUsersCollection();
        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: '이미 존재하는 사용자명입니다.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await usersCollection.insertOne({ username, password: hashedPassword, rank: 0 });

        res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}

async function login(req, res) {
    const { username, password } = req.body;

    try {
        const usersCollection = getUsersCollection();
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
        }

        req.session.user = { id: user._id, username: user.username, rank: user.rank };
        res.status(201).json({ message: '로그인 성공', user: { username: user.username, rank: user.rank } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
}

function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
        }
        res.status(201).json({ message: '로그아웃 되었습니다.' });
    });
}

function getClientUserInfo(req, res) {
    if (req.session.user) {
        res.status(201).json({ isAuthenticated: true, user: req.session.user });
    } else {
        res.status(400).json({ isAuthenticated: false });
    }
}

module.exports = { signup, login, logout, getClientUserInfo };
