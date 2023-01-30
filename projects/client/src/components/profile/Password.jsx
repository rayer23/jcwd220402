import {
    Avatar,
    Box,
    Button,
    Center,
    Spinner,
    Flex,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    Image,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import { BiHide, BiShow } from "react-icons/bi"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import { axiosInstance } from "../../api"

const Password = () => {
    const [userData, setUserData] = useState([])
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false)

    const toggleNewPassword = () => {
        setShowNewPassword(!showNewPassword)
    }
    const toggleNewPasswordConfirmation = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation)
    }

    const toast = useToast()
    const authSelector = useSelector((state) => state.auth)
    const apiImg = process.env.REACT_APP_IMAGE_URL
    const [isLoading, setIsLoading] = useState(false)

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get(
                `user-profile/get/${authSelector.id}`
            )
            setUserData(response.data.data)
            setIsLoading(true)
        } catch (err) {
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        onSubmit: async ({ password, confirmPassword }, { resetForm }) => {
            try {
                const response = await axiosInstance.patch(
                    `/user-profile/password/${authSelector.id}`,
                    { password, confirmPassword }
                )

                toast({
                    title: "Updated Success",
                    description: response.data.message,
                    status: "success",
                })
                resetForm()
            } catch (err) {
                toast({
                    title: "Updated Failed",
                    description: err.response.data.message,
                    status: "error",
                })
            }
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8)
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                "Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
                ),
            confirmPassword: Yup.string()
                .required("Password not match")
                .oneOf([Yup.ref("password")], "password not match"),
        }),
        validateOnChange: false,
    })

    const formChangeHandler = ({ target }) => {
        const { name, value } = target
        formik.setFieldValue(name, value)
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <>
            <Box
                p="16px 0"
                border="1px solid #dfe1e3"
                borderRadius={'20px'}
            >
                {isLoading === false ? (
                    <Box
                        w={"850px"}
                        h={"400px"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        alignContent={"center"}
                    >
                        <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='blue.500'
                            size='xl'
                            />
                    </Box>
                ) : (
                    <Flex>
                        {/* Profile Photo */}
                        <Box p="16px" w="290px">
                            <Box
                                p="16px"
                                mb="24px"
                                boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
                                borderRadius="50px"
                            >
                                <Avatar
                                    src={`${apiImg}/${authSelector.profile_picture}`}
                                    name={userData.username}
                                    w="225px"
                                    h="225px"
                                    borderRadius={"50px"}
                                />
                            </Box>
                        </Box>

                        {/* Change Password */}
                        <Box
                            p="16px"
                        >
                            <Center>
                                <Text
                                    p="14px 0 55px"
                                    fontWeight={"bold"}
                                    fontSize="xl"
                                >
                                    Change Your Password
                                </Text>
                            </Center>

                            {/* Form */}
                            <Box fontSize="13px" alignItems="flex-start">
                                <Stack spacing="10">
                                    {/* Password */}
                                    <FormControl
                                        isInvalid={formik.errors.password}
                                    >
                                        <HStack>
                                            <FormLabel
                                                w="300px"
                                                mr="16px"
                                                align="left"
                                                fontSize="17px"
                                            >
                                                New Password
                                            </FormLabel>
                                            <InputGroup
                                                w="100%"
                                                display="block"
                                            >
                                                <Box display="flex" w="70%" >
                                                    <InputGroup >
                                                        <Input
                                                            onChange={
                                                                formChangeHandler
                                                            }
                                                            name="password"
                                                            value={
                                                                formik.values
                                                                    .password
                                                            }
                                                            type={
                                                                showNewPassword
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                        />
                                                        <InputRightElement width="3rem">
                                                            <Button
                                                                onClick={
                                                                    toggleNewPassword
                                                                }
                                                                variant="link"
                                                            >
                                                                {showNewPassword ? (
                                                                    <BiShow />
                                                                ) : (
                                                                    <BiHide />
                                                                )}
                                                            </Button>
                                                        </InputRightElement>
                                                    </InputGroup>
                                                </Box>
                                                <FormErrorMessage
                                                    fontSize={"11px"}
                                                >
                                                    {formik.errors.password}
                                                </FormErrorMessage>
                                            </InputGroup>
                                        </HStack>
                                    </FormControl>

                                    {/* Change Password */}
                                    <FormControl
                                        isInvalid={
                                            formik.errors.confirmPassword
                                        }
                                    >
                                        <HStack>
                                            <FormLabel
                                                w="300px"
                                                mr="16px"
                                                align="left"
                                                fontSize="17"
                                            >
                                                Confirm Password
                                            </FormLabel>
                                            <InputGroup
                                                w="100%"
                                                display="block"
                                            >
                                                <Box w="70%" display="flex">
                                                    <InputGroup>
                                                        <Input
                                                            onChange={
                                                                formChangeHandler
                                                            }
                                                            name="confirmPassword"
                                                            value={
                                                                formik.values
                                                                    .confirmPassword
                                                            }
                                                            type={
                                                                showPasswordConfirmation
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                        />
                                                        <InputRightElement width="3rem">
                                                            <Button
                                                                onClick={
                                                                    toggleNewPasswordConfirmation
                                                                }
                                                                variant="link"
                                                            >
                                                                {showPasswordConfirmation ? (
                                                                    <BiShow />
                                                                ) : (
                                                                    <BiHide />
                                                                )}
                                                            </Button>
                                                        </InputRightElement>
                                                    </InputGroup>
                                                </Box>

                                                <FormErrorMessage
                                                    fontSize={"11px"}
                                                >
                                                    {
                                                        formik.errors
                                                            .confirmPassword
                                                    }
                                                </FormErrorMessage>
                                            </InputGroup>
                                        </HStack>
                                    </FormControl>

                                    {/* Button Submit */}
                                    <Center>
                                        <Button
                                            bg="#0058a3"
                                            color={'#fff'}
                                            onClick={formik.handleSubmit}
                                            type="submit"
                                            borderRadius={'25px'}
                                            _hover={{ bgColor: "#32769C" }}
                                        >
                                            Save
                                        </Button>
                                    </Center>
                                </Stack>
                            </Box>
                        </Box>
                    </Flex>
                )}
            </Box>
        </>
    )
}

export default Password