import { 
    AlertDialog, 
    AlertDialogBody, 
    AlertDialogContent, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogOverlay, 
    Box, 
    Button, 
    Text } from "@chakra-ui/react"

const AlertDialogDeleteCartItem = ({ 
    isOpen, 
    onClose, 
    confirmDeleteBtnHandler }) => {

    return (
        <AlertDialog isCentered isOpen={isOpen} onClose={onClose} closeOnEsc={false}>
            <AlertDialogOverlay
                bg="blackAlpha.400"
            >
                <AlertDialogContent
                    boxShadow={'dark-lg'}
                    borderRadius={"25px"} mt={"-120px"} 
                >
                    <AlertDialogHeader
                        fontSize="lg"
                        fontWeight="bold"
                        color={"#111"}
                        pt={"20px"}
                    >
                        Remove items?
                    </AlertDialogHeader>

                    <AlertDialogBody
                        fontSize={'17px'}
                        fontWeight={'400px'}
                        fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                        letterSpacing={'0px'}
                        line-height={'22px'}
                        m={'0px 0px 15px'}
                        p={'0px'}
                        color={'#31353BAD'}
                        textAlign={'center'}
                    >
                        <Text
                            pb={"15px"}
                            fontFamily={
                              "Open Sauce One, Nunito Sans, -apple-system, sans-serif"
                            }
                            fontWeight={550}
                        >
                            The selected items will be removed from your cart
                        </Text>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            alignItems={'center'}
                            boxSizing={'border-box'}
                            justifyContent={'space-evenly'}
                            gap={3}
                        >
                            <Button
                                bgColor={'#0058a3'}
                                onClick={confirmDeleteBtnHandler}
                                borderRadius={"20px"}
                                mt={"10px"}
                                width={"190px"}
                                color="white"
                                _hover={'none'}
                                _active={{ bgColor: "#165877" }} 
                            >
                                Yes, Remove it!
                            </Button>
                            <Button
                                onClick={onClose}
                                bgColor={'#fff'}
                                border={"1px solid #0058a3"}
                                color={'#0058a3'}
                                p={'0px 16px'}
                                width={'190px'}
                                _hover={'none'}
                                borderRadius={'30px'}
                                mt={'10px'}

                            >
                                Cancel
                            </Button>
                        </Box>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default AlertDialogDeleteCartItem