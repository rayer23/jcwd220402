import { Box, Button, Image, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { useRef, useState } from "react"
import mandiri from "../assets/mandiri.png"
import BNI from "../assets/BNI.png"
import BCA from "../assets/BCA.png"
import { CgCopy } from "react-icons/cg"
import { IoAlertCircleSharp } from "react-icons/io5"
import { useNavigate, useParams } from "react-router-dom"
import { axiosInstance } from "../api"
import { useEffect } from "react"
// import uploadPH from "../assets/uploadPlaceHolder.png"
import { useFormik } from "formik"
import moment from 'moment'
// import payment from "../assets/PaymentProcess.svg"
import AlertDialogVerify from "../components/PaymentProof/AlertVerify"
import AlertDialogConfirmation from "../components/PaymentProof/Confirmation"
import AlertDialogPaymentExpired from "../components/PaymentProof/PaymentExpired"
import ModalUploadPaymentProof from "../components/PaymentProof/UploadPaymentProof"
import ModalDetailTransaction from "../components/PaymentProof/DetailTransaction"

const PaymentProof = () => {
    const [virtualAccount, setVirtualAccount] = useState("")

    const [transaction, setTransaction] = useState({})
    const [transactionItems, setTransactionItems] = useState([])
    const [selectImage, setSelectImage] = useState(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [uploadImage, setUploadImage] = useState(false)
    const [uploadError, setUploaderror] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState(1)
    const [transactionAddress, setTransactionAddress] = useState({})
    const [courir, setCourir] = useState("")
    const [shippingDate, setShippingDate] = useState("")

    const navigate = useNavigate()
    const inputFileRef = useRef()
    const toast = useToast()
    const params = useParams()

    const {
        isOpen: paymentIsOpen,
        onOpen: paymentOnOpen,
        onClose: paymentOnClose
    } = useDisclosure()

    const {
        isOpen: expIsOpen,
        onOpen: expOnOpen,
        onClose: expOnClose
    } = useDisclosure()

    const {
        isOpen: confirmIsOpen,
        onOpen: confirmOnOpen,
        onClose: confirmOnClose
    } = useDisclosure()

    const {
        isOpen: verifyIsOpen,
        onOpen: verifyOnOpen,
        onClose: verifyOnClose
    } = useDisclosure()

    const fetchTransactionByName = async () => {
        try {
            const response = await axiosInstance.get('/transactions/name', {
                params: {
                    transaction_name: params.transaction_name
                }
            })

            setTransaction(response.data.data)
            setTransactionItems(response.data.data.TransactionItems)
            setPaymentStatus(response.data.data.PaymentStatusId)
            setTransactionAddress(response.data.data.Address)
            setCourir(response.data.data.courir_duration.split("at")[0])
            setShippingDate(response.data.data.courir_duration.split("at")[1])

            if (transaction.payment_method === "Mandiri Virtual Account") {
                setVirtualAccount("8870885771380486")
            } else if (transaction.payment_method === "BCA Virtual Account") {
                setVirtualAccount("8870810222728301")
            } else if (transaction.payment_method === "BNI Virtual Account") {
                setVirtualAccount("8870810222743225")
            }

        } catch (err) {
            console.log(err)
        }
    }

    const copyVirtualAccountNumber = () => {
        toast({
            title: 'Virtual Account Number has been copied.',
            status: 'info',
        })
        navigator.clipboard.writeText(virtualAccount)()
    }

    const copyTotalPayment = () => {
        toast({
            title: 'Total Payment has been copied.',
            status: 'info',
        })
        navigator.clipboard.writeText(transaction.total_price)()
    }

    const selectedImage = () => {
        formikUpload.setFieldValue("payment_proof", null)
        setSelectImage(null)
        setUploadImage(false)
    }

    const formikUpload = useFormik({
        initialValues: {
            payment_proof: null,
        },
        onSubmit: async ({ payment_proof }) => {
            try {
                const newPaymentProof = new FormData()

                if (payment_proof) {
                    newPaymentProof.append("payment_proof", payment_proof)
                }

                await axiosInstance.post(`/transactions/payment-proof/${params.transaction_name}`, newPaymentProof)

                formikUpload.setFieldValue("payment_proof", null)

                toast({
                    title: "Payment Confirmed",
                    status: "success",
                })

            } catch (err) {
                console.log(err)
                toast({
                    title: "Failed confirmed payment",
                    description: err.response.data.message,
                    status: "error",
                })
            }
        }
    })

    const paymentExpired = async () => {
        try {
            await axiosInstance.patch(`/transactions/payment-expired/${params.transaction_name}`)
        } catch (err) {
            console.log(err)
        }
    }

    const paymentConfirmationOpen = () => {
        if (uploadImage === false) {
            toast({
                title: "there is some incompletion please fix it first",
                status: "error",
            })
            setUploaderror(true)
        } else {
            confirmOnOpen()
        }
    }

    const confirmPayment = () => {
        formikUpload.handleSubmit()
        setSelectImage(null)
        setUploadImage(false)
        confirmOnClose()
    }

    const doubleOnClick = () => {
        toast({
            title: "Successfully Uploaded Payment Proof",
            status: "success",
            // position: "top",
        })
        paymentOnClose()
        setUploadImage(true)
        setUploaderror(false)
    }

    const renderTransactionItems = () => {
        return transactionItems.map((val) => {
            return (
                <>
                    <Box display={'flex'} justifyContent={'space-between'} m={'10px 0px 2px'} >
                        <Text
                            fontSize={'14px'}
                            color={'#000000B3'}
                            fontFamily={"Open Sauce One, sans-serif"}
                            fontWeight={'bold'}
                            whiteSpace={"nowrap"}
                            overflow={"hidden"}
                            textOverflow={"ellipsis"}
                            width={"280px"}
                        >
                            {val.Product.product_name}
                        </Text>
                        <Text
                            fontSize={'14px'}
                            color={'#000000B3'}
                            fontFamily={"Open Sauce One, sans-serif"}
                        >
                            {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                            }).format(val.price_per_item * val.quantity).split(",")[0]}
                        </Text>
                    </Box>
                    <Text
                        fontSize={'14px'}
                        color={'#000000B3'}
                        fontFamily={"Open Sauce One, sans-serif"}
                    >
                        {val.quantity} X {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                        }).format(val.price_per_item).split(",")[0]}
                    </Text>
                </>
            )
        })
    }

    const dateNow = moment().format("YYYY-MM-DD HH:mm:ss")
    const compareExp = moment(transaction.payment_expired_date).unix()//1671286238
    const compareCur = moment(dateNow).unix()//1671157357

    const countDown = (compareExp - compareCur)

    let day = moment.unix(countDown + 61199)

    const countDownTimerX = day.format("HH:mm:ss")

    const openAlert = () => {
        expOnOpen()
    }

    const openVerify = () => {
        verifyOnOpen()
    }

    useEffect(() => {
        if (paymentStatus === 2) {
            openVerify()
        } else if (paymentStatus === 3 || paymentStatus === 5) {
            navigate('/transaction-list')
        } else if (paymentStatus === 4) {
            openAlert()
        } else if (compareCur > compareExp && paymentStatus === 1) {
            paymentExpired()
            openAlert()
        }
        fetchTransactionByName()
    }, [transaction, paymentStatus])

    return (
        <>
            <Box display={{ lg: 'inline', base: 'none' }} >
                <Box mt={'100px'} h={'550px'} >
                <Box
                width={"1070px"}
                h={"66px"}
                m={"0px 231.5px"}
                p={"40px 20px 0px"}
                mx={"auto"}
                mt={"5px"}
              >
                <Text
                  fontSize={"20px"}
                  color="#111"
                  fontWeight={"700"}
                  fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                >
                  Payment Evidence
                </Text>
              </Box>
                    <Box h={'390px'} w={'598px'} border={'1px solid rgb(232, 232, 232)'} mx={'auto'} mt={'35px'} borderRadius={'25px'}>
                        <Box  alignItems={'center'} justifyContent={'space-between'} p={'16px'} borderBottom={'0.5px solid rgb(232, 232, 232)'}  >

                        <Text
                                textAlign={'center'}
                                fontSize={'16px'}
                                color={'#31353BF5'}
                                fontFamily={"Open Sauce One, sans-serif"}
                                fontWeight={'bold'}

                            >
                              Finish Your Payment Within
                        </Text>

                        <Text
                                textAlign={'center'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                fontSize={'16px'}
                                m={'8px 0px 10px'}
                                lineHeight={'20px'}
                                letterSpacing={'0px'}
                                fontWeight={700}
                                color={'#0058a3'}

                            >
                              {countDownTimerX}
                        </Text>

                        <Text
                                textAlign={'center'}
                                fontSize={'16px'}
                                color={'#31353BAD'}
                                m={'0px 0px 5px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                fontWeight={400}
                                lineHeight={'20px'}
                                letterSpacing={'0px'}

                            >
                               Payment Deadline
                        </Text>

                        <Text
                                textAlign={'center'}
                                fontSize={'16px'}
                                color={'#31353BF5'}
                                fontFamily={"Open Sauce One, sans-serif"}
                                fontWeight={'bold'}

                            >
                               {moment(transaction.payment_expired_date).format("dddd, DD MMMM YYYY HH:mm")}
                        </Text>
                            

                        </Box>
                        <Box display={'flex'} alignItems={'center'} p={'15px'} borderBottom={'0.5px solid rgb(232, 232, 232)'} >
                            
                        <Text
                                fontSize={'16px'}
                                color={'#31353BF5'}
                                fontFamily={"Open Sauce One, sans-serif"}
                                fontWeight={'bold'}
                                mt={'10px'}

                            >
                                {transaction.payment_method}
                        </Text>
                            <Box ml={'10px'} mt={'8px'}>
                           {transaction.payment_method === "Mandiri Virtual Account" ? (
                                <Image h={'19.63px'} w={'59px'} src={mandiri} />
                            ) : null}

                            {transaction.payment_method === "BNI Virtual Account" ? (
                                <Image h={'19.63px'} w={'55px'} src={BNI} />
                            ) : null}

                            {transaction.payment_method === "BCA Virtual Account" ? (
                                <Image h={'19.63px'} w={'59px'} src={BCA} />
                            ) : null}
                            </Box>
                        </Box>
                        <Box w={'598px'} h={'185.56px'} p={'16px'}>
                            <Box h={'76.78px'} p={'16px 0px'}>
                                <Text
                                    fontSize={'14px'}
                                    color={'#000000B3'}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                >
                                    Virtual Account Number
                                </Text>
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <Text
                                        fontSize={'18px'}
                                        color={'#31353BF5'}
                                        margin={'5px 0px 0px'}
                                        fontWeight={700}
                                        lineHeight={'1.15'}
                                        fontFamily={"Open Sauce One, sans-serif"}
                                    >
                                        {virtualAccount}
                                    </Text>
                                    <Box display={'flex'} flexDir={'row'} color={'#0058a3'} onClick={copyVirtualAccountNumber} cursor={'pointer'} >
                                        <Text
                                            fontSize={'16px'}
                                            fontFamily={"Open Sauce One, sans-serif"}
                                            fontWeight={700}
                                            cursor={'pointer'}
                                            color={'#0058a3'}
                                        >
                                            Copy
                                        </Text>
                                        <CgCopy style={{ paddingLeft: '0px 0px 0px 4px', fontSize: '18px', marginTop: '4px' }} />
                                    </Box>
                                </Box>
                            </Box>
                            <Box p={'16px 0px'} h={'76.78px'}>
                                <Text
                                    fontSize={'14px'}
                                    color={'#000000B3'}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                >
                                    Total Payment
                                </Text>
                                <Box display={'flex'} justifyContent={'space-between'}>
                                    <Box display={'flex'} flexDir={'row'}>
                                        <Text
                                            fontSize={'18px'}
                                            color={'#31353BF5'}
                                            margin={'5px 0px 0px'}
                                            fontWeight={700}
                                            lineHeight={'1.15'}
                                            fontFamily={"Open Sauce One, sans-serif"}
                                        >
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(transaction.total_price).split(",")[0]}
                                        </Text>
                                        <CgCopy style={{ color: '#0058a3', paddingLeft: '0px 0px 0px 4px', fontSize: '18px', marginTop: '4px' }} onClick={copyTotalPayment} cursor={'pointer'} />
                                    </Box>

                                    <Text
                                        fontSize={'16px'}
                                        fontFamily={"Open Sauce One, sans-serif"}
                                        fontWeight={700}
                                        cursor={'pointer'}
                                        color={'#0058a3'}
                                        onClick={() => onOpen()}
                                    >
                                        See Details
                                    </Text>
                                </Box>
                            </Box>
                        </Box>
                        <Box
                            w={'600px'}
                            h={'112px'}
                            p={'32px 0px 40px'}
                            display={'flex'}
                            justifyContent={'space-between'}
                            borderRadius={'8px'}
                        >
                            <Box>
                                <Button
                                    fontWeight={700}
                                    lineHeight={'20px'}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    fontSize={'14px'}
                                    w={'292.55px'}
                                    h={'40px'}
                                    bgColor={'#fff'}
                                    color={'#0058a3'}
                                    _hover={'none'}
                                    border={'1px solid #0058a3'}
                                    borderRadius={'25px'}
                                    onClick={() => paymentOnOpen()}
                                >
                                    {uploadImage === true ? formikUpload?.values?.payment_proof?.name : " Upload Payment Proof"}
                                </Button>
                                {uploadError === true ?
                                    <Text fontSize={'12px'} lineHeight={'1.4'} color={'#D6001C'} fontFamily={'Open Sauce One, sans-serif'} marginTop={'6px'}>
                                        Payment proof is required*
                                    </Text>
                                    : null}
                            </Box>
                            <Button
                                fontWeight={700}
                                lineHeight={'20px'}
                                fontFamily={"Open Sauce One, sans-serif"}
                                fontSize={'14px'}
                                w={'291.45px'}
                                h={'40px'}
                                color={'#fff'}
                                bgColor={'#0058a3'}
                                borderRadius={'25px'}
                                onClick={paymentConfirmationOpen}
                                _hover={{
                                    bgColor: '#0370A2'
                                }}
                                _active={{
                                    bgColor: '#0370A2'
                                }}
                            >
                                Confirm Payment
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Modal Detail Transaction */}
            <ModalDetailTransaction
                isOpen={isOpen}
                onClose={onClose}
                transaction={transaction}
                renderTransactionItems={renderTransactionItems}
                transactionAddress={transactionAddress}
                shippingDate={shippingDate}
                courir={courir}
            />

            {/* Modal For Payment Proof */}
            <ModalUploadPaymentProof
                paymentIsOpen={paymentIsOpen}
                paymentOnOpen={paymentOnOpen}
                paymentOnClose={paymentOnClose}
                selectImage={selectImage}
                // uploadPH={uploadPH}
                formikUpload={formikUpload}
                inputFileRef={inputFileRef}
                IoAlertCircleSharp={IoAlertCircleSharp}
                doubleOnClick={doubleOnClick}
                selectedImage={selectedImage}
                setSelectImage={setSelectImage}
            />

            {/* alert Dialog For Payment Expired */}
            <AlertDialogPaymentExpired
                expIsOpen={expIsOpen}
                expOnOpen={expOnOpen}
                expOnClose={expOnClose}
                onClose={onClose}
            />

            {/* alert Dialog For Payment Confirmation */}

            <AlertDialogConfirmation
                confirmIsOpen={confirmIsOpen}
                confirmOnOpen={confirmOnOpen}
                confirmOnClose={confirmOnClose}
                confirmPayment={confirmPayment}
            />

            {/* alert Dialog For Verify Payment */}
            <AlertDialogVerify
                verifyIsOpen={verifyIsOpen}
                verifyOnOpen={verifyOnOpen}
                verifyOnClose={verifyOnClose}
                // payment={payment}
            />
        </>
    )
}

export default PaymentProof