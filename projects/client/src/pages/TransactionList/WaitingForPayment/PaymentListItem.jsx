import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Grid,
    GridItem,
    Image,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react"
import { Link } from "react-router-dom"
import { axiosInstance } from "../../../api"
import moment from "moment"
import ModalCancelUnpaidTransaction from "../../../components/TransactionList/WaitingForPayment/ModalCancelUnpaidTransaction"
import ModalDetailTransaction from "../../../components/TransactionList/WaitingForPayment/Modal Detail Transaction"
import mandiri from "../../../assets/mandiri.png"
import BNI from "../../../assets/BNI.png"
import BCA from "../../../assets/BCA.png"
import { HiOutlineShoppingBag } from "react-icons/hi2"
import { AiOutlineClockCircle, AiOutlineClose } from "react-icons/ai"
import { HiOutlineDotsHorizontal, HiOutlineDotsVertical } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"

const PaymentListItem = ({
    fetchUnpaidTransaction,
    courirDuration,
    paymentDate,
    paymentExpiredDate,
    paymentMethod,
    totalPrice,
    transaction,
    transactionItems,
    transactionName,
    transactionAddress,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const {
        isOpen: drawerIsOpen,
        onOpen: drawerOnOpen,
        onClose: drawerOnClose
    } = useDisclosure()

    const {
        isOpen: cancelIsOpen,
        onOpen: cancelOnOpen,
        onClose: cancelOnClose,
    } = useDisclosure()

    const courir = courirDuration.split("at")[0]
    const shippingDate = courirDuration.split("at")[1]

    const cancelUnpaidTransaction = async () => {
        try {
            axiosInstance.patch(`/transactions/cancel-unpaid-transaction/${transactionName}`)

            toast({
                title: "Success",
                description: "You have successfully canceled this transaction",
                status: "success",
            })

            fetchUnpaidTransaction()
            cancelOnClose()
        } catch (err) {
            console.log(err)
        }
    }

    const renderTransactionItems = () => {
        return transactionItems.map((val) => {
            return (
                <>
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        m={"10px 0px 2px"}
                    >
                        <Text
                            fontSize={"14px"}
                            color={"#000000B3"}
                            fontFamily={"Open Sauce One, sans-serif"}
                            fontWeight={"bold"}
                            whiteSpace={"nowrap"}
                            overflow={"hidden"}
                            textOverflow={"ellipsis"}
                            width={"280px"}
                        >
                            {val.Product.product_name}
                        </Text>
                        <Text
                            fontSize={"14px"}
                            color={"#000000B3"}
                            fontFamily={"Open Sauce One, sans-serif"}
                        >
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(val.price_per_item * val.quantity).split(",")[0]}
                        </Text>
                    </Box>
                    <Text
                        fontSize={"14px"}
                        color={"#000000B3"}
                        fontFamily={"Open Sauce One, sans-serif"}
                    >
                        {val.quantity} X{" "}
                        {
                            new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(val.price_per_item).split(",")[0]
                        }
                    </Text>
                </>
            )
        })
    }

    return (
        <>
            <Box display={{ lg: 'inline', base: 'none' }}>
                <Box
                    w={"729px"}
                    h={"202px"}
                    m={"16px 0px"}
                    p={"16px"}
                    borderRadius={"8px"}
                    boxShadow={"0 1px 6px 0 rgba(49,53,59,0.12)"}
                    cursor={"default"}
                >
                    <Box
                        display={"flex"}
                        flexDir={"row"}
                        justifyContent={"space-between"}
                    >
                        <Box display={"flex"} flexDir={"row"} h={"24px"}>
                            <HiOutlineShoppingBag
                                style={{
                                    height: "22px",
                                    width: "22px",
                                    color: "#0058a3",
                                }}
                            />
                            <Box
                                display={"flex"}
                                flexDir={"row"}
                                alignItems={"center"}
                            >
                                <Text
                                    color={"#31353BF5"}
                                    fontSize={"14px"}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    m={"0px 8px"}
                                    fontWeight={"bold"}
                                    lineHeight={"20px"}
                                    alignItems={"center"}
                                >
                                    Purchased
                                </Text>
                                <Text
                                    color={"#31353BAD"}
                                    fontSize={"12px"}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    m={"3.5px 0px"}
                                >
                                    {moment(paymentDate).format("D MMM YYYY")}
                                </Text>
                            </Box>
                        </Box>
                        <Box display={"flex"} flexDir={"row"} alignItems={"center"}>
                            <Text
                                color={"#31353BAD"}
                                fontSize={"12px"}
                                fontFamily={"Open Sauce One, sans-serif"}
                                mr={"4px"}
                                lineHeight={"16px"}
                                fontWeight={"unset"}
                            >
                                Pay Before
                            </Text>
                            <AiOutlineClockCircle
                                style={{
                                    color: "0058a3",
                                    height: "13px",
                                    width: "13px",
                                }}
                            />
                            <Text
                                color={"#0058a3"}
                                fontSize={"12px"}
                                fontFamily={"Open Sauce One, sans-serif"}
                                ml={"4px"}
                                fontWeight={"bold"}
                                lineHeight={"16px"}
                            >
                                {moment(paymentExpiredDate).format("D MMM, HH:mm")}
                            </Text>
                        </Box>
                    </Box>
                    <Grid
                        templateColumns="1.6fr 2.38fr 1.02fr"
                        gap={0}
                        m={"24px 0px"}
                    >
                        <GridItem
                            display={"flex"}
                            flexDir={"row"}
                            alignItems={"center"}
                        >
                            {paymentMethod === "Mandiri Virtual Account" ? (
                                <Image h={"19.63px"} w={"59px"} src={mandiri} />
                            ) : null}

                            {paymentMethod === "BNI Virtual Account" ? (
                                <Image h={"19.63px"} w={"55px"} src={BNI} />
                            ) : null}

                            {paymentMethod === "BCA Virtual Account" ? (
                                <Image h={"19.63px"} w={"59px"} src={BCA} />
                            ) : null}

                            <Box pl={"16px"}>
                                <Text
                                    color={"#31353BAD"}
                                    fontSize={"12px"}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    lineHeight={"18px"}
                                >
                                    Payment Method
                                </Text>
                                <Text
                                    fontSize={"14px"}
                                    color={"#31353BF5"}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    fontWeight={"bold"}
                                    lineHeight={"20px"}
                                >
                                    {paymentMethod}
                                </Text>
                            </Box>
                        </GridItem>
                        <GridItem
                            display={"flex"}
                            flexDir={"column"}
                            h={"58px"}
                            w={"332.32px"}
                            justifyContent={"center"}
                        >
                            <Box
                                p={"0px 16px"}
                                borderRight={"1px solid #E5E7E9"}
                                borderLeft={"1px solid #E5E7E9"}
                                w={"332.32px"}
                            >
                                <Text
                                    color={"#31353BAD"}
                                    fontSize={"12px"}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    lineHeight={"18px"}
                                >
                                    Virtual Account Number
                                </Text>
                                <Text
                                    fontSize={"14px"}
                                    color={"#31353BF5"}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    fontWeight={"bold"}
                                    lineHeight={"20px"}
                                >
                                    {paymentMethod === "Mandiri Virtual Account"
                                        ? "8870885771380486"
                                        : paymentMethod === "BCA Virtual Account"
                                            ? "8870810222728301"
                                            : "8870810222743225"}
                                </Text>
                            </Box>
                        </GridItem>
                        <GridItem
                            p={"0px 0px 0px 16px"}
                            display={"flex"}
                            flexDir={"column"}
                            justifyContent={"center"}
                        >
                            <Box>
                                <Text
                                    color={"#31353BAD"}
                                    fontSize={"12px"}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    lineHeight={"18px"}
                                >
                                    Total Payment
                                </Text>
                                <Text
                                    fontSize={"14px"}
                                    color={"#31353BF5"}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    fontWeight={"bold"}
                                    lineHeight={"20px"}
                                >
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(totalPrice).split(",")[0]}
                                </Text>
                            </Box>
                        </GridItem>
                    </Grid>
                    <Box display={"flex"} justifyContent={"flex-end"} h={"44px"}>
                        <Box
                            display={"flex"}
                            flexDir={"row"}
                            justifyContent={"space-evenly"}
                            columnGap={"14px"}
                        >
                            <Button
                                h={"40px"}
                                w={"146px"}
                                border={"1px solid #0058a3"}
                                borderRadius={'25px'}
                                bgColor={"#fff"}
                                color={"#0058a3"}
                                fontSize={"12px"}
                                fontFamily={"Open Sauce One, sans-serif"}
                                fontWeight={700}
                                lineHeight={"24px"}
                                _hover={"none"}
                                onClick={() => onOpen()}
                            >
                                See Detail
                            </Button>
                            <Link
                                to={`/payment/${transactionName}`}
                            >
                                <Button
                                    h={"40px"}
                                    w={"146px"}
                                    borderRadius={'25px'}
                                    bgColor={"#0058a3"}
                                    color={"#fff"}
                                    fontSize={"12px"}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    fontWeight={700}
                                    lineHeight={"24px"}
                                    _hover={{
                                        bgColor: "#0370A2",
                                    }}
                                    _active={{
                                        bgColor: "#0370A2",
                                    }}
                                >
                                    Payment Page
                                </Button>
                            </Link>
                            <Popover>
                                <PopoverTrigger>
                                    <Box
                                        p={"8px 0px"}
                                        cursor={"pointer"}
                                        _focus={"none"}
                                    >
                                        <HiOutlineDotsHorizontal
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                color: "#838994",
                                            }}
                                        />
                                    </Box>
                                </PopoverTrigger>
                                <PopoverContent
                                    _hover={{ bgColor: "#E5F9F6" }}
                                    cursor={"pointer"}
                                    _focus={"#fff"}
                                    _active={"none"}
                                    mr={"145px"}
                                    mt={"-5px"}
                                    w={"173.61px"}
                                    maxH={"40px"}
                                    boxShadow={"0 1px 6px 0 rgba(49,53,59,0.12)"}
                                    border={"none"}
                                    onClick={() => cancelOnOpen()}
                                >
                                    <PopoverBody p={"10px 15px"}>
                                        <Box
                                            display={"flex"}
                                            flexDir={"row"}
                                            justifyContent={"flex-start"}
                                            alignItems={"center"}
                                            alignContent={"center"}
                                        >
                                            <Box w={"20px"} h={"20px"}>
                                                <RiDeleteBin6Line
                                                    style={{
                                                        color: "#8d96aa",
                                                        width: "17.58px",
                                                        maxWidth: "17.58px",
                                                        minWidth: "17.58px",
                                                        height: "19.26px",
                                                        maxHeight: "19.26px",
                                                        minHeight: "19.26px",
                                                    }}
                                                />
                                            </Box>
                                            <Text
                                                fontSize={"14px"}
                                                fontFamily={
                                                    "Open Sauce One, sans-serif"
                                                }
                                                color={"#0000008A"}
                                                lineHeight={"1.15"}
                                                pl={"2px"}
                                            >
                                                Cancel Transaction
                                            </Text>
                                        </Box>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Drawer Cancel Transaction   */}
            <Drawer
                isOpen={drawerIsOpen}
                placement='bottom'
                onClose={drawerOnClose}
            >
                <DrawerOverlay />
                <DrawerContent borderRadius={'10px 10px 0px 0px'}>
                    <DrawerBody p={'0px'}>
                        <Box p={'16px'} display={'flex'} flexDir={'row'} h={'56px'} alignItems={'center'}>
                            <Box mr={'12px'} onClick={() => drawerOnClose()}>
                                <AiOutlineClose style={{ height: '24px', width: '24px' }} />
                            </Box>
                            <Text
                                color={'#31353BF5'}
                                fontSize={'18px'}
                                fontFamily={"Open Sauce One, -apple-system, BlinkMacSystemFont, Roboto, sans-serif"}
                                fontWeight={800}
                                lineHeight={'22px'}
                            >
                                Others
                            </Text>
                        </Box>
                        <Box pb={'16px'}>
                            <Box display={'flex'} flexDir={'row'} justifyContent={'flex-start'} alignItems={'center'} ml={'16px'} p={'16px 16px 16px 0px'} h={'53px'} onClick={() => cancelOnOpen()}>
                                <RiDeleteBin6Line
                                    style={{
                                        color: "#8d96aa",
                                        width: "17.58px",
                                        maxWidth: "17.58px",
                                        minWidth: "17.58px",
                                        height: "19.26px",
                                        maxHeight: "19.26px",
                                        minHeight: "19.26px",
                                    }}
                                />
                                <Text
                                    fontSize={"14px"}
                                    fontFamily={"Open Sauce One, -apple-system, BlinkMacSystemFont, Roboto, sans-serif"}
                                    color={"#31353BF5"}
                                    lineHeight={"18px"}
                                    ml={"8px"}
                                >
                                    Cancel Transaction
                                </Text>
                            </Box>
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            {/* Cancel Unpaid Transaction */}
            <ModalCancelUnpaidTransaction
                cancelIsOpen={cancelIsOpen}
                cancelOnOpen={cancelOnOpen}
                cancelOnClose={cancelOnClose}
                cancelUnpaidTransaction={cancelUnpaidTransaction}
            />

            {/* detail transaction */}
            <ModalDetailTransaction
                isOpen={isOpen}
                onClose={onClose}
                transaction={transaction}
                renderTransactionItems={renderTransactionItems}
                transactionAddress={transactionAddress}
                shippingDate={shippingDate}
                courir={courir}
            />
        </>
    )
}

export default PaymentListItem
