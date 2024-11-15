
import * as React from 'react';
import Box from '@mui/material/Box';
import { Accordion, AccordionDetails, AccordionSummary, Divider, FormControl, Typography } from "@mui/material";
import { useState } from "react";
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import usePermissions, { hasPermission } from '../../componets/permission';

const ProfileView = () => {
    const [open, setOpen] = useState(false);
    const history = useHistory()

    const [selectedItem, setSelectedItem] = useState(localStorage.getItem('selectedItem') || 'About Pharmacy');

    const permissions = usePermissions();

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleItemClick = (path, name) => {
        setSelectedItem(name);
        localStorage.setItem('selectedItem', name); 
        history.push(path);

    };
    const hasStaffSessionsPermission = hasPermission(permissions, "staff members view") || hasPermission(permissions, "manage staff roles view");

    return (
        <>
            <div>
                <Box
                    className="custom-scroll "
                    sx={{
                        width: 350,
                        height: 550,
                        overflowY: 'auto',
                        bgcolor: 'rgba(153, 153, 153, 0.1)',
                        padding: '15px'
                    }}
                    role="presentation"
                    onClick={() => toggleDrawer(false)}
                >
                    <Accordion defaultExpanded>
                        <AccordionSummary sx={{color:"rgb(4, 76, 157)"}} >
                            <PersonIcon sx={{ mb: 1}} />
                            <Typography sx={{ paddingX: "20px" }}>Account</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                <ul >
                                    {hasPermission(permissions, "profile details update") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${selectedItem === 'About Pharmacy' ? 'selected' : ''}`}
                                            onClick={() => handleItemClick('/about-info', 'About Pharmacy')}
                                        >
                                            Profile Details
                                        </li>
                                    )}
                                    {hasPermission(permissions, "profile details update") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${selectedItem === 'Documents' ? 'selected' : ''}`}
                                            onClick={() => handleItemClick('/documents', 'Documents')}
                                        >
                                            Documents
                                        </li>
                                    )}
                                    {hasPermission(permissions, "profile plan view") && (
                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${selectedItem === 'Plan' ? 'selected' : ''}`}
                                            onClick={() => handleItemClick('/plans', 'Plan')}
                                        >
                                            Plan
                                        </li>
                                    )}
                                    <li
                                        className={`font-semibold p-2 cursor-pointer flex justify-between ${selectedItem === 'Password' ? 'selected' : ''}`}
                                        onClick={() => handleItemClick('/password', 'Password')}
                                    >
                                        Password
                                    </li>
                                </ul>
                            </FormControl>
                        </AccordionDetails>
                    </Accordion>

                    {hasStaffSessionsPermission && (
                        <Accordion >
                            <AccordionSummary sx={{ color: "rgb(4, 76, 157)" }} >
                                <SupervisorAccountIcon sx={{ mb: 1 }} />
                                <Typography sx={{ paddingX: "20px" }}>Staff & Sessions</Typography>
                            </AccordionSummary>
                            <AccordionDetails  >
                                <FormControl sx={{ width: "100%", paddingX: "20px" }}>
                                    <ul >
                                        {hasPermission(permissions, "staff members view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${selectedItem === 'Staff Members' ? 'selected' : ''}`}
                                                onClick={() => handleItemClick('/Staff-sessions/staff-member', 'Staff Members')}
                                            >
                                                Staff Members
                                            </li>
                                        )}
                                        {hasPermission(permissions, "manage staff roles view") && (
                                            <li
                                                className={`font-semibold p-2 cursor-pointer flex justify-between ${selectedItem === 'Manage Staff Roles' ? 'selected' : ''}`}
                                                onClick={() => handleItemClick('/Staff-sessions/manage-staffrole', 'Manage Staff Roles')}
                                            >
                                                Manage Staff Roles
                                            </li>
                                        )}

                                        <li
                                            className={`font-semibold p-2 cursor-pointer flex justify-between ${selectedItem === 'Log Activity' ? 'selected' : ''}`}
                                            onClick={() => handleItemClick('/Staff-sessions/sessions', 'Log Activity')}
                                        >
                                            Log Activity
                                        </li>
                                    </ul>
                                    {/* {/ ))} /} */}
                                </FormControl>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    <Divider />
                </Box>
            </div>
        </>
    )
}

export default ProfileView