import Header from "../../../Header"
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import { BsLightbulbFill } from "react-icons/bs";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import Loader from "../../../../componets/loader/Loader";
import usePermissions, { hasPermission } from "../../../../componets/permission";

const columns = [
    { id: 'bill_no', label: 'Bill No', minWidth: 70, height: 100 },
    { id: 'bill_date', label: 'Bill Date', minWidth: 100 },
    { id: 'customer_name', label: 'Customer Name', minWidth: 100 },
    { id: 'phone_number', label: 'Mobile No ', minWidth: 100 },
    { id: 'payment_name', label: 'Payment Mode', minWidth: 100 },
    { id: 'net_amount', label: 'Bill Amount', minWidth: 100 },
];
const SalereturnList = () => {
    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const [tableData, setTableData] = useState([]);
    const permissions = usePermissions();
    const rowsPerPage = 10;
    const initialSearchTerms = columns.map(() => '');
    const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [IsDelete, setIsDelete] = useState(false);
    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const options = ['Option 1', 'Option 2', 'Option 3'];
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const [saleId, setSaleId] = useState(null)

    useEffect(() => {
        saleReturnBillList();
        localStorage.setItem('SaleRetunBillNo', tableData.length + 1);
    }, [tableData.length + 1])

    const saleReturnBillList = async (currentPage) => {
        setIsLoading(true);
        let data = new FormData();
        data.append('page', currentPage);
        try {
            await axios.post("sales-return-list?", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setTableData(response.data.data)
                setIsLoading(false);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        saleReturnBillList(pageNum);
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            saleReturnBillList(newPage);
        }
    };

    const handleNext = () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        saleReturnBillList(newPage);
    };


    const deleteOpen = (id) => {
        setIsDelete(true);
        setSaleId(id);
    };

    const sortByColumn = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...tableData].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setTableData(sortedData);
    };

    const handleSearchChange = (index, value) => {
        const newSearchTerms = [...searchTerms];
        newSearchTerms[index] = value;
        setSearchTerms(newSearchTerms);
    };

    const filteredList = paginatedData.filter(row => {
        return searchTerms.every((term, index) => {
            const value = row[columns[index].id];
            return String(value).toLowerCase().includes(term.toLowerCase());
        });
    });

    const goIntoAdd = () => {
        history.push('/saleReturn/Add')
    }

    return (
        <>
            <div>
                <Header />
                {isLoading ? <div className="loader-container ">
                    <Loader />
                </div> :
                    <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                        <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                            <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px' }} >Sales Return</span>
                            {hasPermission(permissions, "sale return bill create") && (<>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '7px', color: "rgba(4, 76, 157, 1)" }} />
                                <Button variant="contained" size='small' style={{ backgroundColor: 'rgb(4, 76, 157)', fontSize: '12px', marginLeft: "5px" }} onClick={goIntoAdd} ><AddIcon />New  </Button></>)}
                        </div>
                        <div >
                            <div className="firstrow">
                                <div className='overflow-x-auto'>
                                    <table className=" w-full border-collapse custom-table">
                                        <thead>
                                            <tr>
                                                <th>SR. No</th>
                                                {columns.map((column, index) => (
                                                    <th key={column.id} style={{ minWidth: column.minWidth }} onClick={() => sortByColumn(column.id)}>
                                                        <div className='headerStyle'>
                                                            <span>{column.label}</span><SwapVertIcon style={{ cursor: 'pointer' }} onClick={() => sortByColumn(column.id)} />
                                                            <TextField
                                                                label={`Search ${column.label}`}
                                                                id="filled-basic"
                                                                size="small"
                                                                sx={{ width: '150px' }}
                                                                value={searchTerms[index]}
                                                                onChange={(e) => handleSearchChange(index, e.target.value)}
                                                            />
                                                        </div>
                                                    </th>
                                                ))}
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredList.length === 0 ? (
                                                <tr>
                                                    <td colSpan={columns.length + 2} style={{ textAlign: 'center', color: 'gray' }}>
                                                        No data found
                                                    </td>
                                                </tr>
                                            ) : (filteredList
                                                .map((row, index) => {
                                                    return (
                                                        <tr hover role="checkbox" tabIndex={-1} key={row.code}  >
                                                            <td>
                                                                {startIndex + index}
                                                            </td>
                                                            {columns.map((column) => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <td key={column.id} align={column.align} onClick={() => { history.push("/SaleReturn/View/" + row.id) }}>
                                                                        {column.format && typeof value === 'number'
                                                                            ? column.format(value)
                                                                            : value}
                                                                    </td>

                                                                );
                                                            })}
                                                            <td>
                                                                <div className="flex gap-5 justify-center">
                                                                    <VisibilityIcon className='cursor-pointer' onClick={() => { history.push(`/purchase/view/${row.id}`) }} color="primary" />
                                                                    {/* <DeleteIcon className="delete-icon" onClick={() => deleteOpen(row.id)} /> */}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                }))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={handlePrevious}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'bg_darkblue text-white'
                                            }`}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    {currentPage > 2 && (
                                        <button
                                            onClick={() => handleClick(currentPage - 2)}
                                            className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                                        >
                                            {currentPage - 2}
                                        </button>
                                    )}
                                    {currentPage > 1 && (
                                        <button
                                            onClick={() => handleClick(currentPage - 1)}
                                            className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                                        >
                                            {currentPage - 1}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleClick(currentPage)}
                                        className="mx-1 px-3 py-1 rounded bg_darkblue text-white"
                                    >
                                        {currentPage}
                                    </button>
                                    {currentPage < totalPages && (
                                        <button
                                            onClick={() => handleClick(currentPage + 1)}
                                            className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                                        >
                                            {currentPage + 1}
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage ? 'bg-gray-200 text-gray-700' : 'bg_darkblue text-white'
                                            }`}
                                        disabled={filteredList.length === 0}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div id="modal" value={IsDelete}
                                    className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
                                        }`}>
                                    <div />
                                    <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
                                            viewBox="0 0 24 24" onClick={() => setIsDelete(false)}>
                                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                                        </svg>
                                        <div className="my-4 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 fill-red-500 inline" viewBox="0 0 24 24">
                                                <path
                                                    d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                                    data-original="#000000" />
                                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                                    data-original="#000000" />
                                            </svg>
                                            <h4 className="text-lg font-semibold mt-6">Are you sure you want to delete it?</h4>
                                        </div>
                                        <div className="flex gap-5 justify-center">
                                            <button type="submit"
                                                className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                                                onClick={() => deleteOpen()}
                                            >Delete</button>
                                            <button type="button"
                                                className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                                                onClick={() => setIsDelete(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                }

            </div>
        </>
    )

}
export default SalereturnList