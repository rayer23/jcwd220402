import {
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AddressCard from './addresscard';
import FormAddress from '../profile/FormAddress';
import Alert from '../alert';
import EditForm from '../profile/EditForm';

const ChangeAddress = ({ defaultAddressUser }) => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const {
    onOpen: onOpenAddNewAddress,
    isOpen: isOpenAddNewAddress,
    onClose: onCloseAddNewAddress,
  } = useDisclosure();

  const {
    onOpen: onOpenAlertAddNewAddress,
    isOpen: isOpenAlertAddNewAddress,
    onClose: onCloseAlertAddNewAddress,
  } = useDisclosure();

  const {
    onOpen: onOpenAlert,
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();

  const cancelRef = React.useRef();
  const toast = useToast();
  const [address, setAddress] = useState([]);
  const [allAddress, setAllAddress] = useState([]);
  const [selectedNewProvince, setSelectedNewProvince] = useState(0);
  const [selectedNewCity, setSelectedNewCity] = useState(0);
  const [selectedEditProvince, setSelectedEditProvince] = useState(0);
  const [selectedEditCity, setSelectedEditCity] = useState(0);
  const [openedEdit, setOpenedEdit] = useState(null);
  const [currentSearch, setCurrentSearch] = useState('');
  const [defaultAddressId, setDefaultAddressId] = useState(0);
  const [refreshAddress, setRefreshAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  defaultAddressUser(defaultAddressId);

  const fetchAddress = async () => {
    try {
      const response = await axiosInstance.get(
        '/checkoutAddress/defaultAddress',
      );
      setAddress(response.data.data);
      setDefaultAddressId(response.data.data.id);
      setIsLoading(true);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchAllAddress = async () => {
    try {
      const response = await axiosInstance.get('/checkoutAddress/allAddress', {
        params: {
          recipients_name: currentSearch,
          full_address: currentSearch,
        },
      });
      setAllAddress(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const refreshPage = () => {
    window.location.reload(false);
  };

  const onCloseAddressModal = () => {
    if (refreshAddress === false) {
      onClose();
    }
    if (refreshAddress === true) {
      refreshPage();
    }
  };

  const setAsDefault = async (id) => {
    try {
      const response = await axiosInstance.patch(`/address/setDefault/${id}`);

      toast({
        message: 'Address set as default',
        description: response.data.message,
        status: 'success',
      });
      fetchAllAddress();
      fetchAddress();
      setRefreshAddress(true);
    } catch (error) {
      console.log(error.response);
      toast({
        message: 'Fail to set default',
        description: error.response.data.message,
        status: 'error',
      });
    }
  };

  const formikAddNewAddress = useFormik({
    initialValues: {
      recipients_name: '',
      phone_number: '',
      address_labels: '',
      province: '',
      city: '',
      districts: '',
      full_address: '',
    },
    onSubmit: async ({
      recipients_name,
      phone_number,
      address_labels,
      districts,
      full_address,
    }) => {
      try {
        const response = await axiosInstance.post('/address/addNewAddress', {
          recipients_name,
          phone_number,
          address_labels,
          province: selectedNewProvince,
          city: selectedNewCity,
          districts,
          full_address,
        });
        toast({
          title: 'Success to add new adderess',
          description: response.data.message,
          status: 'success',
        });

        formikAddNewAddress.setFieldValue('recipients_name', '');
        formikAddNewAddress.setFieldValue('phone_number', '');
        formikAddNewAddress.setFieldValue('address_labels', '');
        formikAddNewAddress.setFieldValue('province', '');
        formikAddNewAddress.setFieldValue('city', '');
        formikAddNewAddress.setFieldValue('districts', '');
        formikAddNewAddress.setFieldValue('full_address', '');
        fetchAddress();
        fetchAllAddress();
      } catch (error) {
        console.log(error.response);
        toast({
          title: 'Failed to add',
          description: error.response.data.message,
          status: 'error',
        });
      }
    },
    validationSchema: Yup.object({
      recipients_name: Yup.string().required(),
      phone_number: Yup.string()
        .required(9)
        .matches(
          /(\+62 ((\d{3}([ -]\d{3,})([- ]\d{4,})?)|(\d+)))|(\(\d+\) \d+)|\d{3}( \d+)+|(\d+[ -]\d+)|\d+/,
          'Phone number must be valid',
        ),
      address_labels: Yup.string().required(),
      full_address: Yup.string().required(),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    formikAddNewAddress.setFieldValue(name, value);
  };

  const editFormik = useFormik({
    initialValues: {
      recipients_name: '',
      phone_number: '',
      address_labels: '',
      districts: '',
      full_address: '',
    },
    onSubmit: async ({
      recipients_name,
      phone_number,
      address_labels,
      districts,
      full_address,
    }) => {
      try {
        const response = await axiosInstance.patch(
          `/address/updateAddress/${openedEdit.id}`,
          {
            recipients_name,
            phone_number,
            address_labels,
            province: selectedEditProvince || editFormik.values.provinceId,
            city: selectedEditCity || editFormik.values.cityId,
            districts,
            full_address,
          },
        );
        console.log(response);
        toast({
          title: 'Address Edited',
          description: response.data.message,
          status: 'success',
        });

        editFormik.setFieldValue('recipients_name', '');
        editFormik.setFieldValue('phone_number', '');
        editFormik.setFieldValue('address_labels', '');
        editFormik.setFieldValue('full_address', '');
        editFormik.setFieldValue('districts', '');
        fetchAddress();
        fetchAllAddress();
        setOpenedEdit(null);
      } catch (error) {
        console.log(error);
        toast({
          title: 'Failed Edit Admin',
          description: error.response.data.message,
          status: 'error',
        });
      }
    },
    validationSchema: Yup.object({
      recipients_name: Yup.string(),
      phone_number: Yup.number(),
      address_labels: Yup.string(),
      districts: Yup.string(),
      full_address: Yup.string(),
    }),
    validateOnChange: false,
  });

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target;
    editFormik.setFieldValue(name, value);
  };

  const doubleOnClick = () => {
    onCloseAlertAddNewAddress();
    onCloseAddNewAddress();
    setSelectedNewProvince(0);
    setSelectedNewCity(0);
    formikAddNewAddress.handleSubmit();
  };

  const doubleOnClick1 = () => {
    editFormik.handleSubmit();
    setSelectedEditProvince(0);
    setSelectedEditCity(0);
    onCloseAlert();
    setRefreshAddress(true);
  };

  const formikSearch = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: ({ search }) => {
      setCurrentSearch(search);
    },
  });

  const searchAdminHandler = ({ target }) => {
    const { name, value } = target;
    formikSearch.setFieldValue(name, value);
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  useEffect(() => {
    fetchAllAddress();
  }, [isOpen, currentSearch]);

  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue('address_labels', openedEdit.address_labels);
      editFormik.setFieldValue('full_address', openedEdit.full_address);
      editFormik.setFieldValue('recipients_name', openedEdit.recipients_name);
      editFormik.setFieldValue('phone_number', openedEdit.phone_number);
      editFormik.setFieldValue('districts', openedEdit.districts);
      editFormik.setFieldValue('cityId', openedEdit.cityId);
      editFormik.setFieldValue('provinceId', openedEdit.provinceId);
    }
  }, [openedEdit]);
  return (
    <>
      <Box borderBottom="1px solid #dfe1e3">
        <Text
          fontSize={'14px'}
          fontWeight={700}
          color={'#31353B'}
          pb="14px"
        >
          Address
        </Text>
      </Box>
      <Box pb="20px" pt="20px">
        <Box>
          <Box display={'flex'} mb="4px">
            <Text
              fontWeight={'bolder'}
              mr="2px"
              fontSize={'13px'}
              color={'#31353B'}
              lineHeight={'1.4'}
            >
              {isLoading && address.recipients_name}
              {isLoading === false ? (
                <Skeleton
                  height={'16px'}
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  w="70px"
                  borderRadius="8px"
                />
              ) : null}
            </Text>

            <Text
              mr="2px"
              color={'#31353B'}
              lineHeight={'1.4'}
              fontSize={'13px'}
            >
              {isLoading ? `(${address.address_labels})` : null}
              {isLoading === false ? (
                <Skeleton
                  height={'16px'}
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  w="60px"
                  borderRadius="8px"
                />
              ) : null}
            </Text>

            <Box
              display={'inline-flex'}
              alignItems={'center'}
              fontWeight={700}
              lineHeight={'16px'}
              fontSize="10px"
              backgroundColor="#dfe1e3"
              p="0 8px"
              borderRadius={'3px'}
              color="#0095DA"
              w={'52.2px'}
              h={'20px'}
              m={'0px'}
              justifyContent={'center'}
              ml={'2px'}
            >
              Main
            </Box>
          </Box>
          <Box>
            <Text
              color={'#31353B'}
              lineHeight={'1.4'}
              fontSize={'13px'}
              mb="4px"
            >
              {isLoading && address.phone_number}
              {isLoading === false ? (
                <Skeleton
                  height={'16px'}
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  w="90px"
                  borderRadius="8px"
                />
              ) : null}
            </Text>
          </Box>
          <Box
            fontSize={'13px'}
            color={'#0000008A'}
            wordBreak={'break-word'}
            lineHeight={'1.4'}
          >
            <Text>
              {isLoading && address.full_address}
              {isLoading === false ? (
                <Skeleton
                  height={'14px'}
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  w="150px"
                  borderRadius="8px"
                />
              ) : null}
            </Text>
            <Text>
              {isLoading && address.districts}, {isLoading && address.city},
              {isLoading && address.province}
              {isLoading === false ? (
                <Skeleton
                  height={'14px'}
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  w="240px"
                  borderRadius="8px"
                />
              ) : null}
            </Text>
          </Box>
        </Box>
      </Box>
      <Box borderTop="1px solid #dfe1e3" p={'25px 0px 10px'}>
        <Button
          p="0 17px"
          mb="18px"
          border="1px solid #0095DA"
          bgColor={'white'}
          onClick={onOpen}
          fontSize={'14px'}
          color={'#0095DA'}
          _hover={{
            bgColor: '#0095DA',
            color: '#fff',
          }}
          display={'flex'}
          alignContent={'center'}
        >
          <Text fontWeight={'bold'}>Choose Address</Text>
        </Button>
      </Box>

      <Modal
        isOpen={isOpen}
        onClose={onCloseAddressModal}
        motionPreset="slideInBottom"
        size={'3xl'}
      >
        <ModalOverlay />
        <ModalContent mt={'90px'} borderRadius="8px" overflow={false}>
          <ModalHeader
            fontSize={'24px'}
            fontWeight="bold"
            textAlign={'center'}
            borderBottom="1px solid #dfe1e3"
            p="0"
            h="36px"
          >
            <Text m="24px 0 16px">Address List</Text>
          </ModalHeader>
          <ModalCloseButton _hover={false} mt="10px" />

          <ModalBody
            overflowY={'scroll'}
            maxH="529px"
            p="24px 40px"
            fontSize={'14px'}
          >
            <Box
              p="20px"
              fontSize={'16px'}
              fontWeight="bold"
              mb="18px"
              border="1px dashed var(--N100,#dfe1e3)"
              borderRadius={'4px'}
              onClick={onOpenAddNewAddress}
            >
              <Text textAlign={'center'}> Add New Address</Text>
            </Box>

            {allAddress.map((val) => {
              return (
                <AddressCard
                  key={val.id.toString()}
                  address_labels={val.address_labels}
                  recipients_name={val.recipients_name}
                  full_address={val.full_address}
                  phone_number={val.phone_number}
                  id={val.id}
                  on_edit={() => setOpenedEdit(val)}
                  on_default={() => setAsDefault(val.id)}
                  is_default={val?.is_default}
                />
              );
            })}
          </ModalBody>
        </ModalContent>
      </Modal>

      <FormAddress
        isOpen={isOpenAddNewAddress}
        onClose={onCloseAddNewAddress}
        onOpen={onOpenAlertAddNewAddress}
        formChangeHandler={formChangeHandler}
        formik={formikAddNewAddress}
        header={'Add Address'}
        selectProvince={setSelectedNewProvince}
        selectCity={setSelectedNewCity}
      />

      <Alert
        header={'Add New Address'}
        body={'Are you sure you want add new address ?'}
        cancelRef={cancelRef}
        isOpen={isOpenAlertAddNewAddress}
        onClose={onCloseAlertAddNewAddress}
        onSubmit={() => doubleOnClick()}
        rightButton={'Yes'}
        leftButton={'No'}
        color={'#F7931E'}
      />

      {/* modal edit address */}
      <EditForm
        editFormChangeHandler={editFormChangeHandler}
        formik={editFormik}
        isOpenMod={openedEdit}
        onSubmit={onOpenAlert}
        onCloseMod={() => setOpenedEdit(null)}
        selectProvince={setSelectedEditProvince}
        selectCity={setSelectedEditCity}
      />

      {/* Alert Edit address */}
      <Alert
        header={'Edit Address'}
        body={'Are you sure you want edit this address ?'}
        cancelRef={cancelRef}
        isOpen={isOpenAlert}
        onClose={onCloseAlert}
        onSubmit={() => doubleOnClick1()}
        rightButton={'Yes'}
        leftButton={'No'}
        color={'#F7931E'}
      />
    </>
  );
};

export default ChangeAddress;
