import { Box, Button, Spinner, FormControl, Image, Input, InputGroup, InputLeftElement, InputRightElement, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react"
import { BiSearch, BiSearchAlt2 } from "react-icons/bi"
import rupiah from "../../assets/rupiah.svg"
import { MdKeyboardArrowDown, MdOutlineKeyboardArrowRight } from "react-icons/md"
import { axiosInstance } from "../../api"
import { useEffect, useState } from "react"
import TransactionListItems from "./TransactionListItems"
import { Link, useLocation, useSearchParams } from "react-router-dom"
import noTransaction from "../../assets/noTransaction.png"
import Pagination from "./Pagination"
import { useFormik } from "formik"
import { HiOutlineArrowLeft } from "react-icons/hi"

const TransactionList = () => {

    const [transactionList, setTransactionList] = useState([])
    const [unpaidTransaction, setUnpaidTransaction] = useState([])
    const [payment, setPayment] = useState(true)
    const [goingOn, setGoingOn] = useState(false)
    const [status, setStatus] = useState("")
    const [searchParam, setSearchParam] = useSearchParams()
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)
    const [maxItemsPage, setMaxItemsPage] = useState(0)
    const [maxPage, setMaxPage] = useState(1)
    const [keyword, setKeyword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [transData, setTransData] = useState([])
    const [transactionSort, setTransactionSort] = useState("All Transaction")
    const [sortBy, setSortBy] = useState("id")
    const [sortDir, setSortDir] = useState("Desc")
    const [pageCount, setPageCount] = useState(1)
    const [inputSearch, setInputSearch] = useState("")

    const query = new URLSearchParams(useLocation().search)

    const order_status = query.get("status")

    const transaction_page = query.get("page")

    let search_keyword = query.get("keyword")

    const fetchMyTransactionList = async () => {
        const maxItemsPerPage = 10
        try {
            const response = await axiosInstance.get("/transactions/transaction-list", {
                params: {
                    status: order_status,
                    keyword: search_keyword,
                    _page: transaction_page,
                    _sortBy: sortBy,
                    _sortDir: sortDir
                }
            })

            setTransData(response.data.data)
            setPageCount(response.data.data.map((val) => val.id).length)
            setCount(response.data.dataCount)
            setMaxItemsPage(maxItemsPerPage)
            setTransactionList(response.data.data)
            setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))
            setIsLoading(true)
        } catch (err) {
            console.log(err)
        }
    }

    const fetchUnpaidTransaction = async () => {
        try {
            const response = await axiosInstance.get("/transactions/unpaid-transaction")

            setUnpaidTransaction(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    // search
    const searchFormik = useFormik({
        initialValues: {
            search: "",
        },
        onSubmit: ({ search }) => {
            if (!search.length) {
                setPayment(true)
            } else {
                setPayment(false)
            }
            setStatus("")
            setKeyword(search)
            setPage(1)
            setGoingOn(false)

            const params = {}

            if (searchParam.get("status")) {
                params["status"] = searchParam.get("status")
            }

            if (searchParam.get("id")) {
                params["id"] = searchParam.get("id")
            } else if (searchParam.get("createdAt")) {
                params["createdAt"] = searchParam.get("createdAt")
            } else if (searchParam.get("updatedAt")) {
                params["updatedAt"] = searchParam.get("updatedAt")
            }

            if (searchParam.get("page")) {
                params["page"] = 1
            }

            if (!search.length) {
                params["keyword"] = search
                setSearchParam("")
            } else {
                params["keyword"] = search
                setSearchParam(params)
            }
        },
    })

    const searchKeywordHandler = ({ target }) => {
        const { name, value } = target
        searchFormik.setFieldValue(name, value)
        setInputSearch(value)
    }

    console.log(inputSearch)

    // status
    const allBtnHandler = () => {
        setGoingOn(false)
        if (keyword.length) {
            setPayment(false)
        } else {
            setPayment(true)
        }
        setStatus("")
        setPage(1)

        const params = {}

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        setSearchParam(params)
    }

    const goingOnBtnHandler = () => {
        setGoingOn(true)
        setPayment(false)
        setStatus("On Going")
        setPage(1)

        const params = {}

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["status"] = "On Going"
        setSearchParam(params)
    }

    const AwaitingConfirmationBtnHandler = () => {
        setStatus("Awaiting Confirmation")
        setPayment(false)
        setPage(1)

        const params = {}

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["status"] = "Awaiting Confirmation"
        setSearchParam(params)
    }

    const processedBtnHandler = () => {
        setStatus("Processed")
        setPayment(false)
        setPage(1)

        const params = {}

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["status"] = "Processed"
        setSearchParam(params)
    }

    const shippingBtnHandler = () => {
        setStatus("Shipping")
        setPayment(false)
        setPage(1)

        const params = {}

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["status"] = "Shipping"
        setSearchParam(params)
    }

    const deliveredBtnHandler = () => {
        setStatus("Delivered")
        setPayment(false)
        setPage(1)

        const params = {}

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["status"] = "Delivered"
        setSearchParam(params)
    }

    const successBtnHandler = () => {
        setStatus("Done")
        setPayment(false)
        setGoingOn(false)
        setPage(1)

        const params = {}

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["status"] = "Done"
        setSearchParam(params)
    }

    const failedBtnHandler = () => {
        setStatus("Canceled")
        setPayment(false)
        setGoingOn(false)
        setPage(1)

        const params = {}

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["status"] = "Canceled"
        setSearchParam(params)
    }

    // reset filter
    const resetBtnHandler = () => {
        setPayment(true)
        setGoingOn(false)
        setStatus("")
        setPage(1)
        setTransactionSort("All Transaction")
        setSortDir("Desc")
        setSortBy("id")
        setKeyword("")

        searchFormik.setFieldValue("search", "")

        const params = {}

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params[""] = ""
        setSearchParam("")
    }

    // change page
    const nextPageBtn = () => {
        setPage(page + 1)

        const params = {}

        if (searchParam.get("status")) {
            params["status"] = searchParam.get("status")
        }

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        if (transaction_page === null) {
            params["page"] = Number(transaction_page) + 2
            setSearchParam(params)
        } else {
            params["page"] = Number(transaction_page) + 1
            setSearchParam(params)
        }
    }

    const previousPageBtn = () => {
        setPage(page - 1)

        const params = {}

        if (searchParam.get("status")) {
            params["status"] = searchParam.get("status")
        }

        if (searchParam.get("id")) {
            params["id"] = searchParam.get("id")
        } else if (searchParam.get("createdAt")) {
            params["createdAt"] = searchParam.get("createdAt")
        } else if (searchParam.get("updatedAt")) {
            params["updatedAt"] = searchParam.get("updatedAt")
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["page"] = Number(transaction_page) - 1
        setSearchParam(params)
    }

    // sort transaction
    const sortAllTransaction = () => {
        setTransactionSort("All Transaction")
        setSortDir("Desc")
        setSortBy("id")

        const params = {}

        if (searchParam.get("status")) {
            params["status"] = searchParam.get("status")
        }

        if (searchParam.get("page")) {
            params["page"] = 1
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["id"] = "Desc"
        setSearchParam(params)
    }

    const sortRecentlyUpdated = () => {
        setTransactionSort("Recently Updated")
        setSortBy("updatedAt")
        setSortDir("Desc")

        const params = {}

        if (searchParam.get("status")) {
            params["status"] = searchParam.get("status")
        }

        if (searchParam.get("page")) {
            params["page"] = searchParam.get("page")
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["updatedAt"] = "Desc"
        setSearchParam(params)
    }

    const sortOldTransaction = () => {
        setTransactionSort("Old Transaction")
        setSortBy("createdAt")
        setSortDir("ASC")

        const params = {}

        if (searchParam.get("status")) {
            params["status"] = searchParam.get("status")
        }

        if (searchParam.get("page")) {
            params["page"] = searchParam.get("page")
        }

        if (searchParam.get("keyword")) {
            params["keyword"] = searchParam.get("keyword")
        }

        params["createdAt"] = "ASC"
        setSearchParam(params)
    }

    // pagination
    const pageNumbers = []

    for (let i = 1; i <= Math.ceil(count / maxItemsPage); i++) {
        pageNumbers.push(i)
    }

    const renderPagination = () => {
        return pageNumbers.map((number => {
            return <Pagination
                setPage={setPage}
                page={page}
                number={number}
                setSearchParam={setSearchParam}
                transaction_page={transaction_page}
                searchParam={searchParam}
            />
        }))
    }

    // transaction list item
    const renderTransactionList = () => {
        return transactionList.map((val) => {
            return (
                <TransactionListItems
                    key={val.id.toString()}
                    paymentDate={val.payment_date}
                    orderStatusName={val.Order_status.order_status_name}
                    transactionName={val.transaction_name}
                    totalPrice={val.total_price}
                    transactionItems={val.TransactionItems}
                    courirDuration={val.courir_duration}
                    transactionAddress={val.Address}
                    paymentMethod={val.payment_method}
                    totalQuantity={val.total_quantity}
                    shippingFee={val.shipping_fee}
                    fetchMyTransactionList={fetchMyTransactionList}
                    transactionId={val.id}
                />
            )
        })
    }

    useEffect(() => {
        if (order_status === "On Going" || order_status === "Awaiting Confirmation" || order_status === "Processed" || order_status === "Shipping" || order_status === "Delivered") {
            setGoingOn(true)
        }
        fetchMyTransactionList()
        fetchUnpaidTransaction()
        if (search_keyword) {
            setPayment(false)
        }
        if (search_keyword) {
            setInputSearch(search_keyword)
        }
        if (transaction_page) {
            setPage(transaction_page)
        }
    }, [transData])

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [page, payment])

    return (
        <>
            <Box>
                <Box mt={'150px'}>
                    <Box w={'850px'} mx={'auto'}>
                        <Text
                            color={'#31353BF5'}
                            fontSize={'20px'}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            margin={'20px 0px'}
                            fontWeight={700}
                            lineHeight={'26px'}
                            letterSpacing={'-0,1px'}
                        >
                            Transaction List
                        </Text>
                        <Box
                            w={'100%'}
                            h={'100%'}
                            // border={'1px solid #0058a3'} boxShadow={"0 0 10px 0 rgb(0 0 0 / 10%)"} borderRadius={"15px"}
                            pb={count === 0 ? '0px' : '24px'}
                            pt={'24px'}
                        >
                            {/* search */}
                            <Box display={'flex'} mb={'16px'} mt={'0px'} p={'0px 16px'} justifyContent={'flex-start'}>
                                <form onSubmit={searchFormik.handleSubmit}>
                                    <FormControl>
                                        <InputGroup w={'346px'}>
                                            <Input
                                                h={'40px'}
                                                placeholder={'Find your transaction here'}
                                                fontSize={'14px'}
                                                fontFamily={'Open Sauce One, sans-serif'}
                                                color={'#31353BF5'}
                                                borderRadius={"8px"}
                                                onChange={searchKeywordHandler}
                                                name="search"
                                                // value={searchFormik.values.search}
                                                defaultValue={inputSearch}
                                            />
                                            <InputRightElement >
                                                <Box
                                                    pb={'2px'}
                                                    bgColor="#fff"
                                                    color={"#0058a3"}
                                                    type="submit"
                                                    _hover={'none'}
                                                >
                                                    <BiSearchAlt2 style={{ fontSize: '21px' }} />
                                                </Box>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>
                                </form>
                                <Menu>
                                    <Box pl={'10px'}>
                                        <MenuButton
                                            display={'flex'} justifyContent={'space-between'} flexDir={'row'}
                                            w={'250px'}
                                            borderWidth='1px'
                                            textAlign={'left'}
                                            h={'40px'}
                                            p={'0px 8px 0px 12px '}
                                            borderRadius={'8px'}
                                        >
                                            <Box display={'flex'} justifyContent={'space-between'}
                                                alignItems={'center'}>
                                                <Text
                                                    fontSize={'14px'}
                                                    fontFamily={'Open Sauce One, sans-serif'}
                                                    color={"31353BF5"}
                                                >
                                                    {!transactionSort ? "All Transaction" : transactionSort}
                                                </Text>
                                                <MdKeyboardArrowDown style={{ fontSize: "25px" }} />
                                            </Box>
                                        </MenuButton>
                                    </Box>

                                    {/* sort transaction */}
                                    <MenuList w={'250px'} borderRadius={'8px'} mt={'-10px'} borderTopRadius={'0px'} fontWeight={400} lineHeight={1.33} color={'#31353BF5'} fontFamily={'Open Sauce One, sans-serif'} fontSize={'14px'} pt={'1px'} pb={'1px'} >
                                        <MenuItem
                                            h={'40px'}
                                            p={'6px 12px 6px 9px'}
                                            borderLeft={transactionSort === "All Transaction" ? '3px solid #0058a3' : null}
                                            onClick={sortAllTransaction}
                                        >
                                            All Transaction
                                        </MenuItem>
                                        <MenuItem
                                            h={'40px'}
                                            p={'6px 12px 6px 9px'}
                                            onClick={sortRecentlyUpdated}
                                            borderLeft={transactionSort === "Recently Updated" ? '3px solid #0058a3' : null}
                                        >
                                            Recently Updated
                                        </MenuItem>
                                        <MenuItem
                                            h={'40px'}
                                            p={'6px 12px 6px 9px'}
                                            onClick={sortOldTransaction}
                                            borderLeft={transactionSort === "Old Transaction" ? '3px solid #0058a3' : null}
                                        >
                                            Old Transaction
                                        </MenuItem>

                                    </MenuList>
                                </Menu>
                            </Box>

                            {/* transaction status */}
                            <Box display={'flex'} h={'48px'} justifyContent={'flex-start'} p={'0px 16px'} mb={search_keyword !== null || order_status === "Done" || order_status === "Canceled" ? '12px' : null} alignItems={'center'}>
                                <Text
                                    fontSize={'13px'}
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    color={'#31353BF5'}
                                    pr={'10px'}
                                    fontWeight={700}
                                    lineHeight={'22px'}
                                    letterSpacing={'0px'}
                                >
                                    Status
                                </Text>
                                <Box
                                    h={'40px'}
                                    // border={order_status === null ? '2px solid #0095DA' : '1px solid #E5E7E9'}
                                    m={'4px 8px 4px 0px'}
                                    p={'0px 13px'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    cursor={'pointer'}
                                    fontFamily={"Open Sauce One"}
                                    alignItems={'center'}
                                    borderRadius={'16px'}
                                    onClick={allBtnHandler}
                                    // bgColor={order_status === null ? '#ebffef' : 'fff'}
                                >
                                   
                                    <Text
                                        fontSize={'13px'}
                                        lineHeight={'16px'}
                                        textAlign={'center'}
                                        color={order_status === null ? '#32769C' : '#31353BAD'}
                                    >
                                        All
                                    </Text>
                                </Box>
                                
                                <Box

                                    h={'40px'}
                                    // border={order_status === "On Going" || order_status === "Awaiting Confirmation" || order_status === "Processed" || order_status === "Shipping" || order_status === "Delivered" ? '2px solid #0095DA' : '1px solid #E5E7E9'}
                                    m={'4px 8px 4px 0px'}
                                    p={'0px 13px'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    cursor={'pointer'}
                                    fontFamily={"Open Sauce One"}
                                    alignItems={'center'}
                                    borderRadius={'16px'}
                                    onClick={goingOnBtnHandler}
                                    // bgColor={order_status === "On Going" || order_status === "Awaiting Confirmation" || order_status === "Processed" || order_status === "Shipping" || order_status === "Delivered" ? '#ebffef' : 'fff'}
                                >
                                    <Text
                                        fontSize={'13px'}
                                        lineHeight={'16px'}
                                        textAlign={'center'}
                                        color={order_status === "On Going" || order_status === "Awaiting Confirmation" || order_status === "Processed" || order_status === "Shipping" || order_status === "Delivered" ? '#32769C' : '#31353BAD'}
                                    >
                                        On Going
                                    </Text>
                                </Box>
                                <Box
                                    h={'40px'}
                                    // border={order_status === "Done" ? '2px solid #0095DA' : '1px solid #E5E7E9'}
                                    m={'4px 8px 4px 0px'}
                                    p={'0px 13px'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    cursor={'pointer'}
                                    fontFamily={"Open Sauce One"}
                                    alignItems={'center'}
                                    borderRadius={'16px'}
                                    onClick={successBtnHandler}
                                    // bgColor={order_status === "Done" ? '#ebffef' : 'fff'}
                                >
                                    <Text
                                        fontSize={'13px'}
                                        lineHeight={'16px'}
                                        textAlign={'center'}
                                        color={order_status === "Done" ? '#32769C' : '#31353BAD'}
                                    >
                                        Success
                                    </Text>
                                </Box>
                                <Box
                                    h={'40px'}
                                    // border={order_status === "Canceled" ? '2px solid #0095DA' : '1px solid #E5E7E9'}
                                    m={'4px 8px 4px 0px'}
                                    p={'0px 13px'}
                                    display={'flex'}
                                    justifyContent={'center'}
                                    cursor={'pointer'}
                                    fontFamily={"Open Sauce One"}
                                    alignItems={'center'}
                                    borderRadius={'16px'}
                                    onClick={failedBtnHandler}
                                    // bgColor={order_status === "Canceled" ? '#ebffef' : 'fff'}
                                >
                                    <Text
                                        fontSize={'13px'}
                                        lineHeight={'16px'}
                                        textAlign={'center'}
                                        color={order_status === "Canceled" ? '#32769C' : '#31353BAD'}
                                    >
                                        Failed
                                    </Text>
                                </Box>

                                {/* reset filter */}
                                <Box w={'100px'} h={'44px'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
                                    <Text
                                        m={'12px 0px'}
                                        fontSize={'12px'}
                                        fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                        fontWeight={700}
                                        lineHeight={'20px'}
                                        letterSpacing={'0px'}
                                        color={'#0058a3'}
                                        cursor={'pointer'}
                                        onClick={resetBtnHandler}
                                    >
                                        Reset Filter
                                    </Text>
                                </Box>
                            </Box>

                            {/* status going on */}
                            {goingOn === false ? null : (
                                <Box display={'flex'} h={'48px'} justifyContent={'flex-start'} p={'0px 16px'} mb={'12px'} alignItems={'center'}>
                                    <Box

                                        h={'40px'}
                                        // border={order_status === "Awaiting Confirmation" ? '2px solid #0095DA' : '1px solid #E5E7E9'}
                                        m={'4px 8px 4px 0px'}
                                        p={'0px 13px'}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        cursor={'pointer'}
                                        fontFamily={"Open Sauce One"}
                                        alignItems={'center'}
                                        borderRadius={'16px'}
                                        onClick={AwaitingConfirmationBtnHandler}
                                        // bgColor={order_status === "Awaiting Confirmation" ? '#ebffef' : 'fff'}
                                    >
                                        <Text
                                            fontSize={'13px'}
                                            lineHeight={'16px'}
                                            textAlign={'center'}
                                            color={order_status === "Awaiting Confirmation" ? '#32769C' : '#31353BAD'}
                                        >
                                            Awaiting Confirmation
                                        </Text>
                                    </Box>
                                    <Box
                                        h={'40px'}
                                        // border={order_status === "Processed" ? '2px solid #0095DA' : '1px solid #E5E7E9'}
                                        m={'4px 8px 4px 0px'}
                                        p={'0px 13px'}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        cursor={'pointer'}
                                        fontFamily={"Open Sauce One"}
                                        alignItems={'center'}
                                        borderRadius={'16px'}
                                        onClick={processedBtnHandler}
                                        // bgColor={order_status === "Processed" ? '#ebffef' : 'fff'}
                                    >
                                        <Text
                                            fontSize={'13px'}
                                            lineHeight={'16px'}
                                            textAlign={'center'}
                                            color={order_status === "Processed" ? '#32769C' : '#31353BAD'}
                                        >
                                            Processed
                                        </Text>
                                    </Box>
                                    <Box

                                        h={'40px'}
                                        // border={order_status === "Shipping" ? '2px solid #0095DA' : '1px solid #E5E7E9'}
                                        m={'4px 8px 4px 0px'}
                                        p={'0px 13px'}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        cursor={'pointer'}
                                        fontFamily={"Open Sauce One"}
                                        alignItems={'center'}
                                        borderRadius={'16px'}
                                        onClick={shippingBtnHandler}
                                        // bgColor={order_status === "Shipping" ? '#ebffef' : 'fff'}
                                    >
                                        <Text
                                            fontSize={'13px'}
                                            lineHeight={'16px'}
                                            textAlign={'center'}
                                            color={order_status === "Shipping" ? '#32769C' : '#31353BAD'}
                                        >
                                            Shipping
                                        </Text>
                                    </Box>
                                    <Box

                                        h={'40px'}
                                        // border={order_status === "Delivered" ? '2px solid #0095DA' : '1px solid #E5E7E9'}
                                        m={'4px 8px 4px 0px'}
                                        p={'0px 13px'}
                                        display={'flex'}
                                        justifyContent={'center'}
                                        cursor={'pointer'}
                                        fontFamily={"Open Sauce One"}
                                        alignItems={'center'}
                                        borderRadius={'16px'}
                                        onClick={deliveredBtnHandler}
                                        // bgColor={order_status === "Delivered" ? '#ebffef' : 'fff'}
                                    >
                                        <Text
                                            fontSize={'13px'}
                                            lineHeight={'16px'}
                                            textAlign={'center'}
                                            color={order_status === "Delivered" ? '#32769C' : '#31353BAD'}
                                        >
                                            Delivered
                                        </Text>
                                    </Box>
                                </Box>
                            )}

                            {/* see unpaid transaction */}
                            {payment === false ? null : (
                                <Link to={'/transaction/payment-list'}>
                                    <Box
                                        cursor={'pointer'}
                                        w={'818px'}
                                        h={'42px'}
                                        m={'16px'}
                                        p={'8px 12px'}
                                        border={'1px solid #E5E7E9'}
                                        borderRadius={'8px'}
                                        display={'flex'}
                                        alignItems={'center'}
                                    >
                                        <Image
                                            w={'24px'}
                                            h={'24px'}
                                            src={rupiah}
                                        />
                                        <Text
                                            color={'#31353BAD'}
                                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                            fontSize={'12px'}
                                            m={'0px 8px 0px 12px'}
                                            fontWeight={400}
                                            lineHeight={'18px'}
                                            letterSpacing={'0px'}
                                            w={'100%'}
                                        >
                                            Waiting For Payment
                                        </Text>
                                        <Text
                                            fontSize={'10px '}
                                            fontFamily={'Open Sauce One, sans-serif'}
                                            bgColor={unpaidTransaction.length === 0 ? null : '#ef144a'}
                                            p={'0px 2px'}
                                            minW={'15px'}
                                            h={'16px'}
                                            fontWeight={700}
                                            textAlign={'center'}
                                            borderRadius={'25px'}
                                            color={'#fff'}
                                            display={'inline-block'}
                                        >
                                            {unpaidTransaction.length === 0 ? null : unpaidTransaction.length}
                                        </Text>
                                    </Box>
                                </Link>
                            )}

                            {/* when data fetching */}
                            <Box>
                                {isLoading &&
                                    renderTransactionList()}
                            </Box>
                            {isLoading === false ? (
                                <Box w={'850px'} h={'400px'} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                                   <Spinner thickness='4px' speed='0.65s' emptyColor='gray.200' color='blue.500' size='xl' />
                                </Box>
                            ) : null}

                            {/* if data count = 0 */}
                            {count === 0 && isLoading === true || pageCount === 0 && isLoading === true ? (
                                <Box w={'100%'} h={'496.09px'} p={'40px 0px 60px'}>
                                    <Box display={'flex'} flexDir={'column'} alignItems={'center'}>
                                        <Image
                                            src={noTransaction}
                                            w={'279px'}
                                            h={'210px'}
                                        />
                                        <Text
                                            mt={'26px'}
                                            color={'#31353BF5'}
                                            fontSize={'20px'}
                                            fontWeight={700}
                                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                            lineHeight={'26px'}
                                            letterSpacing={'-0,1px'}
                                            maxW={'320px'}
                                            textAlign={'center'}
                                        >
                                            Oops, zero transactions based on filter {':('}
                                        </Text>
                                        <Text
                                            fontSize={'14px'}
                                            color={'#31353BAD'}
                                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                            m={'14px 0px'}
                                            fontWeight={400}
                                            lineHeight={"20px"}
                                            letterSpacing={'0px'}
                                        >
                                            Please try to reset or changing your filter
                                        </Text>
                                        <Button
                                            mt={'11px'}
                                            w={'150px'}
                                            borderRadius={'25px'}
                                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                            h={'48px'}
                                            fontWeight={600}
                                            lineHeight={'22px'}
                                            p={'0px 16px'}
                                            color={'#fff'}
                                            bgColor={'#0058a3'}
                                            _hover={{
                                                bgColor: "#0370A2",
                                            }}
                                            _active={{
                                                bgColor: "#0370A2",
                                            }}
                                            onClick={resetBtnHandler}
                                        >
                                            Reset Filter
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                null
                            )}

                            {/* pagination */}
                            {count === 0 || pageNumbers.length < 2 ? null : (
                                <Box display={'flex'} justifyContent={'center'} h={'24px'} bgColor={'#fff'} alignItems={'center'}>
                                    <Box
                                        cursor={'pointer'}
                                        color={Number(transaction_page) === 1 || Number(page) === 1 ? '#dbdee2' : '#31353BAD'}
                                        ml={'4px'}
                                        mr={'4px'}
                                        p={'1px 6px'}
                                        minW={'24px'}
                                        h={'20px'}
                                        fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                        fontSize={'14px'}
                                        lineHeight={'18px'}
                                        textAlign={'center'}
                                        onClick={Number(transaction_page) === 1 || Number(page) === 1 ? null : previousPageBtn}
                                    >
                                        ❮
                                    </Box>
                                    {renderPagination()}
                                    <Box
                                        onClick={Number(transaction_page) >= maxPage || Number(page) >= maxPage ? null : nextPageBtn}
                                        cursor={'pointer'}
                                        color={Number(transaction_page) >= maxPage || Number(page) >= maxPage ? "#dbdee2" : "#31353BAD"}
                                        ml={'4px'}
                                        mr={'4px'}
                                        p={'1px 6px'}
                                        minW={'24px'}
                                        h={'20px'}
                                        fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                        fontSize={'14px'}
                                        lineHeight={'18px'}
                                        textAlign={'center'}
                                    >
                                        ❯
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box >
            </Box>
        </>
    )
}

export default TransactionList

