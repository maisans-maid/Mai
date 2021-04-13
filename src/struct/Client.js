'use strict';

const { Client, version, APIMessage } = require('discord.js');
const { performance } = require('perf_hooks');
const { readdirSync } = require('fs');
const { join } = require('path');

const Anischedule = require('./Anischedule');
const Mongoose = require('./Mongoose');
const Commands = require('./Commands');
const Music = require('./Music');
const Interaction = require('./Interaction');
const Services = require('./Services');

module.exports = class MaiClient extends Client{
  constructor(settings){
    super(settings);

    if (typeof settings.prefix !== 'string'){
      settings.prefix = 'm!';
    };

    if (!this.token && 'TOKEN' in process.env){
      this.token = process.env.TOKEN;
    };

    this.bootTime = null;

    this.services = new Services(this);

    this.commands = new Commands(this);

    if ('MONGO_URI' in process.env){
      this.database = new Mongoose(this, settings.database);
    } else {
      this.database = null;
    };

    this.anischedule = new Anischedule(this);

    this.music = new Music(this);

    this.database?.db.connection.once('connected', () => {
      this.anischedule.init();

      if (!this.readyAt){
        this.once('ready', () => this.loadProfiles());
      } else {
        this.loadProfiles();
      };
    });

    this.once('ready', async () => {
      // Once a slash command is uploaded to a guild
      // it will stick there forever even if the bot dies
      // as long as permissions for bot.commands is enabled.
      // Do not attempt to load the commands everytime the bot
      // starts to avoid API ratelimit.

      // Sample only
      this.guilds.cache.get('590024931916644372')?.loadSlashCommands();
    });

    this.interaction = new Interaction(this);

    this.services = new Services(this);

    this.owner = settings.owner;
    this.prefix = settings.prefix;
  };

  async loadProfiles(){
    const res = await this.database['GuildProfile'].find({});
    await this.shard.broadcastEval('this.guilds.cache.each(guild => guild._inherit('+ JSON.stringify(res) +'))');
  };

  /**
   * Load event files to this client instance
   * @returns {undefined}
   */
  loadEvents(){
    const eventpath = join(__dirname, '..', 'events');
    const eventdir = readdirSync(eventpath);
    for (const dir of eventdir.filter(x => !x.startsWith('_'))){
      const file = require(join(eventpath, dir));
      this.on(dir.split('.')[0], file.bind(null, this));
    };
    console.log(`\x1b[32m[MAI_EVENTS]\x1b[0m: Loaded \x1b[32m${eventdir.length}\x1b[0m event files!`)
  };

  /**
  * Executes a function once and then loops it
  * @param {function} function The function to execute
  * @param {number} delay The delay between each execution
  * @param {params} parameter Additional parameters for the Interval function
  * @returns {Timeout} timeout returns a Timeout object
  */
  loop(fn, delay, ...param){
    fn();
    return setInterval(fn, delay, ...param);
  };

  get version(){
    return {
      library: version,
      client: require(join(__dirname, '../..', 'package.json')).version
    };
  };
};