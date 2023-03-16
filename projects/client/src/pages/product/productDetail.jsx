import {
  Box,
  Text,
  Stack,
  Image,
  Button,
  useNumberInput,
  Input,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { axiosInstance } from '../../api';
import { Carousel } from 'react-responsive-carousel';
import { useDispatch, useSelector } from 'react-redux';
import { MdModeEdit } from 'react-icons/md';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {
  addItemToCart,
  fillCart,
  getTotalCartQuantity,
} from '../../redux/features/cartSlice';

const ProductDetail = ({ product_name, id }) => {
  const [productDetail, setProductDetail] = useState([]);
  const [image, setImage] = useState([]);
  const [stock, setStock] = useState([]);
  const [productId, setProductId] = useState([]);
  const [cartItemQuantity, setCartItemQuantity] = useState(null);
  const [addNote, setAddNote] = useState(false);
  const [inputNote, setInputNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const authSelector = useSelector((state) => state.auth);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const location = useLocation();

  const params = useParams();

  const fetchProductDetail = async () => {
    try {
      const response = await axiosInstance.get(`/product/${params.id}`);
      setProductDetail(response.data.data);
      setImage(response.data.data.Image_Urls);
      setProductId(response.data.data.id);

      const cartStock = response.data.data.Total_Stocks.map((val) => val.stock);

      let Total = 0;

      for (let i = 0; i < cartStock.length; i++) {
        Total += Number(cartStock[i]);
      }

      setStock(Total);
      setIsLoading(true);
    } catch (err) {
      console.log(err);
    }
  };

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: 1,
      min: 1,
      max: stock,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();
  const addQuantity = Number(input.value);

  const userShouldLogin = () => {
    if (!authSelector.id) {
      onOpen();
    }
  };
  console.log(cartItemQuantity);

  const fetchCartByProductId = async () => {
    try {
      const response = await axiosInstance.get(
        `/carts/cartBy/ProductId/${productId}`,
      );

      if (response.data.data === null) {
        setCartItemQuantity(null);
      } else {
        setCartItemQuantity(response.data.data.quantity);
      }
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMyCart = async () => {
    try {
      const response = await axiosInstance.get('/carts/me');
      dispatch(fillCart(response.data.data));

      const cartQuantity = response.data.data.map((val) => val.quantity);

      let Total = 0;

      for (let i = 0; i < cartQuantity.length; i++) {
        Total += Number(cartQuantity[i]);
      }

      dispatch(getTotalCartQuantity(Total));
    } catch (err) {
      console.log(err);
    }
  };

  const addToCart = async () => {
    try {
      let addToCart = {
        ProductId: productId,
        quantity: addQuantity,
        note: inputNote,
      };

      const response = await axiosInstance.post('/carts', addToCart);

      dispatch(addItemToCart(response.data.data));
      toast({
        title: 'Cart Items Added',
        status: 'success',
      });

      fetchMyCart();
      fetchCartByProductId();
    } catch (err) {
      console.log(err);

      if (stock === 0) {
        toast({
          title: `Failed Added Cart Items`,
          status: 'error',
          description: 'Product out of stock',
        });
      } else {
        toast({
          title: `Failed Added Cart Items`,
          status: 'error',
          description: err.response.data.message,
        });
      }
    }
  };

  const addToExistingCart = async () => {
    try {
      let newQuantity = {
        quantity: addQuantity,
        note: inputNote,
      };
      const response = await axiosInstance.patch(
        `/carts/addCartItems/${productId}`,
        newQuantity,
      );

      dispatch(addItemToCart(response.data.data));

      toast({
        title: 'Cart Items Added',
        status: 'success',
      });

      fetchCartByProductId();
      fetchMyCart();
    } catch (err) {
      console.log(err);

      const itemLeft = stock - cartItemQuantity;

      if (stock === 0) {
        toast({
          title: `Failed Added Cart Items`,
          status: 'error',
          description: 'Product out of stock',
        });
      } else {
        toast({
          title: `Only ${itemLeft} left and you already have ${cartItemQuantity} of this item in your cart.`,
          status: 'error',
          description: err.response.data.message,
        });
      }
    }
  };

  const cancelNotes = () => {
    setAddNote(false);
    setInputNote('');
  };

  useEffect(() => {
    fetchProductDetail();
  }, []);

  useEffect(() => {
    isLoading && fetchCartByProductId();
  }, [cartItemQuantity, productDetail, addQuantity]);

  return (
    <>
      <Box
        mx="auto"
        mt="150px"
        w="1150px"
      >
        {isLoading === false ? (
          <Box
            w={'1200px'}
            h={'600px'}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            alignContent={'center'}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Box>
        ) : (
          <Box display="flex" gap="20px">
            <Box borderRadius={'15px'} display={'block'} w="348px" h="420px">
              <Carousel showStatus={false} showArrows={true} showThumbs={false} >
                {image.map((val) => (
                  <Stack>
                    <Box
                      w="348px"
                      h="348px"
                      borderRadius={'15px'}
                      display={'block'}
                    >
                      <Image
                        src={val.image_url}
                        w="348px"
                        h="348px"
                        objectFit={'cover'}
                        borderRadius={'15px'}
                      />
                    </Box>
                  </Stack>
                ))}
              </Carousel>
            </Box>

            {/* Product */}

            {/* Add to cart */}
            <Box
              bgColor={'#fff'}
              right={'250px'}
              p={'16px 12px'}
              display="block"
              px="16px"
              w="268px"
              h={'100%'}
              // boxShadow={"0 0 10px 0 rgb(0 0 0 / 10%) !important"}
              borderRadius={'15px'}
              // border={"1px solid #0058a3"}
            >
              <Box
                borderRadius={'12px'}
                w="468px"
                // h='700px'
                display="block"
                mx="auto"
              >
                <Box display={'grid'} gap="5px">
                  {/* Product Name */}
                  <Stack
                    // border="1px solid red"
                    w="468px"
                    h="40px"
                  >
                    <Text
                      fontSize={'17px'}
                      fontFamily={'Poppins, sans-serif'}
                      fontWeight="bold"
                    >
                      {productDetail?.product_name}
                    </Text>
                  </Stack>

                  {/* Price */}

                  <Stack w="468px" h="50px" borderBottom={'1px solid #dfe1e3'}>
                    <Text
                      fontSize={'17px'}
                      fontFamily={'Poppins, sans-serif'}
                      fontWeight="bold"
                    >
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(productDetail.price)}
                    </Text>
                  </Stack>

                  {/* Description */}

                  <Stack
                    // border="1px solid brown"
                    w="468px"
                    minH={'92px'}
                  >
                    <Text
                      fontSize="14"
                      fontFamily="sans-serif"
                      whiteSpace={'pre-line'}
                    >
                      {productDetail.description}
                    </Text>
                  </Stack>
                </Box>
              </Box>

              <Box gap="20px">
                <Stack>
                  <Text
                    fontSize="16px"
                    fontWeight={700}
                    textAlign={'left'}
                    lineHeight={'22px'}
                    m={'4px 0px 20px'}
                    color={'#3135BF5'}
                    fontFamily={
                      'Open Sauce One, Nunito Sans, -apple-system, sans-serif'
                    }
                  >
                    Arrange amount and notes
                  </Text>
                </Stack>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  boxSizing={'inherit'}
                  w={'242.03px'}
                  h={'27.97px'}
                >
                  {/* set amount */}
                  <Box
                    w={'107px'}
                    h={'31px'}
                    display={'flex'}
                    border={'1px solid #BFC9D9'}
                    borderRadius={'13px'}
                    p={'3px'}
                    alignItems={'center'}
                    _hover={{
                      borderColor: '#0058a3',
                    }}
                    justifyContent={'flex-start'}
                  >
                    <Box
                      maxW={'20px'}
                      maxH={'20px'}
                      minH={'20px'}
                      minW={'20px'}
                      w={'20px'}
                      h={'20px'}
                      p={'0px'}
                      color={addQuantity > 1 ? '#0095DA' : '#c0cada'}
                      {...dec}
                      isDisabled={stock === 0 ? true : false}
                      bgColor={'#fff'}
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      _hover={'none'}
                      _active={'none'}
                    >
                      <AiOutlineMinus
                        style={{
                          height: '16px',
                          width: '16px',
                          color: '#0058a3',
                        }}
                      />
                    </Box>
                    <Input
                      isDisabled={stock === 0 ? true : false}
                      minWidth={'56px'}
                      maxWidth={'56px'}
                      height={'20px'}
                      textAlign="center"
                      p={'1px'}
                      {...input}
                      fontFamily={
                        'Open Sauce One, Nunito Sans, -apple-system, sans-serif'
                      }
                      fontSize={'14px'}
                      lineHeight={'18px'}
                      color={'rgba(49,53,59,0.68)'}
                      borderColor={'#fff'}
                      _hover={'none'}
                      focusBorderColor={'#fff'}
                      type={'number'}
                    />
                    {stock === 0 ? (
                      <Box
                        maxW={'20px'}
                        maxH={'20px'}
                        minH={'20px'}
                        minW={'20px'}
                        w={'20px'}
                        h={'20px'}
                        p={'0px'}
                        color={stock <= addQuantity ? '#c0cada' : '#0095DA'}
                        isDisabled={stock !== 0 ? false : true}
                        bgColor={'#fff'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        _hover={'none'}
                        _active={'none'}
                      >
                        <AiOutlinePlus style={{ color: '#0058a3' }} />
                      </Box>
                    ) : (
                      <Box
                        maxW={'20px'}
                        maxH={'20px'}
                        minH={'20px'}
                        minW={'20px'}
                        w={'20px'}
                        h={'20px'}
                        p={'0px'}
                        color={stock <= addQuantity ? '#c0cada' : '#0095DA'}
                        {...inc}
                        isDisabled={stock !== 0 ? false : true}
                        bgColor={'#fff'}
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        _hover={'none'}
                        _active={'none'}
                      >
                        <AiOutlinePlus style={{ color: '#0058a3' }} />
                      </Box>
                    )}
                  </Box>
                  <Text
                    lineHeight={'20px'}
                    ml={'8px'}
                    fontSize={'14px'}
                    fontFamily={
                      'Open Sauce One, Nunito Sans, -apple-system, sans-serif'
                    }
                    color={'#31353BF5'}
                    fontWeight={500}
                  >
                    {`Total Stocks: `}
                    <Text
                      as={'span'}
                      fontWeight={'bolder'}
                      color={stock === 0 ? '#FF6577' : '#31353BF5'}
                    >
                      {stock}
                    </Text>
                  </Text>
                </Box>
                {addQuantity > stock ? (
                  <Text
                    fontSize={'12px'}
                    fontFamily={'Open Sauce One, sans-serif'}
                    color={'red'}
                    mt={'5px'}
                    letterSpacing={'0.5px'}
                    fontWeight={500}
                  >
                    This product is currently out of stock {':('}
                  </Text>
                ) : null}

                {/* add notes */}
                {stock === 0 ? null : (
                  <Box
                    mt={'16px'}
                    display={'flex'}
                    color={'#0095DA'}
                    gap={'2px'}
                  >
                    {addNote === true ? null : (
                      <>
                        <MdModeEdit />
                        <Text
                          onClick={() => setAddNote(true)}
                          fontSize={'12px'}
                          fontFamily={'Open Sauce One, sans-serif'}
                          fontWeight={'600'}
                          lineHeight={'1,4'}
                          cursor={'pointer'}
                          color={'#0095DA'}
                          flex-direction={'row'}
                        >
                          Add Notes
                        </Text>
                      </>
                    )}
                    {addNote === true ? (
                      <Box>
                        <Input
                          padding={'10px 16px'}
                          type={'text'}
                          onChange={(e) => setInputNote(e.target.value)}
                          value={inputNote}
                          _placeholder={{
                            color: '#c2c2c2',
                          }}
                          placeholder={'Example: white color, medium size'}
                          width={'234px'}
                          height={'40px'}
                          margin={'0px'}
                          border={'1px solid #ebedee'}
                          borderRadius={'8px'}
                          color={'#31353BF5'}
                          focusBorderColor={'#0095DA'}
                          fontFamily={'Open Sauce One, Nunito Sans, sans-serif'}
                          fontSize={'14px'}
                        />
                        <Text
                          onClick={cancelNotes}
                          fontSize={'12px'}
                          fontFamily={'Open Sauce One, sans-serif'}
                          fontWeight={'600'}
                          lineHeight={'1,4'}
                          cursor={'pointer'}
                          color={'#0095DA'}
                          p={'0px'}
                          display={'flex'}
                          alignItems={'center'}
                          margin={'8px 0px 0px'}
                        >
                          Cancel Notes
                        </Text>
                      </Box>
                    ) : null}
                  </Box>
                )}
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  pb={'16px'}
                  mt={'18px'}
                >
                  <Text
                    color={'#31353BAD'}
                    fontFamily={
                      'Open Sauce One, Nunito Sans, -apple-system, sans-serif'
                    }
                    fontSize={'14px'}
                    fontWeight={'400'}
                    lineHeight={'18px'}
                    marginTop={'4px'}
                  >
                    Subtotal
                  </Text>
                  <Text
                    color={'#31353BF5'}
                    fontFamily={
                      'Open Sauce One, Nunito Sans, -apple-system, sans-serif'
                    }
                    fontSize={'18px'}
                    fontWeight={'bold'}
                    lineHeight={'26px'}
                    margin={'0px'}
                  >
                    {stock === 0
                      ? '-'
                      : new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                        })
                          .format(productDetail.price * addQuantity)
                          .split(',')[0]}
                  </Text>
                </Box>

                {cartItemQuantity === null ? (
                  <Button
                    letterSpacing={'0px'}
                    borderRadius={'25px'}
                    bgColor="#0058a3"
                    color="white"
                    w={'100%'}
                    h={'40px'}
                    fontFamily={
                      'Open Sauce One, Nunito Sans, -apple-system, sans-serif'
                    }
                    margin={'8px 0px'}
                    padding={'0px 16px'}
                    fontWeight={700}
                    alignItems={'center'}
                    _hover={{
                      bgColor: '#044279',
                    }}
                    _active={{
                      bgColor: '#32769C',
                    }}
                    onClick={authSelector.id ? addToCart : userShouldLogin}
                    isDisabled={
                      addQuantity === null || addQuantity === 0 || stock === 0
                        ? true
                        : false
                    }
                  >
                    Add to Shopping Cart
                  </Button>
                ) : (
                  <Button
                    letterSpacing={'0px'}
                    borderRadius={'25px'}
                    bgColor="#0058a3"
                    color="white"
                    w={'100%'}
                    h={'40px'}
                    fontFamily={
                      'Open Sauce One, Nunito Sans, -apple-system, sans-serif'
                    }
                    margin={'8px 0px'}
                    padding={'0px 16px'}
                    fontWeight={700}
                    alignItems={'center'}
                    _hover={{
                      bgColor: '#044279',
                    }}
                    _active={{
                      bgColor: '#32769C',
                    }}
                    onClick={
                      authSelector.id ? addToExistingCart : userShouldLogin
                    }
                    isDisabled={
                      addQuantity === null || addQuantity === 0 || stock === 0
                        ? true
                        : false
                    }
                  >
                    Add to Shopping Cart
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* if user not logged in */}
      <AlertDialog
        isCentered
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        size={'sm'}
        closeOnEsc={false}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            borderRadius={'25px'}
            mt={'-120px'}
            border={'1px solid #0058a3'}
          >
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              color={'#0058a3'}
              pt={'20px'}
            >
              Caution!
            </AlertDialogHeader>

            <AlertDialogBody>
              <Box
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                boxSizing={'border-box'}
              >
                <Text
                  pb={'15px'}
                  fontFamily={
                    'Open Sauce One, Nunito Sans, -apple-system, sans-serif'
                  }
                  fontWeight={550}
                >
                  You should login first before doing any sort of transactions
                </Text>
                <Link to={'/login'} replace state={{ from: location }}>
                  <Button
                    borderRadius={'20px'}
                    mt={'10px'}
                    width={'190px'}
                    bgColor="#0058a3"
                    color="white"
                    onClick={onClose}
                  >
                    Alright!
                  </Button>
                </Link>
              </Box>
            </AlertDialogBody>

            <AlertDialogFooter pb={'7px'}></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ProductDetail;
