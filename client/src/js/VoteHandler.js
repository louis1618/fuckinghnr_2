import { io } from 'socket.io-client';

document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect("http://localhost:3001");
    const voteButton = document.getElementById('vote-button');
    const voteCountDisplay = document.getElementById('vote-count');
    let voteCount = 0;

    voteButton.addEventListener('click', () => {
        socket.emit('vote');
    });

    socket.on('updateVoteCount', (newCount) => {
        voteCount = newCount;
        voteCountDisplay.textContent = voteCount;
    });

    socket.on('connect', () => {
        console.log('서버에 연결되었습니다.');
        socket.emit('getInitialVoteCount'); // 초기 데이터
    });

    socket.on('disconnect', () => {
        console.log('서버와의 연결이 끊어졌습니다.');
    });

    socket.on('error', (error) => {
        console.error('Socket 오류:', error);
    });
});
