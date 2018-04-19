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
        this.setActive();
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
    this.setActive();
  }

  setActive() {
    this.slack.api('users.setPresence', { presence: 'auto' }, (err, response) => {
      if (err) {
        console.error(`error[users.setActive]: ${err}`);
      }
    });
  }

  getPresence() {
    this.slack.api('users.getPresence', (err, response) => {
      console.log(response);
    });
  }

}

module.exports = SlackForever;
