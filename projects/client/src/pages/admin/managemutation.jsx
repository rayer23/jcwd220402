import {
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  InputGroup,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { axiosInstance } from '../../api';
import { TbSearch } from 'react-icons/tb';
import { IoIosAlert } from 'react-icons/io';

import { MdAddToPhotos } from 'react-icons/md';
import { ImCheckmark } from 'react-icons/im';
import { AiOutlineStop } from 'react-icons/ai';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

import Mutation from '../../components/admin/mutation';
import Alert from '../../components/alert';

const AdminMutationStock = () => {
  const [stockData, setStockData] = useState([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('ASC');
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmAlert, setConfirmAlert] = useState(null);
  const [rejectAlert, setRejectAlert] = useState(null);
  const cancelRef = useRef();

  const [selectedProduct, setSelectedProduct] = useState(0);
  const [selectedWarehouse1, setSelectedWarehouse1] = useState(0);
  const [selectedWarehouse2, setSelectedWarehouse2] = useState(0);

  const toast = useToast();

  const fetchAdminData = async () => {
    const maxItemsPerPage = 10;
    try {
      const response = await axiosInstance.get(
        '/stock-mutation/getAllStockMutation',
        {
          params: {
            _page: page,
            _limit: maxItemsPerPage,
            id: currentSearch,
            _sortBy: sortBy,
            _sortDir: sortDir,
          },
        },
      );

      setTotalCount(response.data.dataCount);
      setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage));
      setStockData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const approveMut = async (val) => {
    await axiosInstance.post(`/stock-mutation/approveMutation/${val.id}`);
    fetchAdminData();
  };
  const denyMut = async (val) => {
    await axiosInstance.post(`/stock-mutation/denyMutation/${val.id}`);
    fetchAdminData();
  };

  const renderStockMutation = () => {
    return stockData.map((val) => {
      return (
        <Tr key={val.id.toString()}>
          <Td>{val.id}</Td>
          <Td>{val.from_warehouse}</Td>
          <Td>{val.to_warehouse}</Td>
          <Td>{val.quantity}</Td>
          <Td>{val.Journal?.stock_before}</Td>
          <Td>{val.Journal?.stock_after}</Td>
          <Td>{val.mutation_status}</Td>
          <Td>{val.Product?.product_name}</Td>
          <Td>
            {val.mutation_status === 'Waiting for approval' ? (
              <Box>
                <Button
                  onClick={() => setConfirmAlert(val)}
                  width={'50px'}
                  bgColor={'#0095DA'}
                  _hover={false}
                  color="white"
                  mr={2}
                >
                  <ImCheckmark fontSize={'40px'} />{' '}
                </Button>
                <Button
                  width={'50px'}
                  bgColor={'#FF0000'}
                  _hover={false}
                  color="white"
                  onClick={() => setRejectAlert(val)}
                >
                  <AiOutlineStop fontSize={'40px'} />{' '}
                </Button>
              </Box>
            ) : null}
          </Td>
        </Tr>
      );
    });
  };

  const nextPage = () => {
    setIsLoading(true);
    setPage(page + 1);
    setIsLoading(false);
  };

  const prevPage = () => {
    setIsLoading(true);
    setPage(page - 1);
    setIsLoading(false);
  };

  const formikSearch = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: ({ search }) => {
      setCurrentSearch(search);
      setPage(1);
    },
  });
  const addFormik = useFormik({
    initialValues: {
      from_warehouse: '',
      to_warehouse: '',
      quantity: '',
      ProductId: '',
    },
    onSubmit: async (values) => {
      try {
        let addWarehouse = {
          from_warehouse: selectedWarehouse1,
          to_warehouse: selectedWarehouse2,
          quantity: values.quantity,
          ProductId: selectedProduct,
        };
        await axiosInstance.post(`/stock-mutation/addMutation`, addWarehouse);

        toast({ title: 'Mutation added', status: 'success' });
        fetchAdminData();
        addFormik.setFieldValue('from_warehouse', '');
        addFormik.setFieldValue('to_warehouse', '');
        addFormik.setFieldValue('quantity', '');
        addFormik.setFieldValue('ProductId', '');
      } catch (err) {
        console.log(err);
        toast({ title: 'Server error while adding', status: 'error' });
      }
    },
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    addFormik.setFieldValue(name, value);
  };

  const {
    isOpen: isOpenAddNewWarehouseAddress,
    onOpen: onOpenAddNewWarehouseAddress,
    onClose: onCloseAddNewWarehouseAddress,
  } = useDisclosure();

  const searchAdminHandler = ({ target }) => {
    const { name, value } = target;
    formikSearch.setFieldValue(name, value);
  };
  const onSubmitAddForm = () => {
    addFormik.handleSubmit();
    onCloseAddNewWarehouseAddress();
  };

  const sortCategoryHandler = ({ target }) => {
    const { value } = target;
    setSortBy(value.split(' ')[0]);
    setSortDir(value.split(' ')[1]);
  };

  const doubleOnClick = () => {
    setConfirmAlert(null);
    approveMut(confirmAlert);
  };
  const doubleOnClick2 = () => {
    setRejectAlert(null);
    denyMut(rejectAlert);
  };

  useEffect(() => {
    fetchAdminData();
  }, [currentSearch, page, sortDir, sortBy, isLoading]);

  return (
    <Box marginLeft={'90px'}>
      <HStack justifyContent="space-between">
        <Box>
          <Text fontSize={'2xl'} fontWeight="bold">
            Manage Stock Mutation
          </Text>
        </Box>
      </HStack>

      <HStack mb="5px" mt="5px" mr={'30px'} justifyContent="right">
        <Button
          bgColor={'#0095DA'}
          color="white"
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
            color={'#6D6D6F'}
            _placeholder="Sort By"
          >
            <option value="ID ASC" selected>
              ID ASC
            </option>
            <option value="ID DESC">ID DESC</option>
            <option value="createdAt DESC">Latest</option>
            <option value="createdAt ASC">Old</option>
          </Select>

          <form onSubmit={formikSearch.handleSubmit}>
            <FormControl>
              <InputGroup textAlign={'right'}>
                <Button borderRightRadius={'0'} type="submit">
                  <TbSearch />
                </Button>
                <Input
                  type="text"
                  placeholder="Search by ID"
                  name="search"
                  w="200px"
                  onChange={searchAdminHandler}
                  borderLeftRadius="0"
                  value={formikSearch.values.search}
                />
              </InputGroup>
            </FormControl>
          </form>
        </Box>
      </HStack>
      <Table variant="striped" colorScheme="blue">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>From Warehouse ID</Th>
            <Th>To Warehouse ID</Th>
            <Th>Quantity</Th>
            <Th>Stock Before </Th>
            <Th>Stock After </Th>
            <Th>Mutation Status</Th>
            <Th>Product Name</Th>
            <Th>Option</Th>
          </Tr>
        </Thead>
        <Tbody>{renderStockMutation()}</Tbody>
      </Table>
      {!stockData.length ? (
        <Box p="10px" bgColor={'#E5F9F6'}>
          <Box mx="auto">
            <Box display={'flex'} mx="auto" w="170px">
              <IoIosAlert fontSize={'25px'} color="#0095DA" />
              <Text fontWeight="medium" ml="2">
                No stock mutation found
              </Text>
            </Box>
          </Box>
        </Box>
      ) : null}
      <Text fontSize={'2xl'} fontWeight="bold" color={'#0095DA'}>
        Total Mutations :{totalCount}
      </Text>
      <HStack justifyContent={'center'} mt={'20px'} mb={'50px'} ml={'50px'}>
        <Button
          bgColor={'white'}
          color={'#0095DA'}
          onClick={prevPage}
          w={'60px'}
          isDisabled={page === 1 ? true : null}
        >
          <BsArrowBarLeft fontSize={'40px'} />
        </Button>
        <Text w={'10px'} fontSize={'14px'}>
          {page}
        </Text>
        <Button
          bgColor={'white'}
          color="#0095DA"
          onClick={nextPage}
          w={'60px'}
          isDisabled={page >= maxPage ? true : null}
        >
          <BsArrowBarRight fontSize={'40px'} />
        </Button>
      </HStack>

      {/* Alert confirm mutation*/}
      <Alert
        body={`Are you sure to confirm this mutation ?`}
        cancelRef={cancelRef}
        color={'#0095DA'}
        header={'Approved Mutation'}
        isOpen={confirmAlert}
        leftButton={'Cancel'}
        onClose={() => setConfirmAlert(null)}
        onSubmit={() => doubleOnClick()}
        rightButton={'Approved'}
      />

      <Alert
        body={`Are you sure to reject this mutation ?`}
        cancelRef={cancelRef}
        color={'#0095DA'}
        header={'Approved Mutation'}
        isOpen={rejectAlert}
        leftButton={'Cancel'}
        onClose={() => setRejectAlert(null)}
        onSubmit={() => doubleOnClick2()}
        rightButton={'Reject'}
      />

      <Mutation
        isOpen={isOpenAddNewWarehouseAddress}
        onClose={onCloseAddNewWarehouseAddress}
        onSubmit={(event) => onSubmitAddForm(event.target.value)}
        formChangeHandler={formChangeHandler}
        addFormik={addFormik}
        header={'Request Mutation'}
        selectProduct={setSelectedProduct}
        selectWarehouse1={setSelectedWarehouse1}
        selectWarehouse2={setSelectedWarehouse2}
      />
    </Box>
  );
};
export default AdminMutationStock;
