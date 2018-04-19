const _ = require('lodash');
const SlackBot = require('slackbotapi');
const Slack = require('slack-node');

class SlackForever {
  constructor(token) {
    this.token = token;
    this.slack = new Slack(token);
    this.slackbot = new SlackBot({
      token: token,
      logging: false,
      autoReconnect: true,
    });
  }

  init() {
    console.log('check token');
    this.slack.api('auth.test', (err, response) => {
      if (err) {
        console.error(`error[auth.test]: ${err}`);
        return;
      }
      console.log(`userID: ${response['user_id']}`);
      this.user_id = response['user_id'];
      this.slackbot.on('manual_presence_change', this.handle.bind(this));
      this.slackbot.on('presence_change', this.handle.bind(this));
      setInterval(() => {
        console.log('auto active...');
        this.update();
      }, 30 * 60 * 1000);
    });
  }

  handle(data) {
    if (data['user'] && data['user'] !== this.user_id) {
      return;
    }
    console.log(`Presence change: ${data['presence']}`);

    if (data['presence'] !== 'away') {
      return;
    }

    console.log('Setting myself active');
    this.update();
  }

  update() {
    this.getPresence(() => {
      this.setActive(() => {
        this.getPresence();
      })
    });
  }

  setActive(callback) {
    const noop = () => {};
    callback = callback || noop;
    console.log('call users.setPresence...');
    this.slack.api('users.setPresence', { presence: 'auto' }, (err, response) => {
      if (err) {
        console.error(`error[users.setActive]: ${err}`);
      }
      callback();
    });
  }

  getPresence(callback) {
    console.log('call users.getPresence...');
    const noop = () => {};
    callback = callback || noop;
    this.slack.api('users.getPresence', (err, response) => {
      console.log(response);
      callback();
    });
  }

}

module.exports = SlackForever;
