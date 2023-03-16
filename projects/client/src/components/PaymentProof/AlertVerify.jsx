import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogOverlay, Box, Button, Image, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const AlertDialogVerify = ({ verifyIsOpen, verifyOnOpen, verifyOnClose, payment }) => {

    return (
        <AlertDialog isCentered closeOnOverlayClick={false} isOpen={verifyIsOpen} onOpen={verifyOnOpen} onClose={verifyOnClose} size={"sm"}
            closeOnEsc={false}
        >
            <AlertDialogOverlay
                bg="blackAlpha.700"
                backdropFilter='blur(50px) hue-rotate(90deg)'
            >
                <AlertDialogContent
                    w={'400px'}
                    borderRadius={'30px'}
                    mt={'50px'}
                >
                    <AlertDialogBody>
                        <Text
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            fontSize="lg" fontWeight="500" color={'#0058a3'} pt={'25px'} textAlign={'center'}
                        >
                            Your payment is being processed. Thankyou for completing your payment!!
                        </Text>
                        <Image
                            src={payment}
                            w={'200px'}
                            mx={'auto'}
                            pb={'10px'}
                            pt={'10px'}
                        />
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-evenly'}
                            alignItems={'center'}
                            boxSizing={'border-box'}
                            gap={3}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                        >
                            <Link to={'/'}>
                                <Button
                                    borderRadius={'20px'}
                                    mt={'16px'}
                                    width={'170px'}
                                    colorScheme="blue"
                                    fontSize={'14px'}
                                    color={'#fff'}
                                    bgColor={'#0058a3'}
                                    _active={{
                                        bgColor: '#0370A2'
                                    }}
                                >
                                    Back To Home
                                </Button>
                            </Link>
                            <Link to={'/transaction-list'}>
                                <Button
                                    fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                    borderRadius={'20px'}
                                    mt={'16px'}
                                    width={'170px'}
                                    bgColor={'#fff'}
                                    color={'#0058a3'}
                                    fontSize={'14px'}
                                    border={'1px solid #0058a3'}
                                >
                                    See Transaction List
                                </Button>
                            </Link>
                        </Box>
                    </AlertDialogBody>

                    <AlertDialogFooter pb={'5px'}>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default AlertDialogVerify
