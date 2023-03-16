import {
  Tr,
  Td,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin2Line } from 'react-icons/ri';

const Warehouse = ({
  id,
  warehouse_name,
  full_address,
  address_labels,
  province,
  city,
  districts,
  username,
  latitude,
  longitude,
  onEdit,
  onDelete,
  
}) => {
  const DeleteBtnHandler = () => {
    onDelete();
  };

  const editBtnHandler = () => {
    onEdit();
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tr>
        <Td>{id}</Td>
        <Td>{warehouse_name}</Td>
        <Td>{username ? username : 'Not assigned'}</Td>
        <Td>{full_address}</Td>
        <Td>{province}</Td>
        <Td>{city}</Td>
        <Td>{districts}</Td>
        {/* <Td>{latitude}</Td>
        <Td>{longitude}</Td> */}
        <Td>
          <Button
            onClick={editBtnHandler}
            bgColor="#0095DA"
            marginRight="5px"
            _hover={false}
            width="50px"
            color="white"
          >
            <FiEdit size={'30'} />
          </Button>
          <Button
            onClick={() => onOpen()}
            bgColor="#FF0000"
            _hover={false}
            width="50px"
            color="white"
            marginTop="5px"
          >
            <RiDeleteBin2Line size={'30'} />
          </Button>
        </Td>
      </Tr>
      <AlertDialog
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        closeOnEsc={false}
      >
        <AlertDialogOverlay bg="blackAlpha.400">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Warehouse
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure want to delete {warehouse_name}? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={onClose}
                bgColor={'#0095DA'}
                color={'#fff'}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={DeleteBtnHandler}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Warehouse;
