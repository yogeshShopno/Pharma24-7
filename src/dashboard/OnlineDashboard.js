import React, { useEffect, useState } from 'react';
import Header from './Header';
import Box from '@mui/material/Box';
import axios from 'axios';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { GoInfo } from "react-icons/go";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Loader from '../componets/loader/Loader';
import { encryptData } from '../componets/cryptoUtils';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import stockByPTR from '../Image/ptr.jpg'
import stockByMRP from '../Image/mrp.jpg'
import { Card } from 'flowbite-react';
// import { PieChart } from 'react-minimal-pie-chart';
// import { PieChart } from '@mui/x-charts/PieChart';
import DonutChart from './Chart/DonutChart';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { PieChart } from '@mui/x-charts'
import { Tooltip as RechartsTooltip } from 'recharts';
import { Switch } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListIcon from '@mui/icons-material/List';

const OnlineDashboard = () => {

  const history = useHistory()

  const token = localStorage.getItem("token");
  const staffList = [{ id: 'today', value: 'Today' }, { id: 'yesterday', value: 'Yesterday' }, { id: '7_day', value: 'Last 7 Days' }, { id: '30_day', value: 'Last 30 Days' }]
  const expiryList = [{ id: 'expired', value: 'Expired' }, { id: 'next_month', value: 'Next Month' }, { id: 'next_two_month', value: 'Next 2 Month' }, { id: 'next_three_month', value: 'Next 3 Month' }]
  const pieChart = [{ id: 1, value: 'sales' }, { id: 0, value: 'purchase' }]
  const types = [{ id: 1, value: 'sales' }, { id: 0, value: 'purchase' },]
  const [linechartValue, setLinechartValue] = useState('Today')
  const [staffListValue, setStaffListValue] = useState('7_day')
  const [typeValue, settypeValue] = useState('7_day')
  const [expiredValue, setExpiredValue] = useState('expired')
  const [record, setRecord] = useState()
  const [distributor, setDistributor] = useState([])
  const [billData, setBilldata] = useState([])
  const [customer, setCustomer] = useState([])
  const [expiry, setExpiry] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [pieChartvalue, setpieChartValue] = useState(0)
  const [value, setValue] = useState(1)
  const [data, setData] = useState([])
  const [loyaltyPoints, setLoyaltyPoints] = useState();
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState();
  const [switchValue, setSwitchValue] = useState(false);
  const [switchCustomerValue, setSwitchCustomerValue] = useState(false);
  const [reRender, setreRender] = useState(0);
  const [barChartData, setBarChartData] = useState([]);

  const [tickFontSize, setTickFontSize] = useState('2px');
  const [toggle, setToggle] = useState(false);
  const [record1, setRecord1] = useState(
    {
      "chart": [
        {
          "title": "Assigned Pharmacy",

        },
        {
          "title": "Accepted",

        },
        {
          "title": "In Process",

        },
        {
          "title": "shipped",

        },
        {
          "title": "delivered",

        },
        {
          "title": "rejected",

        }
      ]
    })
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setTickFontSize("23px");
      } else if (window.innerWidth < 900) {
        setTickFontSize("18px");
      } else {
        setTickFontSize("14px");
      }
    };

    handleResize(); // Set initial size
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const datas = [
    { label: 'Issued', value: 30 },
    { label: 'Redeemed', value: useLoyaltyPoints || 0 },
    { label: 'Total Loyalty Points', value: loyaltyPoints || 0 },
  ];

  const lineChartData = customer.map(item => ({
    name: item.name,
    balance: item.balance,
  }));
  const generateYAxisTicks = (data) => {
    if (!data.length) return [];

    const maxBalance = Math.max(...data.map(item => item.balance));
    const interval = Math.ceil(maxBalance / 5); // Divide max value into 5 equal parts

    return Array.from({ length: 6 }, (_, i) => i * interval);
  };

  const lineHandleChange = (event, newValue) => {
    setLinechartValue(newValue);
    const selectedData = record?.chart.find(e => e.title === newValue);
    if (selectedData) {
      setBarChartData([
        { name: 'Sales', value: selectedData.sales_total || 0, fill: '#4A90E2' },
        // { name: 'Sales Count', value: selectedData.sales_count || 0 },
        { name: 'Sales Return', value: selectedData.sales_return_total || 0, fill: '#50E3C2' },
        // { name: 'Sales Return Count', value: selectedData.sales_return_count || 0 },
        { name: 'Purchases', value: selectedData.purchase_total || 0, fill: '#F5A623' },
        // { name: 'Purchase Count', value: selectedData.purchase_count || 0 },
        { name: 'Purchases Return', value: selectedData.purchase_return_total || 0, fill: '#D0021B' },
        // { name: 'Purchases Return Count', value: selectedData.purchase_return_count || 0 },
      ]);
      setRecord({
        ...record,
        salesmodel_total: selectedData.sales_total,
        salesmodel_total_count: selectedData.sales_count,
        salesreturn_total: selectedData.sales_return_total,
        salesreturn_total_count: selectedData.sales_return_count,
        purchesmodel_total: selectedData.purchase_total,
        purchesmodel_total_count: selectedData.purchase_count,
        purchesreturn_total: selectedData.purchase_return_total,
        purchesreturn_total_count: selectedData.purchase_return_count,
      });
    }
  };

  useEffect(() => {
    if (reRender < 2) {

      const timeout = setTimeout(() => {
        setreRender(reRender + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }

  }, [reRender]);

  const handlechange = (event, newValue) => {
    setValue(newValue);
  }

  const handlestaffTabchange = (event, newValue) => {
    setpieChartValue(newValue);
  }

  const staffListHandlechange = (event) => {
    setStaffListValue(event.target.value)
  }

  const typeHandlechange = (event) => {
    settypeValue(event.target.value)

  }

  const lineHandleChanges = (event, newValue) => {
    setLinechartValue(newValue);
    const selectedData = record?.chart.find(e => e.title === newValue);
    if (selectedData) {
      setRecord({
        ...record,
        salesmodel_total: selectedData.sales_total,
        salesmodel_total_count: selectedData.sales_count,
        purchesmodel_total: selectedData.purchase_total,
        purchesmodel_total_count: selectedData.purchase_count,
        salesreturn_total: selectedData.sales_return_total,
        salesreturn_total_count: selectedData.sales_return_count,
        purchesreturn_total: selectedData.purchase_return_total,
        purchesreturn_total_count: selectedData.purchase_return_count,
      });
    }
  };

  useEffect(() => {
    // dashboardData();
    userPermission();
    orderdata()

  }, [typeValue, value, expiredValue, staffListValue, pieChartvalue])

  const dashboardData = async () => {

    let data = new FormData();
    const params = {
      type: value,
      bill_day: typeValue,
      expired: expiredValue,
      staff_bill_day: staffListValue,
      staff_overview_count: pieChartvalue
    };
    try {
      await axios.post("dashbord?", data, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      ).then((response) => {
        setIsLoading(false)
        const initialData = response.data.data;
        setRecord(initialData);
        setIsLoading(false);
        const todayData = initialData.chart.find(e => e.title === 'Today');
        if (todayData) {
          setRecord({
            ...initialData,
            salesmodel_total: todayData.sales_total,
            salesmodel_total_count: todayData.sales_count,
            purchesmodel_total: todayData.purchase_total,
            purchesmodel_total_count: todayData.purchase_count,
            salesreturn_total: todayData.sales_return_total,
            salesreturn_total_count: todayData.sales_return_count,
            purchesreturn_total: todayData.purchase_return_total,
            purchesreturn_total_count: todayData.purchase_return_count,
          });
        }
        const billData = value === 0 ? initialData.purches : initialData.sales;

        const formattedData = initialData.staff_overview.map(item => ({
          label: item.lable,
          value: item.value
        }));

        setData(formattedData);

        setBilldata(billData);
        setCustomer(initialData?.top_customer)
        setExpiry(initialData?.expiring_iteam)
        setDistributor(initialData?.top_distributor)
        setLoyaltyPoints(initialData?.loyalti_point_all_customer
        )
        setUseLoyaltyPoints(initialData?.loyalti_point_use_all_customer)

      })

    } catch (error) {
      setIsLoading(false);
    }
  }

  const orderdata = async () => {

    let data = new FormData();
    data.append("order_status", 0)
    data.append("start_date", "2025-03-10")
    data.append("end_date", "2025-03-31")
    data.append("patient_name", "shailesh")

    try {
      await axios.post("chemist-order-list?", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      ).then((response) => {
        setIsLoading(false)

        setBilldata(response.data.data);
        console.log(response.data.data)
        setBilldata(response.data.data);


      })

    } catch (error) {
      setIsLoading(false);
    }
  }

  const userPermission = async () => {
    let data = new FormData();
    try {
      await axios.post("user-permission", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      ).then((response) => {
        const permission = response.data.data;
        const encryptedPermission = encryptData(permission);
        localStorage.setItem('Permission', encryptedPermission);
      })

    }
    catch (error) {

    }
  }

  // const handleSwitchChange = (event) => {
  //   setSwitchValue(event.target.checked);
  // }
  // const handleSwitchCustomerChange = (event) => {
  //   setSwitchCustomerValue(event.target.checked);
  // }
  const dataOne = [
    { value: 40 },
    { value: 60 },
    { value: 80 },
    { value: 100 },
    { value: 70 },
    { value: 90 },
    { value: 110 },
  ];
  return (
    <div >
      <div>
        <Header key={reRender} />

        {isLoading ? <div className="loaderdash">
          <Loader />
        </div> :
          <div className='p-4' style={{ background: 'rgb(231 230 230 / 36%)', height: '100%' }}>

            <div className='flex flex-col w-full md:w-1/2' style={{ width: '100%' }}>
              <div className='p-4'>
                <h1 style={{ color: 'var(--color1)', fontSize: '2rem', fontWeight: 600 }}>Online Orders</h1>
                <p style={{ color: 'gray' }}>Graphical</p>
                <Switch
                  checked={toggle}
                  sx={{
                    "& .MuiSwitch-track": {
                      backgroundColor: "lightgray",
                    },
                    "&.Mui-checked .MuiSwitch-track": {
                      backgroundColor: "var(--color1) !important",
                    },
                    "& .MuiSwitch-thumb": {
                      backgroundColor: "var(--color1)",
                    },
                    "&.Mui-checked .MuiSwitch-thumb": {
                      backgroundColor: "var(--color1)",
                    },
                  }}
                  onChange={() => {
                    setToggle(!toggle);
                  }}
                />
              </div>
              <div className='dashbd_crd_bx gap-5  p-8 grid grid-cols-1 md:grid-cols-1  sm:grid-cols-1'>
                <div className='gap-4'>
                  <div className="bg-white flex flex-col px-2 py-1 rounded-lg " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)', height: "470px" }}>
                    <div className='p-4 flex justify-between items-center dsh_cdr_hd_ltbill' style={{ borderBottom: '1px solid var(--color2)' }}>
                      <div className='top_fv_bll'>
                        <p className='font-bold dash_first_crd flex items-center' style={{ fontSize: '1.5625rem' }}>online orders
                          <Tooltip title="Top Five Bills" arrow>
                            <Button ><GoInfo className='absolute' style={{ fontSize: "1rem", fill: 'var(--color1)' }} /></Button>
                          </Tooltip>
                        </p>

                      </div>
                      <div className='flex gap-8 dsh_crd_btn'>
                        <div>
                          <TabContext value={value}  >
                            <Box>
                              <TabList aria-label="lab API tabs example" onChange={handlechange} >
                                {types.map((e) => (
                                  <Tab key={e.id} value={e.id} label={e.value} className='tab_txt_crd' sx={
                                    {
                                      '&.Mui-selected': {
                                        backgroundColor: 'var(--color1)',
                                        fontWeight: 'bold',
                                        color: "white",
                                        borderRadius: "5px"
                                      },
                                    }
                                  } />
                                ))}
                              </TabList>
                            </Box>
                          </TabContext>
                        </div>
                        {billData.length > 0 &&
                          <FormControl sx={{ minWidth: 100 }} >
                            <Select
                              labelId="demo-simple-select-helper-label"
                              className='dash_select_box'
                              id="demo-simple-select-helper"
                              size='small'
                              value={typeValue}
                              onChange={typeHandlechange}
                            >
                              {staffList.map((e) => (
                                <MenuItem key={e.id} value={e.id}>{e.value}</MenuItem>))}
                            </Select>
                          </FormControl>}
                      </div>
                    </div>
                    <Box sx={{ height: '100%' }}>
                      <TabContext value={value}>
                        {billData.length > 0 ? (
                          <>
                            {types.map((e) => (
                              <TabPanel key={e.id} value={e.id} sx={{ height: '100%' }}>

                                <div className='flex flex-col justify-between' style={{ height: '100%' }}>
                                  <div className="overflow-x-auto">
                                    <table className="w-full custom-table" style={{ whiteSpace: 'nowrap' }}>
                                      <thead className="primary">
                                        <tr>
                                          <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                            {value == 0 ? "Distributors" : "Customers"}
                                          </th>
                                          <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                            Contact Number
                                          </th>
                                          <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                            Amount
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {billData.map((item, index) => (
                                          <tr key={index} className="border-b border-gray-200" style={{ textAlign: 'center' }}>
                                            <td className=" px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                              {item.name}
                                            </td>
                                            <td className=" px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                              {item.phone_number === "" ? "--" : item.phone_number}
                                            </td>
                                            <td className=" px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                              Rs. {item.total_amount === 0 ? 0 : item.total_amount}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                  {/* View All Link */}
                                  <div className="flex justify-end mt-5" style={{ color: 'rgb(0 39 123)' }}>
                                    {value == 0 ? (
                                      <Link to="/purchase/purchasebill">
                                        <a href="#">View all <ChevronRightIcon /></a>
                                      </Link>
                                    ) : (
                                      <Link to="/salelist">
                                        <a href="#">View all <ChevronRightIcon /></a>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </TabPanel>
                            ))}
                          </>
                        ) : (
                          <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
                            <img src="../no-data.png" className="nofound" />
                          </div>
                        )}
                      </TabContext>
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </div>)}

export default OnlineDashboard
