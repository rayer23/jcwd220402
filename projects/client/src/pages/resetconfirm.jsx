import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../api';
import * as Yup from 'yup';
import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { TfiControlBackward } from 'react-icons/tfi';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { detach } from '../redux/features/resetSlice';

const ResetConfirm = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(false);

  const [passwordFalse, setPasswordFalse] = useState(false);

  const resetSelector = useSelector((state) => state.reset);

  const passwordNotMatch = () => {
    setPasswordMatch(true);
    setPasswordFalse(true);
  };

  const dispatch = useDispatch();

  const toast = useToast();

  const navigate = useNavigate();

  const location = useLocation();

  const toggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmNewPassword = () => {
    setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    onSubmit: async ({ newPassword, confirmNewPassword }) => {
      try {
        const response = await axiosInstance.patch(
          `/auth/confirm-reset-password`,
          {
            newPassword,
            confirmNewPassword,
            token: params.reset_token,
          },
        );
        localStorage.removeItem('reset_token');
        dispatch(detach());

        toast({
          title: 'Reset Password Succesful',
          status: 'success',
          description: response.data.message,
        });

        formik.setFieldValue('newPassword', '');
        formik.setFieldValue('confirmNewPassword', '');
        navigate('/login');
      } catch (err) {
        console.log(err);
        toast({
          title: 'Reset Password Failed',
          status: 'error',
          description: err.response.data.message,
        });
      }
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required(8)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
        ),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    formik.setFieldValue(name, value);
  };

  useEffect(() => {
    if (!localStorage.getItem('reset_token')) {
      navigate('/reset-password');
    }
  }, []);

  return (
    <Box>
      <Link to="/login">
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
      <Box
        display={'flex'}
        fontSize="14px"
        justifyContent={'center'}
        mt={'50px'}
      >
        <Box
          w="450px"
          border="4px solid var(--N75,#0095DA)"
          borderRadius={'10px'}
          p="24px 40px 32px "
          textAlign={'center'}
          bgColor={'white'}
        >
          <Text
            fontSize="22px"
            fontWeight={'bold'}
            textAlign={'center'}
            color={'#0095DA'}
          >
            New Password
          </Text>

          <form onSubmit={formik.handleSubmit}>
            <Box m="20px 0 8px">
              <FormControl isInvalid={formik.errors.newPassword}>
                <InputGroup>
                  <Input
                    value={formik.values.newPassword}
                    name="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    onChange={formChangeHandler}
                    placeholder={'Enter new password'}
                    variant="flushed"
                  />
                  <InputRightElement width={'4.5rem'}>
                    <Button
                      mt={'-4px'}
                      ml={'19px'}
                      size={'md'}
                      bg={'white'}
                      onClick={toggleNewPassword}
                    >
                      {showNewPassword ? <VscEye /> : <VscEyeClosed />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Box mt={'20px'}>
                <FormControl isInvalid={formik.errors.confirmNewPassword}>
                  <InputGroup>
                    <Input
                      value={formik.values.confirmNewPassword}
                      name="confirmNewPassword"
                      type={showConfirmNewPassword ? 'text' : 'password'}
                      onChange={formChangeHandler}
                      placeholder={'Confirm new Password'}
                      variant="flushed"
                    />
                    <InputRightElement width={'4.5rem'}>
                      <Button
                        ml={'19px'}
                        size={'md'}
                        bg={'#white'}
                        onClick={toggleConfirmNewPassword}
                      >
                        {showConfirmNewPassword ? <VscEye /> : <VscEyeClosed />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  {formik.values.confirmNewPassword !==
                    formik.values.newPassword && passwordMatch ? (
                    <FormHelperText
                      color={'red'}
                      fontSize={'12px'}
                      textAlign={'left'}
                    >
                      Your new password does not match, please enter again.
                    </FormHelperText>
                  ) : null}
                </FormControl>
              </Box>
              <Box
                mt="8px"
                fontSize={'14px'}
                textAlign="left"
                color={'#9d9db7'}
              >
                <Text display={'inline'} mr="1" color={'#31353b'}>
                  Entering new password for email{' '}
                  <span style={{ color: '#0095DA' }}>
                    {resetSelector.email}
                  </span>
                </Text>
              </Box>
            </Box>
            <Box mt={'25px'} mb={'20px'} borderRadius={'10px'}>
              <Text fontSize={'11px'} color={'#31353b'} textAlign={'left'}>
                Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number
                and 1 Special Case Character.
              </Text>
            </Box>
            <Button
              display={'flex'}
              w="100%"
              bgColor={'#0095DA'}
              _hover={false}
              m="16px 0"
              color={'white'}
              isDisabled={!formik.values.newPassword}
              type={'submit'}
              onClick={passwordNotMatch}
            >
              <Text fontWeight={'bold'}>Reset Password</Text>
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetConfirm;
