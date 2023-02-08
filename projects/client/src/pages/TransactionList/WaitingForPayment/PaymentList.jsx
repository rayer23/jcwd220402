import { Box, Button, Spinner, Image, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { axiosInstance } from "../../../api"
import PaymentListItem from "./PaymentListItem"
// import emptyStroll from "../../../assets/emptyStroll.jpg"
import { HiOutlineArrowLeft } from "react-icons/hi"

const PaymentList = () => {
    const [unpaidTransaction, setUnpaidTransaction] = useState([])
    const [isLoading, setIsloading] = useState(false)
    const [count, setCount] = useState(1)

    const fetchUnpaidTransaction = async () => {
        try {
            const response = await axiosInstance.get("/transactions/unpaid-transaction")

            setCount(response.data.dataCount)

            setUnpaidTransaction(response.data.data)
            setIsloading(true)
        } catch (err) {
            console.log(err)
        }
    }

    const renderPaymentListItem = () => {
        return unpaidTransaction.map((val) => {
            return (
                <PaymentListItem
                    key={val.id.toString()}
                    paymentDate={val.payment_date}
                    paymentExpiredDate={val.payment_expired_date}
                    transactionAddress={val.Address}
                    transactionName={val.transaction_name}
                    totalPrice={val.total_price}
                    paymentMethod={val.payment_method}
                    transaction={val}
                    transactionItems={val.TransactionItems}
                    courirDuration={val.courir_duration}
                    fetchUnpaidTransaction={fetchUnpaidTransaction}
                />
            )
        })
    }

    useEffect(() => {
        fetchUnpaidTransaction()
    }, [isLoading, unpaidTransaction])

    return (
        <>
            <Box display={{ lg: 'inline', base: 'none' }}>
            <Box
                width={"1070px"}
                h={"66px"}
                m={"0px 231.5px"}
                p={"40px 20px 0px"}
                mx={"auto"}
                mt={"120px"}
              >
                <Text
                  fontSize={"18px"}
                  color="#111"
                  fontWeight={"700"}
                  fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                >
                  Awaiting Payment
                </Text>
              </Box>
                <Box
                    mt={"30px"}
                    mx={"auto"}
                    maxW={"1080px"}
                    w={"763px"}
                    minH={count === 0 ? "505px" : "auto"}
                    h={count === 0 ? "505px" : "auto"}
                    p={"16px"}
                    border={"1px solid #0058a3"}
                    boxShadow={"0 0 10px 0 rgb(0 0 0 / 10%)"}
                    borderRadius={"15px"}
                >
                    {isLoading === false ? (
                        <Box
                            w={"763px"}
                            h={"400px"}
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            alignContent={"center"}
                        >
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='xl'
                                />
                        </Box>
                    ) : null}
                    {count === 0 ? (
                        <Box
                            m={"32px 214.5px"}
                            w={"300px"}
                            h={"342.59px"}
                            display={"flex"}
                            justifyContent={"center"}
                            flexDir={"column"}
                            alignContent={"center"}
                            alignItems={"center"}
                        >
                            {/* <Image
                                src={emptyStroll}
                                p={"0px"}
                                m={"0px"}
                                w={"250px"}
                                h={"187.5px"}
                            /> */}
                            <Text
                                textAlign={"center"}
                                fontSize={"16px"}
                                color={"#31353BAD"}
                                m={"14px 3.5px"}
                                fontFamily={"Open Sauce One, sans-serif"}
                                fontWeight={"bold"}
                                lineHeight={"16px"}
                            >
                                No transactions yet
                            </Text>
                            <Text
                                textAlign={"center"}
                                fontSize={"14px"}
                                color={"#31353BAD"}
                                m={"3.5px 3.5px 28px"}
                                fontFamily={"Open Sauce One, sans-serif"}
                                fontWeight={"unset"}
                                lineHeight={"16px"}
                            >
                                grabs your choosen furniture at Delisha.
                            </Text>
                            <Link to={"/"}>
                                <Button
                                    borderRadius={"25px"}
                                    minH={"48px"}
                                    textAlign={"center"}
                                    fontSize={"16px"}
                                    lineHeight={"22px"}
                                    fontWeight={600}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    color={"#fff"}
                                    bgColor={"#0058a3"}
                                    w={"300px"}
                                    _hover={{
                                        bgColor: "#0370A2",
                                    }}
                                    _active={{
                                        bgColor: "#0370A2",
                                    }}
                                >
                                    Start Shopping
                                </Button>
                            </Link>
                        </Box>
                    ) : (
                        <Box>
                            {isLoading &&
                                <Box>
                                    {renderPaymentListItem()}
                                </Box>}
                        </Box>
                    )}
                </Box>
            </Box>

        </>
    )
}

export default PaymentList
