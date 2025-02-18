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
const Dashboard = () => {

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
    dashboardData();
    userPermission();

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
          <div className='p-2' style={{ background: 'rgb(231 230 230 / 36%)', height: '100%' }}>

            <div className='flex flex-col md:flex-row justify-between gap-5 dash_card_chartss items-end'>
              <div className='flex flex-col w-full md:w-1/2' style={{ width: '100%' }}>
                <div className='p-4'>
                  <h1 style={{ color: 'var(--color1)', fontSize: '2rem', fontWeight: 600 }}>Pharma Dashboard</h1>
                  <p style={{ color: 'gray' }}>Track sales, inventory, and customer trends in real-time</p>
                </div>
                <div>
                  <div className='dsh_card_chart mb-3 pb-3 flex py-1 py-3 rounded-lg' style={{ display: 'flex', gap: '2%', marginTop: "10px" }}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between gap-6" style={{ width: "100%" }}>
                      {/* Content Section */}
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-600 dark:text-gray-300 text-lg">Stock By PTR</span>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">Rs. {record?.total_ptr === 0 ? 0 : record?.total_ptr}</div>
                        <span className="text-green-600 text-lg font-medium">↑ 60.00% from last month</span>
                      </div>

                      {/* Image Section */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img src={stockByPTR} className="w-full h-full object-contain" />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between gap-6" style={{ width: "100%" }}>
                      {/* Content Section */}
                      <div className="flex flex-col gap-2">
                        <span className="text-gray-600 dark:text-gray-300 text-lg">Stock By MRP</span>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">Rs. {record?.total_mrp === 0 ? 0 : record?.total_mrp}</div>
                        <span className="text-green-600 text-lg font-medium">↑ 60.00% from last month</span>
                      </div>

                      {/* Image Section */}
                      <div className="w-24 h-24 flex-shrink-0">
                        <img src={stockByMRP} className="w-full h-full object-contain" />
                      </div>
                    </div>

                  </div>

                  {/* Bar charts */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 flex flex-col justify-between px-2 py-1 py-8">
                    <Box>
                      <Box>
                        <div className='p-2 flex flex-col'>

                          <div className='flex justify-between items-center p-3' style={{ borderBottom: "3px solid var(--color1)" }}>

                            <Tabs
                              value={linechartValue}
                              onChange={lineHandleChange}
                              variant="scrollable"
                              scrollButtons={false}
                              aria-label="scrollable prevent tabs example"

                            >
                              {record?.chart?.map((e) => (
                                <Tab key={e.id} value={e.title} label={e.title} sx={
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
                            </Tabs>

                            {/* <div className='primary'>
                              Graphical <Switch checked={switchValue} onChange={handleSwitchChange}
                              // checkedIcon={<BarChartIcon sx={{ width: '27px', height: '27px', borderRadius: '50%', background: "var(--color1)", color: "white"}} />}
                              //   icon={<ListIcon sx={{ width: '27px', height: '27px', borderRadius: '50%', background: "var(--color1)", color: "white"}} />} 
                              /> Classical
                            </div> */}
                          </div>

                          {/* {switchValue ? (
                            <Box >
                              <Box sx={{ minHeight: "429px" }}>

                                <div className='flex py-4 p-6 flex-wrap '>
                                  <div className='w-1/2'>
                                    <p>Sales</p>
                                    <h4 className='text-2xl font-bold' style={{ color: 'green' }}> Rs.{!record?.salesmodel_total ? 0 : record?.salesmodel_total}/- </h4>
                                    <span>{record?.salesmodel_total_count} Bills</span>
                                  </div>
                                  <div className='w-1/2'>
                                    <p>Purchase</p>
                                    <h4 className='text-red-500 text-2xl font-bold'> Rs.{!record?.purchesmodel_total ? 0 : record?.purchesmodel_total}/- </h4>
                                    <span>{record?.purchesmodel_total_count} Bills</span>
                                  </div>
                                </div>
                                <div className='flex py-4 p-6 justify-between'>
                                  <div className='w-1/2' >
                                    <p>Sale Return</p>
                                    <h4 className='text-red-500 text-2xl font-bold'> Rs.{!record?.salesreturn_total ? 0 : record?.salesreturn_total}/-</h4>
                                    <span>{record?.salesreturn_total_count} Bills</span>
                                  </div>
                                  <div className='w-1/2'>
                                    <p>Purchase Return</p>
                                    <h4 className='text-2xl font-bold' style={{ color: 'green' }}> Rs.{!record?.purchesreturn_total ? 0 : record?.purchesreturn_total}/- </h4>
                                    <span>{record?.purchesreturn_total_count} Bills</span>
                                  </div>
                                </div>
                              </Box>
                            </Box>
                          ) : (
                            <> */}
                          <div className='pt-8 m-auto'>
                            {barChartData.every(item => item.value === 0) ? (
                              <div className='flex justify-center' style={{ minHeight: "429px", alignItems: 'center' }}>
                                <img src='../no-data.png' className='nofound' alt="No Data" />
                              </div>
                            ) : (

                              <BarChart
                                width={900}
                                height={400}
                                data={barChartData}
                                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                              >

                                <XAxis dataKey="name" tick={false} axisLine={{ stroke: "#ccc" }} />
                                <YAxis />
                                <RechartsTooltip contentStyle={{ borderRadius: '7px' }} />
                                <Legend />
                                <Bar dataKey="value" barSize={30} radius={[10, 10, 0, 0]} />
                              </BarChart>
                            )}
                          </div>
                          <div className="space-y-3 mt-4">
                            {[
                              { label: "Sales", count: record?.salesmodel_total_count, color: "#4A90E2" }, // Modern Blue
                              { label: "Sales Return", count: record?.salesreturn_total_count, color: "#50E3C2" }, // Aqua Green
                              { label: "Purchase", count: record?.purchesmodel_total_count, color: "#F5A623" }, // Vibrant Orange
                              { label: "Purchases Return", count: record?.purchesreturn_total_count, color: "#D0021B" }, // Bold Red
                            ].map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center px-4 py-3 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <span
                                    className="w-5 h-5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  ></span>
                                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{item.label}</h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 font-medium">{item.count} Bills</p>
                              </div>
                            ))}
                          </div>

                          {/* </> */}
                          {/* )} */}

                        </div>
                      </Box>
                    </Box>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-5 w-full md:w-1/2 ' style={{ width: '100%' }}>
                <div className='flex gap-5' style={{ width: '100%' }}>
                  <Card className="w-full rounded-2xl shadow-xl bg-white dark:bg-gray-800 p-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                        Top Customers
                        <Tooltip title="Latest Customers" arrow>
                          <Button className="p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                            <GoInfo className="text-primary text-xl" />
                          </Button>
                        </Tooltip>
                      </h2>
                    </div>

                    <div className="mt-6">
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={lineChartData}>
                          {/* X-Axis */}
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: "#94a3b8" }}
                            axisLine={{ stroke: "#e2e8f0" }}
                            tickLine={false}
                          />

                          {/* Y-Axis with Auto-Distributed Ticks */}
                          <YAxis
                            tickFormatter={(value) => value.toLocaleString()} // Format numbers
                            ticks={generateYAxisTicks(lineChartData)}
                            tick={{ fontSize: 12, fill: "#94a3b8" }}
                            axisLine={{ stroke: "#e2e8f0" }}
                            tickLine={false}
                          />

                          {/* Tooltip */}
                          <RechartsTooltip
                            contentStyle={{
                              borderRadius: "10px",
                              backgroundColor: "white",
                              color: "black",
                              border: "none",
                              padding: "8px"
                            }}
                          />

                          {/* Legend */}
                          <Legend wrapperStyle={{ fontSize: 13, color: "#64748b" }} />

                          {/* Colorful Bars with Rounded Edges */}
                          <Bar dataKey="balance" barSize={30} radius={[8, 8, 0, 0]}>
                            {lineChartData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={["#2563eb", "#9333ea", "#f43f5e", "#f59e0b", "#22c55e"][index % 5]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Link to="/more/customer" className="text-primary flex items-center gap-1 hover:underline">
                        View all <ChevronRightIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  </Card>


                </div>
                <div className='flex flex-col gap-5 md:flex-row dash_board_chart_crds' style={{ width: '100%' }}>
                  <Card style={{ width: '100%', background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
                    <div className='p-2'>
                      <div>
                        <p className='font-bold text-lg'>Loyalty Points</p>
                        <div className='pt-4 flex flex-col items-center'>
                          <DonutChart data={datas} />
                        </div>

                        <div className='pt-4 space-y-3'>
                          <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                              <div style={{ width: '12px', height: '12px', background: '#006666', borderRadius: '50%' }}></div>
                              <h3 className='text-gray-700 text-sm'>Issued</h3>
                            </div>
                            <p className='text-gray-800 font-semibold'>30</p>
                          </div>

                          <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                              <div style={{ width: '12px', height: '12px', background: '#ffae1a', borderRadius: '50%' }}></div>
                              <h3 className='text-gray-700 text-sm'>Redeemed</h3>
                            </div>
                            <p className='text-gray-800 font-semibold'>{useLoyaltyPoints}</p>
                          </div>

                          <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                              <div style={{ width: '12px', height: '12px', background: '#fe6a49', borderRadius: '50%' }}></div>
                              <h3 className='text-gray-700 text-sm'>Total Loyalty Points</h3>
                            </div>
                            <p className='text-gray-800 font-semibold'>{loyaltyPoints}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className='' style={{ width: '100%' }}>
                    <div className='p-2 flex flex-col '>
                      <div className='flex justify-between '>
                        <div className=''>
                          <p className='font-bold text-lg'>Staff Overview</p>
                        </div>
                        <FormControl >
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            size='small'
                            value={staffListValue}
                            onChange={staffListHandlechange}
                          >
                            {staffList.map((e) => (
                              <MenuItem key={e.id} value={e.id}>
                                {e.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div className="flex justify-center sm:gap-4 gap-2 pt-2">
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                          <TabContext value={pieChartvalue}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                              <TabList aria-label="lab API tabs example" onChange={handlestaffTabchange}>
                                {pieChart.map((e) => (
                                  <Tab key={e.id} value={e.id} label={e.value} sx={
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
                            {pieChart.map((e) => (
                              <TabPanel
                                key={e.id} value={e.id}>
                                <PieChart
                                  series={[
                                    {
                                      data: data,
                                      highlightScope: { faded: 'global', highlighted: 'item' },
                                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                    },
                                  ]}
                                  height={301}
                                />

                              </TabPanel>
                            ))}
                          </TabContext>
                        </Box>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* <div className='grid grid-cols-1 pt-5'> */}
            <div className='dashbd_crd_bx gap-5 grid grid-cols-1 md:grid-cols-2 pt-5 sm:grid-cols-1'>
              <div className='gap-4'>
                <div className="bg-white flex flex-col px-2 py-1 rounded-lg " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)', height: "470px" }}>

                  <div className='p-4 flex justify-between items-center dsh_cdr_hd_ltbill' style={{ borderBottom: '1px solid var(--color2)' }}>
                    <div className='top_fv_bll'>
                      <p className='font-bold dash_first_crd flex items-center' style={{ fontSize: '1.5625rem' }}>Top Five Bills
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
              <div className='gap-4'>
                <div className="bg-white  flex flex-col px-2 py-1 rounded-lg " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)', height: "470px" }}>

                  <div className='p-5 flex justify-between items-center dsh_cdr_hd' style={{ borderBottom: '1px solid var(--color2)' }}>
                    <div className='top_fv_bll'>
                      <p className='font-bold dash_first_crd1 flex items-center' style={{ fontSize: '1.5625rem' }}>Expiring Items
                        <Tooltip title="Expiring Items" arrow>
                          <Button ><GoInfo className='absolute' style={{ fontSize: "1rem", fill: 'var(--color1)' }} /></Button>
                        </Tooltip>
                      </p>
                    </div>
                    <div className=' dsh_crd_btn1'>
                      <FormControl sx={{ minWidth: 100 }}>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          size='small'
                          value={expiredValue}
                          onChange={(e) => { setExpiredValue(e.target.value) }}
                        >
                          {expiryList.map((e) => (
                            <MenuItem key={e.id} value={e.id}>{e.value}</MenuItem>))}
                        </Select>
                      </FormControl>
                      <div>
                      </div>
                    </div>
                  </div>

                  <Box sx={{ height: '100%' }}>
                    <TabContext value={value}>
                      {expiry.length > 0 ? (
                        <>
                          {types.map((e) => (
                            <TabPanel key={e.id} value={e.id} sx={{ height: '100%' }}>
                              <div className='flex flex-col justify-between' style={{ height: '100%' }}>
                                <div className='overflow-x-auto'>
                                  <table className="w-full custom-table" style={{ whiteSpace: 'nowrap' }}>
                                    <thead className="primary">
                                      <tr>
                                        <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                          Item Name
                                        </th>
                                        <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                          Qty.
                                        </th>
                                        <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                          Expiry Date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {expiry.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-200" style={{ textAlign: 'center' }}>
                                          <td className=" px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                            {item.name}
                                          </td>
                                          <td className=" px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                            {item.qty}
                                          </td>
                                          <td className=" px-4 py-2" style={{ minWidth: 150, fontSize: '16px' }}>
                                            {item.expiry}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                {/* View All Link */}
                                <div className="flex justify-end mt-5" style={{ color: 'rgb(0 39 123)' }}>
                                  <Link to='/inventory'>
                                    <div>
                                      <a href="" >View all <ChevronRightIcon /></a>
                                    </div>
                                  </Link>
                                </div>
                              </div>

                            </TabPanel>
                          ))}
                        </>
                      ) : (
                        <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
                          <img src="../no-data.png" className="nofound" width="100%"/>
                        </div>
                      )}
                    </TabContext>
                  </Box>

                </div>
              </div>
            </div>

            <div className='dashbd_crd_bx1 gap-5 grid grid-cols-1 md:grid-cols-2 pt-5 sm:grid-cols-1'>
              {/* <div className='gap-4'>
                <div className="bg-white flex flex-col px-2 py-1 rounded-lg " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)', height: "470px" }}>

                  <div className='p-4 flex justify-between items-center' style={{ borderBottom: '1px solid var(--color2)' }}>
                    <div className=''>
                      <p className='font-bold' style={{ fontSize: '1.5625rem' }}>Expiring Items
                        <Tooltip title="Expiring Items" arrow>
                          <Button ><GoInfo className='absolute' style={{ fontSize: "1rem" }} /></Button>
                        </Tooltip>
                      </p>
                    </div>
                    <div className='gap-8'>
                      <FormControl sx={{ minWidth: 100 }}>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          size='small'
                          value={expiredValue}
                          onChange={(e) => { setExpiredValue(e.target.value) }}
                        >
                          {expiryList.map((e) => (
                            <MenuItem key={e.id} value={e.id}>{e.value}</MenuItem>))}
                        </Select>
                      </FormControl>
                      <div>
                      </div>
                    </div>
                  </div>

                  <Box sx={{ height: '100%' }}>
                    <TabContext value={value}>
                      {expiry.length > 0 ? (
                        <>
                          {types.map((e) => (
                            <TabPanel key={e.id} value={e.id} sx={{ height: '100%' }}>
                              <div className='flex flex-col justify-between' style={{ height: '100%' }}>
                                <div>
                                  <table className="w-full">
                                    <thead className="primary">
                                      <tr>
                                        <th className="border-b border-gray-200 font-bold px-4 py-2">
                                          Item Name
                                        </th>
                                        <th className="border-b border-gray-200 font-bold px-4 py-2">
                                          Qty.
                                        </th>
                                        <th className="border-b border-gray-200 font-bold px-4 py-2">
                                          Expiry Date
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {expiry.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-200" style={{ textAlign: 'center' }}>
                                          <td className=" px-4 py-2">
                                            {item.name}
                                          </td>
                                          <td className=" px-4 py-2">
                                            {item.qty}
                                          </td>
                                          <td className=" px-4 py-2">
                                            {item.expiry}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                {/* View All Link 
                                <div className="flex justify-end mt-5" style={{color:'rgb(0 39 123)'}}>
                                  <Link to='/inventory'>
                                    <div>
                                      <a href="" >View all <ChevronRightIcon /></a>
                                    </div>
                                  </Link>
                                </div>
                              </div>

                            </TabPanel>
                          ))}
                        </>
                      ) : (
                        <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
                          <img src="../no_Data1.png" className="nofound" />
                        </div>
                      )}
                    </TabContext>
                  </Box>

                </div>
              </div> */}
              <div className='gap-4'>

                <div className="bg-white flex flex-col px-2 py-1 rounded-lg " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)', height: "470px" }}>

                  <div className='p-4 flex justify-between items-center' style={{ borderBottom: '1px solid var(--color2)' }}>
                    <div className=''>
                      <p className='font-bold flex items-center' style={{ fontSize: '1.5625rem' }}>Top Distributors
                        <Tooltip title="Latest Distributors" >
                          <Button ><GoInfo className='absolute' style={{ fontSize: "1rem", fill: 'var(--color1)' }} /></Button>
                        </Tooltip>
                      </p>
                    </div>
                  </div>

                  <Box sx={{ height: '100%', padding: "24px" }}>
                    {distributor.length > 0 ? (
                      <>
                        <div className='flex flex-col justify-between' style={{ height: '100%' }}>
                          <div className="overflow-x-auto">
                            <table className="w-full custom-table" style={{ whiteSpace: 'nowrap' }}>
                              <thead className="primary">
                                <tr>
                                  <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 180, fontSize: '16px' }}>
                                    Distributor
                                  </th>
                                  <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 180, fontSize: '16px' }}>
                                    GST Number
                                  </th>
                                  <th className="border-b border-gray-200 font-bold px-4 py-2" style={{ minWidth: 180, fontSize: '16px' }}>
                                    Bill Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {distributor.map((item, index) => (
                                  <tr key={index} className="border-b border-gray-200" style={{ textAlign: 'center' }}>
                                    <td className="px-4 py-2" style={{ minWidth: 180, fontSize: '16px' }}>
                                      {item.name}
                                    </td>
                                    <td className="px-4 py-2" style={{ minWidth: 180, fontSize: '16px' }}>
                                      {item.gst_number}
                                    </td>
                                    <td className="px-4 py-2" style={{ minWidth: 180, fontSize: '16px' }}>
                                      Rs.{item.due_amount == 0 ? 0 : item.due_amount}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* View All Link */}
                          <div className="flex justify-end mt-5" style={{ color: 'rgb(0 39 123)' }}>
                            <Link to='/more/DistributorList'>
                              <div>
                                <a href="" >View all <ChevronRightIcon /></a>
                              </div>
                            </Link>
                          </div>
                        </div>

                      </>
                    ) : (
                      <div className="flex justify-center items-center" style={{ minHeight: "400px" }}>
                        <img src="../no-data.png" className="nofound" />
                      </div>
                    )}
                  </Box>

                </div>
              </div>
            </div>

            {/* <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-5'>
              <div className='gap-4'>
                <div className="flex flex-col px-2 py-1 justify-between" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <Box >
                    <Box >
                      <Tabs
                        value={linechartValue}
                        onChange={lineHandleChanges}
                        variant="scrollable"
                        scrollButtons={false}
                        className='p-2'
                        aria-label="scrollable prevent tabs example"
                      >
                        {record?.chart?.map((e) => (
                          <Tab key={e.id} value={e.title} label={e.title} />))}
                      </Tabs>
                      <div className='flex py-4 p-6 flex-wrap '>
                        <div className='w-1/2'>
                          <p>Sales</p>
                          <h4 className='text-2xl font-bold' style={{ color: 'green' }}> Rs.{!record?.salesmodel_total ? 0 : record?.salesmodel_total}/- </h4>
                          <span>{record?.salesmodel_total_count} Bills</span>
                        </div>
                        <div className='w-1/2'>
                          <p>Purchase</p>
                          <h4 className='text-red-500 text-2xl font-bold'> Rs.{!record?.purchesmodel_total ? 0 : record?.purchesmodel_total}/- </h4>
                          <span>{record?.purchesmodel_total_count} Bills</span>
                        </div>
                      </div>
                      <div className='flex py-4 p-6 justify-between'>
                        <div className='w-1/2' >
                          <p>Sale Return</p>
                          <h4 className='text-red-500 text-2xl font-bold'> Rs.{!record?.salesreturn_total ? 0 : record?.salesreturn_total}/-</h4>
                          <span>{record?.salesreturn_total_count} Bills</span>
                        </div>
                        <div className='w-1/2'>
                          <p>Purchase Return</p>
                          <h4 className='text-2xl font-bold' style={{ color: 'green' }}> Rs.{!record?.purchesreturn_total ? 0 : record?.purchesreturn_total}/- </h4>
                          <span>{record?.purchesreturn_total_count} Bills</span>
                        </div>
                      </div>
                    </Box>
                  </Box>
                </div>

                <div className="flex flex-col px-2 py-1 justify-between mt-5" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <div className='p-2 flex justify-between items-center'>
                    <div className=''>
                      <p className='font-bold '>Top Five Bills</p>
                    </div>
                    {billData.length > 0 &&
                      <FormControl sx={{ minWidth: 100 }}>
                        <Select
                          labelId="demo-simple-select-helper-label"
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
                  <Box >
                    <TabContext value={value}  >
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
                        <TabList aria-label="lab API tabs example" onChange={handlechange}>
                          {types.map((e) => (
                            <Tab key={e.id} value={e.id} label={e.value} />
                          ))}
                        </TabList>
                      </Box>
                      {billData.length > 0 ?
                        <>
                          {types.map((e) => (
                            <TabPanel key={e.id} value={e.id}>
                              <div className='flex  justify-between py-1 p-5 text-blue-900 border-b border-blue-200' >
                                <div>
                                  {value == 0 ? 'Distributors' : 'Customers'}

                                </div>
                                <div>
                                  Bill Amount
                                </div>
                              </div>
                              <div className='px-2 py-1' style={{ minHeight: "270px" }}>
                                {billData.map((item) =>
                                  <div className='py-1 border-b border-blue-200 flex justify-between items-center'>
                                    <div className='flex'>
                                      <p className='ml-2 font-bold'>{item.name}<br />{item.phone_number == "" ? '--' : item.phone_number}</p>
                                    </div>
                                    <div className={`text-lg font-bold ${value === 0 ? 'text-red-600' : 'text-green-600'}`}>Rs.{item.total_amount == 0 ? 0 : item.total_amount}</div>
                                  </div>
                                )}
                              </div>
                              <div className='text-blue-600 flex justify-end'>
                                {value == 0 ?
                                  <Link to='/purchase/purchasebill'>
                                    <div>
                                      <a href="" >View all <ChevronRightIcon /></a>
                                    </div>
                                  </Link> :
                                  <Link to='/salelist'>
                                    <div>
                                      <a href="" >View all <ChevronRightIcon /></a>
                                    </div>
                                  </Link>
                                }
                              </div>
                            </TabPanel>
                          ))}
                        </> :
                        <div className='flex justify-center' style={{ minHeight: "400px", alignItems: 'center', }}>
                          <img src='../no_Data1.png' className='nofound' />
                        </div>
                      }
                    </TabContext>

                  </Box>

                </div>

                {/* need to pay 

              </div>
              <div className='gap-4'>
                <div>

                  {/* need to collect 
                  <div className=" p-4 h-fit justify-between " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                    <div>
                      <div>
                        <div className='flex justify-between py-2'>
                          <div className='justify-start text-lg font-medium'>
                            Top Customers
                            <Tooltip title="Latest Customers" arrow>
                              <Button ><GoInfo className='absolute' style={{ fontSize: "1rem" }} /></Button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      {customer.length > 0 ?
                        <>
                          <div className='flex justify-between  font-bold  text-blue-900 border-b border-blue-200'>
                            <div>Customer</div>
                            <div>Bill Amount</div>
                          </div>
                          <div style={{ minHeight: "170px" }}>
                            {customer.map((item) =>
                              <div className='p-2 border-b border-blue-200 flex justify-between items-center' >
                                <div className='flex' >
                                  <div className='bg-blue-900 w-8 h-8 rounded-full mt-3 flex items-center justify-center'>
                                    <FaUser className='text-white w-4 h-4' />
                                  </div>
                                  <p className='ml-2 font-bold '>{item.name} <br />{item.mobile}</p>
                                </div>
                                <div className='text-lg font-bold' style={{ color: 'green' }}>Rs.{item.balance}</div>
                              </div>
                            )}
                          </div>
                        </> :
                        <div className='flex justify-center' style={{ minHeight: "300px", alignItems: 'center', }}>
                          <img src='../no_Data1.png' className='nofound' />
                        </div>
                      }
                      <div className='text-blue-600 flex justify-end'>
                        <Link to='/more/customer'>
                          <div>
                            <a href="" >View all <ChevronRightIcon /></a>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Stock by PTR and MRP 
                  <div className="flex flex-col p-2 justify-between mt-5" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                    <div className='p-5 flex justify-between items-center gap-2'>
                      <div className=''>
                        <p className='font-bold '>Stock By PTR</p>
                        <div className={`text-lg font-bold text-green-600`}>Rs.{record?.total_ptr == 0 ? 0 : record?.total_ptr}</div>
                      </div>
                      <div className=''>
                        <p className='font-bold '>Stock By MRP</p>
                        <div className={`text-lg font-bold text-green-600`}>Rs.{record?.total_mrp == 0 ? 0 : record?.total_mrp}</div>
                      </div>
                    </div>
                  </div>


                  <div className="flex flex-col p-2 justify-between mt-5" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                    <div className='p-2 flex justify-between items-center gap-2'>
                      <div className=''>
                        <p className='font-bold '>Staff Overview</p>
                      </div>
                      <FormControl >
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          size='small'
                          value={staffListValue}
                          onChange={staffListHandlechange}
                        >
                          {staffList.map((e) => (
                            <MenuItem key={e.id} value={e.id}>
                              {e.value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="flex justify-center sm:gap-4 gap-2">
                      <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={pieChartvalue}>
                          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList aria-label="lab API tabs example" onChange={handlestaffTabchange}>
                              {pieChart.map((e) => (
                                <Tab key={e.id} value={e.id} label={e.value} />
                              ))}
                            </TabList>
                          </Box>
                          {pieChart.map((e) => (
                            <TabPanel
                              key={e.id} value={e.id}>
                              <PieChart
                                series={[
                                  {
                                    data: data,
                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                  },
                                ]}
                                height={250}
                              />

                            </TabPanel>
                          ))}
                        </TabContext>
                      </Box>
                    </div>
                  </div>
                </div>
              </div>
              <div className='gap-4'>
                <div className="flex p-6 mb-5 h-fit loyalbg" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <div className='w-1/2'>
                    <h2 className='text-blue-900 text-xl font-semibold'>Loyalty Points</h2>
                    <div className='pointlogo'>
                      <img src='../coin.png' />
                    </div>
                  </div>

                  <div className='w-1/2 items-center'>
                    <div className='mb-2 flex justify-between items-center '>
                      <div className='flex '>
                        <span className='text-lime-800 font-bold mr-2 text-xl'>142,843</span>
                        <p> Issued</p>
                      </div>
                    </div>
                    <div className='mb-2 flex justify-between items-center '>
                      <div className='flex '>
                        <span className='text-blue-800 font-bold mr-2 text-xl '>114</span>
                        <p>  Redeemed</p>
                      </div>
                    </div>
                    <div className='mb-2 flex justify-between items-center '>
                      <div className='flex'>
                        <span className='text-blue-500 font-bold mr-2 text-xl'>32</span>
                        <p> Issued</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" p-4 h-fit justify-between " style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <div>
                    <div>
                      <div className='flex justify-between py-2'>
                        <div className='justify-start text-lg font-medium'>
                          Expiring Items
                          <Tooltip title="Expiring Items" arrow>
                            <Button ><GoInfo className='absolute' style={{ fontSize: "1rem" }} /></Button>
                          </Tooltip>
                        </div>
                        {/* {expiry.length > 0 && 
                        <FormControl sx={{ minWidth: 100 }}>
                          <Select
                            labelId="demo-simple-select-helper-label"
                            id="demo-simple-select-helper"
                            size='small'
                            value={expiredValue}
                            onChange={(e) => { setExpiredValue(e.target.value) }}
                          >
                            {expiryList.map((e) => (
                              <MenuItem key={e.id} value={e.id}>{e.value}</MenuItem>))}
                          </Select>
                        </FormControl>
                        {/* } 
                      </div>
                    </div>
                    {expiry.length > 0 ?
                      <>
                        <div className='flex justify-between  font-bold  text-blue-900 border-b border-blue-200'>
                          <div className='ml-2 w-36'>
                            Item Name
                          </div>
                          <div>
                            Qty.
                          </div>
                          <div>
                            Expiry Date
                          </div>
                        </div>
                        <div style={{ minHeight: "235px" }}>
                          {expiry.map((item) =>
                            <div className='p-2 border-b border-blue-200 flex justify-between items-center'>
                              <div className='flex'>
                                <p className='ml-2 w-28'>{item.name}</p>
                              </div>
                              <div className='font-bold text-lg' style={{ color: 'green' }}>{item.qty}</div>
                              <div className='font-bold text-lg' style={{ color: 'red' }}>{item.expiry}</div>
                            </div>
                          )}
                        </div>
                      </>
                      :
                      <div className='flex justify-center' style={{ minHeight: "300px", alignItems: 'center', }}>
                        <img src='../no_Data1.png' className='nofound' />
                      </div>
                    }
                    <div className='text-blue-600 flex justify-end'>
                      <Link to='/inventory'>
                        <div>
                          <a href="" >View all <ChevronRightIcon /></a>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col p-2 justify-between mt-5" style={{ boxShadow: '0 0 16px rgba(0, 0, 0, .1607843137254902)' }}>
                  <div className='p-2 flex justify-between items-center'>
                    <div className=''>
                      <p className='font-medium'>Top Distributors
                        <Tooltip title="Latest Distributors" >
                          <Button ><GoInfo className='absolute' style={{ fontSize: "1rem" }} /></Button>
                        </Tooltip>
                      </p>
                    </div>
                  </div>
                  {distributor.length > 0 ?
                    <>
                      <div className='flex justify-between py-2 p-5 text-blue-900 border-b border-blue-200 '>
                        <div>
                          Distributor
                        </div>
                        <div>
                          Bill Amount
                        </div>
                      </div>
                      <div className='px-5 py-2' style={{ minHeight: "300px" }} >
                        {distributor.map((item) =>
                          <div className='py-1 border-b border-blue-200 flex justify-between items-center'>
                            <div className='flex'>
                              <p className='ml-2 font-bold'>{item.name}<br />{item.gst_number}</p>
                            </div>
                            <div className='text-red-600  text-lg font-bold'>Rs.{item.due_amount == 0 ? 0 : item.due_amount}</div>
                          </div>
                        )}

                      </div>
                    </>
                    :
                    <div className='flex justify-center' style={{ minHeight: "300px", alignItems: 'center', }}>
                      <img src='../no_Data1.png' className='nofound' />
                    </div>
                  }
                  <div className='text-blue-600 flex justify-end'>
                    <Link to='/more/DistributorList'>
                      <div>
                        <a href="" >View all <ChevronRightIcon /></a>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div> */}
          </div> 
        }
      </div>
    </div>

  )

}

export default Dashboard
