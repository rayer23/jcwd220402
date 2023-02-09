import {
    Box,
    Button,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    Center,
} from "@chakra-ui/react"
import { IoAlertCircleSharp } from "react-icons/io5"

const ModalCancelTransaction = ({
    cancelPaidTransaction,
    transactionItems,
    moment,
    formChangeHandler,
    cancelReason,
    MdKeyboardArrowDown,
    reason,
    inputText,
    cancelIsOpen,
    cancelOnOpen,
    cancelOnClose,
    closeCancelBtn,
    paymentDate,
    transactionName,
    changeOrderBtnHandler,
    changeShippingBtnHandler,
    setCancelReason,
    changeOtherReasonBtnHandler,
    setInformationOrder,
    informationOrder,
    setInformationShipping,
    informationShipping,
}) => {
    const renderTransactionItems = () => {
        return transactionItems.map((val) => {
            return (
                <Box
                    display={"flex"}
                    justifyContent={"flex-start"}
                    flexDir={"row"}
                    mb={"12px"}
                >
                    <Image
                        borderRadius={"6px"}
                        src={val.Product.Image_Urls[0].image_url}
                        minW={"56px"}
                        maxH={"56px"}
                    />
                    <Box display={"flex"} flexDir={"column"} pl={"16px"}>
                        <Text
                            color={"#31353B"}
                            fontSize={"14px"}
                            fontFamily={
                                "Open Sauce One, Nunito Sans, -apple-system, sans-serif"
                            }
                            mb={"6px"}
                            fontWeight={700}
                            lineHeight={"18px"}
                        >
                            {val.Product.product_name}
                        </Text>
                        <Text
                            fontSize={"12px"}
                            fontFamily={"Open Sauce One, sans-serif"}
                            mb={"4px"}
                            color={"#31353B"}
                            lineHeight={"14px"}
                        >
                            {
                                new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                })
                                    .format(val.price_per_item)
                                    .split(",")[0]
                            }
                        </Text>
                    </Box>
                </Box>
            )
        })
    }

    return (
        <Modal
            isOpen={cancelIsOpen}
            onOpen={cancelOnOpen}
            onClose={cancelOnClose}
            closeOnEsc={false}
        >
            <ModalOverlay />
            <ModalContent mt={"120px"} maxW={"560px"} borderRadius={"8px"}>
                <ModalHeader
                    borderBottom={"1px solid #e5e7e9"}
                    pt={"32px"}
                    pb={"16px"}
                >
                    <Box>
                        <Text
                            color={"31353BF5"}
                            fontSize={"20px"}
                            fontWeight={700}
                            lineHeight={"26px"}
                            letterSpacing={"-0.1px"}
                            fontFamily={
                                "Open Sauce One, Nunito Sans, -apple-system, sans-serif"
                            }
                            textAlign={"center"}
                        >
                            Cancel Transaction
                        </Text>
                    </Box>
                </ModalHeader>
                <ModalCloseButton onClick={closeCancelBtn} />
                <ModalBody
                    p={"20px 32px 32px 32px"}
                    overflow={"auto"}
                    maxH={"530px"}
                >
                    <Box mb={"16px"}>
                        <Text
                            color={"#31353BAD"}
                            fontSize={"12px"}
                            fontFamily={"Open Sauce One, sans-serif"}
                            lineHeight={"18px"}
                        >
                            {`INV / ${moment(paymentDate).format(
                                "YYYYMMDD"
                            )} / ${transactionName}`}
                        </Text>
                    </Box>
                    <Box
                        mb={"24px"}
                        pb={"14px"}
                        borderBottom={"thin dashed rgb(229, 231, 233)"}
                    >
                        {renderTransactionItems()}
                    </Box>

                    <Center>
                    <Button
                        w={"70%"}
                        justifyContent={'center'}
                        alignItems={'center'}
                        textAlign={'center'}
                        alignContent={'center'}
                        borderRadius={'25px'}
                        mt={"10px"}
                        bgColor={"#0058a3"}
                        _hover={{
                            bgColor: "#0370A2",
                        }}
                        _active={{
                            bgColor: "#0370A2",
                        }}
                        color={"#fff"}
                        h={"48px"}
                        fontSize={"16px"}
                        fontFamily={"Open Sauce One, sans-serif"}
                        fontWeight={600}
                        lineHeight={"22px"}
                        onClick={cancelPaidTransaction}
                        
                    >
                        Click For Cancellation
                    </Button>
                    </Center>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalCancelTransaction
