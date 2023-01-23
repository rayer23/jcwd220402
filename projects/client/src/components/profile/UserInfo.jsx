import {
    Box,
    Button,
    Center,
    Spinner,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputLeftAddon,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react"
import { useFormik } from "formik"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import { axiosInstance } from "../../api"
import { useState } from "react"
import { useEffect } from "react"
import ImageCard from "./ImageCard"

const UserInfo = ({ onClick }) => {
    const [userData, setUserData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const authSelector = useSelector((state) => state.auth)
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
    console.log("res", userData)

    const formik = useFormik({
        initialValues: {
            username: userData.username,
            phone_number: userData.phone_number,
        },
        onSubmit: async ({ username, phone_number }) => {
            try {
                const response = await axiosInstance.patch(
                    `/user-profile/info/${authSelector.id}`,
                    { username, phone_number }
                )

                toast({
                    title: "Updated Success",
                    description: response.data.message,
                    status: "success",
                })
                window.location.reload()
            } catch (err) {
                toast({
                    title: "Updated Failed",
                    description: err.response.data.message,
                    status: "error",
                })
            }
            onClick()
        },
        validationSchema: Yup.object({
            username: Yup.string().min(3),
            phone_number: Yup.string()
                .min(9)
                .matches(
                    /(\+62 ((\d{3}([ -]\d{3,})([- ]\d{4,})?)|(\d+)))|(\(\d+\) \d+)|\d{3}( \d+)+|(\d+[ -]\d+)|\d+/,
                    "Phone number must be valid"
                ),
        }),
        validateOnChange: false,
    })
    const formChangeHandler = ({ target }) => {
        const { name, value } = target
        formik.setFieldValue(name, value)
    }

    const btnSubmit = async (e) => {
        try {
            let pic = new FormData()
            pic.append("profile_picture", e)

           const response =  await axiosInstance.patch(
                `/user-profile/pic/${authSelector.id}`,
                pic
            )

            toast({
                title: "Updated Success",
                description: response.data.message,
                position: 'top',
                status: "success",
                
            })
        } catch (err) {
            toast({
                title: "Updated Failed",
                description: err.response.data.message,
                status: "error",
                position: 'top',

            })
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])
    return (
        <>
            <Box
                p="16px 0"
                display={{ base: "none", md: "none", lg: "flex" }}
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
                        <ImageCard userData={userData} btnSubmit={btnSubmit} />

                        {/* Change Personal Info */}
                        <Box p="16px">
                            <Center>
                                <Text
                                    p="14px 0 55px"
                                    fontWeight={"bold"}
                                    fontSize="xl"
                                >
                                    Change Your Personal Data
                                </Text>
                            </Center>

                            {/* Form */}
                            <Box fontSize="13px" alignItems="flex-start">
                                <Stack spacing="10">
                                    {/* Name */}
                                    <FormControl
                                        isInvalid={formik.errors.username}
                                    >
                                        <HStack>
                                            <FormLabel
                                                w="300px"
                                                mr="16px"
                                                align="left"
                                            >
                                                Name
                                            </FormLabel>
                                            <InputGroup
                                                w="100%"
                                                display="block"
                                            >
                                                <Box display="flex" w="70%">
                                                    <Input
                                                        onChange={
                                                            formChangeHandler
                                                        }
                                                        name="username"
                                                        defaultValue={
                                                            userData.username
                                                        }
                                                    />
                                                </Box>

                                                <FormErrorMessage>
                                                    {formik.errors.username}
                                                </FormErrorMessage>
                                            </InputGroup>
                                        </HStack>
                                    </FormControl>

                                    {/* Phone Number */}
                                    <FormControl
                                        isInvalid={formik.errors.phone_number}
                                    >
                                        <HStack>
                                            <FormLabel
                                                w="300px"
                                                mr="16px"
                                                align="left"
                                            >
                                                Phone Number
                                            </FormLabel>
                                            <InputGroup
                                                w="100%"
                                                display="block"
                                            >
                                                <Box display="flex" w="70%">
                                                    <InputLeftAddon children="+62" />
                                                    <Input
                                                        onChange={
                                                            formChangeHandler
                                                        }
                                                        name="phone_number"
                                                        defaultValue={
                                                            userData.phone_number
                                                        }
                                                        w="100%"
                                                        type="number"
                                                        maxLength={15}
                                                        minLength={9}
                                                    />
                                                </Box>
                                                <FormErrorMessage>
                                                    {formik.errors.phone_number}
                                                </FormErrorMessage>
                                            </InputGroup>
                                        </HStack>
                                    </FormControl>

                                    {/* Email */}
                                    <FormControl>
                                        <HStack>
                                            <FormLabel
                                                w="300px"
                                                mr="16px"
                                                align="left"
                                            >
                                                Email
                                            </FormLabel>
                                            <InputGroup
                                                w="100%"
                                                display="block"
                                            >
                                                <Box display="flex" w="70%">
                                                    <Input
                                                        onChange={
                                                            formChangeHandler
                                                        }
                                                        name="email"
                                                        defaultValue={
                                                            authSelector.email
                                                        }
                                                        isDisabled
                                                    />
                                                </Box>
                                            </InputGroup>
                                        </HStack>
                                    </FormControl>

                                    {/* Button Submit */}
                                    <Center>
                                        <Button
                                            bg="#0058a3"
                                            color={'#fff'}
                                            onClick={formik.handleSubmit}
                                            _hover={{ bgColor: "#32769C" }}
                                            borderRadius={'25px'}
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

export default UserInfo
