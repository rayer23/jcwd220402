import { Box, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const AddressCard = ({
  address_labels,
  recipients_name,
  full_address,
  phone_number,
  id,
  on_delete,
  on_edit,
  on_default,
  is_default,
}) => {
  return (
    <>
      {is_default == true ? (
        <>
          <Box
            boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
            borderRadius="10px"
            m="16px 4px 4px"
            p="16px 24px"
            fontWeight={'bold'}
            color="black"
            fontSize={'14px'}
            // bgColor="#dfe1e3"
            border={'1px solid #0095DA'}
          >
            <Box w="6.5px" h="35px" ml="-25px" borderRightRadius={'5px'} />
            <Text mt="-35px">{address_labels}</Text>
            <Text>{recipients_name}</Text>
            <Text mt="4px" fontWeight={'normal'}>
              {phone_number}
            </Text>
            <Text fontWeight={'normal'}>{full_address}</Text>
            <Box display={'flex'}>
              <Link>
                <Text
                  mt="16px"
                  fontSize={'12px'}
                  color={'#0095DA'}
                  onClick={on_edit}
                >
                  Change Address
                </Text>
              </Link>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
          borderRadius="10px"
          m="16px 4px 4px"
          p="16px 24px"
          fontWeight={'bold'}
          color="black"
          fontSize={'14px'}
        >
          <Box w="6.5px" h="35px" ml="-25px" borderRightRadius={'5px'} />
          <Text mt="-35px">{address_labels}</Text>
          <Text>{recipients_name}</Text>
          <Text mt="4px" fontWeight={'normal'}>
            {phone_number}
          </Text>
          <Text fontWeight={'normal'}>{full_address}</Text>
          <Box display={'flex'}>
            <Link>
              <Text
                mt="16px"
                fontSize={'12px'}
                color={'#0095DA'}
                onClick={on_edit}
              >
                Change Address
              </Text>
            </Link>
            <Link>
              <Text
                mt="16px"
                fontSize={'12px'}
                color={'#0095DA'}
                
                borderLeft={'1px solid #dfe1e3'}
                pr="12px"
                mr="12px"
                ml="12px"
                pl="12px"
                onClick={on_default}
              >
                Make Address Primary
              </Text>
            </Link>
          </Box>
        </Box>
      )}
    </>
  );
};

export default AddressCard;
