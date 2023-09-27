const messages = {
  data: [
    {
      nickName: 'Bazinga78',
      timeStamp: '21:12 12.12.2021',
      messageText: 'Всем приветы!',
    },
    {
      nickName: 'Bazinga78',
      timeStamp: '21:12 12.12.2021',
      messageText: 'Как дела?',
    },
  ],
  users: new Set(['Bazinga78(default)']),

  addMessage(message) {
    this.data.push(message);
  },
};

module.exports = messages;
