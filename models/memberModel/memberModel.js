const pool = require('../config'); // Assuming you have a database connection pool
const bcryptjs = require('bcryptjs')


const MembershipModel = {


  // Retrieve the request status
  getMembershipRequestStatus: (requestId, callback) => {
    const selectStatusQuery = 'SELECT membership_status FROM membership_request WHERE member_req_id = ?';

    pool.query(selectStatusQuery, [requestId], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      if (results.length === 0) {
        return callback('Request not found', null);
      }

      const status = results[0].membership_status;
      return callback(null, status);
    });
  },

  createMember: (requestData, callback) => {
    const insertQueryMembers = 'INSERT INTO members (first_name, last_name, dob, gender, email_id, contact_no, member_type, membership_plan, member_category, created_by, created_on, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(),0)';
    const insertQueryAddress = 'INSERT INTO address (member_id,member_company_id, member_address_type, street_address, city, state, country, zip_code, created_by, created_on,is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,NOW(),0)';
    const insertQueryMembersCompany = 'INSERT INTO members_company_details (company_name, company_title, company_email, company_contact_no, company_website, company_linkedIn_url, created_by, created_on,is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(),0)';
    const insertQueryMembership = 'INSERT INTO membership_detail (member_id, membership_status, membership_start_date, membership_end_date, membership_renewal_date, fee, member_category, payment_date, payment_method, payment_status, is_active, created_by, created_on, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(),0)';
    const insertQueryUser = 'INSERT INTO user (member_id,user_name, password, role_id, is_active, created_by, created_on, is_delete) VALUES (?, ?, ?, ?, ?, ?, NOW(), 0)';
    let member_id;
    let member_company_id;
    const {
      member_req_id,
      membership_status,
      role_id,
      first_name,
      last_name,
      dob,
      gender,
      email_id,
      contact_no,
      member_type,
      membership_plan,
      member_category,
      chapter_id,
      street_address,
      city,
      state,
      country,
      zip_code,
      company_name,
      company_title,
      company_email,
      company_contact,
      company_website,
      company_linkedIn_url,
      company_address,
      company_city,
      company_state,
      company_country,
      company_zip_code,
      users_id
    } = requestData;

    // insert data in the Member Table
    const valuesMembers = [first_name, last_name, dob, gender, email_id, contact_no, member_type, membership_plan, member_category, users_id];

    pool.query(insertQueryMembers, valuesMembers, (error, results) => {
      if (error) {
        return callback(error);
      }
      else {
        member_id = results.insertId;
        // If company data is present, insert data in the members_company_details Table and then the Address Table
        if (company_name) {
          // Insert data in the members_company_details Table
          const valuesMembersCompany = [company_name, company_title, company_email, company_contact, company_website, company_linkedIn_url, users_id];
          pool.query(insertQueryMembersCompany, valuesMembersCompany, (error, results) => {
            if (error) {
              return callback(error);
            }
            member_company_id = results.insertId;
            // Insert data in the Address Table As corporate
            const valuesCompanyAddress = [member_id, member_company_id, 'corporate', company_address, company_city, company_state, company_country, company_zip_code, users_id];
            pool.query(insertQueryAddress, valuesCompanyAddress, (error) => {
              if (error) {
                console.log(error);
                return callback(error);
              }
              // Insert data in the Address Table As individual
              const valuesIndividualAddress = [member_id, member_company_id, 'individual', street_address, city, state, country, zip_code, users_id];
              pool.query(insertQueryAddress, valuesIndividualAddress, (error) => {
                if (error) {
                  console.log(error);
                  return callback(error);
                }
                // Insert data in the Membership_Details Table
                const valuesinsertQueryMembership = [member_id, 'Accept', null, null, null, null, member_category, null, null, null, 1, users_id];
                pool.query(insertQueryMembership, valuesinsertQueryMembership, (error) => {
                  if (error) {
                    console.log(error);
                    return callback(error);
                  }
                  // Generate a random password
                  function generateRandomPassword(length) {
                    let result = '';
                    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    const charactersLength = characters.length;
                    for (let i = 0; i < length; i++) {
                      result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                  }
                  const generatedPassword = generateRandomPassword(8); // You can adjust the length as needed
                  // Use the generated password in the query and for sending it to the user's email
                  const valuesinsertQueryUser = [member_id, first_name, generatedPassword, role_id, 1, users_id];
                  pool.query(insertQueryUser, valuesinsertQueryUser, (error) => {
                    if (error) {
                      return callback(error);
                    }
                    // Update the status in the membership_request table
                    const updateStatusQuery = 'UPDATE membership_request SET membership_status = ? WHERE member_req_id = ?';
                    pool.query(updateStatusQuery, [membership_status, member_req_id], (error, results) => {
                      if (error) {
                        return callback(error);
                      }
                      const selectQuery = `
                      SELECT m.*, a.*, mc.*,u.*
                      FROM cb_project.members AS m
                      LEFT JOIN cb_project.address AS a ON m.member_id = a.member_id
                      LEFT JOIN cb_project.user AS u ON m.member_id = u.member_id
                      LEFT JOIN cb_project.members_company_details AS mc ON a.member_company_id = mc.member_company_id
                          WHERE m.member_id = ?;
                        `;
                  
                      pool.query(selectQuery, [member_id], (error, results) => {
                        if (error) {
                          return callback(error, null);
                        } else {
                  
                          if (results.length === 0) {
                            return callback('Member not found', null);
                          }
                        }
                        const memberData = results[0];
                        return callback(null, memberData);
                      });
                    });

                  })
                });
              });
            });
          })
        } else {
          // Insert data in the Address Table As individual
          const valuesIndividualAddress = [member_id, member_company_id, 'individual', street_address, city, state, country, zip_code, users_id];
          pool.query(insertQueryAddress, valuesIndividualAddress, (error) => {
            if (error) {
              console.log(error);
              return callback(error);
            }
            // Insert data in the Membership_Details Table
            const valuesinsertQueryMembership = [member_id, 'Accept', null, null, null, null, member_category, null, null, null, 1, users_id];
            pool.query(insertQueryMembership, valuesinsertQueryMembership, (error) => {
              if (error) {
                console.log(error);
                return callback(error);
              }
              // Generate a random password
              function generateRandomPassword(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                const charactersLength = characters.length;
                for (let i = 0; i < length; i++) {
                  result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                console.log(result);
                return result;
              }
              const generatedPassword = generateRandomPassword(8); // You can adjust the length as needed
              console.log(generatedPassword);
              //get hash pass & save new user into db
              // const hashpass =  bcryptjs.hash(generatedPassword, bcryptjs.genSalt(10))
              // console.log(hashpass);
              // Use the generated password in the query and for sending it to the user's email
              const valuesinsertQueryUser = [member_id, first_name, generatedPassword, role_id, 1, users_id];
              pool.query(insertQueryUser, valuesinsertQueryUser, (error) => {
                if (error) {
                  console.log(error);
                  return callback(error);
                }
                // Update the status in the membership_request table
                const updateStatusQuery = 'UPDATE membership_request SET membership_status = "Accepted" WHERE member_req_id = ?';
                pool.query(updateStatusQuery, [member_req_id], (error, results) => {
                  if (error) {
                    console.log(error);
                    return callback(error);
                  }
                  // const memberData = results;
                  const selectQuery = ` SELECT m.*, a.*, mc.*,u.*
    FROM cb_project.members AS m
    LEFT JOIN cb_project.address AS a ON m.member_id = a.member_id
    LEFT JOIN cb_project.user AS u ON m.member_id = u.member_id
    LEFT JOIN cb_project.members_company_details AS mc ON a.member_company_id = mc.member_company_id
        WHERE m.member_id = ?;
      `;

                  pool.query(selectQuery, [member_id], (error, results) => {
                    if (error) {
                      return callback(error, null);
                    } else {

                      if (results.length === 0) {
                        return callback('Member not found', null);
                      }
                    }
                    const memberData = results[0];
                    return callback(null, memberData);
                  });
                });
              })
            });
          });
        }
      }
    });
  },
 
  // Get a member by ID//
  getMemberById: (member_id, callback) => {
    const selectQuery = `
    SELECT m.*, a.*, mc.*,u.*,md.*
    FROM cb_project.members AS m
    LEFT JOIN cb_project.membership_detail AS md ON m.member_id = md.member_id
    LEFT JOIN cb_project.address AS a ON m.member_id = a.member_id
    LEFT JOIN cb_project.user AS u ON m.member_id = u.member_id
    LEFT JOIN cb_project.members_company_details AS mc ON a.member_company_id = mc.member_company_id
        WHERE m.member_id = ?;
      `;

    pool.query(selectQuery, [member_id], (error, results) => {
      if (error) {
        return callback(error, null);
      } else {

        if (results.length === 0) {
          return callback('Member not found', null);
        }
      }
      const memberData = results[0];
      return callback(null, memberData);
    });
  },
 //get  members all data by frist name for search
 getMembersBySearch: (first_name, last_name, callback) => {
  let selectQuery = `
  SELECT m.*, a.*, mc.*, c.*
  FROM cb_project.members AS m 
  LEFT JOIN cb_project.address AS a ON m.member_id = a.member_id 
  LEFT JOIN cb_project.members_company_details AS mc ON a.member_company_id = mc.member_company_id 
  LEFT JOIN cb_project.chapter as c on m.chapter_id = c.chapter_id
  WHERE m.is_delete = false
    `;

  const queryParams = [];

  if (first_name && last_name) {
    selectQuery += ` AND (m.first_name LIKE ? OR m.last_name LIKE ?) `;
    queryParams.push(`%${first_name}%`, `%${last_name}%`);
  } else if (first_name) {
    selectQuery += ` AND m.first_name LIKE ? `;
    queryParams.push(`%${first_name}%`);
  } else if (last_name) {
    selectQuery += ` AND m.last_name LIKE ? `;
    queryParams.push(`%${last_name}%`);
  }

  pool.query(selectQuery, queryParams, (error, results) => {
    if (error) {
      return callback(error, null);
    } else {
      if (results.length === 0) {
        return callback('No Members found', null);
      }
      return callback(null, results);
    }
  });
},

 //get all members list
  getAllMembers: (callback) => {
    const selectQuery = `
        SELECT m.*, a.*, mc.*, md.*
        FROM cb_project.members AS m
        LEFT JOIN cb_project.membership_detail AS md ON m.member_id = md.member_id
        LEFT JOIN cb_project.address AS a ON m.member_id = a.member_id
        LEFT JOIN cb_project.members_company_details AS mc ON a.member_company_id = mc.member_company_id
        WHERE m.is_delete = false
        ORDER BY m.member_id DESC;
    `;

    pool.query(selectQuery, (error, results) => {
        if (error) {
            return callback(error, null);
        } else {
            if (results.length === 0) {
                return callback('No Members found', null);
            }
            return callback(null, results);
        }
    });
},

  // Update the member isdelete status
  //   updateMember: (member_id, updatedData, updated_by, callback) => {
  //     const updateQuery = `
  //     UPDATE members AS m
  //     LEFT JOIN address AS a ON m.member_id = a.member_id
  //     LEFT JOIN members_company_details AS mc ON a.member_company_id = mc.member_company_id
  //     SET
  //         m.first_name = ?,
  //         m.last_name = ?,
  //         m.dob = ?,
  //         m.gender = ?,
  //         m.email_id = ?,
  //         m.contact_no = ?,
  //         m.member_type = ?,
  //         m.membership_plan = ?,
  //         m.member_category = ?,
  //         m.chapter_id = ?,
  //         m.update_on = NOW(),
  //         m.updated_by = ?,
  //         a.street_address = ?,
  //         a.city = ?,
  //         a.state = ?,
  //         a.country = ?,
  //         a.zip_code = ?,
  //         a.update_on = NOW(),
  //         a.updated_by = ?,
  //         mc.company_name = ?,
  //         mc.company_title = ?,
  //         mc.company_email = ?,
  //         mc.company_contact = ?,
  //         mc.company_website = ?,
  //         mc.company_linkedIn_url = ?,
  //         mc.company_size = ?,
  //         mc.update_on = NOW(),
  //         mc.updated_by = ?
  //     WHERE m.member_id = ?;
  //   `;
  // // let updated_by;
  //     const values = [
  //       updatedData.first_name,
  //       updatedData.last_name,
  //       updatedData.dob,
  //       updatedData.gender,
  //       updatedData.email_id,
  //       updatedData.contact_no,
  //       updatedData.member_type,
  //       updatedData.membership_plan,
  //       updatedData.member_category,
  //       updatedData.chapter_id,
  //       // updated_by=updatedData.users_id, // updated_by
  //       updatedData.street_address,
  //       updatedData.city,
  //       updatedData.state,
  //       updatedData.country,
  //       updatedData.zip_code,
  //       // updated_by=updatedData.users_id, // updated_by
  //       updatedData.company_name,
  //       updatedData.company_title,
  //       updatedData.company_email,
  //       updatedData.company_contact,
  //       updatedData.company_website,
  //       updatedData.company_linkedIn_url,
  //       updatedData.company_size,
  //       updated_by=updatedData.users_id, // updated_by
  //       member_id // member_id
  //     ];

  //     pool.query(updateQuery, values, (error, results) => {
  //       if (error) {
  //         return callback(error, null);
  //       }else {

  //       if (results.length === 0) {
  //         return callback('No Members found', null);
  //       }
  //     }

  //       return callback(null, results);
  //     });
  //   },
  updateMember: (requestData, callback) => {
    // Extract the necessary data from the request
    const {
      member_id,
      first_name,
      last_name,
      dob,
      gender,
      email_id,
      contact_no,
      member_type,
      membership_plan,
      member_category,
      company_name,
      company_title,
      company_email,
      company_contact,
      company_website,
      company_linkedIn_url,
      company_address,
      company_city,
      company_state,
      company_country,
      company_zip_code,
      street_address,
      city,
      state,
      country,
      zip_code,
      membership_status,
      role_id,
      member_req_id,
      users_id
    } = requestData;

    const updated_by = users_id;
    const updated_on = new Date(); // Current date

    // Update Members Table
    const updateMembersQuery = 'UPDATE members SET first_name = ?, last_name = ?, dob = ?, gender = ?, email_id = ?, contact_no = ?, member_type = ?, membership_plan = ?, member_category = ?, updated_by = ?, updated_on = ? WHERE member_id = ?';

    const valuesMembers = [first_name, last_name, dob, gender, email_id, contact_no, member_type, membership_plan, member_category, updated_by, updated_on, member_id];

    pool.query(updateMembersQuery, valuesMembers, (error, results) => {
      if (error) {
        return callback(error);
      }

      // If company data is present, update data in the members_company_details Table and then the Address Table
      if (company_name) {
        // Update data in the members_company_details Table
        const updateMembersCompanyQuery = 'UPDATE members_company_details SET company_name = ?, company_title = ?, company_email = ?, company_contact_no = ?, company_website = ?, company_linkedIn_url = ?, updated_by = ?, updated_on = ? WHERE member_id = ?';

        const valuesMembersCompany = [company_name, company_title, company_email, company_contact, company_website, company_linkedIn_url, updated_by, updated_on, member_id];

        pool.query(updateMembersCompanyQuery, valuesMembersCompany, (error, results) => {
          // Handle the error
        });

        // Update data in the Address Table for corporate
        const updateCompanyAddressQuery = 'UPDATE address SET street_address = ?, city = ?, state = ?, country = ?, zip_code = ?, updated_by = ?, updated_on = ? WHERE member_id = ? AND member_company_id = ? AND member_address_type = ?';

        const valuesCompanyAddress = [company_address, company_city, company_state, company_country, company_zip_code, updated_by, updated_on, member_id, member_company_id, 'corporate'];

        pool.query(updateCompanyAddressQuery, valuesCompanyAddress, (error) => {
          // Handle the error
        });

        // Update data in the Address Table for individual
        const updateIndividualAddressQuery = 'UPDATE address SET street_address = ?, city = ?, state = ?, country = ?, zip_code = ?, updated_by = ?, updated_on = ? WHERE member_id = ? AND member_address_type = ?';

        const valuesIndividualAddress = [street_address, city, state, country, zip_code, updated_by, updated_on, member_id, 'individual'];

        pool.query(updateIndividualAddressQuery, valuesIndividualAddress, (error) => {
          // Handle the error
        });

        // Update data in the Membership_Details Table
        const updateMembershipQuery = 'UPDATE membership_detail SET membership_status = ?, updated_by = ?, updated_on = ? WHERE member_id = ?';

        const valuesMembership = [membership_status, updated_by, updated_on, member_id];

        pool.query(updateMembershipQuery, valuesMembership, (error) => {
          // Handle the error
        });

        // Update data in the User Table
        const updateUserQuery = 'UPDATE user SET user_name = ?, role_id = ?, updated_by = ?, updated_on = ? WHERE member_id = ?';

        const valuesUser = [email_id, role_id, updated_by, updated_on, member_id];

        pool.query(updateUserQuery, valuesUser, (error) => {
          // Handle the error
        });

        // Update the status in the membership_request table
        const updateStatusQuery = 'UPDATE membership_request SET membership_status = ?, updated_by = ?, updated_on = ? WHERE member_req_id = ?';

        const valuesStatus = [membership_status, updated_by, updated_on, member_req_id];

        pool.query(updateStatusQuery, valuesStatus, (error, results) => {
          if (error) {
            return callback(error);
          }
          const memberData = results;
          return callback(null, memberData);
        });
      }
    });
  }
  ,
  // delete the member record
  deleteMember: (requestId, callback) => {
    // Instead of deleting the record, update is_deleted to true
    const updateQuery = `UPDATE members AS m
  LEFT JOIN address AS a ON m.member_id = a.member_id
  LEFT JOIN members_company_details AS mc ON a.member_company_id = mc.member_company_id
  SET m.is_delete = true, a.is_delete = true, mc.is_delete = true
  WHERE m.member_id = ?;`

    pool.query(updateQuery, [requestId], (error, results) => {
      if (error) {
        return callback(error, null);
      } else {

        if (results.length === 0) {
          return callback('No Members found', null);
        }
      }
      return callback(null, results);
    });
  },

// update member personal
updateMemberPersonal : (member_id,updatedPersonalData, callback) => {
  // Instead of deleting the record, update it with the new data
  const updateQuery = `UPDATE members AS m
    LEFT JOIN address AS a ON m.member_id = a.member_id
    SET m.first_name = ?, m.email_id = ?, m.member_address_type = ?
    WHERE m.member_id = ?;`

  // You should pass the updated data as an array to `pool.query`
  const updateValues = [
    updatedPersonalData.first_name,
    updatedPersonalData.email_id,
    updatedPersonalData.member_address_type,
    member_id
  ];

  pool.query(updateQuery, updateValues, (error, results) => {
    if (error) {
      return callback(error, null);
    } else {
      if (results.affectedRows === 0) {
        return callback('No Members found', null);
      }
      return callback(null, results);
    }
  });


},

}




module.exports = MembershipModel;

