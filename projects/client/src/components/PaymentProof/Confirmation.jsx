import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogOverlay, Box, Button, Image, Text } from "@chakra-ui/react"

const AlertDialogConfirmation = ({ confirmIsOpen, confirmOnOpen, confirmOnClose, confirmPayment }) => {

    return (
        <AlertDialog isCentered closeOnOverlayClick={false} isOpen={confirmIsOpen} onOpen={confirmOnOpen} onClose={confirmOnClose} size={"sm"}
            closeOnEsc={false}
        >
            <AlertDialogOverlay
                bg="blackAlpha.700"
            >
                <AlertDialogContent
                    mt={'-10px'} w={'400px'} h={'197.5px'} borderRadius={'20px'}
                >
                    <AlertDialogBody p={'32px 32px 24px'}>
                        <Box display={'flex'} flexDir={'column'} alignItems={'center'} alignContent={'center'}>
                            <Text
                                color={'#31353BF5'}
                                fontSize={'24px'}
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                mb={'14px'}
                                fontWeight={700}
                                lineHeight={'28px'}
                                letterSpacing={'-0,2px'}
                                textAlign={'center'}
                            >
                                Payment Confirmation!!!
                            </Text>
                            <Text
                                fontSize={'14px'}
                                fontFamily={'Open Sauce One, sans-serif'}
                                // mb={'14px'}
                                color={'#0000008A'}
                                lineHeight={'1.15'}
                            >
                                Click OK to finish your payment process
                            </Text>
                        </Box>
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-evenly'}
                            alignItems={'center'}
                            boxSizing={'border-box'}
                            gap={3}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                        >
                            <Button
                                borderRadius={'20px'}
                                mt={'16px'}
                                width={'150px'}
                                colorScheme="blue"
                                onClick={confirmPayment}
                                fontSize={'14px'}
                                color={'#fff'}
                                bgColor={'#0058a3'}
                                border={'1px solid #0370A2'}
                                _active={{
                                    bgColor: '#0370A2'
                                }}
                            >
                                OK
                            </Button>
                            <Button
                                fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                                borderRadius={'20px'}
                                mt={'16px'}
                                width={'150px'}
                                bgColor={'#fff'}
                                color={'#E26868'}
                                onClick={() => confirmOnClose()}
                                fontSize={'14px'}
                                border={'1px solid #E26868'}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </AlertDialogBody>

                    <AlertDialogFooter pb={'5px'}>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}
export default AlertDialogConfirmation