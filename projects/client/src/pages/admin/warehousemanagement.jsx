import {
  Box,
  Button,
  Divider,
  FormControl,
  Input,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  HStack,
  useDisclosure,
  InputGroup,
  Select,
} from '@chakra-ui/react';
// import { useSelector } from "react-redux";
import { axiosInstance } from '../../api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCallback } from 'react';
import React, { useEffect, useState } from 'react';
import { TbSearch } from 'react-icons/tb';
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai';
import { MdAddToPhotos } from 'react-icons/md';

import Warehouse from '../../components/admin/warehouse';
import AddWarehouse from '../../components/admin/addwarehouse';
import EditWarehouse from '../../components/admin/editwarehouse';

const WarehouseManagement = () => {
  const [data, setData] = useState([]);
  const toast = useToast();
  // const authSelector = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [openedEdit, setOpenedEdit] = useState(null);

  const [rows, setRows] = useState(0);
  const [pages, setPages] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [keywordHandler, setKeywordHandler] = useState('');
  const maxItemsPage = 5;

  const [selectedAddProvince, setSelectedAddProvince] = useState(0);
  const [selectedAddCity, setSelectedAddCity] = useState(0);
  const [selectedEditProvince, setSelectedEditProvince] = useState(0);
  const [selectedEditCity, setSelectedEditCity] = useState(0);

  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('ASC');

  const {
    isOpen: isOpenEditWarehouseAddress,
    onOpen: onOpenEditWarehouseAddress,
    onClose: onCloseEditWarehouseAddress,
  } = useDisclosure();

  const {
    isOpen: isOpenAddNewWarehouseAddress,
    onOpen: onOpenAddNewWarehouseAddress,
    onClose: onCloseAddNewWarehouseAddress,
  } = useDisclosure();

  const fetchWarehouse = useCallback(async () => {
    try {
      const fetchingWH = await axiosInstance.get(`/warehouse`, {
        params: {
          _keywordHandler: keyword,
          _page: pages,
          _limit: maxItemsPage,
          _sortBy: sortBy,
          _sortDir: sortDir,
        },
      });
      setData(fetchingWH.data.data);
      setTotalCount(fetchingWH.data.totalRows);
      setIsLoading(true);
      setRows(fetchingWH.data.totalRows - maxItemsPage);
      setMaxPage(Math.ceil(fetchingWH.data.totalRows / maxItemsPage));
    } catch (error) {
      console.log(error);
    }
  }, [pages, keyword, sortBy, sortDir]);

  const nextPage = () => {
    setPages(pages + 1);
  };

  const prevPage = () => {
    setPages(pages - 1);
  };

  const deleteBtnHandler = async (id) => {
    try {
      await axiosInstance.delete(`/warehouse/${id}`);

      fetchWarehouse();
      toast({ title: 'Warehouse deleted', status: 'info' });
    } catch (err) {
      console.log(err);
      toast({ title: 'Error deleting data warehouse', status: 'error' });
    }
  };

  const addFormik = useFormik({
    initialValues: {
      warehouse_name: '',
      address_labels: '',
      province: '',
      city: '',
      districts: '',
      full_address: '',
    },
    onSubmit: async (values) => {
      try {
        let addWarehouse = {
          warehouse_name: values.warehouse_name,
          address_labels: values.address_labels,
          province: selectedAddProvince,
          city: selectedAddCity,
          districts: values.districts,
          full_address: values.full_address,
        };

        await axiosInstance.post(`/warehouse`, addWarehouse);

        toast({ title: 'Warehouse added', status: 'success' });
        fetchWarehouse();
        addFormik.setFieldValue('warehouse_name', '');
        addFormik.setFieldValue('address_labels', '');
        addFormik.setFieldValue('province', '');
        addFormik.setFieldValue('city', '');
        addFormik.setFieldValue('districts', '');
        addFormik.setFieldValue('full_address', '');
      } catch (err) {
        console.log(err);
        toast({ title: 'Server error while adding', status: 'error' });
      }
    },
    validationSchema: Yup.object({
      warehouse_name: Yup.string().required().min(1),
      address_labels: Yup.string().required(),
      districts: Yup.string().required(),
      full_address: Yup.string().required(),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    addFormik.setFieldValue(name, value);
  };

  const onOpenedEditHandler = (val) => {
    onOpenEditWarehouseAddress();
    setOpenedEdit(val);
  };
  const onSubmitAddForm = () => {
    addFormik.handleSubmit();
    onCloseAddNewWarehouseAddress();
  };
  const onSubmitEditForm = () => {
    editFormik.handleSubmit();
    onCloseEditWarehouseAddress();
  };

  const editFormik = useFormik({
    initialValues: {
      warehouse_name: openedEdit ? openedEdit.warehouse_name : '',
      address_labels: openedEdit ? openedEdit.address_labels : '',
      province: openedEdit ? openedEdit.province : '',
      city: openedEdit ? openedEdit.city : '',
      districts: openedEdit ? openedEdit.districts : '',
      full_address: openedEdit ? openedEdit.full_address : '',
    },
    onSubmit: async (values) => {
      try {
        let editedWarehouse = {
          warehouse_name: values.warehouse_name,
          address_labels: values.address_labels,
          province: selectedEditProvince,
          city: selectedEditCity,
          districts: values.districts,
          full_address: values.full_address,
        };

        await axiosInstance.patch(
          `/warehouse/${openedEdit.id}`,
          editedWarehouse,
        );

        toast({ title: 'Warehouse edited', status: 'success' });
        editFormik.setFieldValue('warehouse_name', '');
        editFormik.setFieldValue('address_labels', '');
        editFormik.setFieldValue('province', '');
        editFormik.setFieldValue('city', '');
        editFormik.setFieldValue('districts', '');
        editFormik.setFieldValue('full_address', '');
        fetchWarehouse();
        setOpenedEdit(null);
      } catch (err) {
        console.log(err);
        toast({ title: 'Server error while editing', status: 'error' });
      }
    },
    validationSchema: Yup.object({
      warehouse_name: Yup.string().required().min(1),
      address_labels: Yup.string().required(),
      districts: Yup.string().required(),
      full_address: Yup.string().required(),
    }),
    validateOnChange: false,
  });

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target;
    editFormik.setFieldValue(name, value);
  };

  const renderWarehouse = () => {
    return data.map((val) => {
      return (
        <Warehouse
          key={val.id.toString()}
          id={val.id.toString()}
          warehouse_name={val.warehouse_name}
          full_address={val.full_address}
          address_labels={val.address_labels}
          province={val.province}
          city={val.city}
          districts={val.districts}
          username={val?.User?.username}
          latitude={val.latitude}
          longitude={val.longitude}
          onDelete={() => deleteBtnHandler(val.id)}
          onEdit={() => onOpenedEditHandler(val)}
        />
      );
    });
  };

  const searchKey = () => {
    setPages(0);
    setKeyword(keywordHandler);
  };

  const sortCategoryHandler = ({ target }) => {
    const { value } = target;
    setSortBy(value.split(' ')[0]);
    setSortDir(value.split(' ')[1]);
  };

  useEffect(() => {
    fetchWarehouse();
  }, [openedEdit, pages, sortBy, sortDir, keyword, keywordHandler]);

  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue('warehouse_name', openedEdit.warehouse_name);
      editFormik.setFieldValue('address_labels', openedEdit.address_labels);
      editFormik.setFieldValue('province', openedEdit.selectedProvince);
      editFormik.setFieldValue('city', openedEdit.selectedCity);
      editFormik.setFieldValue('districts', openedEdit.districts);
      editFormik.setFieldValue('full_address', openedEdit.full_address);
    }
  }, [openedEdit]);

  return (
    <Box marginLeft={'90px'}>
      <Box p="20px 0" display={'flex'} justifyContent="space-between" mr="0">
        <Box display={'flex'} gap="4" my={'auto'}>
          <Text fontSize={'2xl'} fontWeight="bold">
            Warehouse Management
          </Text>
        </Box>
        <Button
          mr={'-850'}
          bgColor={'#0095DA'}
          color="white"
          _hover={false}
          onClick={() => onOpenAddNewWarehouseAddress()}
          w="50px"
        >
          <MdAddToPhotos />
        </Button>
        <Box gap="4" display={'flex'}>
          <Select
            onChange={sortCategoryHandler}
            fontSize={'15px'}
            fontWeight="normal"
            variant="filled"
            width={'130px'}
            color={'#6D6D6F'}
            _placeholder="Sort By"
          >
            <option value="id ASC" selected>
              A-Z
            </option>
            <option value="id DESC">Z-A</option>
            <option value="createdAt DESC">Latest</option>
            <option value="createdAt ASC">Old</option>
          </Select>

          <FormControl>
            <InputGroup textAlign={'right'}>
              <Button borderRightRadius={'0'} type="submit" onClick={searchKey}>
                <TbSearch />
              </Button>
              <Input
                type="text"
                placeholder="Warehouse Name"
                name="search"
                w="200px"
                onChange={(event) => setKeywordHandler(event.target.value)}
                borderLeftRadius="0"
                value={keywordHandler}
              />
            </InputGroup>
          </FormControl>
        </Box>
      </Box>

      <Table size="lg" variant="striped" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Warehouse Name</Th>
            <Th>Admin Name</Th>
            <Th>Full Address</Th>
            <Th>Province</Th>
            <Th>City</Th>
            <Th>District</Th>
            <Th>Option</Th>
          </Tr>
        </Thead>
        <Tbody>{isLoading && renderWarehouse()}</Tbody>
      </Table>
      <Text fontSize={'2xl'} fontWeight="bold" color={'#0095DA'}>
        Total Warehouses: {totalCount}
      </Text>
      <Box p="20px">
        <Box textAlign={'center'}>
          <Button
            onClick={prevPage}
            disabled={pages === 0 ? true : null}
            _hover={false}
            _active={false}
          >
            <AiOutlineLeftCircle fontSize={'20px'} />
          </Button>

          <Box display={'inline'}>{pages + 1}</Box>

          <Button
            onClick={nextPage}
            disabled={pages + 1 >= maxPage ? true : null}
            _hover={false}
            _active={false}
          >
            <AiOutlineRightCircle fontSize={'20px'} />
          </Button>
          <Box>
            Page: {pages + 1} of {maxPage}
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Modal tambah data */}
      <AddWarehouse
        isOpen={isOpenAddNewWarehouseAddress}
        onClose={onCloseAddNewWarehouseAddress}
        onSubmit={(event) => onSubmitAddForm(event.target.value)}
        formChangeHandler={formChangeHandler}
        formik={addFormik}
        header={'Add Warehouse Form'}
        selectProvince={setSelectedAddProvince}
        selectCity={setSelectedAddCity}
      />

      {/* Modal edit data */}
      <EditWarehouse
        isOpen={isOpenEditWarehouseAddress}
        onClose={onCloseEditWarehouseAddress}
        onSubmit={(event) => onSubmitEditForm(event.target.value)}
        formChangeHandler={editFormChangeHandler}
        formik={editFormik}
        header={'Edit Warehouse Form'}
        selectProvince={setSelectedEditProvince}
        selectCity={setSelectedEditCity}
      />
    </Box>
  );
};

export default WarehouseManagement;
