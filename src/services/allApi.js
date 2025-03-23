import commonApi from "./commonApi"
import serverUrl from "./serverUrl"


// seeker-registration
export const seekerRegisterApi = async (reqBody) => {
    return await commonApi("POST", `${serverUrl}/seeker-register`, reqBody)
}

// seeker-login
export const seekerLoginApi = async (reqBody) => {
    return await commonApi("POST", `${serverUrl}/seeker-login`, reqBody)
}

// seekerProfileUpdate
export const seekerProfileUpdation = async (reqBody, reqHeaders) => {
    return await commonApi("PUT", `${serverUrl}/seeker-profileupdate`, reqBody, reqHeaders)
}

// seekerProfileDetails
export const seekerProfileDetails = async (reqHeaders) => {
    return await commonApi("GET", `${serverUrl}/seeker-profileDetails`, {}, reqHeaders)
}

// employer-registration
export const employerRegisterApi = async (reqBody) => {
    return await commonApi("POST", `${serverUrl}/employer-register`, reqBody)
}

// employer-login
export const employerLoginApi = async (reqBody) => {
    return await commonApi("POST", `${serverUrl}/employer-login`, reqBody)
}

// employer-dataUpdate
export const employerUpdateProfileApi = async (reqBody, reqHeaders) => {
    return await commonApi("PUT", `${serverUrl}/employer-profile`, reqBody, reqHeaders)
}

// seekerProfileDetails
export const employerAcDetails = async (reqHeaders) => {
    return await commonApi("GET", `${serverUrl}/employer-profileDetails`, {}, reqHeaders)
}

// add-job
export const employerAddJob = async (reqBody, reqHeaders) => {
    return await commonApi("POSt", `${serverUrl}/add-job`, reqBody, reqHeaders)
}

// get-all-job to all jobs page
export const getAllJob = async () => {
    return await commonApi("GET", `${serverUrl}/get-all-jobs`, {})
}

// get-user-job
export const getUserJobDetails = async (reqHeaders) => {
    return await commonApi("GET", `${serverUrl}/get-userjobs`, {}, reqHeaders)
}

export const userApplyingJob = async (jobId, reqHeaders) => {
    return await commonApi("POST", `${serverUrl}/apply-job/${jobId}`, {}, reqHeaders);
}

export const userAppliedDetails = async (reqHeaders) => {
    return await commonApi("GET", `${serverUrl}/my-posted-jobs`, null, reqHeaders);
};

export const rejectApplicants = async (reqBody, reqHeaders) => {
    return await commonApi("PUT", `${serverUrl}/reject-applicant`, reqBody, reqHeaders);
};

export const selectApplicants = async (reqBody, reqHeaders) => {
    return await commonApi("PUT", `${serverUrl}/select-applicant`, reqBody, reqHeaders);
};

// getuserAppliedJobs
export const getUserAppliedJobs = async (reqHeaders) => {
    return await commonApi("GET", `${serverUrl}/user-appliedjobs`, {}, reqHeaders);
};

// getuserdetails
export const getUserDetails = async () => {
    return await commonApi("GET", `${serverUrl}/getusers`, {});
};

// getParticularuserdetails
export const getParticularUserDetails = async (id) => {
    return await commonApi("GET", `${serverUrl}/getusersDetails/${id}`);
};

// getParticularuserdetails
export const deleteUserJobs = async (id, reqHeaders) => {
    return await commonApi("DELETE", `${serverUrl}/deleteUserJobs/${id}`, {}, reqHeaders);
};

// updateuserPostedJobs
export const updateuserPostedJobs = async (id, reqBody, reqHeaders) => {
    return await commonApi("PUT", `${serverUrl}/editUserJobs/${id}`, reqBody, reqHeaders);
};












// API function
export const sendMessage = async (reqBody) => {
    return await commonApi("POST", `${serverUrl}/send-message`, reqBody);
};

export const getAllEmployers = async () => {
    return await commonApi("GET", `${serverUrl}/employerDetails`);
};


export const getMessage = async (senderId, receiverId) => {
    return await commonApi("GET", `${serverUrl}/getmessages/${senderId}/${receiverId}`);
};