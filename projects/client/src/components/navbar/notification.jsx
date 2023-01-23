import {
  Box,
  Grid,
  GridItem,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Stack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IoIosAlert, IoIosNotifications } from 'react-icons/io';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { SiClockify } from 'react-icons/si';
import { FcProcess } from 'react-icons/fc';
import { TbTruckDelivery } from 'react-icons/tb';
import { BsBagCheckFill } from 'react-icons/bs';

const Notification = ({ authSelector, navigate, unpaidTransaction }) => {
  const transSelector = useSelector((state) => state.trans);
  const statusOrder = transSelector.trans.map((val) => val.OrderStatusId);

  let StatusOrderActive = [];
  let AwaitingConfirmation = [];
  let Processed = [];
  let Shipping = [];
  let Delivered = [];

  for (let i = 0; i < statusOrder.length; i++) {
    if (statusOrder[i] === 1) {
      AwaitingConfirmation.push(statusOrder[i]);
    } else if (statusOrder[i] === 2) {
      Processed.push(statusOrder[i]);
    } else if (statusOrder[i] === 3) {
      Shipping.push(statusOrder[i]);
    } else if (statusOrder[i] === 4) {
      Delivered.push(statusOrder[i]);
    }
  }

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

  const goToAwaitingConfirmation = () => {
    navigate('/transaction-list?status=Awaiting+Confirmation');
  };

  const goToProcessed = () => {
    navigate('/transaction-list?status=Processed');
  };

  const goToDelivered = () => {
    navigate('/transaction-list?status=Delivered');
  };

  const goToShipping = () => {
    navigate('/transaction-list?status=Shipping');
  };
  return (
    <Box>
      {authSelector.id ? (
        <Box
          display={'flex'}
          gap="4"
          fontSize="14px"
          fontWeight={'semibold'}
          cursor={'pointer'}
        >
          <Box
            display={'flex'}
            my="auto"
            gap={2}
            paddingRight={1}
            color="#6c727c"
          >
            <Popover trigger="hover">
              <PopoverTrigger>
                <Box pl={'10px'} mr={'-12px'}>
                  <Stack
                    p={2}
                    _hover={{
                      color: '#0095DA',
                    }}
                  >
                    <Box display={'flex'} flexDir={'row'}>
                      <MdOutlineNotificationsActive fontSize={'25px'} />
                      {transSelector.trans.length && authSelector.id ? (
                        <sup>
                          <Box
                            fontSize={'11px'}
                            backgroundColor={'#EF144A'}
                            borderRadius={'50%'}
                            m={'-2px -9px 0px -8px'}
                            p={'6px 5px 8px 5px'}
                            color={'white'}
                            fontWeight={700}
                          >
                            {StatusOrderActive.length +
                              unpaidTransaction.length}
                          </Box>
                        </sup>
                      ) : null}
                    </Box>
                  </Stack>
                </Box>
              </PopoverTrigger>
              <PopoverContent
                width={'400px'}
                height={'270px'}
                borderRadius={'20px'}
              >
                <Box boxShadow={'rgba(0, 0, 0, 0.05) 0px 3px 8px'}>
                  <PopoverHeader
                    display={'flex'}
                    justifyContent="space-between"
                    pt={'10px'}
                    pb={'10px'}
                  >
                    <Text fontSize={'17px'}>Notification</Text>
                    {/* <Box fontSize={'21px'}>
                      <IoIosAlert />
                    </Box> */}
                  </PopoverHeader>
                </Box>
                <PopoverBody>
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    pb={'7px'}
                    pt={'5px'}
                  >
                    <Text fontSize={'15px'} fontWeight={600} ml={'10px'}>
                      Transaction
                    </Text>
                    <Link to={'/transaction-list'}>
                      <Text
                        color={'#0095DA'}
                        fontSize={'12px'}
                        mt={'10px'}
                        mb={'-5px'}
                      >
                        See All
                      </Text>
                    </Link>
                  </Box>
                  <Box display={'flex'} dir={'row'} justifyContent={''}>
                    <Box
                      width={'400px'}
                      bgColor={'#0095DA'}
                      h={'3px'}
                      mb={'7px'}
                    />
                  </Box>
                  <Box pl={'8px'} pr={'8px'} mt={'4px'}>
                    <Box
                      _hover={{
                        bgColor: '#f3f4f5',
                      }}
                      display={'flex'}
                      w={'370px'}
                      flexDir={'row'}
                      justifyContent={'space-between'}
                      // border={'1px solid #0095DA'}
                      // borderRadius={'5px'}
                      p={'6px 5px 8px 5px'}
                      alignItems={'center'}
                      ml={'-8px'}
                      onClick={() => navigate('/transaction/payment-list')}
                    >
                      <Text
                        color={'#31353BAD'}
                        fontSize={'13px'}
                        fontWeight={400}
                      >
                        Waiting for payment
                      </Text>
                      <Text
                        fontWeight={500}
                        textAlign={'center'}
                        borderRadius={'8px'}
                        color={'#fff'}
                        bgColor={
                          unpaidTransaction.length === 0 ? null : '#ef144a'
                        }
                        p={'0px 1px'}
                        fontSize={'10px '}
                        w={'15px'}
                      >
                        {unpaidTransaction.length === 0
                          ? null
                          : unpaidTransaction.length}
                      </Text>
                    </Box>
                    <Grid
                      templateColumns="repeat(4, 1fr)"
                      gap={'4px'}
                      mt={'15px'}
                      display={'flex'}
                      justifyContent={'space-between'}
                    >
                      <GridItem
                        w="70px"
                        h="10"
                        alignItems={'center'}
                        onClick={goToAwaitingConfirmation}
                      >
                        <Box display={'flex'}>
                          <Icon
                            margin={'auto'}
                            w={'47px'}
                            h={'47px'}
                            ml={'15px'}
                          >
                            <SiClockify color={'#EF144A'} fontSize={20} />
                          </Icon>
                          {!AwaitingConfirmation.length ? null : (
                            <sup>
                              <Box
                                fontSize={'11px'}
                                backgroundColor={'#EF144A'}
                                borderRadius={'50%'}
                                m={'3px 11px 0px -8px'}
                                p={'6px 5px 8px 5px'}
                                color={'white'}
                                fontWeight={700}
                              >
                                {AwaitingConfirmation.length}
                              </Box>
                            </sup>
                          )}
                        </Box>
                        <Text
                          mt={'8px'}
                          textAlign={'center'}
                          fontSize={'12px'}
                          fontWeight={400}
                          fontFamily={'Open Sauce One,Nunito Sans, sans-serif'}
                        >
                          Awaiting Confirmation
                        </Text>
                      </GridItem>
                      <GridItem w="60px" h="10" onClick={goToProcessed}>
                        <Box display={'flex'}>
                          <Icon
                            margin={'auto'}
                            w={'47px'}
                            h={'47px'}
                            ml={'11px'}
                          >
                            <FcProcess fontSize={20} />
                          </Icon>
                          {!Processed.length ? null : (
                            <sup>
                              <Box
                                fontSize={'11px'}
                                backgroundColor={'#EF144A'}
                                borderRadius={'50%'}
                                m={'3px 6px 0px -8px'}
                                p={'6px 5px 8px 5px'}
                                color={'white'}
                                fontWeight={700}
                              >
                                {Processed.length}
                              </Box>
                            </sup>
                          )}
                        </Box>
                        <Text
                          mt={'8px'}
                          textAlign={'center'}
                          fontSize={'12px'}
                          fontWeight={400}
                        >
                          Processed
                        </Text>
                      </GridItem>
                      <GridItem w="60px" h="10" onClick={goToShipping}>
                        <Box display={'flex'}>
                          <Icon
                            margin={'auto'}
                            w={'47px'}
                            h={'47px'}
                            ml={'11px'}
                          >
                            <TbTruckDelivery color="#00B526" fontSize={20} />
                          </Icon>
                          {!Shipping.length ? null : (
                            <sup>
                              <Box
                                fontSize={'11px'}
                                backgroundColor={'#EF144A'}
                                borderRadius={'50%'}
                                m={'5px 5px 0px -10px'}
                                p={'6px 5px 8px 5px'}
                                color={'white'}
                                fontWeight={700}
                              >
                                {Shipping.length}
                              </Box>
                            </sup>
                          )}
                        </Box>
                        <Text
                          mt={'6px'}
                          textAlign={'center'}
                          fontSize={'12px'}
                          fontWeight={400}
                        >
                          Shipping
                        </Text>
                      </GridItem>
                      <GridItem w="60px" h="10" onClick={goToDelivered}>
                        <Box display={'flex'}>
                          <Icon
                            margin={'auto'}
                            w={'47px'}
                            h={'47px'}
                            ml={'11px'}
                          >
                            <BsBagCheckFill color="#0095DA" fontSize={20} />
                          </Icon>
                          <sup>
                            <Box
                              fontSize={'11px'}
                              bgColor={
                                !Delivered.length ? 'transparent' : '#EF144A'
                              }
                              borderRadius={'50%'}
                              m={'5px 8px 0px -10px'}
                              p={'6px 5px 8px 5px'}
                              color={
                                !Delivered.length ? 'transparent' : 'white'
                              }
                              fontWeight={700}
                            >
                              {Delivered.length}
                            </Box>
                          </sup>
                        </Box>
                        <Text
                          mt={'4px'}
                          textAlign={'center'}
                          fontSize={'12px'}
                          fontWeight={400}
                          fontFamily={'Open Sauce One,Nunito Sans, sans-serif'}
                        >
                          Delivered
                        </Text>
                      </GridItem>
                    </Grid>
                  </Box>
                  <Box
                    width={'100%'}
                    bgColor={'#e5e7e9'}
                    h={'5px'}
                    mt={'50px'}
                  />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};
export default Notification;
