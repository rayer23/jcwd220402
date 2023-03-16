import {
  Box,
  Button,
  FormControl,
  Grid,
  Image,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
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
  Skeleton,
  HStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { TbSearch } from 'react-icons/tb';
import { axiosInstance } from '../../api';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { IoIosAlert } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { ImCheckmark } from 'react-icons/im';
import { AiOutlineStop } from 'react-icons/ai';

import Alert from '../../components/alert';
import Search from '../../components/search';
import Pagination from '../../components/pagination';
import RejectPayment from '../../components/admin/rejectpayment';

const ManageOrder = () => {
  const [order, setOrder] = useState([]);
  const [approve, setApprove] = useState(null);
  const [send, setSend] = useState(null);
  const [reject, setReject] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [deliver, setDeliver] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  console.log(modalImage);
  const [currentSearch, setCurrentSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('DESC');
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [warehouse, setWarehouse] = useState([]);
  const [orderSort, setOrderSort] = useState(0);
  const [paymentSort, setPaymentSort] = useState(0);
  const [warehouseSort, setWarehouseSort] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const authSelector = useSelector((state) => state.auth);

  const toast = useToast();

  const cancelRef = React.useRef();

  const {
    onOpen: onOpenAlert,
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();

  const fetchOrder = async () => {
    try {
      const maxItemsPerPage = 3;
      const response = await axiosInstance.get(
        '/adminOrder/waitingConfirmation',
        {
          params: {
            _page: page,
            _limit: maxItemsPerPage,
            username: currentSearch,
            transaction_name: currentSearch,
            PaymentStatusId: paymentSort,
            OrderStatusId: orderSort,
            WarehouseId: warehouseSort,
            payment_method: paymentMethod,
            _sortBy: sortBy,
            _sortDir: sortDir,
          },
        },
      );

      setTotalCount(response.data.dataCount);
      setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage));

      if (page === 1) {
        setOrder(response.data.data);
      } else {
        setOrder(response.data.data);
      }
      setIsLoading(true);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await axiosInstance.get('/adminOrder/findOrderStatus');
      setOrderStatus(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchPaymentStatus = async () => {
    try {
      const response = await axiosInstance.get('/adminOrder/findPaymentStatus');
      setPaymentStatus(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchWarehouse = async () => {
    try {
      const response = await axiosInstance.get('/adminOrder/findWarehouse');
      setWarehouse(response.data.data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const approveBtnHandler = async () => {
    try {
      const response = await axiosInstance.patch(
        `/adminOrder/approvePayment/${approve.id}`,
      );

      toast({
        title: 'Payment Approved',
        status: 'success',
        description: response.data.message,
      });
      fetchOrder();
    } catch (error) {
      console.log(error.response);
      toast({
        title: 'Payment Approved Failed',
        status: 'error',
        description: error.response.data.message,
      });
    }
  };

  const sendOrderBtnHandler = async () => {
    try {
      const response = await axiosInstance.patch(
        `/adminOrder/sendOrder/${send.id}`,
      );

      toast({
        title: 'Order Send',
        status: 'success',
        description: response.data.message,
      });
      fetchOrder();
    } catch (error) {
      console.log(error.response);
      toast({
        title: 'Send Order Failed',
        status: 'error',
        description: error.response.data.message,
      });
    }
  };

  const cancelOrderBtnHandler = async () => {
    try {
      const response = await axiosInstance.patch(
        `/adminOrder/cancelOrder/${cancel.id}`,
      );

      toast({
        title: 'Cancel Order',
        status: 'success',
        description: response.data.message,
      });
      fetchOrder();
    } catch (error) {
      console.log(error.response);
      toast({
        title: 'Cancel Order Failed',
        status: 'error',
        description: error.response.data.message,
      });
    }
  };

  const deliverOrderBtnHandler = async () => {
    try {
      const response = await axiosInstance.patch(
        `/adminOrder/deliverOrder/${deliver.id}`,
      );

      toast({
        title: 'Order Deliver',
        status: 'success',
        description: response.data.message,
      });
      fetchOrder();
    } catch (error) {
      console.log(error.response);
      toast({
        title: 'Deliver Order Failed',
        status: 'error',
        description: error.response.data.message,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async ({ message }) => {
      try {
        console.log(reject.id);
        await axiosInstance.patch(`/adminOrder/rejectPayment/${reject.id}`, {
          message,
        });

        fetchOrder();
        setReject(null);

        toast({
          title: 'Payment Rejected',
          status: 'info',
        });
      } catch (error) {
        console.log(error);
        toast({
          title: 'Filed Reject Payment',
          description: error.response.data.message,
          status: 'error',
        });
      }
    },
  });

  const formikSearch = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: ({ search }) => {
      setCurrentSearch(search);
      setPage(1);
      setIsLoading(false);
    },
  });

  const searchHandler = ({ target }) => {
    const { name, value } = target;
    formikSearch.setFieldValue(name, value);
  };

  const doubleOnClick = () => {
    approveBtnHandler(approve.id);
    setApprove(null);
    setIsLoading(false);
  };

  const doubleOnClick1 = () => {
    formik.handleSubmit();
    onCloseAlert();
    setIsLoading(false);
  };

  const doubleOnClick2 = () => {
    sendOrderBtnHandler(send.id);
    setSend(null);
    setIsLoading(false);
  };

  const doubleOnClick3 = () => {
    cancelOrderBtnHandler(cancel.id);
    setSend(null);
    setCancel(null);
    setIsLoading(false);
  };

  const doubleOnClick4 = () => {
    deliverOrderBtnHandler(deliver.id);
    setDeliver(null);
    setIsLoading(false);
  };

  const nextPage = () => {
    setPage(page + 1);
    setIsLoading(false);
  };

  const previousPage = () => {
    setPage(page - 1);
    setIsLoading(false);
  };

  const orderStatusHandler = ({ target }) => {
    const { value } = target;
    setOrderSort(value);
    setIsLoading(false);
  };

  const paymentStatusHandler = ({ target }) => {
    const { value } = target;
    setPaymentSort(value);
    setIsLoading(false);
  };

  const paymentMethodHandler = ({ target }) => {
    const { value } = target;
    setPaymentMethod(value);
    setIsLoading(false);
  };

  const warehouseHandler = ({ target }) => {
    const { value } = target;
    setWarehouseSort(value);
    setIsLoading(false);
  };

  const sortHandler = ({ target }) => {
    const { value } = target;
    setSortBy(value.split(' ')[0]);
    setSortDir(value.split(' ')[1]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrder();
  }, [
    approve,
    reject,
    currentSearch,
    page,
    sortDir,
    sortBy,
    paymentSort,
    paymentMethod,
    orderSort,
    warehouseSort,
  ]);

  useEffect(() => {
    fetchOrderStatus();
    fetchPaymentStatus();
    fetchWarehouse();
  }, []);
  return (
    <Box marginLeft="90px" mt={90}>
      <HStack justifyContent="space-between">
        <Box>
          <Text fontSize={'2xl'} fontWeight="bold">
            Order Management
          </Text>
        </Box>
      </HStack>

      {authSelector.RoleId === 2 ? (
        <Grid gap="4" templateColumns={'repeat(5, 1fr)'} mt="4" mb="4">
          <Select
            onChange={sortHandler}
            fontSize={'15px'}
            fontWeight="normal"
            color={'#6D6D6F'}
            bgColor={'white'}
          >
            <option value="id">Sort</option>
            <option value="createdAt DESC">Latest</option>
            <option value="createdAt ASC">Oldest</option>
          </Select>

          <Select
            fontSize={'15px'}
            fontWeight="normal"
            onChange={orderStatusHandler}
            color={'#6D6D6F'}
            placeholder="Order Status"
            bgColor={'white'}
          >
            {orderStatus.map((val) => {
              return <option value={val.id}>{val.order_status_name}</option>;
            })}
          </Select>

          <Select
            fontSize={'15px'}
            fontWeight="normal"
            onChange={paymentStatusHandler}
            color={'#6D6D6F'}
            placeholder="Payment Status"
            bgColor={'white'}
          >
            {paymentStatus.map((val) => {
              return <option value={val.id}>{val.payment_status_name}</option>;
            })}
          </Select>

          <Select
            onChange={paymentMethodHandler}
            fontSize={'15px'}
            fontWeight="normal"
            color={'#6D6D6F'}
            placeholder="Payment Method"
            bgColor={'white'}
          >
            <option value="BCA Virtual Account">BCA Virtual Account</option>
            <option value="BNI Virtual Account">BNI Virtual Account</option>
            <option value="Mandiri Virtual Account">
              Mandiri Virtual Account
            </option>
          </Select>

          <Search
            formikSearch={formikSearch}
            searchHandler={searchHandler}
            placeholder="Search by transaction name or username"
            width={'100%'}
          />
        </Grid>
      ) : (
        <Grid gap="4" templateColumns={"repeat(6, 1fr)"} mt="4" mb="4">
            
            <Select
              onChange={sortHandler}
              fontSize={'15px'}
              fontWeight="normal"
              variant="filled"
            //   width={'100px'}
              color={'#6D6D6F'}
            >
              <option value="id">Sort</option>
              <option value="createdAt DESC">Latest</option>
              <option value="createdAt ASC">Oldest</option>
            </Select>

            <Select
              onChange={orderStatusHandler}
              fontSize={'15px'}
              fontWeight="normal"
              variant="filled"
            //   width={'200px'}
              color={'#6D6D6F'}
              placeholder="Order Status"
            >
              {orderStatus.map((val) => {
                return <option value={val.id}>{val.order_status_name}</option>;
              })}
            </Select>

            <Select
              onChange={paymentStatusHandler}
              fontSize={'15px'}
              fontWeight="normal"
              variant="filled"
            //   width={'200px'}
              color={'#6D6D6F'}
              placeholder="Payment Status"
            >
              {paymentStatus.map((val) => {
                return (
                  <option value={val.id}>{val.payment_status_name}</option>
                );
              })}
            </Select>

            <Select
              onChange={paymentMethodHandler}
              fontSize={'15px'}
              fontWeight="normal"
              variant="filled"
            //   width={'220px'}
              color={'#6D6D6F'}
              placeholder="Payment Method"
            >
              <option value="BCA Virtual Account">BCA Virtual Account</option>
              <option value="BNI Virtual Account">BNI Virtual Account</option>
              <option value="Mandiri Virtual Account">
                Mandiri Virtual Account
              </option>
            </Select>

            {authSelector.RoleId === 3 ? (
              <Select
                onChange={warehouseHandler}
                fontSize={'15px'}
                fontWeight="normal"
                variant="filled"
                // width={'220px'}
                color={'#6D6D6F'}
                placeholder="Warehouse"
              >
                {warehouse.map((val) => {
                  return <option value={val.id}>{val.warehouse_name}</option>;
                })}
              </Select>
            ) : null}

            <form onSubmit={formikSearch.handleSubmit}>
              <FormControl>
                <InputGroup textAlign={'right'}>
                  <Button
                    borderRightRadius={'0'}
                    type="submit"
                    bgColor={'white'}
                    border="1px solid #e2e8f0"
                    borderRight={'0px'}
                  >
                    <TbSearch />
                  </Button>
                  <Input
                    type={'text'}
                    placeholder="Search By Invoice or User"
                    name="search"
                    bgColor={'white'}
                    onChange={searchHandler}
                    borderLeftRadius="0"
                    value={formikSearch.values.search}
                  />
                </InputGroup>
              </FormControl>
            </form>
          
        </Grid>
      )}

      <Table variant={'striped'} colorScheme={'blue'} size="lg">
        <Thead>
          <Tr>
            <Th p={'10px'}>Invoice</Th>
            <Th p={'10px'}>Username</Th>
            <Th p={'10px'}>Order Status</Th>
            <Th p={'10px'}>Payment Status</Th>
            <Th p={'10px'}>Payment Method</Th>
            <Th p={'10px'}>Payment Date</Th>
            <Th p={'10px'}>Upload</Th>
            <Th p={'10px'}>Total Price</Th>

            {authSelector.RoleId === 3 ? <Th p={'10px'}>Warehouse</Th> : null}
            <Th p={'10px'}>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading &&
            order.map((val) => {
              return (
                <Tr height={'140px'}>
                  <Td p={'10px'}>{val.transaction_name}</Td>
                  <Td p={'10px'}>{val.User?.username}</Td>
                  <Td p={'10px'}>{val.Order_status?.order_status_name}</Td>
                  <Td p={'10px'}>{val.Payment_status?.payment_status_name}</Td>
                  <Td p={'10px'}>{val.payment_method}</Td>
                  <Td p={'10px'}>
                    {moment(val.payment_date).format('DD MMMM YYYY, HH:mm:ss')}
                  </Td>
                  <Td p={'10px'}>
                    {val.payment_proof ? (
                      <Image
                        w="100px"
                        src={`${process.env.REACT_APP_IMAGE_URL}/${val.payment_proof}`}
                        onClick={() => setModalImage(val)}
                      />
                    ) : (
                      <Text>Not Uploaded</Text>
                    )}
                  </Td>
                  <Td p={'10px '}>Rp. {val.total_price.toLocaleString()}</Td>

                  {authSelector.RoleId === 3 ? (
                    <Td p={'10px'}>{val.Warehouse?.warehouse_name}</Td>
                  ) : null}
                  <Td p={'10px'}>
                    {val?.PaymentStatusId == 2 ? (
                      <>
                        <Text textAlign={'center'} fontSize="12px">
                          Approve Payment?
                        </Text>
                        <Box
                          display={'flex'}
                          fontSize="40px"
                          gap="4px"
                          mx="auto"
                          justifyContent={'center'}
                        >
                          <Button
                            onClick={() => setApprove(val)}
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
                            onClick={() => setReject(val)}
                          >
                            <AiOutlineStop fontSize={'40px'} />{' '}
                          </Button>
                        </Box>
                      </>
                    ) : null}
                    {val?.PaymentStatusId == 3 && val?.OrderStatusId == 2 ? (
                      <Box>
                        <Text textAlign={'center'} fontSize="12px">
                          Send Order?
                        </Text>
                        <Box
                          display={'flex'}
                          fontSize="40px"
                          gap="4px"
                          mx="auto"
                          justifyContent={'center'}
                        >
                          <Button
                            onClick={() => setSend(val)}
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
                            onClick={() => setCancel(val)}
                          >
                            <AiOutlineStop fontSize={'40px'} />{' '}
                          </Button>
                        </Box>
                      </Box>
                    ) : null}
                    {val?.PaymentStatusId == 3 && val?.OrderStatusId == 3 ? (
                      <Box>
                        <Text textAlign={'center'} fontSize="12px">
                          Deliver Order?
                        </Text>
                        <Box
                          display={'flex'}
                          fontSize="40px"
                          gap="4px"
                          mx="auto"
                          justifyContent={'center'}
                        >
                          <Button
                            onClick={() => setDeliver(val)}
                            width={'50px'}
                            bgColor={'#0095DA'}
                            _hover={false}
                            color="white"
                            mr={2}
                          >
                            <ImCheckmark fontSize={'40px'} />{' '}
                          </Button>
                        </Box>
                      </Box>
                    ) : null}
                  </Td>
                </Tr>
              );
            })}
          {isLoading === false ? (
            <Tr>
              <Td p="10px">
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  borderRadius="8px"
                />
              </Td>
              <Td p="10px">
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  borderRadius="8px"
                />
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  borderRadius="8px"
                  mt="2"
                />
              </Td>
              <Td p="10px">
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  borderRadius="8px"
                />
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  borderRadius="8px"
                  mt="2"
                />
              </Td>
              <Td p="10px">
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  w="60%"
                  borderRadius="8px"
                />
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  w="70%"
                  borderRadius="8px"
                  mt="2"
                />
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  borderRadius="8px"
                  mt="2"
                />
              </Td>
              <Td p="10px">
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  w="100%"
                  borderRadius="8px"
                />
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  w="45%"
                  borderRadius="8px"
                  mt="2"
                />
              </Td>
              <Td p="10px">
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="120px"
                  borderRadius="8px"
                  mt="2"
                />
              </Td>
              <Td p="10px">
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  w="30%"
                  borderRadius="8px"
                  mt="2"
                />
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  borderRadius="8px"
                  mt="2"
                />
              </Td>
              <Td p="10px">
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  borderRadius="8px"
                  mt="2"
                />
              </Td>
              <Td p="10px">
                <Skeleton
                  startColor="#bab8b8"
                  endColor="#d4d2d2"
                  height="20px"
                  borderRadius="8px"
                  mt="2"
                />
              </Td>
              <Td p="10px"></Td>
            </Tr>
          ) : null}
        </Tbody>
      </Table>
      {!order.length && isLoading === true ? (
        <Box p="10px" bgColor={'#E5F9F6'}>
          <Box mx="auto">
            <Box display={'flex'} mx="auto" w="170px">
              <IoIosAlert fontSize={'25px'} color="#0095DA" />
              <Text fontWeight="medium" ml="2">
                No orders found
              </Text>
            </Box>
          </Box>
        </Box>
      ) : null}
      <Text fontSize={'2xl'} fontWeight="bold" color={'#0095DA'}>
        Total Order :{totalCount}
      </Text>
      <RejectPayment
        formik={formik}
        header={'Reject Payment'}
        isOpen={reject}
        onClose={() => setReject(null)}
        onOpen={onOpenAlert}
      />

      <Alert
        header={'Payment reject'}
        body={'Reject this Payment?'}
        cancelRef={cancelRef}
        isOpen={isOpenAlert}
        leftButton={'Cancel'}
        onClose={onCloseAlert}
        rightButton={'Reject'}
        onSubmit={doubleOnClick1}
        color={'#0095DA'}
      />

      <Alert
        header={'Payment approve'}
        body={'Approve this payment?'}
        cancelRef={cancelRef}
        isOpen={approve}
        leftButton={'Cancel'}
        onClose={() => setApprove(null)}
        rightButton={'Approve'}
        onSubmit={() => doubleOnClick()}
        color={'#0095DA'}
      />

      <Alert
        header={'Send Order'}
        body={'Send the order?'}
        cancelRef={cancelRef}
        isOpen={send}
        leftButton={'Cancel'}
        onClose={() => setSend(null)}
        rightButton={'Send'}
        onSubmit={() => doubleOnClick2()}
        color={'#0095DA'}
      />

      <Alert
        header={'Cancel Order'}
        body={'Cancel the order?'}
        cancelRef={cancelRef}
        isOpen={cancel}
        leftButton={'Cancel'}
        onClose={() => setCancel(null)}
        rightButton={'Yes'}
        onSubmit={() => doubleOnClick3()}
        color={'#0095DA'}
      />

      <Alert
        header={'Deliver Order'}
        body={'Deliver the order?'}
        cancelRef={cancelRef}
        isOpen={deliver}
        leftButton={'Cancel'}
        onClose={() => setDeliver(null)}
        rightButton={'Deliver'}
        onSubmit={() => doubleOnClick4()}
        color={'#0095DA'}
      />

      <Pagination
        maxPage={maxPage}
        nextPage={nextPage}
        page={page}
        previousPage={previousPage}
      />

      <Modal
        isOpen={modalImage}
        onClose={() => setModalImage(null)}
        motionPreset="slideInBottom"
        size={'2xl'}
      >
        <ModalOverlay />
        <ModalContent my="auto" borderRadius="8px" overflow={false}>
          <ModalBody p="24px 40px" fontSize={'14px'}>
            <Box textAlign={'center'}>
              <Image
                src={`${process.env.REACT_APP_IMAGE_URL}/${modalImage?.payment_proof}`}
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ManageOrder;
