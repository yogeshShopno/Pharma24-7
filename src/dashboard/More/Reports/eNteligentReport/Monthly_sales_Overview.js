import Header from "../../../Header"
import { Button } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DatePicker from 'react-datepicker';
import { format, subDays, subMonths } from 'date-fns';
import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
const Monthly_sales_Overview = () => {
    const history = useHistory()
    const [monthDate, setMonthDate] = useState(subMonths(new Date(), 1));
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token")
    const [errors, setErrors] = useState({});
    const [monthlySaleData, setMonthlySaleData] = useState([])
    const MonthlySaleColumns = [
        { id: 'duration', label: 'Duration', minWidth: 100 },
        { id: 'total_amount', label: 'Total Amount', minWidth: 100 },
        { id: 'total_discount', label: 'Total Discount', minWidth: 100 },
        { id: 'net_sales', label: 'Net Sales', minWidth: 100 },
        { id: 'count', label: 'Count', minWidth: 100 },
    ];
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';
    const [tableData, setTableData] = useState([
        { item_name: "dolo fresh", pack: "strip", location: "d", last_Purchased: "-", stock: "54", nonMovingSincedays: "355", lp: "74.2", total_Stock: "3154", byLp: "-" }
    ])

    const handlefilterData = async () => {

        let data = new FormData()
        setIsLoading(true);
        const params = {
            month_year: monthDate ? format(monthDate, 'MM-yyyy') : '',
        }
        try {
            await axios.post('monthly-sales-overview?', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setIsLoading(false);
                setMonthlySaleData(response.data.data)
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const exportToCSV = () => {
        if (monthlySaleData.length == 0) {
            toast.error('Apply filter and then after download records.')
        } else {
            // const filteredData = companyData?.item_list?.map(({ iteam_name, unite, bill_no, bill_date, batch, free_qty, net_rate, qty, exp_dt }) => ({
            //     ItemName: iteam_name,
            //     Unit: unite,
            //     BillNo: bill_no,
            //     BillDate: bill_date,
            //     Batch: batch,
            //     Expiry: exp_dt,
            //     Qty: qty,
            //     Free: free_qty,
            //     Amount: net_rate,

            // }));

            // Custom data rows
            const customDataRows = [
                ['Duration', monthlySaleData.duration],
                ['Total Amount', monthlySaleData.total_amount],
                ['Total Discount', monthlySaleData.total_discount],
                ['Net Sales', monthlySaleData.net_sales],
                ['Count', monthlySaleData.count],
                [],
            ];

            // Headers for filtered data
            const headers = ['ItemName', 'Unit', 'BillNo', 'BillDate', 'Batch', 'Expiry', 'Qty', 'Free', 'Amount'];

            // Convert filteredData to an array of arrays
            // const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

            // Combine custom data, headers, and filtered data rows
            const combinedData = [...customDataRows];

            // Convert combined data to CSV format
            const csv = combinedData.map(row => row.join(',')).join('\n');

            // Convert the CSV string to a Blob
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Save the file using file-saver
            saveAs(blob, 'Monthly_Sales_OverView_Report.csv');
        }
    };

    return (
        <>
            <Header />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div>
                    <div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: '10px 20px 0px' }}>
                        <div className="flex gap-2 pb-2">
                            <div style={{ display: 'flex', flexWrap: 'wrap', width: '800px', gap: '7px', alignItems: "center" }}>
                                <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                </span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "rgba(4, 76, 157, 1)" }} />
                                <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "190px" }}> Monthly Sales Overview
                                </span>
                                <BsLightbulbFill className=" w-6 h-6 sky_text hover-yellow" />
                            </div>
                            <div className="headerList" >
                                <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV} > <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
                            </div>
                        </div>
                        <div className="bg-white">
                            <div className="manageExpenseRow" style={{
                                padding: ' 12px 24px', borderBottom: "2px solid rgb(0 0 0 / 0.1)"
                            }}>
                                <div className="flex gap-5" >
                                    <div >
                                        <DatePicker
                                            className='custom-datepicker '
                                            selected={monthDate}
                                            onChange={(newDate) => setMonthDate(newDate)}
                                            dateFormat="MM-yyyy"
                                            showMonthYearPicker
                                        />
                                    </div>
                                    <div>
                                        <Button variant="contained" onClick={handlefilterData} >
                                            Go
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {!monthlySaleData?.duration ?
                                <div>
                                    <div className="SearchIcon">
                                        <div>
                                            <FaSearch className="IconSize" />
                                        </div>
                                        <p className="text-gray-500 font-semibold">Apply filter to get records.</p>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div className="overflow-x-auto mt-4">
                                        <table className="table-cashManage w-full border-collapse">
                                            <thead>
                                                <tr>
                                                    {MonthlySaleColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr >
                                                    <>
                                                        <td >
                                                            {monthlySaleData?.duration}
                                                        </td>
                                                        <td  >
                                                            {monthlySaleData?.total_amount}
                                                        </td> <td  >
                                                            {monthlySaleData?.total_discount}
                                                        </td> <td  >
                                                            {monthlySaleData?.net_sales}
                                                        </td> <td  >
                                                            {monthlySaleData?.count}
                                                        </td>
                                                    </>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }
                        </div>

                    </div>
                </div >
            }
        </>
    )
}
export default Monthly_sales_Overview