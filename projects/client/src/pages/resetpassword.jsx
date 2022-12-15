import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { axiosInstance } from "../api";
import * as Yup from "yup";
import React, { useState } from "react";
import { TfiControlBackward } from "react-icons/tfi";

import { attach } from "../redux/features/resetSlice";

const RequestResetPassword = () => {
  const [emailMatch, setEmailMatch] = useState(false);

  const dispatch = useDispatch();

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: async ({ email }) => {
      try {
        const response = await axiosInstance.post(
          "/auth/request-reset-password",
          {
            email,
          }
        );

        localStorage.setItem("reset_token", response.data.token);

        dispatch(
          attach({
            email: response.data.data.email,
            is_verify: response.data.data.is_verify,
          })
        );

        setEmailMatch(false);

        toast({
          title: "Request Sent",
          description: response.data.message,
          status: "success",
        });
        formik.setFieldValue("email", "");
      } catch (error) {
        console.log(error.response);

        setEmailMatch(true);

        toast({
          title: "Registration Failed",
          description: error.response.data.message,
          status: "error",
        });
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().required().email("invalid email"),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    formik.setFieldValue(name, value);
  };

  return (
    <Box>
      <Link to="/login">
        <Box w={"100px"} pt={"30px"}>
          <Button
            bgColor={"white"}
            fontSize={"75px"}
            _hover={"none"}
            pb={"5px"}
            color={"#0095DA"}
          >
            <TfiControlBackward />
          </Button>
        </Box>
      </Link>

      <Box
        display={"flex"}
        fontSize="14px"
        justifyContent={"center"}
        mt={"50px"}
      >
        <Box
          w="440px"
          border="4px solid var(--N75,#0095DA)"
          borderRadius={"10px"}
          p="35px 20px 35px "
          textAlign={"center"}
          bgColor={"white"}
        >
          <Text
            fontSize="22px"
            fontWeight={"bold"}
            textAlign={"center"}
            color={"#0095DA"}
            fontFamily="Open Sauce One',sans-serif"
          >
            Reset Password
          </Text>
          <Box mt="8px" fontSize={"14px"} textAlign="center" color={"#9d9db7"}>
            <Text display={"inline"} mr="1" color={"#31353b"}>
              You need to enter your email for resetting your password.
            </Text>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Box m="20px 16px 19px">
              <FormControl isInvalid={formik.errors.email}>
                <InputGroup>
                  <Input
                    value={formik.values.email}
                    name="email"
                    onChange={formChangeHandler}
                    placeholder={"Enter your email"}
                    variant="flushed"
                  />
                </InputGroup>
                {emailMatch ? (
                  <FormHelperText
                    color={"red"}
                    fontSize={"12px"}
                    textAlign={"left"}
                  >
                    This email is not registered
                  </FormHelperText>
                ) : null}
              </FormControl>
            </Box>
            <Box display={"flex"} justifyContent={"center"}>
              <Button
                display={"flex"}
                w="70%"
                bgColor={"#0095DA"}
                _hover={false}
                m="6px 0"
                color={"white"}
                isDisabled={!formik.values.email}
                type={"submit"}
              >
                <Text fontWeight={"bold"}>Send Email</Text>
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default RequestResetPassword;
