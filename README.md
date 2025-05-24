const moment = require("moment");

async function createOrUpdateStudent(req, res) {
  try {
    let {
      row_id,
      gender,
      student_name,
      father_name,
      address,
      state,
      city,
      zip_code,
      adhar_number,
      phone_r,
      phone_o,
      mobile_no,
      dob,
      education,
      medium,
      account_no,
      account_name,
      bank_name,
      branch_name,
      ifsc_code,
      remarks,
    } = req.data;

    // ======= Required Field Validation =======
    const missingFields = [];
    if (!student_name) missingFields.push("Student Name");
    if (!father_name) missingFields.push("Father's Name");
    if (!gender) missingFields.push("Gender");

    if (missingFields.length > 0) {
      return libFunc.sendResponse(res, {
        status: 1,
        msg: `Please provide the following required field(s): ${missingFields.join(", ")}`,
      });
    }

    // ======= Mobile Number Validation =======
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile_no)) {
      return libFunc.sendResponse(res, {
        status: 1,
        msg: "Please enter a valid 10-digit mobile number starting with 6-9.",
      });
    }

    // ======= IFSC Code Validation =======
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
    if (ifsc_code && !ifscRegex.test(ifsc_code)) {
      return libFunc.sendResponse(res, {
        status: 1,
        msg: "Please enter a valid 11-character alphanumeric IFSC code (e.g., SBIN0001234).",
      });
    }

    // ======= Format Date =======
    const formattedDate = moment(dob).format("YYYY-MM-DD");

    let response;

    if (row_id) {
      // ========== Update Student ==========
      const updateData = {
        gender,
        student_name,
        father_name,
        dob: formattedDate,
        mobile_no,
        address,
        state,
        city,
        zip_code,
        ahhar_no: adhar_number,
        phone_r,
        phone_o,
        medium,
        education,
        account_no,
        account_name,
        bank_name,
        branch_name,
        ifsc_code,
        remarks,
        up_on: new Date().toISOString(),
      };

      await query.update_data(students, updateData, { row_id: row_id });

      response = {
        status: 0,
        msg: "Student updated successfully",
      };
    } else {
      // ========== Create Student ==========
      row_id = libFunc.randomid();

      // Fetch the latest roll_no from the database and increment by 1
      const latestRollNoQuery = `SELECT MAX(roll_no) as roll_no FROM ${schema}.students`;
      const latestRollNoResult = await query.custom_query(latestRollNoQuery);

      let roll_no = 1000; // Default starting roll_no
      if (
        latestRollNoResult &&
        latestRollNoResult[0] &&
        latestRollNoResult[0].roll_no
      ) {
        roll_no = latestRollNoResult[0].roll_no + 1;
      }

      const createData = {
        row_id,
        gender,
        student_name,
        father_name,
        dob: formattedDate,
        mobile_no,
        address,
        state,
        city,
        zip_code,
        ahhar_no: adhar_number,
        phone_r,
        phone_o,
        medium,
        education,
        account_no,
        account_name,
        bank_name,
        branch_name,
        ifsc_code,
        remarks,
        roll_no,
      };

      await query.insert_data(students, createData);

      response = {
        status: 0,
        msg: "Student created successfully",
      };
    }

    console.log("Student response:", response);
    libFunc.sendResponse(res, response);
  } catch (error) {
    libFunc.sendResponse(res, {
      status: 1,
      msg: "An error occurred while creating/updating the student",
      error: error.message,
    });
  }
}
