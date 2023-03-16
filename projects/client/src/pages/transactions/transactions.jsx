import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api';
import BCA from '../../assets/BCA.png';
import BNI from '../../assets/BNI.png';
import mandiri from '../../assets/mandiri.png';
import { TfiControlBackward } from 'react-icons/tfi';

import CartItems from '../../components/transactions/cartitems';
import Shipping from '../../components/transactions/shipping';
import Payment from '../../components/transactions/payment';
import ChangeAddress from '../../components/transactions/changeaddress';
import Alert from '../../components/alert';

import {
  getTotalPrice,
  getTotalQuantity,
} from '../../redux/features/cartSlice';

const Transactions = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [BCAChecked, setBCAChecked] = useState(true);
  const [BNIChecked, setBNIChecked] = useState(false);
  const [MandiriChecked, setMandiriChecked] = useState(false);
  const [productWeight, setProductWeight] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('BCA');
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingError, setShippingError] = useState(false);
  const [defaultAddressId, setDefaultAddressId] = useState(0);
  const [courirDuration, setCourirDuration] = useState('');
  const [closestWarehouse, setClosestWarehouse] = useState(null);

  const BCARadio = () => {
    setBCAChecked(true);
    setBNIChecked(false);
    setMandiriChecked(false);

    setPaymentMethod('BCA');
  };

  const BNIRadio = () => {
    setBCAChecked(false);
    setBNIChecked(true);
    setMandiriChecked(false);

    setPaymentMethod('BNI');
  };

  const MandiriRadio = () => {
    setBCAChecked(false);
    setBNIChecked(false);
    setMandiriChecked(true);

    setPaymentMethod('Mandiri');
  };

  const {
    isOpen: paymentIsOpen,
    onOpen: paymentOnOpen,
    onClose: paymentOnclose,
  } = useDisclosure();

  const cartSelector = useSelector((state) => state.cart);

  const fetchTotalPrice = async () => {
    try {
      const response = await axiosInstance.get('/carts/price/total');

      dispatch(getTotalPrice(response.data.data.totalPrice));

      dispatch(getTotalQuantity(response.data.data.totalQuantity));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCheckoutCartItems = async () => {
    try {
      const response = await axiosInstance.get(
        '/transactions/checkoutCartItems',
      );

      const productWeight = response.data.data.map(
        (val) => val.Product.product_weight,
      );
      let total = 0;

      for (let i = 0; i < productWeight.length; i++) {
        total += Number(productWeight[i]);
      }

      setProductWeight(total);
    } catch (err) {
      console.log(err);
    }
  };

  const toast = useToast();

  const openPayment = () => {
    if (!shippingFee) {
      toast({
        title: 'Pick your shipping first before checkout your transactions',
        status: 'error',
      });
      setShippingError(true);
    } else {
      paymentOnOpen();
      setShippingError(false);
    }
  };

  const createNewTransaction = async () => {
    try {
      const response = await axiosInstance.post('/transactions/payItems', {
        shipping_fee: shippingFee,
        payment_method: paymentMethod,
        total_price: totalPrice,
        AddressId: defaultAddressId,
        courir_duration: courirDuration,
        WarehouseId: closestWarehouse,
      });

      navigate(`/payment/${response.data.data.transaction_name}`);

      toast({
        title: 'Payment Success',
        description: response.data.message,
        status: 'success',
      });
    } catch (err) {
      console.log(err);
      toast({
        title: 'payment failed',
        description: err.response.data.message,
        status: 'error',
      });
    }
  };

  const totalBill = Number(shippingFee) + Number(cartSelector.totalPrice);
  const transactionFee = 1000;
  const totalPrice = Number(totalBill) + transactionFee;

  useEffect(() => {
    fetchTotalPrice();
    fetchCheckoutCartItems();
  }, []);

  return (
    <>
      <Box h="52px" borderBottom="1px solid #dfe1e3">
        <Link onClick={onOpen}>
          <Text
            bgColor={'white'}
            size={'lg'}
            fontSize={'75px'}
            _hover={'none'}
            pb={'5px'}
            color={'#0095DA'}
          >
            <TfiControlBackward />
          </Text>
        </Link>
      </Box>
      

      <Box w={'1120px'} p="0 20px" mx="auto">
        <Flex>
          <Box w="685px" mr="45px">
            
            <Box mt="20px">
              <Box
                w={'710px'}
                border={'1px solid #dfe1e3'}
                boxShadow={'0 0 10px 0 rgb(0 0 0 / 10%)'}
                borderRadius={'15px'}
                mb={'50px'}
                p={'20px'}
              >
                <Box pt={'19px'} minH={'92px'}>
                  <CartItems />
                </Box>
                <Box borderBottom="1px solid #dfe1e3">
                  <ChangeAddress defaultAddressUser={setDefaultAddressId} />
                </Box>

                <Box h={'1px'} bgColor={'#dfe1e3'} w={'100%'}></Box>
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  p={'10px 0px'}
                  fontWeight={700}
                  fontSize={'14px'}
                  lineHeight={'20px'}
                  letterSpacing={'0px'}
                  margin={'0px'}
                  color={'#31353BF5'}
                  borderBottom="6px solid #0095DA"
                  mb={'10px'}
                >
                  <Text>Total Price</Text>
                  <Text>
                    {
                      new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      })
                        .format(cartSelector.totalPrice)
                        .split(',')[0]
                    }
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Shopping Summary */}
          <Box w="350px" mt="20px">
            <Box>
              <Box
                inset="92px auto auto 0px"
                zIndex={'1'}
                boxShadow={'0 0 10px 0 rgb(0 0 0 / 10%)'}
                borderRadius={'15px'}
                border={'1px solid #dfe1e3'}
              >
                <Box p="16px" pb={'25px'}>
                  <Text
                    fontWeight={700}
                    lineHeight={1.6}
                    fontSize={'14px'}
                    color={'#31353B'}
                  >
                    Transactions
                  </Text>
                  <Box
                    lineHeight={1.5}
                    fontSize={'14px'}
                    color={'#31353B'}
                    textTransform={'capitalize'}
                    m="16px 0"
                  >
                    <Box display={'flex'} justifyContent="space-between">
                      <Box p={'0px 14px 0px 0px'}>
                        Total price ({cartSelector.totalQuantity}{' '}
                        {cartSelector.totalQuantity < 2
                          ? 'product'
                          : 'products'}
                        )
                      </Box>
                      <Box>
                        {
                          new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          })
                            .format(cartSelector.totalPrice)
                            .split(',')[0]
                        }
                      </Box>
                    </Box>
                    <Box display={'flex'} justifyContent="space-between">
                      <Box p={'0px 14px 0px 0px'}>Shipping Cost</Box>
                      <Box>
                        {
                          new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                          })
                            .format(shippingFee)
                            .split(',')[0]
                        }
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display={'flex'}
                    justifyContent="space-between"
                    pt="16px"
                    mb="22px"
                    borderTop="1px solid #dfe1e3"
                    fontWeight={700}
                    fontSize={'16px'}
                    color={'#31353B'}
                  >
                    <Box pr={'14px'}>Transactions Total</Box>
                    <Box fontSize={'17px'}>
                      {
                        new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        })
                          .format(totalBill)
                          .split(',')[0]
                      }
                    </Box>
                  </Box>
                  <Button
                    w="100%"
                    onClick={openPayment}
                    h={'48px'}
                    bgColor={'#0095DA'}
                    _hover={{
                      bgColor: '#0370A2',
                    }}
                    _active={'none'}
                  >
                    <Text lineHeight={'22px'} color="#fff" fontWeight={700}>
                      Payment
                    </Text>
                  </Button>
                </Box>
              </Box>
              <Shipping
                closestWarehouseTransaction={setClosestWarehouse}
                selectedCourir={setCourirDuration}
                shippingFeePay={setShippingFee}
                productWeight={productWeight}
                shippingError={shippingError}
                setShippingError={setShippingError}
              />
            </Box>
          </Box>
        </Flex>
      </Box>

      {/* Alert */}
      <Alert
        body={'Changes you make to this page will not be saved'}
        cancelRef={cancelRef}
        color="#0095DA"
        isOpen={isOpen}
        header="Back To Cart?"
        leftButton={'No'}
        rightButton={'Yes'}
        onClose={onClose}
        onSubmit={() => navigate('/cart')}
      />

      {/* Modal Payment */}
      <Payment
        paymentIsOpen={paymentIsOpen}
        paymentOnclose={paymentOnclose}
        paymentOnOpen={paymentOnOpen}
        BCA={BCA}
        BCAChecked={BCAChecked}
        BNI={BNI}
        BNIChecked={BNIChecked}
        mandiri={mandiri}
        MandiriChecked={MandiriChecked}
        totalBill={totalBill}
        totalPrice={totalPrice}
        BCARadio={BCARadio}
        BNIRadio={BNIRadio}
        MandiriRadio={MandiriRadio}
        createNewTransaction={createNewTransaction}
      />
    </>
  );
};

export default Transactions;
