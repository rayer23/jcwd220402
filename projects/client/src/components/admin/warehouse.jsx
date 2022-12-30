import { Tr, Td, Button } from '@chakra-ui/react';
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
            <FiEdit size={"30"}/>
          </Button>
          <Button
            onClick={DeleteBtnHandler}
            bgColor="#FF0000"
            _hover={false}
            width="50px"
            color="white"
            marginTop="5px"
          >
            <RiDeleteBin2Line size={"30"}/>
          </Button>
        </Td>
      </Tr>
    </>
  );
};

export default Warehouse;
