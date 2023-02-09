import { Box, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react"
import { GoPackage } from "react-icons/go"
import { Ri24HoursFill } from "react-icons/ri"

const ModalFinishTransaction = ({ doneIsOpen, doneOnOpen, doneOnClose, finishOrderBtn }) => {

    return (
        <Modal
            isOpen={doneIsOpen}
            onOpen={doneOnOpen}
            onClose={doneOnClose}
            closeOnEsc={false}
        >
            <ModalOverlay />
            <ModalContent
                borderRadius={"15px"}
                maxW={"480px"}
                mt={"220px"}
                boxShadow={"0 1px 6px 0 rgba(49,53,59,0.12)"}
                p={"32px"}
            >
                <ModalCloseButton />
                <ModalBody p={"0px"}>
                    <Box>
                        <Text
                            color={"#0058a3"}
                            fontSize={"20px"}
                            fontFamily={
                                "Open Sauce One, Nunito Sans, -apple-system, sans-serif"
                            }
                            mb={"16px"}
                            fontWeight={700}
                            lineHeight={"26px"}
                            letterSpacing={"-0.1px"}
                            textAlign={"center"}
                        >
                            Finish your order?
                        </Text>
                        <Text
                            fontSize={"14px"}
                            fontFamily={
                                "Open Sauce One, Nunito Sans, -apple-system, sans-serif"
                            }
                            color={"#31353BAD"}
                            m={"14px 0px"}
                            fontWeight={400}
                            lineHeight={"20px"}
                            letterSpacing={"0px"}
                            textAlign={"center"}
                        >
                            Make sure you've already received your products
                            that you've ordered. Thankyou for buying furniture
                            at Delisha and enjoy your choosen furniture!
                        </Text>
                    </Box>
                    <Box
                        display={"flex"}
                        justifyContent={"flex-start"}
                        flexDir={"row"}
                        mb={"16px"}
                    >
                    </Box>
                    <Box
                        display={"flex"}
                        justifyContent={"flex-start"}
                        flexDir={"row"}
                        mb={"16px"}
                    >
                    </Box>
                    <Box
                        display={"flex"}
                        justifyContent={"flex-start"}
                        flexDir={"row"}
                        mt={"30px"}
                    >
                        <Button
                            m={"0px 10px 0px 0px"}
                            p={"0px 16px"}
                            w={"230.56px"}
                            h={"40px"}
                            bgColor={"#fff"}
                            borderRadius={'25px'}
                            border={"1px solid #0058a3"}
                            _hover={"none"}
                            color={'#0058a3'}
                            onClick={() => doneOnClose()}
                        >
                            Cancel
                        </Button>
                        <Button
                            borderRadius={"25px"}
                            w={"230.56px"}
                            h={"40px"}
                            m={"0px 10px 0px 0px"}
                            p={"0px 16px"}
                            bgColor={"#0058a3"}
                            _hover={{
                                bgColor: "#0370A2",
                            }}
                            _active={{
                                bgColor: "#0370A2",
                            }}
                            color={"#fff"}
                            onClick={finishOrderBtn}
                        >
                            Finish
                        </Button>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
export default ModalFinishTransaction
