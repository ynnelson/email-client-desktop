const Telios = require('@telios2/client-sdk');
const fs = require('fs');
const apiENV = require('./env_api.json');
const pkg = require('./package.json');

class Store {
  constructor() {
    this.api = {
      account: () => {
        return new Telios.Account({
          provider:
            process.env.NODE_ENV === 'production' ? pkg.api.prod : apiENV.dev
        });
      },
      mailbox: null
    };

    this.drive = null;
    this.acctpath = null;
    this.accountSecrets = {};
    this.account = null;
    this.currentAccount = null;
    this.sessionActive = false;
    this.keypair = null;
    this.authPayload = null;
    this.connection = {};
    this.theme = 'system';
    this.initialDraft = null;
    this.newDraft = null;
    this.draftDirty = false;
    // TODO: Retrieve this from remotely from server
    this.teliosPubKey = 'fa8932f0256a4233dde93195d24a6ae4d93cc133d966f3c9f223e555953c70c1';
  }

  setDrive({ name, keyPair, secret, acl = [] }) {
    this.drive = new Telios.Drive(name, null, {
      keyPair,
      secret,
      swarmOpts: {
        server: true,
        client: true,
        acl: [this.teliosPubKey, ...acl]
      }
    });
    return this.drive;
  }

  getDrive() {
    return this.drive;
  }

  setNewDraft(draft) {
    this.newDraft = draft;
  }

  getNewDraft() {
    return this.newDraft;
  }

  setInitialDraft(draft) {
    this.initialDraft = draft;
  }

  getInitialDraft() {
    return this.initialDraft;
  }

  setDraftDirty(bool) {
    this.draftDirty = bool;
  }

  getDraftDirty() {
    return this.draftDirty;
  }

  setAccountSecrets(secrets) {
    this.accountSecrets = secrets;
  }

  getAccountSecrets() {
    return this.accountSecrets;
  }

  setDBConnection(account, db) {
    this.connection = {};
    this.connection[account] = db;
    this.currentAccount = account;
  }

  getDBConnection(account) {
    return this.connection[account];
  }

  async closeDBConnection() {
    await this.connection[this.currentAccount].close();
    delete this.connection[this.currentAccount];
  }

  setKeypair(keypair) {
    this.keypair = keypair;
  }

  getKeypair() {
    return this.keypair;
  }

  setMailbox(mailbox) {
    this.api.mailbox = mailbox;
  }

  getMailbox() {
    return this.api.mailbox;
  }

  getAccount() {
    return this.account;
  }

  setAccount(account) {
    this.account = account;
  }

  setSessionActive(bool) {
    this.sessionActive = bool;
  }

  getSessionActive() {
    return this.sessionActive;
  }

  setAuthPayload(payload) {
    this.authPayload = payload;
  }

  getAuthPayload() {
    return this.authPayload;
  }

  setTheme(newTheme) {
    this.theme = newTheme;
  }

  getTheme() {
    return this.theme;
  }
}

const instance = new Store();

module.exports = instance;
