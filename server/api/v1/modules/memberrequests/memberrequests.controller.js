const service = require('./memberrequests.service');

const statusstring = [
  'approved', 'invitesent', 'accepted', 'requested', 'resent',
];


// Getting the table details for particular domain

function gettingValuesByDomain(domain, done) {
  const domainname = domain.toLowerCase();
  service.gettingValuesByDomain(domainname, done);
}


// Insert the values into the table for both request and invite

function InsertData(values, done) {
  let flag = false;
  if ((values.person.length) && (values.domain)) {
    if (values.domain !== null) {
      if (values.status.toLowerCase() !== 'approved' && values.status.toLowerCase() !== 'accepted') {
        statusstring.forEach((a) => {
          if (values.status.toLowerCase().includes(a)) {
            flag = true;
          }
        });
      }
    }
  }

  if (flag) {
    service.InsertData(values, done);
  } else {
    done('Error in operation, please try later..!');
  }
}

// Upadate the status for both request and invite

function updateStatus(params, bodyData, done) {
  let flag = false;
  const domain = params.domain.toLowerCase();
  const person = params.person.toLowerCase();
  const status = bodyData.status.toLowerCase();
  service.gettingValuesByDomainPerson(domain, person, (error, result) => {
    if (error) done('error in getting type for the given domain');
    let inviteType = '';
    if (result !== undefined && result.length > 0) {
      inviteType = result[0].type;
      if ((bodyData.status) && (bodyData.status !== null)) {
        statusstring.forEach((a) => {
          if (status.includes(a)) {
            flag = true;
          }
        });
      }
    }

    if (flag) {
      if ((status === 'approved') && (inviteType === 'request')) {
        if ((bodyData.member) && bodyData.member !== null) {
          service.statusUpdateRequest(domain, person, bodyData, done);
        } else done('Error in operation, please try later..!');
      } else if (((status === 'accepted') || (status === 'resent')) && (inviteType === 'invite')) {
        service.statusUpdateInvite(domain, person, bodyData, done);
      } else done('Error in operation, please try later..!');
    } else done('Error in operation, please try later..!');
  });
}

// Deleting the row in the table when the request or invite is rejected

function rejectedInviteRequest(domainvalue, personvalue, done) {
  let flag = false;
  const domainname = domainvalue.toLowerCase();
  const personname = personvalue.toLowerCase();
  service.gettingValuesByDomainPerson(domainname, personname, (error, result) => {
    if (error) { done('error in getting type for the given domain'); }

    if (result !== undefined && result.length > 0) {
      const checkdomain = result[0].domain;
      const checkperson = result[0].person;
      if (checkdomain === domainname && checkperson === personname) {
        flag = true;
      }
    }

    if (flag) {
      service.rejectedInviteRequest(domainname, personname, done);
    } else {
      done('Error in operation, please try later..!');
    }
  });
}


module.exports = {
  gettingValuesByDomain,
  InsertData,
  updateStatus,
  rejectedInviteRequest,

};
