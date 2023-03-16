import {
  useToast,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  ButtonGroup,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { BiShow } from 'react-icons/bi';
import { BiHide } from 'react-icons/bi';
import delisha from '../assets/LogoDelisha.18.02.jpeg';
import { axiosInstance } from '../api';
import { login } from '../redux/features/authSlice';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { gapi } from 'gapi-script';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const clientId = process.env.REACT_APP_CLIENT_ID;
const appId = process.env.REACT_APP_APP_ID;

const Login = () => {
  const authSelector = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const grill = useToast();

  const navigate = useNavigate();

  const place = useLocation();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ email, password }) => {
      try {
        const res = await axiosInstance.post('/auth/login', {
          email,
          password,
        });

        grill({
          title: 'Successfully Login',
          status: 'success',
          description: res.data.message,
          duration: 4000,
          isClosable: true,
        });

        localStorage.setItem('auth_token', res.data.token);
        dispatch(
          login({
            id: res.data.data.id,
            email: res.data.data.email,
            RoleId: res.data.data.RoleId,
            username: res.data.data.username,
            phone_number: res.data.data.phone_number,
            profile_picture: res.data.data.profile_picture,
            is_verify: res.data.data.is_verify,
            WarehouseId: res?.data.data.WarehouseId,
          }),
        );
        console.log(res);
        formik.setFieldValue('email', '');
        formik.setFieldValue('password', '');
        navigate(place.state.from);
      } catch (err) {
        console.log(err);
        grill({
          title: 'Login Failed',
          status: 'error',
          description: err.response.data.message,
        });
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().required(),
      password: Yup.string().required(),
    }),
    validateOnChange: false,
  });

  const formHandler = ({ target }) => {
    const { name, value } = target;
    formik.setFieldValue(name, value);
  };

  const handleFacebook = async (response) => {
    try {
      const res = await axiosInstance.post('/auth/loginSocialMedia', {
        username: response.name,
        email: response.email,
      });

      grill({
        title: 'Successfully Login',
        status: 'success',
        position: 'top',
        description: res.data.message,
        duration: 4000,
        isClosable: true,
      });

      localStorage.setItem('auth_token', res.data.token);
      dispatch(
        login({
          id: res.data.data.id,
          email: res.data.data.email,
          RoleId: res.data.data.RoleId,
          username: res.data.data.username,
          phone_number: res.data.data.phone_number,
          profile_picture: res.data.data.profile_picture,
          is_verify: res.data.data.is_verify,
          WarehouseId: res?.data.data.WarehouseId,
        }),
      );
    } catch (err) {
      console.log(err);
    }
    navigate(place.state.from);
  };

  const handleSuccess = async (response) => {
    try {
      const res = await axiosInstance.post('/auth/loginSocialMedia', {
        username: response.profileObj.name,
        email: response.profileObj.email,
      });
      grill({
        title: 'Successfully Login',
        status: 'success',
        description: res.data.message,
        duration: 4000,
        isClosable: true,
      });

      localStorage.setItem('auth_token', res.data.token);
      dispatch(
        login({
          id: res.data.data.id,
          email: res.data.data.email,
          RoleId: res.data.data.RoleId,
          username: res.data.data.username,
          phone_number: res.data.data.phone_number,
          profile_picture: res.data.data.profile_picture,
          is_verify: res.data.data.is_verify,
          WarehouseId: res?.data.data.WarehouseId,
        }),
      );
    } catch (err) {
      console.log(err);
    }
    navigate(place.state.from);
  };

  const handleFailure = (err) => {
    console.log(err);
  };

  useEffect(() => {
    const initiate = () => {
      gapi.client.init({
        client: clientId,
        scope: '',
      });
    };
    gapi.load('client:auth2', initiate);
  });

  return (
    <Box>
      <Link to={'/'}>
        <Box
          justifyContent={'center'}
          display={'flex'}
          textAlign={'center'}
          minW={{ lg: '960px', md: null, base: null }}
          mt="35px"
        >
          <Image src={delisha} height={'75px'} width={'150px'} />
        </Box>
      </Link>

      <Box
        display={'flex'}
        justifyContent={'center'}
        maxW="1190px"
        pt="100px"
        mx={'auto'}
      >
        <Box width={{ lg: '50%', md: '100%', base: '100%' }} fontSize="15px">
          <Box
            w="430px"
            mx={{ lg: null, md: 'auto', base: 'auto' }}
            ml={{ lg: '75px', md: null, base: null }}
            boxShadow={'0 0 10px 0 rgb(0 0 0 / 10%)'}
            border="1px solid var(--N75,#E5E7E9)"
            borderRadius={'3px'}
            p="24px 40px 32px "
            textAlign={'center'}
          >
            <Text fontSize="30px" fontWeight={'bold'} textAlign="start">
              Sign in
            </Text>

            <form onSubmit={formik.handleSubmit}>
              <Box m="20px 0 8px">
                <Box>
                  <Text
                    fontSize={'12px'}
                    textAlign="start"
                    mb="5px"
                    fontWeight={'bold'}
                  >
                    Email
                  </Text>
                  <FormControl isInvalid={formik.errors.email}>
                    <Input
                      onChange={formHandler}
                      border={'2.5px solid #0058a3'}
                      placeholder="email"
                      p="8px 2px"
                      value={formik.values.email}
                      name="email"
                      type="text"
                    />

                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>
                </Box>
              </Box>
              <Box m="15px 0 15px">
                <Box mb="8px">
                  <Text
                    fontSize={'12px'}
                    textAlign="start"
                    mb="5px"
                    fontWeight={'bold'}
                  >
                    Password
                  </Text>
                  <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  <FormControl isInvalid={formik.errors.password}>
                    <InputGroup>
                      <Input
                        onChange={formHandler}
                        border={'2.5px solid #0058a3'}
                        placeholder="password"
                        p="8px 2px"
                        value={formik.values.password}
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                      />
                      <InputRightElement width="3rem">
                        <Button
                          size="sm"
                          _active={false}
                          _hover={false}
                          onClick={togglePassword}
                          color={'#0095DA'}
                          bgColor="transparent"
                        >
                          {showPassword ? <BiShow /> : <BiHide />}
                        </Button>
                      </InputRightElement>
                    </InputGroup>

                    <FormErrorMessage>
                      {formik.errors.password}
                    </FormErrorMessage>
                  </FormControl>
                  <Box>
                    <Link to="/reset-password">
                      <Text
                        cursor={'pointer'}
                        textAlign={'right'}
                        color={'#0058a3'}
                        fontSize={'13px'}
                        mt={'6px'}
                      >
                        Forgot password?
                      </Text>
                    </Link>
                  </Box>
                </Box>
              </Box>
              <Button
                display={'flex'}
                w="100%"
                bgColor={'#0058a3'}
                borderRadius={'20px'}
                _hover={false}
                m="20px 0 0"
                type={'submit'}
                color={'white'}
                isDisabled={!formik.values.email}
              >
                <Text fontWeight={'bold'}>Sign in</Text>
              </Button>

              <Box margin="20px 0">
                <Box justifyContent={'space-between'} display="flex">
                  <Box width="45%">
                    <hr />
                  </Box>

                  <Box width="45%">
                    <hr />
                  </Box>
                </Box>
                <Text
                  textAlign={'center'}
                  mt="-13px"
                  mx={'auto'}
                  bgColor={'white'}
                  color={'#B0BFBF'}
                >
                  or
                </Text>
              </Box>

              <Box display={'flex'} gap="2" mt={'20px'}>
                <GoogleLogin
                  clientId={clientId}
                  buttonText={null}
                  onSuccess={handleSuccess}
                  onFailure={handleFailure}
                  cookiePolicy={'single_host_origin'}
                  isSignedIn={false}
                  render={(renderProps) => (
                    <Button
                      display={'flex'}
                      onClick={renderProps.onClick}
                      w="100%"
                      bgColor={'white'}
                      border="1px solid #0058a3"
                      _hover={false}
                    >
                      <Box mr="6px" my={'auto'}>
                        <FcGoogle fontSize={'25px'} />
                      </Box>
                      <Text>Google</Text>
                    </Button>
                  )}
                />
                <FacebookLogin
                  appId={appId}
                  autoLoad={false}
                  callback={handleFacebook}
                  fields="name,email,picture"
                  render={(renderProps) => (
                    <Button
                      display={'flex'}
                      onClick={renderProps.onClick}
                      bgColor={'white'}
                      w="100%"
                      border="1px solid #0058a3"
                      _hover={false}
                    >
                      <Box mr="6px" my={'auto'}>
                        <FaFacebook fontSize={'25px'} color="#3b5998" />
                      </Box>
                      <Text>Facebook</Text>
                    </Button>
                  )}
                />
              </Box>
            </form>
          </Box>
          <Box>
            <Box margin="40px 0">
              <Box justifyContent={'space-between'} display="flex">
                <Box width="38%">
                  <hr />
                </Box>

                <Box width="38%">
                  <hr />
                </Box>
              </Box>
              <Text
                textAlign={'center'}
                mt="-13px"
                mx={'auto'}
                bgColor={'white'}
                color={'#B0BFBF'}
              >
                New to Delisha?
              </Text>
            </Box>
            <Link to={'/register'}>
              <Box
                justifyContent={'center'}
                display={'flex'}
                textAlign={'center'}
                // mt="50px"
              >
                <Button
                  display={'flex'}
                  w="250px"
                  bgColor={'#0058a3'}
                  _hover={false}
                  color={'#fff'}
                  m="5px 0"
                  borderRadius={'10px'}
                >
                  Create your Delisha Account
                </Button>
              </Box>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
