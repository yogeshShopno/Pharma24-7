import Header from "../../../Header"
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import axios from "axios";
import PopUpRed from '../../../../componets/popupBox/PopUpRed';
import { saveAs } from 'file-saver';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import { addDays, format, subDays, subMonths } from 'date-fns';
const Gstr_3B = () => {
    const history = useHistory()
    const [monthDate, setMonthDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const [nonMovingItemData, setNonMovingItemData] = useState([])
    const [showPopup, setShowPopup] = useState(false);
    const excelIcon = process.env.PUBLIC_URL + '/excel.png';
    return (
        <>
            <Header />
            <div>
                <div style={{ background: "rgb(0 0 0 / 10%)", height: 'calc(99vh - 55px)', padding: '10px 20px 0px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '15px' }}>
                            <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                            </span>
                            <ArrowForwardIosIcon style={{ fontSize: '18px', color: "rgba(4, 76, 157, 1)" }} />
                            <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "120px" }}>GSTR-3B Report
                            </span>
                            <BsLightbulbFill className=" w-6 h-6 sky_text hover-yellow" />
                        </div>
                    </div>
                    <div className="IconNonMoving flex-wrap" style={{ background: "white" }}>
                        <div style={{ width: "40%" }}>
                            <div >
                                <div style={{ maxWidth: "500px", marginBottom: "20px" }}>
                                    <img src="../imgpsh_fullsize_anim.png" ></img>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: "100px", height: "380px" }}>
                            <div className="flex gap-4">
                                <div >
                                    <span className="flex mb-2 sky_text text-lg">Choose Date</span>
                                    <div style={{ width: "215px" }}>
                                        <DatePicker
                                            className='custom-datepicker '
                                            selected={monthDate}
                                            onChange={(newDate) => setMonthDate(newDate)}
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: "25px" }}>
                                <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }}> <img src={excelIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        </>
    )
}
export default Gstr_3B