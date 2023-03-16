import {
  Box,
  Button,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Icon,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { MdShoppingCart, MdOutlineAddShoppingCart } from 'react-icons/md';

import CartItem from './cartitem';

const Cart = ({ authSelector, totalCartQuantity }) => {
  const cartSelector = useSelector((state) => state.cart);
  const renderCartNavbar = () => {
    return cartSelector.cart.map((val) => {
      return (
        <CartItem
          product_name={val?.Product.product_name}
          quantity={val?.quantity}
          product_weight={val?.Product.product_weight}
          price={val?.Product.price}
          image_urls={val?.Product.Image_Urls[0].image_url}
        />
      );
    });
  };
  return (
    <Box display={{ lg: 'flex', base: 'none' }}>
      <Box display={'flex'} gap="4" fontSize="14px" fontWeight={'semibold'}>
        <Link to="/cart">
          <Box
            display={'flex'}
            my="auto"
            gap={2}
            borderRight="2px solid #e0e0e0"
            paddingRight={'10px'}
            color="#6c727c"
          >
            <Popover trigger="hover">
              <PopoverTrigger>
                <Link to="/cart">
                  <Button
                    ml={!authSelector.id ? '0px' : '10px'}
                    bgColor={'inherit'}
                    fontSize={'2xl'}
                    _hover={{
                      color: '#0095DA',
                    }}
                    mr={'10px'}
                    p={2}
                  >
                    <MdShoppingCart fontSize={'24px'} />
                    {cartSelector.cart.length && authSelector.id ? (
                      <sup>
                        <Box
                          fontSize={'11px'}
                          backgroundColor={'#EF144A'}
                          borderRadius={'50%'}
                          m={'-2px -8px 0px -8px'}
                          p={'7px 6px 8px 5px'}
                          color={'white'}
                          fontWeight={700}
                        >
                          {cartSelector.totalCartQuantity}
                        </Box>
                      </sup>
                    ) : null}
                  </Button>
                </Link>
              </PopoverTrigger>

              {!cartSelector.cart.length || !authSelector.id ? (
                <>
                  {/* if cart empty or user not logged in yet*/}
                  <PopoverContent>
                    <PopoverBody>
                      <Box>
                        <Text
                          color={'#393d43'}
                          textAlign="center"
                          fontWeight={'bold'}
                        >
                          Your Shopping cart still empty
                        </Text>
                        <br></br>
                        <Icon
                          margin={'auto'}
                          w={'100px'}
                          h={'100px'}
                          ml={'100px'}
                        >
                          <MdOutlineAddShoppingCart
                            color={'#0095DA'}
                            fontSize={20}
                          />
                        </Icon>
                        <Text
                          mt={'5px'}
                          color={'#919396'}
                          textAlign="center"
                          fontSize={'12px'}
                          mb={'5px'}
                        >
                          Let's start shopping now !
                        </Text>
                      </Box>
                    </PopoverBody>
                  </PopoverContent>
                </>
              ) : (
                <>
                  {/* if cart filled */}
                  <PopoverContent w={'405px'} borderRadius={'12px'}>
                    <PopoverBody>
                      <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        mt={'8px'}
                        mb={'12px'}
                        pl={'2px'}
                        pr={'2px'}
                      >
                        <Text fontSize={'15px'} fontWeight={600}>
                          Total ({totalCartQuantity})
                        </Text>
                        <Link to="/cart">
                          <Text
                            color="#0095DA"
                            fontWeight={700}
                            fontSize={'13px'}
                            mr={'5px'}
                          >
                            {' '}
                            Cart
                          </Text>
                        </Link>
                      </Box>
                      <Box
                        h={'1px'}
                        bgColor={'#0095DA'}
                        mb={'-6px'}
                        pb={'2px'}
                      />
                      <Box
                        h={'1px'}
                        bgColor={'transparent'}
                        pb={'4px'}
                        mt={'2px'}
                      />
                      <Box
                        pt={'2px'}
                        overflow={'auto'}
                        maxH={'335px'}
                        cursor={'pointer'}
                      >
                        {renderCartNavbar()}
                      </Box>
                    </PopoverBody>
                  </PopoverContent>
                </>
              )}
            </Popover>
          </Box>
        </Link>
      </Box>
    </Box>
  );
};

export default Cart;
