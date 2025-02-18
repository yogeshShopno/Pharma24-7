import "./AddPurchasebill.css";
import React, { useState, useRef, useEffect } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Button,
  InputAdornment,
  ListItem,
  ListItemText,
  OutlinedInput,
  TextField,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaPlusCircle } from "react-icons/fa";
import { MenuItem, Select } from "@mui/material";
import { BsLightbulbFill } from "react-icons/bs";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Header from "../../../Header";
import DatePicker from "react-datepicker";
import { addDays, format, subDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";

import { Prompt } from "react-router-dom/cjs/react-router-dom";
import { VscDebugStepBack } from "react-icons/vsc";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { Modal } from "flowbite-react";
import { FaCaretUp } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };

};

const AddPurchaseBill = () => {
  const searchItemField = useRef(null);
  const inputRef1 = useRef();
  const inputRef2 = useRef();
  const inputRef3 = useRef();
  const inputRef4 = useRef();
  const inputRef5 = useRef();
  const inputRef6 = useRef();
  const inputRef7 = useRef();
  const inputRef8 = useRef();
  const inputRef9 = useRef();
  const inputRef10 = useRef();
  const inputRef11 = useRef();
  const inputRef12 = useRef();
  const inputRef13 = useRef();

  const [ItemPurchaseList, setItemPurchaseList] = useState({ item: [] });
  const [totalMargin, setTotalMargin] = useState(0);
  const [marginNetProfit, setMarginNetProfit] = useState(0);
  const [totalNetRate, setTotalNetRate] = useState(0);
  const [totalBase, setTotalBase] = useState(0);
  const [totalFree, setTotalFRee] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [searchItem, setSearchItem] = useState("");
  const [itemList, setItemList] = useState([]);
  const [distributor, setDistributor] = useState(null);
  const [billNo, setbillNo] = useState("");
  const [dueDate, setDueDate] = useState(addDays(new Date(), 15));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [randomNumber, setRandomNumber] = useState(null);
  const [srNo, setSrNo] = useState();
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [error, setError] = useState({ distributor: "", billNo: "" });
  const [expiryDate, setExpiryDate] = useState("");
  const [mrp, setMRP] = useState(null);
  const [ptr, setPTR] = useState(null);
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");
  const [deleteAll, setDeleteAll] = useState(false);
  const [free, setFree] = useState("");
  const [loc, setLoc] = useState("");
  const [unit, setUnit] = useState("");
  const [schAmt, setSchAmt] = useState("");
  const [ItemTotalAmount, setItemTotalAmount] = useState(0);
  const [margin, setMargin] = useState("");
  const [disc, setDisc] = useState("");
  const [base, setBase] = useState("");
  const [gst, setGst] = useState();
  const [batch, setBatch] = useState("");
  const [HSN, setHSN] = useState("");

  const [gstList, setGstList] = useState([]);
  const userId = localStorage.getItem("userId");
  const [barcode, setBarcode] = useState("");
  const [netRate, setNetRate] = useState("");
  const [IsDelete, setIsDelete] = useState(false);

  const [ItemId, setItemId] = useState(0);

  const [isAutocompleteDisabled, setAutocompleteDisabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEditItemId, setSelectedEditItemId] = useState(0);
  const [selectedEditItem, setSelectedEditItem] = useState(null);
  const [unitEditID, setUnitEditID] = useState(0);
  const [itemEditID, setItemEditID] = useState(0);
  const [distributorList, setDistributorList] = useState([]);
  const [otherAmt, setOtherAmt] = useState(0);
  const [batchListData, setBatchListData] = useState([]);
  const [openAddPopUp, setOpenAddPopUp] = useState(false);
  const [openAddItemPopUp, setOpenAddItemPopUp] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [purchaseReturnPending, setPurchaseReturnPending] = useState([]);
  const [finalPurchaseReturnList, setFinalPurchaseReturnList] = useState([]);
  // const [adjustCnAmount, setAdjustCnAmount] = useState("")
  const [cnTotalAmount, setCnTotalAmount] = useState({});
  const [netAmount, setNetAmount] = useState(0);
  const [finalTotalAmount, setFinalTotalAmount] = useState(0);
  const [cnAmount, setCnAmount] = useState(0);
  const [roundOffAmount, setRoundOffAmount] = useState(0);
  const [finalCnAmount, setFinalCnAmount] = useState(0);
  const [isOpenBox, setIsOpenBox] = useState(false);
  const [nextPath, setNextPath] = useState("");
  const [unsavedItems, setUnsavedItems] = useState(false);

  const [selectedOption, setSelectedOption] = useState(null);

  const [addItemName, setAddItemName] = useState("");
  const [addBarcode, setAddBarcode] = useState("");
  const [addUnit, setAddUnit] = useState("");
  const [barcodeBatch, setBarcodeBatch] = useState("");

  const [highlightedRowId, setHighlightedRowId] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const [itemAutofoucs, setItemAutofoucs] = useState(false);
  const [autocompleteKey, setAutocompleteKey] = useState(0);
  const [focusedField, setFocusedField] = useState("distributor");

  const [openFile, setOpenFile] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);

  const paymentOptions = [
    { id: 1, label: "Cash" },
    { id: 2, label: "Credit" },
    { id: 3, label: "UPI" },
    { id: 4, label: "Cheque" },
    { id: 5, label: "Paytm" },
    { id: 6, label: "CC/DC" },
    { id: 7, label: "RTGS/NEFT" },
  ];

  const [errors, setErrors] = useState({});
  const [paymentType, setPaymentType] = useState("credit");
  const [bankData, setBankData] = useState([]);
  const [id, setId] = useState(null);
  let defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 3);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  /*<================================================================================ Input ref on keydown enter  =======================================================================> */

  const [selectedIndex, setSelectedIndex] = useState(-1); // Index of selected row
  const tableRef = useRef(null); // Reference for table container

  const inputRefs = useRef([]);

  // Handle key presses for navigating rows
  const handleKeyPress = (e) => {
    // setTableFocus(true);
    const key = e.key;
    if (key === "ArrowDown") {
      // Move selection down
      setSelectedIndex((prev) =>
        prev < ItemPurchaseList.item.length - 1 ? prev + 1 : prev
      );
    } else if (key === "ArrowUp") {
      // Move selection up
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (key === "Enter" && selectedIndex !== -1) {
      // Confirm selection

      const selectedRow = ItemPurchaseList.item[selectedIndex];
      setSelectedEditItemId(selectedRow.id);

      handleEditClick(ItemPurchaseList.item[selectedIndex])

    }
  };

  useEffect(() => {
    const currentRef = tableRef.current;
    if (currentRef) {
      currentRef.focus(); // Ensure focus for capturing key events
      currentRef.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("keydown", handleKeyPress);
      }
    };
  }, [selectedIndex, ItemPurchaseList]);



  useEffect(() => {
    if (selectedIndex >= 0) {
      setSelectedEditItemId(ItemPurchaseList.item[selectedIndex]?.id || null);
    }
  }, [selectedIndex, ItemPurchaseList]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault(); // Prevent the browser's save dialog

        handleSubmit(); // Call your function
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event, index) => {

    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission

      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus(); // Move to next input
      }
    }
  };

  /*<================================================================================ PTR and MRP validation =======================================================================> */

  useEffect(() => {
    const newErrors = {};
    if (Number(ptr) > Number(mrp)) {
      newErrors.ptr = "PTR must be less than or equal to MRP";
      toast.error("PTR must be less than or equal to MRP");
    }

    setErrors(newErrors);
  }, [ptr, mrp]);

  /*<================================================================= Clear old purchase item if user leave the browswer =========================================================> */

  useEffect(() => {
    generateRandomNumber();
    const initialize = async () => {
      try {
        await handleLeavePage();
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };
    initialize();
  }, []);

  /*<===================================================== handle add item using barcode function if add value in barcode field =================================================> */

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleBarcode();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [barcode]);

  /*<=========================================================================== get essential details intially =================================================================> */

  useEffect(() => {
    if (id) {
      batchList(id);
    }
    listDistributor();
    BankList();
    listOfGst();
    setSrNo(localStorage.getItem("Purchase_SrNo"));
  }, [id]);

  /*<============================================================================ Clear old purchase item data ====================================================================> */

  useEffect(() => {
    if (localStorage.getItem("RandomNumber") !== null) {
      if (deleteAll == false) {
        handlePopState();
      }
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /*<================================================================== Clear old purchase item if user leave the browswer ==========================================================> */

  useEffect(() => {
    const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
    setSchAmt(totalSchAmt);

    /*<=========================================================================== Calculate totalBase ================================================================================> */

    const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    setItemTotalAmount(0);
    setBase(totalBase);

    /*<============================================================================= Calculate totalAmount ==============================================================================> */

    const totalAmount = parseFloat(
      (totalBase + (totalBase * gst) / 100).toFixed(2)
    );
    if (totalAmount) {
      setItemTotalAmount(totalAmount);
    } else {
      setItemTotalAmount(0);
    }

    /*<======================================================================================= Net Rate calculation ====================================================================> */

    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;
    const netRate = parseFloat(
      (totalAmount / (numericQty + numericFree)).toFixed(2)
    );
    setNetRate(netRate);

    /*<================================================================================= Margin calculation =========================================================================> */

    const Margin = parseFloat((((mrp - netRate) / mrp) * 100).toFixed(2));
    setMargin(Margin);
  }, [qty, ptr, disc, mrp, gst, free, ItemTotalAmount, barcodeBatch]);

  /*<============================================================================== CN calculation realtime ========================================================================> */

  useEffect(() => {
    const total = Object.values(cnTotalAmount)
      .map((amount) => parseFloat(amount) || 0)
      .reduce((acc, amount) => acc + amount, 0);
    setCnAmount(total);
  }, [cnTotalAmount]);

  /*<================================================================================ get bank list =============================================================================> */

  const BankList = async () => {
    let data = new FormData();
    try {
      await axios
        .post("bank-list", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setBankData(response.data.data);
          if (response.data.status === 401) {
            history.push('/');
            localStorage.clear();
          }
        });
    } catch (error) {
      console.error("API error:", error);
      if (error.response.status === 401) {
        setUnsavedItems(false);
      }
    }
  };


  /*<============================================================================ expiry date validation =========================================================================> */

  const handleExpiryDate = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\D/g, "");

    if (inputValue.length > 2) {
      const month = inputValue.slice(0, 2);
      const year = inputValue.slice(2, 4);
      if (parseInt(month) > 12) {
        inputValue = "MM";
      } else if (parseInt(month) < 1) {
        inputValue = "01";
      }
      inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 4)}`;
    }

    setExpiryDate(inputValue);
  };

  /*<================================================================================= select file to upload =========================================================================> */

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.type;
      if (fileType === "text/csv") {
        setFile(selectedFile);
      } else {
        toast.error("Please select an Excel or CSV file.");
      }
    }
  };

  /*<=================================================================================== upload selected file =======================================================================> */

  const handleFileUpload = async () => {
    generateRandomNumber();

    if (file) {
      let data = new FormData();
      data.append("file", file);
      data.append("random_number", localStorage.getItem("RandomNumber"));

      const params = {
        random_number: localStorage.getItem("RandomNumber"),
      };

      setIsLoading(true);
      try {
        await axios
          .post("purchase-item-upload", data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            toast.success(response.data.message);
            setOpenFile(false);
            setIsLoading(false);
            setUnsavedItems(true);
            itemPurchaseList();
          });
      } catch (error) {
        setIsLoading(false);
        console.error("API error:", error);
      }
    } else {
      toast.error("No file selected");
    }
  };

  /*<================================================================================ download selected file =============================================================================> */

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/purchase_add_sample.csv";
    link.download = "purchase_add_sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /*<============================================================================ barcode functionality =========================================================================> */

  const handleBarcode = async () => {

    setIsEditMode(false);
    if (!barcode) {
      return;
    }

    /*<============================================================================ get barcode batch list =========================================================================> */

    try {
      const res = axios.post("barcode-batch-list?", { barcode: barcode },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((response) => {
        console.log(response.data.data[0]?.batch_list[0], "response")

        setTimeout(() => {
          const handleBarcodeItem = async () => {
            setUnsavedItems(true);
            let data = new FormData();

            data.append(
              "random_number",
              localStorage.getItem("RandomNumber")
            );
            data.append(
              "weightage",
              Number(response?.data?.data[0]?.batch_list[0]?.unit)
            );
            data.append(
              "batch_number",
              response?.data?.data[0]?.batch_list[0]?.batch_name
                ? response?.data?.data[0]?.batch_list[0]?.batch_name
                : 0
            );
            data.append(
              "expiry",
              response?.data?.data[0]?.batch_list[0]?.expiry_date
            );
            data.append(
              "mrp",
              Number(response?.data?.data[0]?.batch_list[0]?.mrp)
                ? Number(response?.data?.data[0]?.batch_list[0]?.mrp)
                : 0
            );
            data.append(
              "qty",
              Number(response?.data?.data[0]?.batch_list[0]?.unit)
                ? Number(response?.data?.data[0]?.batch_list[0]?.unit)
                : 0
            );
            data.append(
              "free_qty",
              Number(
                response?.data?.data[0]?.batch_list[0]?.purchase_free_qty
              )
                ? Number(
                  response?.data?.data[0]?.batch_list[0]?.purchase_free_qty
                )
                : 0
            );
            data.append(
              "ptr",
              Number(response?.data?.data[0]?.batch_list[0]?.ptr)
                ? Number(response?.data?.data[0]?.batch_list[0]?.ptr)
                : 0
            );
            data.append(
              "discount",
              Number(response?.data?.data[0]?.batch_list[0]?.discount)
                ? Number(
                  response?.data?.data[0]?.batch_list[0]?.scheme_account
                )
                : 0
            );
            data.append(
              "scheme_account",
              Number(response?.data?.data[0]?.batch_list[0]?.scheme_account)
                ? Number(
                  response?.data?.data[0]?.batch_list[0]?.scheme_account
                )
                : 0
            );
            data.append(
              "base_price",
              Number(response?.data?.data[0]?.batch_list[0]?.base)
                ? Number(response?.data?.data[0]?.batch_list[0]?.base)
                : 0
            );
            const gstMapping = { 28: 6, 18: 4, 12: 3, 5: 2, 0: -1 };
            const gstValue = Number(response?.data?.data[0]?.batch_list[0]?.gst);
            data.append("gst", gstMapping[gstValue] ?? gstValue);

            data.append(
              "location",
              response?.data?.data[0]?.batch_list[0]?.location
                ? response?.data?.data[0]?.batch_list[0]?.location
                : 0
            );
            data.append(
              "margin",
              Number(response?.data?.data[0]?.batch_list[0]?.margin)
                ? Number(response?.data?.data[0]?.batch_list[0]?.margin)
                : 0
            );
            data.append(
              "net_rate",
              Number(response?.data?.data[0]?.batch_list[0]?.net_rate)
                ? Number(response?.data?.data[0]?.batch_list[0]?.net_rate)
                : 0
            );

            data.append(
              "item_id",
              Number(response?.data?.data[0]?.batch_list[0]?.item_id)
                ? Number(response?.data?.data[0]?.batch_list[0]?.item_id)
                : 0
            );
            data.append("unit_id", Number(0));
            data.append("user_id", userId);

            data.append(
              "id",
              Number(response?.data?.data[0]?.batch_list[0]?.item_id)
                ? Number(response?.data?.data[0]?.batch_list[0]?.item_id)
                : 0
            );

            data.append(
              "total_amount",
              Number(response?.data?.data[0]?.batch_list[0]?.total_amount)
                ? Number(response?.data?.data[0]?.batch_list[0]?.total_amount)
                : 0
            );

            const params = {
              id: selectedEditItemId,
            };
            /*<========================================================================== call add item api to add barcode item  ===================================================================> */

            try {
              const response = await axios.post("item-purchase", data, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setItemTotalAmount(0);
              setDeleteAll(true);
              itemPurchaseList();
              setUnit("");
              setBatch("");
              setHSN("");
              setExpiryDate("");
              setMRP("");
              setQty("");
              setFree("");
              setPTR("");
              setGst("");
              setDisc("");
              setBase("");
              setNetRate("");
              setSchAmt("");
              setMargin("");
              setLoc("");
              setIsEditMode(false);
              setSelectedEditItemId(null);
              setBarcode("");
              setValue("");
              setValue("");
              setSearchItem("");

              if (ItemTotalAmount <= finalCnAmount) {
                setFinalCnAmount(0);
                setSelectedRows([]);
                setCnTotalAmount({});
              }
            } catch (e) {
              setUnsavedItems(false);
            }
          };

          handleBarcodeItem();
        }, 100);
      });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };

  /*<========================================================================== delete purchase item data   ===================================================================> */


  const handlePopState = () => {
    let data = new FormData();
    data.append("random_number", randomNumber);

    const params = {
      random_number: localStorage.getItem("RandomNumber"),
    };
    try {
      const res = axios
        .post("item-purchase-delete-all?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          itemPurchaseList();
          localStorage.removeItem("RandomNumber");
        });
    } catch (error) {
      console.error("API error:", error);

      setUnsavedItems(false);
    }
  };

  /*<================================================================================ Generate random number   ========================================================================> */

  const generateRandomNumber = () => {
    if (localStorage.getItem("RandomNumber") == null) {
      const number = Math.floor(Math.random() * 100000) + 1;
      setRandomNumber(number);
      localStorage.setItem("RandomNumber", number);
    } else {
      return;
    }
  };

  /*<================================================================================ Get GST List   =================================================================================> */

  let listOfGst = () => {
    axios
      .get("gst-list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setGstList(response.data.data);
        // gstList.filer((gst) =>(
        //   return age >= 18;
        // )

      })
      .catch((error) => {
        setUnsavedItems(false);
      });
  };

  /*<================================================================================ Get Distributor List   =================================================================================> */

  let listDistributor = () => {
    axios
      .get("list-distributer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        localStorage.setItem("distributor", response.data.data.distributor);
        setDistributorList(response.data.data);
      })
      .catch((error) => {
        setUnsavedItems(false);
      });
  };

  /*<================================================================================ Get Item purchase List   =================================================================================> */

  const itemPurchaseList = async () => {
    let data = new FormData();
    data.append("random_number", localStorage.getItem("RandomNumber"));

    try {
      const response = await axios
        .post("item-purchase-list?", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setItemPurchaseList(response.data.data);
          setFinalTotalAmount(response.data.data.total_price);
          setTotalGst(response.data.data.total_gst);
          setTotalQty(response.data.data.total_qty);
          setTotalMargin(response.data.data.total_margin);
          setMarginNetProfit(response.data.data.margin_net_profit);
          setTotalNetRate(response.data.data.total_net_rate);
          handleCalNetAmount(response.data.data.total_price);
          setTotalBase(response.data.data.total_base);
          setTotalFRee(response.data.data.total_free);
        });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };

  /*<========================================================================= disable to select date of past  ====================================================================> */

  const isDateDisabled = (date) => {
    const today = new Date();
    // Set time to 00:00:00 to compare only date part--------------------------
    today.setHours(0, 0, 0, 0);
    // Disable dates that are greater than today-------------------------------------
    return date > today;
  };

  /*<========================================================================= delete added  item  ====================================================================> */

  const deleteOpen = (Id) => {
    setIsDelete(true);
    setItemId(Id);
  };

  /*<========================================================================= get batch list to select item while add  ====================================================================> */

  const batchList = async () => {
    let data = new FormData();
    data.append("iteam_id", id);
    const params = {
      iteam_id: id,
    };
    try {
      const res = await axios
        .post("batch-list?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const batchData = response.data.data;
          setBatchListData(response.data.data);
          if (batchData.length > 0) {
            setUnit(batchData[0].unit);
            setBatch(batchData[0].batch_name);
            setHSN(batchData[0].HSN);
            setExpiryDate(batchData[0].expiry_date);
            setMRP(batchData[0].mrp);
            setQty(batchData[0].purchase_qty);
            setFree(batchData[0].purchase_free_qty);
            setPTR(batchData[0].ptr);
            setDisc(batchData[0].discount);
            setLoc(batchData[0].location);
            setGst(batchData[0].gst_name);
            // setUnit()
          } else {
            setUnit("");
            setBatch("");
            setHSN("");
            setExpiryDate("");
            setMRP("");
            setQty("");
            setFree("");
            setPTR("");
            setDisc("");
            setLoc("");
            setGst("");
          }
        });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };

  /*<========================================================================= Add and Edit validation  ====================================================================> */

  const handleAddButtonClick = async () => {

    setFocusedField("item");
    setAutocompleteKey((prevKey) => prevKey + 1); // Re-render item Autocomplete

    generateRandomNumber();
    const newErrors = {};
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const numericQty = parseFloat(qty) || 0;
    const numericFree = parseFloat(free) || 0;
    if (numericQty === 0 && numericFree === 0) {
      toast.error("Free and Qty cannot both be 0");
      newErrors.qty = "Free and Qty cannot both be 0";
    }
    if (!unit) newErrors.unit = "Unit is required";
    // if (!HSN) {
    //   toast.error("HSN is required");
    //   newErrors.HSN = "HSN is required";
    // }

    if (!qty) newErrors.unit = "Qty is required";
    if (!expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
      toast.error(newErrors.expiryDate);
    } else if (!expiryDateRegex.test(expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format";
      toast.error(newErrors.expiryDate);
    } else {
      const [expMonth, expYear] = expiryDate.split("/").map(Number);
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;

      if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth <= currentMonth)
      ) {
        newErrors.expiryDate =
          "Expiry date must be in the future and cannot be the current month";
        toast.error(newErrors.expiryDate);
      }
    }
    if (!mrp) {
      newErrors.mrp = "MRP is required";
    }
    if (!ptr) {
      newErrors.ptr = "PTR is required";
    } else if (ptr && parseFloat(ptr) > parseFloat(mrp)) {
      newErrors.ptr = "PTR must be less than or equal to MRP";
      toast.error("PTR must be less than or equal to MRP");
    }
    if (!gst) newErrors.gst = "GST is required";
    if (!searchItem) {
      toast.error("Please Select any Item Name");
      newErrors.searchItem = "Select any Item Name";
    }
    if (!ItemTotalAmount) {
      toast.error("Total amount is not available");
      newErrors.searchItem = "Total amount is not available";
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      await handleAddItem();
      setUnsavedItems(true)

    }
    return isValid;
  };

  /*<========================================================================= Add and Edit item function  ====================================================================> */

  const handleAddItem = async () => {
    setItemAutofoucs(true);

    setUnsavedItems(true);
    const gstMapping = {
      28: 6,
      18: 4,
      12: 3,
      5: 2,
      0: 1
    };
    let data = new FormData();
    data.append("user_id", userId);
    if (isEditMode == true) {
      data.append("item_id", itemEditID);
      data.append("unit_id", unitEditID);
    } else {
      if (barcode) {
        data.append("item_id", ItemId);
        data.append("unit_id", Number(0));
      } else {
        data.append("item_id", value.id);

        data.append("unit_id", Number(value.unit_id));
      }
    }



    data.append("random_number", localStorage.getItem("RandomNumber"));
    data.append("weightage", unit ? Number(unit) : 1);
    data.append("batch_number", batch ? batch : 0);
    data.append("hsn_code", HSN ? HSN : 0);
    data.append("expiry", expiryDate);
    data.append("mrp", mrp ? mrp : 0);
    data.append("qty", qty ? qty : 0);
    data.append("free_qty", free ? free : 0);
    data.append("ptr", ptr ? ptr : 0);
    data.append("discount", disc ? disc : 0);
    data.append("scheme_account", schAmt ? schAmt : 0);
    data.append("base_price", base ? base : 0);
    data.append("gst", gstMapping[gst] ?? gst);
    data.append("location", loc ? loc : 0);
    data.append("margin", margin ? margin : 0);
    data.append("net_rate", netRate ? netRate : 0);
    data.append("id", selectedEditItemId ? selectedEditItemId : 0);

    const totalAmount = isNaN(ItemTotalAmount) ? 0 : ItemTotalAmount;
    data.append("total_amount", totalAmount);
    const params = {
      id: selectedEditItemId,
    };
    try {
      const response = isEditMode
        ? await axios.post("item-purchase-update?", data, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        : await axios.post("item-purchase", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setSelectedOption(null);
      setSearchItem("");
      setItemTotalAmount(0);
      setDeleteAll(true);
      itemPurchaseList();
      setUnit("");
      setBatch("");
      setHSN("");
      setExpiryDate("");
      setMRP("");
      setQty("");
      setFree("");
      setPTR("");
      setGst("");
      setDisc("");
      setBase("");
      setNetRate("");
      setSchAmt("");
      setMargin("");
      setLoc("");

      setIsEditMode(false);
      setSelectedEditItemId(null);
      setBarcode("");
      setValue("");
      setSearchItem("");

      if (ItemTotalAmount <= finalCnAmount) {
        setFinalCnAmount(0);
        setSelectedRows([]);
        setCnTotalAmount({});
      }
    } catch (e) {
      setUnsavedItems(false);
    }
  };

  /*<========================================================================= Add new item to item master  ====================================================================> */

  const handleAddNewItem = async () => {
    if (!addItemName && !addUnit && !addBarcode) {
      return;
    }

    let formData = new FormData();
    formData.append("item_name", addItemName ? addItemName : "");
    formData.append("unite", addUnit ? addUnit : "");
    formData.append("weightage", addUnit ? addUnit : "");
    formData.append("pack", addUnit ? "1*" + addUnit : "");
    formData.append("barcode", addBarcode ? addBarcode : "");

    formData.append("packaging_id", "");
    formData.append("drug_group", "");
    formData.append("gst", "");
    formData.append("location", "");
    formData.append("mrp", "");
    formData.append("minimum", "");
    formData.append("maximum", "");
    formData.append("discount", "");
    formData.append("margin", "");
    formData.append("hsn_code", "");
    formData.append("message", "");
    formData.append("item_category_id", "");
    formData.append("pahrma", "");
    formData.append("distributer", "");
    formData.append("front_photo", "");
    formData.append("back_photo", "");
    formData.append("mrp_photo", "");

    try {
      const response = await axios.post("create-iteams", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 200) {

        setOpenAddItemPopUp(false);
      } else if (response.data.status === 400) {
        toast.error(response.data.message);
      }
    } catch (error) {
      setUnsavedItems(false);

      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Please try again later");
      }
    }
  };

  /*<=================================================================================== search item name  ==============================================================================> */

  const handleSearch = async () => {
    let data = new FormData();
    data.append("search", searchItem);
    const params = {
      search: searchItem,
    };
    try {
      const res = await axios
        .post("item-search?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setItemList(response.data.data.data);
        });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };

  /*<=========================================================================== select row using up down arrow  ======================================================================> */

  const handleRowSelect = (id, totalAmount) => {
    const newSelectedRows = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];

    setSelectedRows(newSelectedRows);

    if (newSelectedRows.includes(id)) {
      setCnTotalAmount((prev) => ({ ...prev, [id]: totalAmount }));
      setCnAmount((prev) => prev + parseFloat(totalAmount));
    } else {
      setCnTotalAmount((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      setCnAmount((prev) => prev - parseFloat(totalAmount));
    }
  };

  const handleMouseEnter = (e) => {
    const hoveredRow = e.currentTarget;
    setHighlightedRowId(hoveredRow.getAttribute("data-id"));
  };


  const handleTableKeyDown = (e) => {

    const rows = Array.from(
      tableRef.current?.querySelectorAll("tr.cursor-pointer") || []
    );
    let currentIndex = rows.findIndex((row) => row === document.activeElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (rows.length > 0) {
        const nextIndex = currentIndex + 1 < rows.length ? currentIndex + 1 : 0;
        rows[nextIndex]?.focus();
        setHighlightedRowId(rows[nextIndex]?.getAttribute("data-id"));
      }
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (rows.length > 0) {
        const prevIndex =
          currentIndex - 1 >= 0 ? currentIndex - 1 : rows.length - 1;
        rows[prevIndex]?.focus();
        setHighlightedRowId(rows[prevIndex]?.getAttribute("data-id"));
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (currentIndex >= 0 && rows[currentIndex]) {
        const itemId = rows[currentIndex].getAttribute("data-id");
        const item = ItemPurchaseList.find(
          (item) => String(item.id) === String(itemId)
        );
        if (item) {
          setHighlightedRowId(itemId);
          handleEditClick(item);
        }
      }
    }
  };

  /*<================================================================================= delete added item  ============================================================================> */

  const handleDeleteItem = async (ItemId) => {
    if (!ItemId) return;
    let data = new FormData();
    data.append("id", ItemId);
    const params = {
      id: ItemId,
    };
    try {
      await axios
        .post("item-purchase-delete?", data, {
          params: params,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          itemPurchaseList();
          setIsDelete(false);
        });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };

  /*<============================================================================== submit purchase bill  ==========================================================================> */

  const submitPurchaseData = async () => {
    let data = new FormData();
    data.append("distributor_id", distributor?.id);
    data.append("bill_no", billNo);
    data.append(
      "bill_date",
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""
    );
    data.append("due_date", dueDate ? format(dueDate, "yyyy-MM-dd") : "");
    data.append("owner_type", localStorage.getItem("UserName"));
    data.append("user_id", localStorage.getItem("userId"));
    data.append("sr_no", srNo);
    data.append("payment_type", paymentType);
    data.append("total_amount", ItemPurchaseList.total_price);
    data.append("net_amount", netAmount);
    data.append("cn_amount", cnAmount);
    data.append("total_gst", !totalGst ? 0 : totalGst);
    data.append("total_margin", ItemPurchaseList.total_margin);
    data.append("cn_amount", finalCnAmount);
    data.append("round_off", roundOffAmount?.toFixed(2));
    data.append("purches_data", JSON.stringify(ItemPurchaseList.item));
    data.append("purches_return_data", JSON.stringify(finalPurchaseReturnList));

    try {
      await axios
        .post("purches-store", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          localStorage.removeItem("RandomNumber");
          setItemPurchaseList("");
          setUnsavedItems(false);
          toast.success(response.data.message);
          setTimeout(() => {
            history.push("/purchase/purchasebill");
          }, 2000);
        });
    } catch (error) {
      console.error("API error:", error);
      setUnsavedItems(false);
    }
  };

/*<============================================================================== validation  purchase bill  ==========================================================================> */

  const handleSubmit = () => {

    const newErrors = {};
    if (!distributor) {
      newErrors.distributor = "Please select Distributor";
      toast.error("Please select Distributor");
    }
    if (!billNo) {
      newErrors.billNo = "Bill No is Required";
      toast.error("Bill No is Required");
    }
    if (ItemPurchaseList.item.length === 0) {
      toast.error("Please add atleast one item");
      newErrors.item = "Please add atleast one item";
    }

    setError(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    submitPurchaseData();
    setUnsavedItems(false);
  };

  useEffect(() => {
    if (selectedEditItem) {
      setUnitEditID(selectedEditItem.unit_id);
      setItemEditID(selectedEditItem.item_id);
      setSearchItem(selectedEditItem.iteam_name);
      setUnit(selectedEditItem.weightage);
      setBatch(selectedEditItem.batch_number);
      setHSN(selectedEditItem.hsn_code);
      setExpiryDate(selectedEditItem.expiry);
      setMRP(selectedEditItem.mrp);
      setQty(selectedEditItem.qty);
      setFree(selectedEditItem.free_qty);
      setPTR(selectedEditItem.ptr);
      setDisc(selectedEditItem.discount);
      setSchAmt(selectedEditItem.scheme_account);
      setBase(selectedEditItem.base_price);
      setGst(selectedEditItem.gst);
      setLoc(selectedEditItem.location);
      setMargin(selectedEditItem.margin);
      setNetRate(selectedEditItem.net_rate);
    }
  }, [selectedEditItem]);


  /*<============================================================================== validation  purchase bill  ==========================================================================> */

  const handleEditClick = (item) => {

    setSelectedEditItem(item);
    setIsEditMode(true);
    setSelectedEditItemId(item.id)
    setSelectedEditItemId(item.id);
  };

  const purchaseReturnData = async () => {
    let data = new FormData();
    data.append("distributor_id", distributor?.id);
    try {
      await axios
        .post("purchase-return-pending-bills", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPurchaseReturnPending(response.data.data);
        });
    } catch (error) {
      setUnsavedItems(false);
      if (error.response.data.status == 400) {
        toast.error(error.response.data.message);
      } else {
      }
    }
  };

  /*<============================================================================== open CN Adjust popup  ==========================================================================> */

  const handelAddOpen = () => {
    setUnsavedItems(true);
    setOpenAddPopUp(true);

    purchaseReturnData();
  };

  /*<============================================================================== open item master popup  ==========================================================================> */

  const handelAddItemOpen = () => {
    setUnsavedItems(true);
    setOpenAddItemPopUp(true);
  };

  /*<============================================================================== close CN Adjust popup  ==========================================================================> */

  const resetAddDialog = () => {
    setOpenAddPopUp(false);
    setOpenAddItemPopUp(false);
    // setCnAmount(0);
    // setSelectedRows("")
    // setCnTotalAmount("")
    // setCnAmount(0);
  };

  /*<============================================================================== Distributor select  ==========================================================================> */

  const handleDistributorSelect = (event, newValue) => {
    setDistributor(newValue);
    purchaseReturnData(id);
  };

  /*<============================================================================== Select Item  ==========================================================================> */

  const handleInputChange = (event, newInputValue) => {
    setSearchItem(newInputValue.toUpperCase());
    handleSearch(newInputValue.toUpperCase());
  };

  const handleOptionChange = (event, newValue) => {
    setIsEditMode(false);

    setValue(newValue);
    setSelectedOption(newValue);

    const itemName = newValue ? newValue.iteam_name : "";
    setSearchItem(itemName);

    setId(newValue?.id);
    setAutocompleteDisabled(true);
    handleSearch(itemName);
  };

  /*<============================================================================== Discount calculation  ==========================================================================> */


  const handleSchAmt = (e) => {
    const inputDiscount =
      e.target.value.replace(/[eE]/g, "") === ""
        ? ""
        : parseFloat(e.target.value.replace(/[eE]/g, ""));
    if (isNaN(inputDiscount)) {
      setDisc(0);
      setSchAmt(0);
      setBase(ptr * qty);
      return;
    }
    setDisc(inputDiscount);

    const totalSchAmt = parseFloat(
      (((ptr * inputDiscount) / 100) * qty).toFixed(2)
    );
    setSchAmt(totalSchAmt);

    const totalBase = parseFloat((ptr * qty - totalSchAmt).toFixed(2));
    setBase(totalBase);
  };

  /*<============================================================================== Remove Item  ==========================================================================> */

  const removeItem = () => {
    setIsEditMode(false);
    setUnit("");
    setBatch("");
    setHSN("");
    setExpiryDate("");
    setSearchItem("");
    setMRP("");
    setQty("");
    setFree("");
    setPTR("");
    setGst("");
    setDisc("");
    setBase("");
    setSchAmt("");
    setNetRate("");
    setMargin("");
    setLoc("");
  };

  /*<================================================================================== select all CN Bill ==============================================================================> */



  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(purchaseReturnPending.map((row) => row.id));
      const updatedAmounts = purchaseReturnPending.reduce((acc, row) => {
        acc[row.id] = row.total_amount;
        return acc;
      }, {});
      setCnTotalAmount(updatedAmounts);
      setCnAmount(
        purchaseReturnPending.reduce(
          (acc, row) => acc + parseFloat(row.total_amount || 0),
          0
        )
      );
    } else {
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
    }
  };

  /*<================================================================================== CN Amount Calculation ==============================================================================> */

  const handleCnAmountChange = (id, value, totalAmount) => {
    const numericValue = parseFloat(value) || 0;

    const finalValue = Math.min(numericValue, totalAmount);

    setCnTotalAmount((prevAmounts) => ({
      ...prevAmounts,
      [id]: finalValue,
    }));

    const prevAmount = cnTotalAmount[id] || 0;

    setCnAmount((prev) => prev + finalValue - prevAmount);
  };

  const handleCalNetAmount = (total_price) => {
    const adjustedTotalAmount = total_price - finalCnAmount;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    let netAmountCal;
    let roundOffAmountCal;

    if (decimalPart >= 0.5) {
      netAmountCal = Math.ceil(adjustedTotalAmount); // round up
      roundOffAmountCal = netAmountCal - adjustedTotalAmount; // calculate the round-off value
    } else {
      netAmountCal = Math.floor(adjustedTotalAmount);
      roundOffAmountCal = netAmountCal - adjustedTotalAmount; // calculate the round-off value
    }
    setNetAmount(netAmountCal);
    setRoundOffAmount(roundOffAmountCal);
  };

  const handleCnAmount = () => {
    const newErrors = {};

    if (finalTotalAmount <= cnAmount) {
      newErrors.finalTotalAmount =
        "You cannot adjust CN more than the total invoice amount";
      toast.error("You cannot adjust CN more than the total invoice amount");
      setError(newErrors);
      setSelectedRows([]);
      setCnTotalAmount({});
      setCnAmount(0);
      return;
    }
    setFinalCnAmount(cnAmount);
    const decimalTotalAmount = finalTotalAmount - Math.floor(finalTotalAmount);
    const decimalCNAmount = cnAmount - Math.floor(cnAmount);

    setRoundOffAmount(decimalTotalAmount - decimalCNAmount);

    const adjustedTotalAmount = finalTotalAmount - cnAmount;

    let netAmountCal, roundOffAmountCal;

    const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    if (decimalPart >= 0.5) {
      netAmountCal = Math.ceil(adjustedTotalAmount); // Round up
    } else {
      netAmountCal = Math.floor(adjustedTotalAmount); // Round down
    }

    roundOffAmountCal = netAmountCal - adjustedTotalAmount;

    // Update the states with the calculated values
    setNetAmount(netAmountCal);
    setRoundOffAmount(roundOffAmountCal);

    // handleCalNetAmount();
    const purchaseReturnList = selectedRows.map((rowId) => {
      return {
        purches_return_bill_id: rowId,
        amount: cnTotalAmount[rowId],
      };
    });
    setFinalPurchaseReturnList(purchaseReturnList);
    // Submit purchaseReturnList to the backend or handle it as needed
    resetAddDialog();
    // Reset dialog after submission
  };

  const handleNavigation = (path) => {
    setOpenAddPopUp(false);
    setIsOpenBox(true);
    setNextPath(path);
  };

  const LogoutClose = () => {
    setIsOpenBox(false);
    // setPendingNavigation(null);
  };

  /*<============================================================================== CN Amount Calculation ==========================================================================> */


  const handleLeavePage = async () => {
    let data = new FormData();
    data.append("random_number", localStorage.getItem("RandomNumber"));

    try {
      const response = await axios.post("item-purchase-delete-all", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUnsavedItems(false);
        setIsOpenBox(false);
        setTimeout(() => {
          if (nextPath) {
            history.push(nextPath);
          }
        }, 0);
      }
      setIsOpenBox(false);
      setUnsavedItems(false);
      localStorage.removeItem("RandomNumber");

      // history.replace(nextPath);
    } catch (error) {
      setUnsavedItems(false);

      console.error("Error deleting items:", error);
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
      <div
        style={{
          height: "calc(100vh - 225px)",
          padding: "0px 20px 0px",
        }}
      >
        <div>
          <div className="py-3" style={{ display: "flex", gap: "4px" }}>
            <div style={{ display: "flex", gap: "7px" }}>
              <span
                style={{
                  color: "var(--color2)",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  history.push("/purchase/purchasebill");
                }}
              >
                Purchase
              </span>
              <ArrowForwardIosIcon
                style={{
                  fontSize: "18px",
                  marginTop: "8px",
                  color: "var(--color1)",
                }}
              />
              <span
                style={{
                  color: "var(--color1)",
                  alignItems: "center",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                New
              </span>
              <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow" />
            </div>

            <div className="headerList">
              <Select
                labelId="dropdown-label"
                id="dropdown"
                value={paymentType}
                sx={{ minWidth: "150px" }}
                onChange={(e) => {
                  setPaymentType(e.target.value);
                }}
                size="small"
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
                {bankData?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.bank_name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                style={{ backgroundColor: "var(--color1)" }}
                onClick={() => {
                  setOpenFile(true);
                }}
              >
                <CloudUploadIcon className="mr-2" />
                Import CSV
              </Button>

              {!distributor || ItemPurchaseList?.item?.length === 0 ? (
                <></>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ backgroundColor: "var(--color1)" }}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "var(--color1)",
                    "&:disabled": {
                      backgroundColor: "var(--color3)",
                      color: "var(--color1)",
                      opacity: 0.7,
                      cursor: "pointer",
                    },
                  }}
                  onClick={handelAddOpen}
                  disabled={
                    !distributor || ItemPurchaseList?.item?.length === 0
                  }
                >
                  <AddIcon className="mr-2" />
                  CN Adjust
                </Button>
              )}

              <Button
                variant="contained"
                style={{ backgroundColor: "var(--color1)" }}
                onClick={handelAddItemOpen}>
                <ControlPointIcon className="mr-2" />
                Add New Item
              </Button>

              <Button
                variant="contained"
                style={{ background: "var(--color1)" }}
                onClick={handleSubmit}
              >
                Save
              </Button>

            </div>
          </div>
          {/*<============================================================================== details at top  =============================================================================> */}

          <div className="bg-white">
            <div className="firstrow flex">
              <div className="flex flex-row gap-4 mx-2">
                <div >
                  <span className="title mb-2">
                    Distributor
                    <FaPlusCircle
                      className="primary cursor-pointer"
                      onClick={() => {
                        history.push("../../more/addDistributer");
                      }}
                    />
                  </span>
                  <Autocomplete
                    value={distributor}
                    sx={{
                      width: "100%",
                      minWidth: "350px",
                      "@media (max-width:600px)": {
                        minWidth: "250px",
                      },
                    }}
                    size="small"
                    onChange={handleDistributorSelect}
                    options={distributorList}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        autoFocus={focusedField === "distributor"}
                        autoComplete="off"
                        variant="outlined"
                        {...params}
                        inputRef={(el) => (inputRefs.current[0] = el)}
                        onKeyDown={(e) => handleKeyDown(e, 0)}

                      />

                    )}
                  />
                  {error.distributor && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      {error.distributor}
                    </span>
                  )}
                </div>
                {/* <div className="detail">
                <span className="title mb-2">Sr No.</span>
                <TextField
                  autoComplete="off"
                  id="outlined-number"
                  size="small"
                  style={{ width: "200px" }}
                  value={srNo}
                  variant="outlined"
                  disabled
                  onChange={(e) => {
                    setSrNo(e.target.value);
                  }}
                />
              </div> */}
                <div className="detail">
                  <span className="title mb-2">Bill No. / Order No.</span>
                  <TextField
                    autoComplete="off"
                    id="outlined-number"
                    size="small"
                    variant="outlined"
                    style={{ width: "250px" }}
                    value={billNo}
                    onChange={(e) => {
                      setbillNo(e.target.value.toUpperCase());
                    }}
                    inputRef={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                  />
                  {error.billNo && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                      {error.billNo}
                    </span>
                  )}
                </div>

                <div className="detail">
                  <span className="title mb-2">Bill Date</span>
                  <div>
                    <DatePicker
                      className="custom-datepicker "
                      selected={selectedDate}
                      variant="outlined"
                      onChange={(newDate) => setSelectedDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      filterDate={(date) => !isDateDisabled(date)}

                    />
                  </div>
                </div>

                <div className="detail">
                  <span className="title mb-2">Due Date</span>
                  <div>
                    <DatePicker
                      className="custom-datepicker "
                      selected={dueDate}
                      variant="outlined"
                      onChange={(newDate) => setDueDate(newDate)}
                      dateFormat="dd/MM/yyyy"
                      minDate={new Date()}

                    />
                  </div>
                </div>
                <div className="detail">
                  <span className="title mb-2">Scan Barcode</span>

                  <TextField
                    autoComplete="off"
                    id="outlined-number"
                    type="number"
                    size="small"
                    variant="outlined"
                    value={barcode}
                    placeholder="scan barcode"
                    // inputRef={inputRef10}
                    // onKeyDown={handleKeyDown}
                    sx={{ width: "250px" }}
                    onChange={(e) => {
                      setBarcode(e.target.value);
                    }}
                  />
                </div>
              </div>
              {/*<============================================================================ add Item field  ===========================================================================> */}

              <div className="overflow-x-auto ">

                <table

                  className="customtable  w-full border-collapse custom-table"
                >
                  <thead>
                    <tr>
                      <th>Search Item Name</th>
                      <th>Unit</th>
                      {/* <th>HSN</th> */}
                      <th>Batch </th>
                      <th>Expiry </th>
                      <th>MRP </th>
                      <th>Qty. </th>
                      <th>Free </th>
                      <th>PTR </th>
                      <th>CD%</th>
                      {/* <th>Sch. Amt</th> */}
                      <th>Base</th>
                      <th>GST% </th>
                      <th>Loc.</th>
                      <th>Net Rate</th>
                      <th>Margin%</th>
                      <th>Amount </th>
                    </tr>
                  </thead>
                  <tbody>
                    {!value && ItemPurchaseList.item > 0 ? (
                      <tr>
                        <td
                          colSpan={0}
                          style={{
                            marginTop: "10px",
                            textAlign: "center",
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          No record found
                        </td>
                      </tr>
                    ) : (
                      <>
                        <tr>
                          {isEditMode ? (
                            <td>
                              <div>
                                <BorderColorIcon
                                  style={{ color: "var(--color1)" }}
                                  onClick={() => setIsEditMode(false)}
                                />
                                <DeleteIcon
                                  className="delete-icon mr-2"
                                  onClick={removeItem}
                                />
                                {searchItem}
                              </div>
                              {error.item && (
                                <span
                                  style={{ color: "red", fontSize: "12px" }}
                                >
                                  {error.item}
                                </span>
                              )}
                            </td>
                          ) : (
                            <td className="p-0">
                              {isAutocompleteDisabled && (
                                <Autocomplete
                                  key={autocompleteKey}
                                  value={selectedOption}
                                  // value={searchItem?.iteam_name}
                                  sx={{ width: 200, padding: 0 }}
                                  size="small"
                                  onChange={handleOptionChange}
                                  onInputChange={handleInputChange}
                                  // inputRef={searchItemField}
                                  getOptionLabel={(option) =>
                                    `${option.iteam_name} `
                                  }
                                  options={itemList}
                                  renderOption={(props, option) => (
                                    <ListItem {...props}>
                                      <ListItemText
                                        primary={`${option.iteam_name}`}
                                        secondary={` ${option.stock === 0
                                          ? `Unit: ${option.weightage}`
                                          : `Pack: ${option.pack}`
                                          } | MRP: ${option.mrp}  | Location: ${option.location
                                          }  | Current Stock: ${option.stock}`}
                                      />
                                    </ListItem>)}
                                  renderInput={(params) => (
                                    <TextField
                                      tabIndex={0}

                                      variant="outlined"
                                      autoComplete="off"
                                      sx={{ width: 200, padding: 0 }}
                                      autoFocus={focusedField === "item"}
                                      {...params}
                                      value={searchItem?.iteam_name}
                                      inputRef={(el) => (inputRefs.current[2] = el)}
                                      onKeyDown={(e) => handleKeyDown(e, 2)}

                                    />
                                  )}
                                />
                              )}
                            </td>)}
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              type="text"
                              size="small"
                              error={!!errors.unit}
                              value={unit}
                              sx={{ width: "65px" }}

                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                setUnit(value ? Number(value) : "");
                              }}
                              onKeyDown={(e) => {
                                if (["e", "E", ".", "+", "-", ","].includes(e.key)) {
                                  e.preventDefault();
                                }
                                handleKeyDown(e, 3);
                              }}
                              inputRef={(el) => (inputRefs.current[3] = el)}
                            />
                            {error.unit && (
                              <span style={{ color: "red", fontSize: "12px" }}>
                                {error.unit}
                              </span>
                            )}
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"

                              size="small"
                              value={batch}
                              sx={{ width: "90px" }}

                              onChange={(e) => {
                                setBatch(e.target.value);
                              }}
                              inputRef={(el) => (inputRefs.current[4] = el)}
                              onKeyDown={(e) => handleKeyDown(e, 4)}
                            />
                            {error.batch && (
                              <span style={{ color: "red", fontSize: "12px" }}>
                                {error.batch}
                              </span>
                            )}
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              size="small"
                              sx={{ width: "80px" }}

                              error={!!errors.expiryDate}
                              value={expiryDate}
                              onChange={handleExpiryDate}
                              placeholder="MM/YY"
                              inputRef={(el) => (inputRefs.current[5] = el)}
                              onKeyDown={(e) => handleKeyDown(e, 5)}
                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              type="number"
                              sx={{ width: "90px" }}
                              size="small"

                              error={!!errors.mrp}

                              value={mrp}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*\.?\d*$/.test(value)) {
                                  setMRP(value ? Number(value) : "");
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  ["e", "E", "+", "-", ","].includes(e.key) ||
                                  (e.key === "." &&
                                    e.target.value.includes("."))
                                ) {
                                  e.preventDefault();
                                }
                                handleKeyDown(e, 6)

                              }}
                              inputRef={(el) => (inputRefs.current[6] = el)}

                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              type="number"
                              sx={{ width: "80px" }}
                              size="small"
                              error={!!errors.qty}
                              value={qty}
                              onChange={(e) => {
                                const value = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                );
                                setQty(value ? Number(value) : "");
                              }}
                              inputRef={(el) => (inputRefs.current[7] = el)}

                              onKeyDown={(e) => {
                                if (
                                  ["e", "E", ".", "+", "-", ","].includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                                handleKeyDown(e, 7)
                              }}

                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              size="small"
                              type="number"
                              sx={{ width: "50px" }}
                              value={free}
                              error={!!errors.free}

                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g);
                                setFree(value ? Number(value) : "");
                              }}
                              onKeyDown={(e) => {
                                if (
                                  ["e", "E", ".", "+", "-", ","].includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                                handleKeyDown(e, 8)
                              }}
                              inputRef={(el) => (inputRefs.current[8] = el)}

                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              type="number"
                              sx={{ width: "90px" }}
                              size="small"

                              value={ptr}
                              error={!!errors.ptr}
                              onKeyDown={(e) => {
                                if (
                                  ["e", "E", "+", "-", ","].includes(e.key) ||
                                  (e.key === "." &&
                                    e.target.value.includes("."))
                                ) {
                                  e.preventDefault();
                                }
                                handleKeyDown(e, 9)
                              }}
                              onChange={(e) => {
                                const setptr = e.target.value.replace(/[eE]/g, "");
                                setPTR(setptr);
                              }}
                              inputRef={(el) => (inputRefs.current[9] = el)}

                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              sx={{ width: "60px" }}
                              size="small"
                              type="number"

                              value={disc}
                              onKeyDown={(e) => {
                                if (
                                  ["e", "E", "+", "-", ","].includes(e.key) ||
                                  (e.key === "." &&
                                    e.target.value.includes("."))
                                ) {
                                  e.preventDefault();
                                }
                                handleKeyDown(e, 10)
                              }}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (Number(value) > 99) {
                                  e.target.value = 99;
                                }
                                handleSchAmt(e);
                              }}
                              inputRef={(el) => (inputRefs.current[10] = el)}
                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              type="number"
                              size="small"
                              value={base === 0 ? "" : base}

                              disabled
                              sx={{ width: "100px" }}
                              onChange={(e) => {
                                setBase(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              size="small"
                              value={gst}
                              error={!!errors.gst}
                              inputRef={(el) => (inputRefs.current[11] = el)}
                              onKeyDown={(e) => handleKeyDown(e, 11)}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*\.?\d*$/.test(value)) {
                                  setGst(value ? Number(value) : "");
                                }
                              }}
                              open={isOpen}
                              onOpen={() => setIsOpen(true)}
                              onClose={() => setIsOpen(false)}
                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              // inputRef={inputRef12}
                              // onKeyDown={handleKeyDown}
                              size="small"
                              value={loc?.toUpperCase()}
                              // error={!!errors.loc}
                              sx={{ width: "100px" }}
                              onChange={(e) => {
                                setLoc(e.target.value);

                              }}
                              inputRef={(el) => (inputRefs.current[12] = el)}

                              onKeyDown={async (e) => {
                                if (e.key === 'Enter') {
                                  await handleAddButtonClick();
                                  handleKeyDown(e, 1)
                                }
                              }}

                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              type="number"
                              disabled
                              size="small"
                              value={netRate === 0 ? "" : netRate}
                              sx={{ width: "100px" }}

                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              autoComplete="off"
                              id="outlined-number"
                              type="number"
                              disabled
                              size="small"
                              value={margin === 0 ? "" : margin}
                              sx={{ width: "100px" }}
                              onChange={(e) => {
                                setMargin(e.target.value);
                              }}
                            />
                          </td>
                          <td className="total">
                            <span className="font-bold">{ItemTotalAmount.toFixed(2)}</span>
                          </td>
                        </tr>
                      </>)}
                  </tbody>
                </table>
                < >
                  {/*<=============================================================================== added Item  ==============================================================================> */}

                  <table
                    className="p-30  border border-indigo-600 w-full border-collapse custom-table"
                    ref={tableRef}
                  // tabIndex={0}
                  > <tbody>
                      {ItemPurchaseList?.item?.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => handleEditClick(item)}
                          className={` item-List  cursor-pointer saleTable ${item.id === selectedEditItemId
                            ? "highlighted-row"
                            : ""}`}>
                          <td
                            style={{
                              display: "flex",
                              gap: "8px",
                              width: "400px"
                            }}
                          >
                            <BorderColorIcon
                              style={{ color: "var(--color1)" }}
                              onClick={() => handleEditClick(item)}
                            />
                            <DeleteIcon
                              style={{ color: "var(--color6)" }}
                              className="delete-icon bg-none"

                              onClick={() => { deleteOpen(item.id) }}
                            />
                            {item.iteam_name}
                          </td>
                          <td>{item.weightage}</td>
                          <td>{item.hsn_code}</td>
                          <td>{item.batch_number}</td>
                          <td>{item.expiry}</td>
                          <td>{item.mrp}</td>
                          <td>{item.qty}</td>
                          <td>{item.free_qty}</td>
                          <td>{item.ptr}</td>
                          <td>{item.discount}</td>
                          <td>{item.scheme_account}</td>
                          <td>{item.base_price}</td>
                          <td>{item.gst}</td>
                          <td>{item.location}</td>
                          <td>{item.net_rate}</td>
                          <td>{item.margin}</td>
                          <td>{item.total_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>

              </div>
            </div>
          </div>
        </div>
        {/*<============================================================================== total and other details  =============================================================================> */}

        <div
          className=""
          style={{
            background: "var(--color1)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            position: "fixed",
            width: "100%",
            bottom: "0",
            overflow: "auto",
            left: "0",
          }}
        >
          <div
            className=""
            style={{
              display: "flex",
              gap: "40px",
              whiteSpace: "nowrap",
              left: "0",
              padding: "20px",
            }}
          >
            <div
              className="gap-2 invoice_total_fld"
              style={{ display: "flex" }}
            >
              <label className="font-bold">Total GST : </label>

              <span style={{ fontWeight: 600 }}>{totalGst ? totalGst : 0} </span>
            </div>
            <div
              className="gap-2 invoice_total_fld"
              style={{ display: "flex" }}
            >
              <label className="font-bold">Total Qty : </label>
              <span style={{ fontWeight: 600 }}>   {totalQty ? totalQty : 0} +{" "}
                <span className="">
                  {totalFree ? totalFree : 0} Free{" "}
                </span></span>
            </div>
            <div
              className="gap-2 invoice_total_fld"
              style={{ display: "flex" }}
            >
              <label className="font-bold">Total Base : </label>
              <span style={{ fontWeight: 600 }}> {totalBase ? totalBase : 0}
              </span>
            </div>
            <div
              className="gap-2 invoice_total_fld"
              style={{ display: "flex" }}
            >
              <label className="font-bold">Total Net Rate : </label>
              <span style={{ fontWeight: 600 }}>
                ₹  {totalNetRate ? totalNetRate : 0}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              padding: "0 20px",
              whiteSpace: "noWrap",
            }}
          >
            <div
              className="gap-2 "
              onClick={toggleModal}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <label className="font-bold">Net Amount : </label>
              <span
                className="gap-1"
                style={{
                  fontWeight: 800,
                  fontSize: "22px",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {netAmount.toFixed(2)}
                <FaCaretUp />
              </span>
            </div>

            <Modal
              show={isModalOpen}
              onClose={toggleModal}
              size="lg"
              position="bottom-center"
              className="modal_amount"
            // style={{ width: "50%" }}
            >
              <div
                style={{
                  backgroundColor: "var(--COLOR_UI_PHARMACY)",
                  color: "white",
                  padding: "20px",
                  fontSize: "larger",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <h2 style={{ textTransform: "uppercase" }}>
                  invoice total
                </h2>
                <IoMdClose
                  onClick={toggleModal}
                  cursor={"pointer"}
                  size={30}
                />
              </div>
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  width: "100%",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: "2.5rem",
                }}
              >
                <div
                  className=""
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <label className="font-bold">Total Amount : </label>
                  <span style={{ fontWeight: 600 }}>
                    {finalTotalAmount?.toFixed(2)}
                  </span>
                </div>

                <div
                  className=""
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "5px",
                  }}
                >
                  <label className="font-bold">CN Amount : </label>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "#F31C1C",
                    }}
                  >
                    -{finalCnAmount?.toFixed(2)}
                  </span>
                </div>

                <div
                  className="font-bold"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    paddingBottom: "5px",
                    borderTop:
                      "1px solid var(--toastify-spinner-color-empty-area)",
                    paddingTop: "5px",
                  }}
                >
                  <label className="font-bold">Round Off : </label>
                  <span> {roundOffAmount === "0.00"
                    ? roundOffAmount
                    : roundOffAmount < 0
                      ? `-${Math.abs(roundOffAmount.toFixed(2))}`
                      : `${Math.abs(roundOffAmount.toFixed(2))}`}</span>
                </div>

                <div
                  className=""
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    justifyContent: "space-between",
                    borderTop: "2px solid var(--COLOR_UI_PHARMACY)",
                    paddingTop: "5px",
                  }}
                >
                  <label className="font-bold">Net Amount: </label>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "22px",
                      color: "var(--COLOR_UI_PHARMACY)",
                    }}
                  >
                    {netAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </Modal>
          </div>
        </div>
        {/*<============================================================================== CN amount PopUp Box  =============================================================================> */}

        <Dialog open={openAddPopUp}>
          <DialogTitle id="alert-dialog-title" className="secondary">
            Add Amount
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={resetAddDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="bg-white">
                <div className="bg-white">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={
                              selectedRows.length ===
                              purchaseReturnPending.length &&
                              purchaseReturnPending.length > 0
                            }
                          />
                        </th>
                        <th>Bill No</th>
                        <th>Bill Date</th>
                        <th>Amount</th>
                        <th>Adjust CN Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseReturnPending.length === 0 ? (
                        <tr>
                          <td>No data found</td>
                        </tr>
                      ) : (
                        purchaseReturnPending.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  handleRowSelect(row.id, row.total_amount || 0)
                                }
                                checked={selectedRows.includes(row.id)}
                              />
                            </td>
                            <td>{row.bill_no}</td>
                            <td>{row.bill_date}</td>
                            <td>{row.total_amount}</td>
                            <td>
                              <OutlinedInput
                                type="number"
                                value={cnTotalAmount[row.id] || ""}
                                onChange={(e) =>
                                  handleCnAmountChange(
                                    row.id,
                                    e.target.value,
                                    row.total_amount
                                  )
                                }
                                startAdornment={
                                  <InputAdornment position="start">
                                    Rs.
                                  </InputAdornment>
                                }
                                sx={{ width: 130, m: 1 }}
                                size="small"
                                disabled={!selectedRows.includes(row.id)}
                              />
                            </td>
                          </tr>
                        ))
                      )}
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Selected Bills Amount</td>
                        <td>
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: 800,
                              color: "black",
                            }}
                          >
                            Rs.{(parseFloat(cnAmount) || 0).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              variant="contained"
              color="success"
              onClick={handleCnAmount}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
        {/*<============================================================================== Bulk Import csv =============================================================================> */}

        <Dialog open={openFile} className="custom-dialog">
          <DialogTitle className="primary">Import Item</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => {
              setOpenFile(false);
            }}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="primary">Item File Upload</div>
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexDirection: "column",
                }}
              >
                <div>
                  <input
                    className="File-upload"
                    type="file"
                    accept=".csv"
                    id="file-upload"
                    onChange={handleFileSelect}
                  />
                  <span className="errorFile">*select only .csv File.</span>
                </div>
                <div>
                  <Button
                    onClick={handleDownload}
                    style={{ backgroundColor: "#3f6212", color: "white" }}
                  >
                    <CloudDownloadIcon className="mr-2" />
                    Download Sample File
                  </Button>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              style={{ backgroundColor: "#3f6212", color: "white" }}
              type="success"
              onClick={handleFileUpload}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/*<============================================================================== add item  PopUp Box  =============================================================================> */}

        <Dialog open={openAddItemPopUp}>
          <DialogTitle id="alert-dialog-title" className="primary">
            Add New Item
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={resetAddDialog}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="bg-white">
                <div
                  className="mainform bg-white rounded-lg"
                  style={{ padding: "20px" }}
                >
                  <div className="row">
                    <div className="fields add_new_item_divv">
                      <label className="label secondary">Item Name</label>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        size="small"
                        value={addItemName}
                        onChange={(e) =>
                          setAddItemName(e.target.value.toUpperCase())
                        }
                      />
                    </div>
                    <div className="fields add_new_item_divv">
                      <label className="label  secondary">Barcode</label>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        type="number"
                        size="small"
                        value={addBarcode}
                        onChange={(e) => setAddBarcode(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="fields add_new_item_divv">
                      <label className="label secondary">Unit</label>
                      <TextField
                        autoComplete="off"
                        id="outlined-number"
                        type="number"
                        size="small"
                        value={addUnit}
                        onChange={(e) => setAddUnit(e.target.value)}
                      />
                    </div>
                    <div className="fields add_new_item_divv">
                      <label className="label secondary">Pack</label>
                      <TextField
                        autoComplete="off"
                        disabled
                        id="outlined-number"
                        size="small"
                        value={`1 * ${addUnit} `}
                      />
                    </div>
                  </div>
                  <div
                    className="row"
                    style={{
                      justifyContent: "flex-end",
                      paddingRight: "4px",
                      paddingTop: "8%",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#3f6212",
                        "&:hover": {
                          backgroundColor: "#3f6212",
                        },
                      }}
                      onClick={handleAddNewItem}
                    >
                      <ControlPointIcon className="mr-2" />
                      Add New Item
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        {/*<==============================================================================  Delete PopUP   =============================================================================> */}

        <div
          id="modal"
          value={IsDelete}
          className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
            }`}
        >
          <div />
          <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
              viewBox="0 0 24 24"
              onClick={() => setIsDelete(false)}
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
            </svg>
            <div className="my-4 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 fill-red-500 inline"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                  data-original="#000000"
                />
                <path
                  d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                  data-original="#000000"
                />
              </svg>
              <h4 className="text-lg font-semibold mt-6 first-letter:uppercase">
                <span style={{ textTransform: "none" }}>
                  Are you sure you want to delete it?
                </span>
              </h4>
            </div>
            <div className="flex gap-5 justify-center">
              <button
                type="submit"
                className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                onClick={() => handleDeleteItem(ItemId)}
              >
                Delete
              </button>
              <button
                type="button"
                className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                onClick={() => setIsDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/*<============================================================================== Leave page  PopUp Box  =============================================================================> */}

        <Prompt
          when={unsavedItems}
          message={(location) => {
            handleNavigation(location.pathname);
            return false;
          }}
        />

        <div
          id="modal"
          value={isOpenBox}
          className={`fixed first-letter:uppercase inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${isOpenBox ? "block" : "hidden"
            }`}
        >
          <div />
          <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
            <div className="my-4 logout-icon">
              <VscDebugStepBack
                className="h-12 w-14"
                style={{ color: "#628A2F" }}
              />
              <h4 className="text-lg font-semibold mt-6 text-center">
                <span style={{ textTransform: "none" }}>
                  Are you sure you want to leave this page?
                </span>
              </h4>
            </div>
            <div className="flex gap-5 justify-center">
              <button
                type="submit"
                className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none primary-bg hover:primary-bg active:primary-bg"
                onClick={handleLeavePage}
              >
                Yes
              </button>
              <button
                type="button"
                className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
                onClick={LogoutClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPurchaseBill;

/*<================================================================================ temp  handleBarcodeItem logic =================================================================================> */

// const handleBarcodeItem = async () => {
//   setUnsavedItems(true)
//   let data = new FormData();
//   data.append("random_number", localStorage.getItem("RandomNumber"));
//   data.append("weightage", unit ? Number(unit) : 1);
//   data.append("batch_number", batch ? batch : 0);
//   data.append("expiry", expiryDate);
//   data.append("mrp", mrp ? mrp : 0);
//   data.append("qty", qty ? qty : 0);
//   data.append("free_qty", free ? free : 0);
//   data.append("ptr", ptr ? ptr : 0);
//   data.append("discount", disc ? disc : 0);
//   data.append("scheme_account", schAmt ? schAmt : 0);
//   data.append("base_price", base ? base : 0);
//   data.append("gst", gst.id);
//   data.append("location", loc ? loc : 0);
//   data.append("margin", margin ? margin : 0);
//   data.append("net_rate", netRate ? netRate : 0);
//   data.append("id", selectedEditItemId ? selectedEditItemId : 0);
//   data.append("item_id", ItemId);
//   data.append("unit_id", Number(0));
//   data.append("user_id", userId);
//   data.append("id", selectedEditItemId ? selectedEditItemId : 0);
//   data.append("total_amount", ItemTotalAmount ? ItemTotalAmount : 0);

//   const params = {
//     id: selectedEditItemId,
//   };
//   try {
//     const response = await axios.post("item-purchase", data, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     setItemTotalAmount(0);
//     setDeleteAll(true);
//     itemPurchaseList();
//     setUnit("");
//     setBatch("");
//     setExpiryDate("");
//     setMRP("");
//     setQty("");
//     setFree("");
//     setPTR("");
//     setGst("");
//     setDisc("");
//     setBase("");
//     setNetRate("");
//     setSchAmt("");
//     setBatch("");
//     setMargin("");
//     setLoc("");

//     if (ItemTotalAmount <= finalCnAmount) {
//       setFinalCnAmount(0);
//       setSelectedRows([]);
//       setCnTotalAmount({});
//     }
//     // setNetAmount(totalAmount)
//     // handleCalNetAmount()
//     setIsEditMode(false);
//     setSelectedEditItemId(null);
//     setBarcode("")
//     setValue("")
//     // Reset Autocomplete field
//     setValue("");
//     setSearchItem("");
//     // setAutocompleteDisabled(false);
//   } catch (e) {
//   }
// }

/*<================================================================================ temp  handle Add button logic =================================================================================> */

{/* <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>
                            <Button
                              variant="contained"
                              style={{ backgroundColor: "var(--color1)" }}
                              onClick={handleAddButtonClick}
                            >
                              <ControlPointIcon className="mr-2" />
                              {isEditMode ? "Edit" : "Add"}
                            </Button>
                          </td>
                        </tr> */}
