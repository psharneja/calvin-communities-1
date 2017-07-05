const model = require('cassandra-driver');
const connectionString = require('../../../../config').connectionString;

const logger = require('../../../../logger');

const MEMBERSHIP_TABLE = 'membership';

const client = new model.Client({
  contactPoints: [connectionString.contact],
  protocolOptions: { port: connectionString.port },
  keyspace: connectionString.keyspace,
});


/**
 *Add memeber to the community
 *
 * POST REQUEST
 *
 *
 */

function addMemberToCommunity(domainName, data, done) {
  const arr = [];
  const query = (`INSERT INTO ${MEMBERSHIP_TABLE} (username,domain,role,createdon,updatedon) values(?,?,?,dateof(now()),dateof(now()))`);
  data.forEach((val) => {
    arr.push({ query, params: [val.username, domainName.toLowerCase(), val.role.toLowerCase()] });
  });
  return client.batch(arr, { prepare: true }, (err) => {
    if (!err) {
      logger.debug('Member added');
      done(undefined);
    } else {
      done(err);
    }
  });
}

/**
 *Remove member from a community
 *
 * DELETE REQUEST
 *
 *
 */

function removeMemberFromCommunity(domainName, data, done) {
  const arr = [];
  const query = (`DELETE FROM ${MEMBERSHIP_TABLE} WHERE username =? AND domain = ? `);
  data.forEach((val) => {
    arr.push({ query, params: [val.username, domainName.toLowerCase()] });
  });
  return client.batch(arr, { prepare: true }, (err) => {
    if (!err) {
      logger.debug('Member deleted');
      done(undefined);
    } else {
      done(err);
    }
  });
}

/**
 *Modify role of a member in a community
 *
 * PATCH REQUEST
 *
 *
 */

function modifyRoleOfMemberFromCommunity(domainName, data, done) {
  const arr = [];
  const query = (`UPDATE ${MEMBERSHIP_TABLE} SET role =? ,updatedon = dateof(now()) WHERE domain =? AND username =? `);
  data.forEach((val) => {
    arr.push({ query, params: [val.role.toLowerCase(), domainName.toLowerCase(), val.username] });
  });
  return client.batch(arr, { prepare: true }, (err) => {
    if (!err) {
      logger.debug('Role modified');
      done(null);
    } else {
      done(err);
    }
  });
}

/**
 *get community Details of a particular member
 *
 * GET REQUEST
 *
 *
 */

function getCommunityList(username, done) {
  const query = `SELECT domain,role FROM ${MEMBERSHIP_TABLE} WHERE username = '${username}' `;
  return client.execute(query, (err, results) => {
    if (!err) {
      if (results.rows.length > 0) {
        done(undefined, { username, communityDetails: results.rows });
      } else {
        done({ error: 'please enter a valid username' }, undefined);
      }
    } else {
      done(err, undefined);
    }
  });
}

module.exports = {
  addMemberToCommunity,
  getCommunityList,
  modifyRoleOfMemberFromCommunity,
  removeMemberFromCommunity,
};
