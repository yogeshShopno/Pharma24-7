import Header from "../../../Header"
import { Button, FormControl, InputAdornment, InputLabel, MenuItem, MenuList, Select, TextField } from "@mui/material"
import { BsLightbulbFill } from "react-icons/bs"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DatePicker from 'react-datepicker';
import { addDays, format, subDays } from 'date-fns';
import axios from "axios";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Loader from "../../../../componets/loader/Loader";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { toast, ToastContainer } from "react-toastify";
const BillItemWiseMargin = () => {
    const history = useHistory()
    const [startDate, setStartDate] = useState(subDays(new Date(), 2));
    const [endDate, setEndDate] = useState(new Date())
    const [reportType, setReprtType] = useState('')
    const [searchItem, setSearchItem] = useState('')
    const token = localStorage.getItem("token")
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [billMarginData, setBillMarginData] = useState([])
    const csvIcon = process.env.PUBLIC_URL + '/csv.png';

    const BillItemWiseColumns = [
        { id: "entry_by", label: "Entry By", minWidth: 100 },
        { id: 'bill_no', label: 'Bill No.', minWidth: 100 },
        { id: 'bill_date', label: 'Bill Date', minWidth: 100 },
        { id: 'patient_name', label: 'Customer Name', minWidth: 100 },
        { id: 'name', label: 'Item Name', minWidth: 100 },
        { id: 'category', label: 'Category', minWidth: 100 },
        { id: 'unite', label: 'Unit', minWidth: 100 },
        { id: 'company', label: 'Manu.', minWidth: 100 },
        { id: 'sales_count', label: 'Sale', minWidth: 100 },
        { id: 'stock', label: 'Stock', minWidth: 100 },
        { id: 'mrp', label: 'MRP', minWidth: 100 },
        { id: 'sales_amount', label: 'Sale Amt.', minWidth: 100 },
        { id: 'purches_amount', label: 'Purchase', minWidth: 100 },
        { id: 'net_gst', label: 'Net GST', minWidth: 100 },
        { id: 'net_profit', label: 'Profit(%)', minWidth: 100 },
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!reportType) {
            newErrors.reportType = 'Select any Report Type.';
            toast.error(newErrors.reportType)
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlefilterData = async () => {
        if (validateForm()) {
            let data = new FormData()
            setIsLoading(true);
            const params = {
                start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
                end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
                type: reportType,
                item_name: searchItem
            }
            try {
                await axios.post('item-bill-margin', data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
                ).then((response) => {
                    setIsLoading(false);
                    setBillMarginData(response.data.data)
                })
            } catch (error) {
                console.error("API error:", error);
            }
        }
    }

    const exportToCSV = () => {
        if (billMarginData.length == 0) {
            toast.error('Apply filter and then after download records.')

        } else {
            const saleamt = billMarginData.total_sales;
            const total_purchase = billMarginData.total_purches;
            const total_net_gst = billMarginData.total_net_gst;
            const net_profit = billMarginData.total_net_profit;

            const filteredData = billMarginData?.bill_margin_report?.map(({ entry_by, bill_no, bill_date, patient_name, name, company, sales_count, unite, category, stock, mrp, sales_amount, purches_amount, net_gst, net_profit }) => ({
                EntryBy: entry_by,
                BillNo: bill_no,
                BillDate: bill_date,
                CustomerName: patient_name,
                ItemName: name,
                Category: category,
                Unit: unite,
                Company_Name: company,
                Sale: sales_count,
                Stock: stock,
                MRP: mrp,
                Sale_Amt: sales_amount,
                Purchase: purches_amount,
                Net_GST: net_gst,
                Profit_PR: net_profit,
            }));

            // Custom data rows
            const customDataRows = [
                ['Total Sale Amt.', saleamt],
                ['Total Purchase', total_purchase],
                ['Total Net GST', total_net_gst],
                ['Total Profit', net_profit],
                [],
            ];

            // Headers for filtered data
            const headers = [
                'EntryBy', 'BillNo', 'BillDate', 'CustomerName', 'ItemName', 'Category', 'Unit', 'Company_Name', 'Sale', 'Stock', 'MRP', 'Sale_Amt', 'Purchase', 'Net_GST', 'Profit_PR'
            ];

            // Convert filteredData to an array of arrays
            const filteredDataRows = filteredData.map(item => headers.map(header => item[header]));

            // Combine custom data, headers, and filtered data rows
            const combinedData = [...customDataRows, headers, ...filteredDataRows];

            // Convert combined data to CSV format
            const csv = combinedData.map(row => row.join(',')).join('\n');

            // Convert the CSV string to a Blob
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            // Save the file using file-saver
            saveAs(blob, 'BillItemWise_Report.csv');
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
                    <div>
                        <div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: '10px 20px 0px' }}>
                            <div className="flex gap-2 pb-2">
                                <div style={{ display: 'flex', flexWrap: 'wrap', width: '900px', gap: '7px', alignItems: "center" }}>
                                    <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', cursor: "pointer" }} onClick={(() => history.push('/Resports'))} > Reports
                                    </span>
                                    <ArrowForwardIosIcon style={{ fontSize: '18px', color: "rgba(4, 76, 157, 1)" }} />
                                    <span style={{ color: 'rgba(4, 76, 157, 1)', display: 'flex', fontWeight: 700, fontSize: '17px', minWidth: "200px" }}> Bill-Item Wise Margin Report </span>
                                    <BsLightbulbFill className=" w-6 h-6 sky_text hover-yellow" />
                                </div>
                                <div className="headerList">
                                    <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={exportToCSV}> <img src={csvIcon} className="report-icon absolute mr-10" alt="csv Icon" />Download</Button>
                                </div>
                            </div>
                            <div className="bg-white">
                                <div className="manageExpenseRow" style={{
                                    padding: ' 12px 24px', borderBottom: "2px solid rgb(0 0 0 / 0.1)"
                                }}>
                                    <div className="flex gap-5 flex-wrap" >

                                        <div className="detail">
                                            <span className="text-gray-500">Start Date</span>
                                            <div style={{ width: "215px" }}>
                                                <DatePicker
                                                    className='custom-datepicker '
                                                    selected={startDate}
                                                    onChange={(newDate) => setStartDate(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            </div>
                                        </div>

                                        <div className="detail">
                                            <span className="text-gray-500">End Date</span>
                                            <div style={{ width: "215px" }}>
                                                <DatePicker
                                                    className='custom-datepicker '
                                                    selected={endDate}
                                                    onChange={(newDate) => setEndDate(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <FormControl sx={{ minWidth: 250 }} size="small">
                                                <InputLabel id="demo-select-small-label">Report Type</InputLabel>
                                                <Select
                                                    labelId="demo-select-small-label"
                                                    id="demo-select-small"
                                                    value={reportType}
                                                    onChange={(e) => setReprtType(e.target.value)}
                                                    label="Report Type"

                                                >
                                                    <MenuItem value="" disabled>
                                                        Select Report Type
                                                    </MenuItem>
                                                    <MenuItem value="0">Sale</MenuItem>
                                                    <MenuItem value="1">Sale Return</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </div>
                                        <div className="mt-6">
                                            <div className="detail" >
                                                <TextField
                                                    id="outlined-basic"
                                                    value={searchItem}
                                                    size="small"
                                                    onChange={(e) => setSearchItem(e.target.value)}
                                                    variant="outlined"
                                                    placeholder="Type Here..."
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start" >
                                                                <span className="text-black">Item Name</span>
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <InputAdornment position="end" >
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                        type: 'search'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <Button variant="contained" onClick={handlefilterData}>
                                                Go
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {billMarginData?.bill_margin_report?.length > 0 ?
                                    <div>
                                        <div className="flex gap-8 justify-end flex-wrap" style={{ padding: ' 20px 24px' }} >
                                            <div>
                                                <span className="darkblue_text">
                                                    Total Sale Amt.
                                                </span>
                                                <p className="sky_text font-semibold p-1.5">Rs. {parseFloat(billMarginData.total_sales).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <span className="darkblue_text">
                                                    Total Purchase
                                                </span>
                                                <p className="darkblue_text font-semibold p-1.5">Rs.  {parseFloat(billMarginData.total_purches).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <span className="darkblue_text">
                                                    Total Net GST
                                                </span>
                                                <p className="sky_text font-semibold p-1.5">Rs.  {parseFloat(billMarginData.total_net_gst).toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <span className="darkblue_text">
                                                    Total Profit
                                                </span>
                                                <p className="  font-semibold p-1.5" style={{ color: "rgba(0, 197, 220, .8)" }}>Rs.  {parseFloat(billMarginData?.total_net_profit).toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div className="overflow-x-auto mt-4">
                                            <table className="table-cashManage w-full border-collapse" s>
                                                <thead>
                                                    <tr>
                                                        {BillItemWiseColumns.map((column) => (
                                                            <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                                {column.label}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {billMarginData?.bill_margin_report?.map((item, index) => (
                                                        <tr key={index} >
                                                            {BillItemWiseColumns.map((column) => (
                                                                <td key={column.id}>
                                                                    {item[column.id] && item[column.id].charAt(0).toUpperCase() + item[column.id].slice(1)}
                                                                </td>
                                                            ))}

                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <div className="SearchIcon">
                                            <div>
                                                <FaSearch className="IconSize" />
                                            </div>
                                            <p className="text-gray-500 font-semibold">Apply filter to get records.</p>
                                        </div>
                                    </div>


                                }
                            </div>

                        </div>
                    </div >
                </div>
            }
        </>
    )
}
export default BillItemWiseMargin