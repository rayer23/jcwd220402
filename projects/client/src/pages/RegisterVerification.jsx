import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import delisha from '../assets/LogoDelisha.18.02.jpeg';
import { useFormik } from 'formik';
import { axiosInstance } from '../api';
import * as Yup from 'yup';
import { useState } from 'react';
import { BiHide, BiShow } from 'react-icons/bi';

const RegisterVerification = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  const toast = useToast();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ password, username }) => {
      try {
        const response = await axiosInstance.post('/auth/registerPassword', {
          username,
          password,
          token: params.verification_token,
        });

        toast({
          title: 'Registration Success',
          description: response.data.message,
          status: 'success',
        });
        formik.setFieldValue('password', '');
        formik.setFieldValue('username', '');
        navigate('/login');
      } catch (error) {
        console.log(error.response);
        toast({
          title: 'Registration Failed',
          description: error.response.data.message,
          status: 'error',
        });
      }
    },
    validationSchema: Yup.object({
      username: Yup.string().required().min(3),
      password: Yup.string()
        .required(8)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          '*Your password does not meet requirement below',
        ),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    formik.setFieldValue(name, value);
  };

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
        <Box width={{ lg: '50%', md: '100%', base: '100%' }} fontSize="16px">
          <Box
            w="420px"
            mx={{ lg: null, md: 'auto', base: 'auto' }}
            ml={{ lg: '75px', md: null, base: null }}
            boxShadow={'0 0 10px 0 rgb(0 0 0 / 10%)'}
            border="1px solid var(--N75,#E5E7E9)"
            borderRadius={'3px'}
            p="24px 40px 32px "
            textAlign={'center'}
          >
            <Text fontSize="30px" fontWeight={'bold'}>
              Register Form
            </Text>

            <Text mt="10px" fontSize="20px">
              {' '}
              Insert These Fields To Make an Account{' '}
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
                    username
                  </Text>
                  <FormControl isInvalid={formik.errors.username}>
                    <InputGroup>
                      <Input
                        onChange={formChangeHandler}
                        border={'2.5px solid #0058a3'}
                        placeholder="username"
                        p="8px 2px"
                        value={formik.values.username}
                        name="username"
                        type="text"
                      />
                    </InputGroup>

                    <FormErrorMessage>
                      {formik.errors.username}
                    </FormErrorMessage>
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
                    password
                  </Text>
                  <FormControl isInvalid={formik.errors.password}>
                    <InputGroup>
                      <Input
                        onChange={formChangeHandler}
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
                  <Text fontSize={'12px'} textAlign="start" mt="4px">
                    Minimum 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character
                  </Text>
                </Box>
              </Box>
              <Button
                display={'flex'}
                w="100%"
                bgColor={'#0058a3'}
                borderRadius={'20px'}
                _hover={false}
                m="50px 0 0"
                type="submit"
                color={'white'}
                isDisabled={!formik.values.password || !formik.values.username}
              >
                <Text fontWeight={'bold'}>Completed!</Text>
              </Button>
            </form>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterVerification;
