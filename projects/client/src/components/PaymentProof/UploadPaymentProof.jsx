import { Box, Button, FormControl, FormErrorMessage, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react"
// import { GoPrimitiveDot } from "react-icons/go"

const ModalUploadPaymentProof = ({ doubleOnClick, selectedImage, setSelectImage, paymentIsOpen, paymentOnOpen, paymentOnClose, selectImage, uploadPH, formikUpload, inputFileRef, IoAlertCircleSharp }) => {

    return (
        <Modal isOpen={paymentIsOpen} onOpen={paymentOnOpen} onClose={paymentOnClose}>
            <ModalOverlay />
            <ModalContent mt={{ lg: selectImage ? '100px' : '145px', base: selectImage ? '60px' : '105px' }} w={'550px'} borderRadius={'10px'}>
                <ModalCloseButton />
                <ModalBody pt={'25px'} pb={'32px'} pr={'25px'} pl={'25px'} mt={'10px'}>
                    <Box>
                        <Text
                            fontSize={'20px'}
                            color={'#31353BF5'}
                            m={'0px 0px 16px'}
                            fontFamily={"Open Sauce One, Nunito Sans, -apple-system, sans-serif"}
                            fontWeight={700}
                            lineHeight={'26px'}
                            letterSpacing={'-0.1px'}
                            textAlign={'center'}
                        >
                            Upload Your Payment Proof
                        </Text>
                        <Box
                            m={'8px 0px'}
                            p={'8px 25px'}
                            bgColor={'#fff'}
                            borderRadius={'10px'}
                            display={'flex'}
                            flexDir={'row'}
                            justifyContent={'center'}
                        >
                            <IoAlertCircleSharp style={{ color: '#F7931E', fontSize: '30px', marginLeft: '-5px' }} />
                            <Text
                                pl={'15px'}
                                fontSize={'13px'}
                                lineHeight={'16px'}
                                fontWeight={'unset'}
                                m={'0px'}
                                fontFamily={"Open Sauce One, sans-serif"}
                                color={'#31353BAD'}
                            >
                                Upload payment proof as payment verification before proceeding to the next phase
                            </Text>
                        </Box>

                        <Box
                            mt={'20px'}
                            h={'280px'}
                            bgColor={'#E2E2E2'}
                            borderRadius={'8px'}
                            w={'399.06px'}
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            mx={'auto'}
                            p={'32px'}
                            flexDir={'column'}
                        >
                            <Image
                                h={selectImage ? '250px' : '47px'}
                                src={selectImage ? selectImage : uploadPH}
                            />
                            {selectImage ? null : (
                                <Text
                                    m={'16px'}
                                    fontSize={'14px'}
                                    color={'#31353BAD'}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    lineHeight={'1.15'}
                                >
                                    Picture format: .JPG .JPEG, .PNG, max 2 MB
                                </Text>
                            )}
                            <FormControl isInvalid={formikUpload.errors.payment_proof}>
                                <Input
                                    w="100%"
                                    _hover={false}
                                    fontWeight="bold"
                                    bgColor={"white"}
                                    border="1px solid #dfe1e3"
                                    borderRadius={"5px"}
                                    name="payment_proof"
                                    onChange={(event) => {
                                        setSelectImage(
                                            URL.createObjectURL(event.target.files[0])
                                        )
                                        formikUpload.setFieldValue("payment_proof", event.target.files[0]) // btnSubmit(e.target.files[0])
                                    }}
                                    accept="image/*"
                                    type="file"
                                    color="transparent"
                                    ref={inputFileRef}
                                    display="none"
                                />
                                <Button
                                    display={selectImage ? "none" : "flex"}
                                    mx={'auto'}
                                    w={'200px'}
                                    h={'40px'}
                                    bgColor={'#0058a3'}
                                    borderRadius={'20px'}
                                    fontSize={'12px'}
                                    fontFamily={"Open Sauce One, sans-serif"}
                                    color={'#fff'}
                                    fontWeight={700}
                                    lineHeight={'24px'}
                                    onClick={() => inputFileRef.current.click()}
                                    _hover={'none'}
                                    _active={{
                                        bgColor: '#0370A2'
                                    }}
                                >
                                    {selectImage ? null : "Select Picture"}
                                </Button>
                                <FormErrorMessage> {formikUpload.errors.payment_proof}  </FormErrorMessage>
                            </FormControl>
                        </Box>
                        {selectImage ? (
                            <>
                                <Box m={'16px'} >
                                    <Text
                                        fontSize={'14px'}
                                        color={'#31353BAD'}
                                        fontFamily={"Open Sauce One, sans-serif"}
                                        fontWeight={'unset'}
                                        lineHeight={'16px'}
                                        textAlign={'center'}
                                    >
                                        Are you sure you want to select this image as payment proof?
                                    </Text>
                                </Box>
                                <Box display={'flex'} justifyContent={'center'}>
                                    <Button
                                        w={'150px'}
                                        fontSize={'12px'}
                                        color={'#fff'}
                                        fontFamily={"Open Sauce One, sans-serif"}
                                        bgColor={'#0058a3'}
                                        p={'0px 16px'}
                                        onClick={doubleOnClick}
                                        borderRadius={'20px'}
                                        _hover={'none'}
                                        _active={{
                                            bgColor: '#0370A2'
                                        }}
                                    >
                                        Upload This Image
                                    </Button>
                                    <Button
                                        ml={'10px'}
                                         w={'150px'}
                                        fontSize={'12px'}
                                        color={'#E26868'}
                                        fontFamily={"Open Sauce One, sans-serif"}
                                        bgColor={'#fff'}
                                        p={'0px 16px'}
                                        _hover={'none'}
                                        borderRadius={'20px'}
                                        border={'1px solid #E26868'}
                                        onClick={selectedImage}
                                        _active={{
                                            bgColor: '#E2E2E2'
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </>
                        ) : null}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ModalUploadPaymentProof