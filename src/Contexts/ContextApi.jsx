import React, { createContext, useState } from 'react';

export const IsEmployeeStatusContext = createContext();
export const profileDetailsContext = createContext();
export const employerDetailsContext = createContext();
export const jobCardEditContext = createContext()

const ContextApi = ({ children }) => {
    const [isEmployee, setIsEmployee] = useState("");
    const [profileDetails, setProfileDetails] = useState({})
    const [employerDetails, setEmployerDetails] = useState({})
    const [jobCardUpdateDetails, setJobCardUpdateDetails] = useState({})



    return (
        <jobCardEditContext.Provider value={{jobCardUpdateDetails, setJobCardUpdateDetails}}>
            <profileDetailsContext.Provider value={{ profileDetails, setProfileDetails }}>
                <employerDetailsContext.Provider value={{ employerDetails, setEmployerDetails }}>
                    <IsEmployeeStatusContext.Provider value={{ isEmployee, setIsEmployee }}>
                        {children}
                    </IsEmployeeStatusContext.Provider>
                </employerDetailsContext.Provider>
            </profileDetailsContext.Provider>
        </jobCardEditContext.Provider>
    );
}

export default ContextApi;
