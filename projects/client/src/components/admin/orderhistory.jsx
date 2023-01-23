import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
} from '@chakra-ui/react';
import OrderRender from './orderrender';

const OrderHistory = ({ transactionItems, isOpen, onClose }) => {
  const renderOrder = () => {
    return transactionItems.map((val) => {
      return (
        <OrderRender
          key={val.id.toString()}
          product_name={val.Product.product_name}
          image_url={val.Product.Image_Urls[0].image_url}
          quantity={val.quantity}
          price={val.Product.price}
        />
      );
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent maxH="50%" overflowY="scroll">
        <Box position="fixed">
          <ModalHeader bgColor="white" w="448px">
            <Text fontSize="25px">Order List</Text>
          </ModalHeader>
          <ModalCloseButton />
        </Box>
        <ModalBody mt="50px">{renderOrder()}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderHistory;
