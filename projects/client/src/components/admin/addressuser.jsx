import {
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
  } from "@chakra-ui/react"
  
  const AddressModal = ({ header, isOpen, onClose, color, val }) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
        size={"3xl"}
      >
        <ModalOverlay />
        <ModalContent mt={"120px"} borderRadius="8px" overflow={false}>
          <ModalHeader
            fontSize={"24px"}
            fontWeight="bold"
            textAlign={"center"}
            borderBottom="1px solid #dfe1e3"
            p="0"
            h="36px"
          >
            <Text m="24px 0 16px">{header}</Text>
          </ModalHeader>
          <ModalCloseButton _hover={false} mt="10px" />
  
          <ModalBody
            overflowY={"scroll"}
            maxH="529px"
            p="24px 40px"
            fontSize={"14px"}
          >
            <Box mt="-10px" mb="4px">
              {val === null ? <Text>The address is null</Text> : val}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }
  
  export default AddressModal
  