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
import stockByPTR from '../Image/stock by ptr 1.png'
import stockByMRP from '../Image/stock by mrp 1.png'
import { Card } from 'flowbite-react';
// import { PieChart } from 'react-minimal-pie-chart';
// import { PieChart } from '@mui/x-charts/PieChart';
import DonutChart from './Chart/DonutChart';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
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

  const lineHandleChange = (event, newValue) => {
    setLinechartValue(newValue);
    const selectedData = record?.chart.find(e => e.title === newValue);
    if (selectedData) {
      setBarChartData([
        { name: 'Sales', value: selectedData.sales_total || 0, fill: 'var(--COLOR_UI_PHARMACY)' },
        // { name: 'Sales Count', value: selectedData.sales_count || 0 },
        { name: 'Sales Return', value: selectedData.sales_return_total || 0, fill: 'var(--color2)' },
        // { name: 'Sales Return Count', value: selectedData.sales_return_count || 0 },
        { name: 'Purchases', value: selectedData.purchase_total || 0, fill: '#9fc172' },
        // { name: 'Purchase Count', value: selectedData.purchase_count || 0 },
        { name: 'Purchases Return', value: selectedData.purchase_return_total || 0, fill: 'var(--color3)' },
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
    // setIsLoading(true)
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
      //   console.error('Error fetching dashboard data:', error);
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
        // localStorage.setItem('Permission', JSON.stringify(permission));
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

  return (
    <div >
      <div>
        <Header key={reRender} />

        {isLoading ? <div className="loaderdash">
          <Loader />
        </div> :
          <div className='p-5' style={{ background: 'rgb(231 230 230 / 36%)', height: '100%' }}>

            <div className='flex flex-col md:flex-row justify-between gap-5 dash_card_chartss items-end'>
              <div className='flex flex-col w-full md:w-1/2' style={{ width: '100%' }}>
                <div>
                  <h1 style={{ color: 'var(--color2)', fontSize: '2rem', fontWeight: 600 }}>Pharma Dashboard</h1>
                  <p style={{ color: 'gray' }}>Track sales, inventory, and customer trends in real-time</p>
                </div>
                <div>
                  <div className='dsh_card_chart mb-5 pb-5 bg-white flex p-5 rounded-lg border border-gray-200 dark:border-gray-700' style={{ display: 'flex', justifyContent: 'space-between', gap: '16%', marginTop: "60px" }}>
                    <div className='gap-5' style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={stockByPTR} />
                      <div>
                        <h3 style={{ color: 'var(--color2)', fontWeight: 500, fontSize: '20px', whiteSpace: 'nowrap' }}>Stock By PTR</h3>
                        <div className={`text-xl font-bold primary`}>Rs.{record?.total_ptr == 0 ? 0 : record?.total_ptr}</div>
                      </div>
                    </div>
                    <div className='gap-5' style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={stockByMRP} />
                      <div>
                        <h3 style={{ color: 'var(--color2)', fontWeight: 500, fontSize: '20px', whiteSpace: 'nowrap' }}>Stock By MRP</h3>
                        <div className={`text-xl font-bold primary`}>Rs.{record?.total_mrp == 0 ? 0 : record?.total_mrp}</div>
                      </div>
                    </div>


                  </div>

                  {/* Bar charts */}
                  <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between px-2 py-1 py-8 rounded-lg shadow-md">
                    <Box >
                      <Box>
                        <div className='p-2 flex flex-col'>

                          <div className='flex justify-between items-center'>

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
                                      color: 'var(--color2)',
                                      fontWeight: 'bold'
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
                                <img src='../no_Data1.png' className='nofound' alt="No Data" />
                              </div>
                            ) : (

                              <BarChart
                                width={900}
                                height={429}
                                data={barChartData}
                                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                              >

                                <XAxis dataKey="name" tick={false} axisLine={{ stroke: "#ccc" }} />
                                <YAxis />
                                <RechartsTooltip contentStyle={{ borderRadius: '7px' }} />
                                <Legend />
                                <Bar dataKey="value" barSize={60} />
                              </BarChart>
                            )}
                          </div>
                          <div className='flex justify-between pl-8 pr-8 pt-8'>
                            <div className='flex gap-2'>
                              <div style={{ border: '1px solid var(--COLOR_UI_PHARMACY)', background: 'var(--COLOR_UI_PHARMACY)', padding: '0px 22px' }}>
                              </div>
                              <h3>Sales</h3>
                            </div>
                            <p>
                              {record?.salesmodel_total_count} Bills
                            </p>
                          </div>
                          <div className='flex justify-between pl-8 pr-8 pt-1'>
                            <div className='flex gap-2'>
                              <div style={{ border: '1px solid var(--color2)', background: 'var(--color2)', padding: '0px 22px' }}>
                              </div>
                              <h3>Sales Return</h3>
                            </div>
                            <p>
                              {record?.salesreturn_total_count} Bills
                            </p>
                          </div>
                          <div className='flex justify-between pl-8 pr-8 pt-1'>
                            <div className='flex gap-2'>
                              <div style={{ border: '1px solid #9fc172', background: '#9fc172', padding: '0px 22px' }}>
                              </div>
                              <h3>Purchase</h3>
                            </div>
                            <p>
                              {record?.purchesmodel_total_count} Bills
                            </p>
                          </div>
                          <div className='flex justify-between pl-8 pr-8 pt-1'>
                            <div className='flex gap-2'>
                              <div style={{ border: '1px solid var(--color3)', background: 'var(--color3)', padding: '0px 22px' }}>
                              </div>
                              <h3>Purchases Return</h3>
                            </div>
                            <p>
                              {record?.purchesreturn_total_count} Bills
                            </p>
                          </div>
                          {/* </> */}
                          {/* )} */}
                        </div>
                      </Box>
                    </Box>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-5 w-full md:w-1/2' style={{ width: '100%' }}>
                <div className='flex gap-5' style={{ width: '100%' }}>
                  <Card style={{ width: '100%' }}>
                    <div className='p-2 flex flex-col'>
                      <div className='flex justify-between'>
                        <div className=''>
                          <p className='font-bold flex items-center text-lg'>Top Customers
                            <Tooltip title="Latest Customers" arrow>
                              <Button ><GoInfo className='absolute' style={{ fontSize: "1rem", fill: 'var(--color1)' }} /></Button>
                            </Tooltip></p>
                        </div>

                        {/* <div className='primary'>
                          Graphical <Switch checked={switchCustomerValue} onChange={handleSwitchCustomerChange}
                          /> Classical
                        </div> */}

                      </div>
                      {/* {switchCustomerValue ? (
                        <>
                          {
                            customer.length > 0 ?
                              <>
                                <div className='flex justify-between  font-bold  text-gray-400 border-b border-blue-200 mt-3 pb-2'>
                                  <div>Customer</div>
                                  <div>Bill Amount</div>
                                </div>
                                <div className='' style={{ minHeight: "300px" }}>
                                  {customer.map((item) =>
                                    <div className='p-2 border-b border-blue-200 flex justify-between items-center' >
                                      <div className='flex items-center mt-1 mb-1 gap-3' >
                                        <div className='bg-blue-900 w-8 h-8 rounded-full flex items-center justify-center'>
                                          <FaUser className='text-white w-4 h-4' />
                                        </div>
                                        <p className='font-bold text-sm'>{item.name} <br />{item.mobile}</p>
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
                        </>

                      ) : ( */}
                      <div class='pt-5 pb-5'>
                        {customer.length > 0 ? (
                          <>
                            <LineChart
                              width={850}
                              height={300}
                              data={lineChartData}
                              cursor="pointer"
                            >
                              <XAxis dataKey="name" tick={{ style: { fontSize: tickFontSize } }} />
                              <YAxis tick={{ style: { fontSize: tickFontSize } }}/>
                              <RechartsTooltip contentStyle={{ borderRadius: '7px' }} />
                              <Legend />
                              <Line dataKey="balance" stroke="#8884d8" />
                            </LineChart>
                          </>
                        ) : (
                          <div >
                            <img src='../no_Data1.png' className='nofound' alt="No Data" />
                          </div>
                        )}
                      </div>
                      {/* )} */}
                      <div className='flex justify-end' style={{ color: 'rgb(0 39 123)' }}>
                        <Link to='/more/customer'>
                          <div>
                            <a href="">View all <ChevronRightIcon /></a>
                          </div>
                        </Link>
                      </div>

                    </div>
                  </Card>
                </div>
                <div className='flex flex-col gap-5 md:flex-row dash_board_chart_crds' style={{ width: '100%' }}>
                  <Card style={{ width: '100%' }}>
                    <div className='p-2 '>
                      <div className=''>
                        <p className='font-bold text-lg'>Loyalty Points</p>
                        <div class='pt-2'>

                          <DonutChart data={datas} />
                          <div className='flex justify-between pt-2'>
                            <div className='flex gap-2'>
                              <div style={{ width: '50px', background: 'rgb(121 200 255 / 81%)', padding: '0px 22px' }}>

                              </div>
                              <h3>Issued</h3>
                            </div>
                            <p>
                              30
                            </p>
                          </div>
                          <div className='flex justify-between pt-1'>
                            <div className='flex gap-2'>
                              <div style={{ width: '50px', background: 'rgb(29 163 255)', padding: '0px 22px' }}>
                              </div>
                              <h3>Redeemed</h3>
                            </div>
                            <p>
                              {useLoyaltyPoints}
                            </p>
                          </div>
                          <div className='flex justify-between pt-1'>
                            <div className='flex gap-2'>
                              <div style={{ width: '50px', background: 'rgb(42 98 137)', padding: '0px 22px' }}>

                              </div>
                              <h3>Total Loyalty Points</h3>
                            </div>
                            <p>
                              {loyaltyPoints}
                            </p>
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
                                        color: 'var(--color2)',
                                        fontWeight: 'bold'
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
                                      color: 'var(--color2)',
                                      fontWeight: 'bold'
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
                          <img src="../no_Data1.png" className="nofound" />
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
                          <img src="../no_Data1.png" className="nofound" />
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
                        <img src="../no_Data1.png" className="nofound" />
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

