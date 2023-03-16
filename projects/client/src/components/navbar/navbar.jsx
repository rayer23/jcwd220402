import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  Link,
  useNavigate,
  createSearchParams,
  useSearchParams,
  useLocation,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/authSlice';
import { useState } from 'react';
import { useEffect } from 'react';
import { axiosInstance } from '../../api';
import { fillTrans, fillUnpaidTrans } from '../../redux/features/transSlice';
import { fillCart, getTotalCartQuantity } from '../../redux/features/cartSlice';

import { CgRemote } from 'react-icons/cg';
import { RiSearchEyeFill } from 'react-icons/ri';

import Notification from './notification';
import Cart from './cart';

const Navbar = ({ onChange, onKeyDown }) => {
  const authSelector = useSelector((state) => state.auth);
  const cartSelector = useSelector((state) => state.cart);
  const transSelector = useSelector((state) => state.trans);

  const [searchValue, setSearchValue] = useState('');
  const [searchParam, setSearchParam] = useSearchParams();
  const [showCategory, setShowCategory] = useState([]);
  const [totalCartQuantity, setTotalCartQuantity] = useState(0);
  const [unpaidTransaction, setUnpaidTransaction] = useState([]);

  const location = useLocation();
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const apiImg = process.env.REACT_APP_IMAGE_URL;

  const fetchMyCart = async () => {
    try {
      const response = await axiosInstance.get('/carts/me');
      dispatch(fillCart(response.data.data));

      const cartQuantity = response.data.data.map((val) => val.quantity);

      let Total = 0;

      for (let i = 0; i < cartQuantity.length; i++) {
        Total += Number(cartQuantity[i]);
      }

      setTotalCartQuantity(Total);

      dispatch(getTotalCartQuantity(Total));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllTransaction = async () => {
    try {
      const response = await axiosInstance.get(
        '/transactions/all-transaction-list',
      );
      dispatch(fillTrans(response.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUnpaidTransaction = async () => {
    try {
      const response = await axiosInstance.get(
        '/transactions/unpaid-transaction',
      );

      dispatch(fillUnpaidTrans(response.data.data));
      setUnpaidTransaction(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axiosInstance.get('/categories');
      setShowCategory(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  

  const logoutBtnHandler = () => {
    localStorage.removeItem('auth_token');
    dispatch(logout());

    toast({
      title: 'User Logout',
      status: 'info',
    });

    if (
      location.pathname === '/cart' ||
      location.pathname === '/transaction-list' ||
      location.pathname === '/user/profile' ||
      location.pathname === '/user/profile/change-password' ||
      location.pathname === '/user/profile/address' ||
      location.pathname === '/transaction/payment-list'
    ) {
      navigate('/login');
    }
  };

  const changeBtnHandler = (e) => {
    setSearchValue(e.target.value);
    onChange(e);
  };

  const keyDownBtnHandler = (e) => {
    if (e.key === 'Enter') {
      navigate({
        pathname: '/product',
        search: createSearchParams({
          name: searchValue,
        }).toString(),
      });
      onKeyDown(e);
    }
  };

  const statusOrder = transSelector.trans.map((val) => val.OrderStatusId);

  let StatusOrderActive = [];

  for (let i = 0; i < statusOrder.length; i++) {
    if (
      statusOrder[i] === 1 ||
      statusOrder[i] === 2 ||
      statusOrder[i] === 3 ||
      statusOrder[i] === 4
    ) {
      StatusOrderActive.push(statusOrder[i]);
    }
  }

  useEffect(() => {
    setSearchValue(searchParam.get('name'));
  }, []);

  useEffect(() => {
    fetchMyCart();
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchAllTransaction();
  }, []);

  useEffect(() => {
    fetchUnpaidTransaction();
  }, []);
  return (
    <>
      <Box
        boxShadow={'rgba(0, 0, 0, 0.24) 0px 3px 8px'}
        position={'fixed'}
        left="0"
        right={'0'}
        top="0"
        backgroundColor={'#EEEEEE'}
        zIndex="9998"
      >
        <Box backgroundColor="#fcfcfc">
          <HStack height={'90px'} width={'98%'} mx={'auto'} spacing={5}>
            {/* Logo */}
            <Link to={'/'}>
              <CgRemote color={'#0095DA'} fontSize={70} />
            </Link>
            <Link to={'/'}>
              <Text
                fontSize={'30px'}
                fontWeight="bold"
                color={'#0095DA'}
                display="inline"
                ml={'-25px'}
              >
                DeLisHa
              </Text>
            </Link>

            {/* Search*/}
            <Box w={'100%'} display={'flex'} justifyContent={'flex-end'}>
              <Box w={'96%'}>
                <InputGroup>
                  <Input
                    placeholder="Search in Delisha"
                    _placeholder={{ fontSize: '16px' }}
                    bgColor={'#fff'}
                    border={'2px solid #FFD7B1'}
                    borderRadius={'15px'}
                    onChange={changeBtnHandler}
                    onKeyDown={keyDownBtnHandler}
                    value={searchValue}
                  />
                  <InputRightElement width="3.5rem" mr={'-5px'}>
                    <Button
                      borderLeftRadius="0"
                      _hover={{ bgColor: 'none' }}
                      size={'35px'}
                      h={'30px'}
                      bgColor={'#fff'}
                      mr={'9px'}
                      borderRadius={'15px'}
                    >
                      <RiSearchEyeFill fontSize={'20px'} color={'#0095DA'} />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
            </Box>

            {/* notification tab */}
            <Notification
              unpaidTransaction={unpaidTransaction}
              navigate={navigate}
              authSelector={authSelector}
            />

            {/* Cart tab */}
            <Cart
              authSelector={authSelector}
              totalCartQuantity={totalCartQuantity}
            />

            {/* navbar user logged in */}
            <Box
              display={'flex'}
              gap="4"
              fontSize="14px"
              fontWeight={'semibold'}
              pl={'8px'}
            >
              {authSelector.username ? (
                <Box display={'flex'} mr="2" ml="1" cursor={'pointer'}>
                  <Popover trigger={'hover'}>
                    <PopoverTrigger>
                      <Box
                        display={'flex'}
                        my="auto"
                        minW={'113px'}
                        maxW="250px"
                        paddingLeft="5px"
                        paddingRight={'5px'}
                        //   _hover={{
                        //     color: '#0095DA',
                        //   }}
                        color={'rgba(0,0,0,.54)'}
                      >
                        <Avatar
                          size="md"
                          name={authSelector.username}
                          mr={2}
                          width={'35px'}
                          height="35px"
                          my="auto"
                          src={`${apiImg}/${authSelector.profile_picture}`}
                        />
                        <Text
                          my="auto"
                          fontSize="16px"
                          textTransform={'capitalize'}
                        >
                          {authSelector.username.split(' ')[0]}
                        </Text>
                      </Box>
                    </PopoverTrigger>
                    <PopoverContent w={'185px'}>
                      <PopoverBody>
                        <Box>
                          <Box fontSize={'18px'}>
                            <Link to="/user/profile">
                              <Box p={'5px 4px'}>
                                <Text>Profile</Text>
                              </Box>
                            </Link>

                            <Link to={'/transaction-list'}>
                              <Box p={'5px 4px'}>
                                <Text>Transaction-list</Text>
                              </Box>
                            </Link>
                            {location.pathname === '/cart' ||
                            location.pathname === '/transaction-list' ||
                            location.pathname === '/user/profile' ||
                            location.pathname ===
                              '/user/profile/change-password' ||
                            location.pathname === '/user/profile/address' ? (
                              <Link
                                to={'/login'}
                                replace
                                state={{
                                  from: location,
                                }}
                              >
                                <Box
                                  p={'5px 4px'}
                                  b="0"
                                  onClick={logoutBtnHandler}
                                >
                                  <Text>Logout</Text>
                                </Box>
                              </Link>
                            ) : (
                              <Box
                                display={'flex'}
                                p={'5px 4px'}
                                b="0"
                                onClick={logoutBtnHandler}
                              >
                                <Text>Logout</Text>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Box>
              ) : (
                // navbar if user not logged in
                <Box gap="2" display={'flex'} pl={'15px'} mr={'0px'}>
                  <Link to={'/login'} replace state={{ from: location }}>
                    <Box width={'85px'}>
                      <Button
                        borderColor={'#0095DA'}
                        colorScheme="silver"
                        variant="outline"
                        fontWeight={'bold'}
                        size="md"
                        color={'#0095DA'}
                        borderRadius={'15px'}
                      >
                        Login
                      </Button>
                    </Box>
                  </Link>
                  <Link to="/register">
                    <Box width={'85px'}>
                      <Button
                        bgColor={'#0095DA'}
                        variant="solid"
                        fontWeight={'bold'}
                        size="md"
                        color={'white'}
                        borderRadius={'15px'}
                        mx={'auto'}
                        w={'75px'}
                      >
                        Register
                      </Button>
                    </Box>
                  </Link>
                </Box>
              )}
            </Box>
          </HStack>
        </Box>
      </Box>
    </>
  );
};

export default Navbar;
