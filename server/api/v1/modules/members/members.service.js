const model = require('cassandra-driver');

const connectionString = require('../../../../config');

const MEMBERS_TABLE = 'members';

const client = new model.Client({
  contactPoints: [connectionString.contact],
  protocolOptions: { port: connectionString.port },
  keyspace: connectionString.keyspace,
});

// Add member to the community
function addedMemberToCommunity(params, done) {
  const query = (`INSERT INTO ${MEMBERS_TABLE} (username,domain,role) values('${params.userName}','${params.domainName}','${params.role}')`);
  return client.execute(query, (err) => {
    if (err) {
      done(err);
    } else {
      done();
    }
  });
}

// Get particular member with all community details
function getParticularMemberDetailInCommunities(userName, done) {
  const query = `SELECT domain,role FROM ${MEMBERS_TABLE} where username = '${userName}' `;
  return client.execute(query, (err, results) => {
    if (!err) {
      done(err, results.rows);
    } else {
      done(err, undefined);
    }
  });
}

// Modify role of a member in a community
function modifyRoleOfMemberFromCommunity(params, memberRole, done) {
  const query = (`UPDATE ${MEMBERS_TABLE} SET role = '${memberRole}' where domain = '${params.domainName}' AND username ='${params.userName}' IF EXISTS `);
  return client.execute(query, (err) => {
    if (!err) {
      done(err);
    } else {
      done(err);
    }
  });
}

// Remove member from the community
function removeMemberFromCommunity(params, done) {
  const query = (`DELETE FROM ${MEMBERS_TABLE} where domain = '${params.domainName}' AND username ='${params.userName}' IF EXISTS`);
  return client.execute(query, (err) => {
    if (!err) {
      done(err);
    } else {
      done(err);
    }
  });
}

module.exports = {
  addedMemberToCommunity,
  getParticularMemberDetailInCommunities,
  modifyRoleOfMemberFromCommunity,
  removeMemberFromCommunity,
};
