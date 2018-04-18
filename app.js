"use strict"

const fs = require('fs');
const argparse = require('argparse');
const _ = require('lodash');
const SlackForever = require('./');

var parser = new argparse.ArgumentParser({
    description: 'Keeps your slack active',
});

parser.addArgument(['-t', '--token'], {
    addHelp: true,
    help: 'Your slack token',
});

const args = parser.parseArgs();

if (!args.token) {
  console.error("Token not configured, see usage:");
  return parser.printHelp();
}

const slackForever = new SlackForever(args.token);
slackForever.init();
