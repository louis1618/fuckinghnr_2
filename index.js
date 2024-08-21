const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3001;
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
require('dotenv').config();

const saltRounds = 10;
const uri = process.env.MONGODB_URI;
const dbName = process.env.DATABASE_NAME;
let db, votesCollection, usersCollection, postsCollection = 0;

MongoClient.connect(uri)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
    usersCollection = db.collection('users');
    postsCollection = db.collection('posts');
  })
  .catch(error => console.error('Error connecting to MongoDB:', error));

app.use(express.json());
var cors = require('cors');
app.use(cors());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'Strict'
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    
    try {
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
  });

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    req.session.user = { id: user._id, username: user.username, rank: user.rank };
    res.json({ message: '로그인 성공', user: { username: user.username, rank: user.rank } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: '로그아웃 중 오류가 발생했습니다.' });
    }
    res.json({ message: '로그아웃 되었습니다.' });
  });
});

app.get('/api/getClientUserInfo', (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  if (req.session.user) {
    try {
      const postId = req.params.id;
      const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching post' });
    }
  } else {
      res.status(500).json({ message: '권한이 없습니다.' });
  }
});

app.post('/api/rposts', async (req, res) => {
  try {
    const { user } = req.session;
    if (!user || user.rank === undefined) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const newPost = req.body;
    const userId = new ObjectId(user.id);
    const userData = await usersCollection.findOne({ _id: userId });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.rank === 5) {
      newPost.rank = "관리자";
    } else {
      newPost.rank = "유저";
    }

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}년 ${month}월 ${day}일`;
    }

    newPost.date = formatDate(new Date());
    newPost.createdAt = new Date();
    newPost.author = userData.username;

    const result = await postsCollection.insertOne(newPost);
    const posts = await postsCollection.find().toArray();
    res.status(201).json(posts);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
});

app.get('/api/posts', async (req, res) => {
  if (req.session.user) {
    try {
      const posts = await postsCollection.find().toArray();
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Server error occurred while fetching posts.' });
    }
  } else {
    res.status(500).json({ message: '권한이 없습니다.' });
  }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

function getClientInfo(socket) {
    return {
        socketId: socket.id,
        ipAddress: socket.handshake.address,
        connectTime: new Date(socket.handshake.time),
        userAgent: socket.handshake.headers['user-agent'],
        query: socket.handshake.query,
        cookies: socket.handshake.headers.cookie
    };
}

io.on('connection', (socket) => {
    console.log('A user connected');
    const clientInfo = getClientInfo(socket);
    console.log('New connection client info:', clientInfo);

    socket.emit('updateVoteCount', voteCount);

    socket.on('getInitialVoteCount', () => {
        socket.emit('updateVoteCount', voteCount);
    });

    socket.on('vote', async (clientData) => {
        voteCount++;
        await votesCollection.updateOne({ name: 'voteCount' }, { $set: { count: voteCount } });
        const clientInfo = getClientInfo(socket);
        console.log('Vote from client:', { ...clientInfo, ...clientData });
        io.emit('updateVoteCount', voteCount);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

http.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
