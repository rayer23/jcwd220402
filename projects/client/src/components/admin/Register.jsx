import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    Image,
    Input,
    Text,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react"
  import { FcGoogle } from "react-icons/fc"
  import { FaFacebook } from "react-icons/fa"
  import delisha from "../assets/LogoDelisha.18.02.jpeg"
  import { Link, useLocation, useNavigate } from "react-router-dom"
  import { useFormik } from "formik"
  import * as Yup from "yup"
  import { axiosInstance } from "../api"
  import React, { useEffect} from "react"
  import { gapi } from "gapi-script"
  import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"
  import GoogleLogin from "react-google-login"
  import { useDispatch } from "react-redux"
  import { login } from "../redux/features/authSlice"

  const clientId = process.env.REACT_APP_CLIENT_ID
  const appId = process.env.REACT_APP_APP_ID

  const Register = () => {

    const place = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { onOpen, isOpen, onClose } = useDisclosure()
    const grill = useToast()
    const cancel = React.useRef()

    const formik = useFormik({
        initialValues: {
            email : "",
        },
        onSubmit: async ({email}) => {
            try{
                const response = await axiosInstance.post("/auth/registerEmail", { email, })

                grill({
                    title: "Registered Successfully",
                    description : response.data.message,
                    position: "top",
                    status : "success",
                    duration : 4000,
                    isClosable: true,
                })
                formik.setFieldValue("email", "")
            }
            catch(err){
                console.log(err.response)

                grill({
                    title: "Registration Failed",
                    description: err.response.data.message,
                    status: "error",
                })
            }
        },
        validationSchema: Yup.object({
            email: Yup.string().required().email(),
        }),
        validationOnChange: false,
    })

    const formHandler = ({target}) => {
        const {name, value} = target
        formik.setFieldValue(name,value)
    }


    const handleFacebook = async (response) => {

        try {
            const res = await axiosInstance.post("/auth/loginSocialMedia", {
                username : response.name,
                email: response.email
            })

            localStorage.setItem("auth_token", res.data.token)
            dispatch(login({
                id: res.data.data.id,
                email: res.data.data.email,
                RoleId: res.data.data.RoleId,
                username: res.data.data.username,
                phone_number: res.data.data.phone_number,
                profile_picture: res.data.data.profile_picture,
                is_verify: res.data.data.is_verify,
                WarehouseId: res?.data.data.WarehouseId,
            }))
            navigate("/")
        }
        catch(err) {
            console.log(err)
        }
        navigate(place.state.from)
    }
    useEffect(() => {
        const initiate = () => {
            gapi.client.init(
                {
                    client: clientId,
                    scope: "",

                })
        }
        gapi.load("client:auth2",initiate )
    })

    const handleSuccess = async (response) => {
        try{
            const res = await axiosInstance.post("/auth/loginSocialMedia", {
                username: response.profileObj.name,
                email: response.profileObj.email,
            })
            localStorage.setItem("auth_token", res.data.token)
            dispatch(login({
                id: res.data.data.id,
                email: res.data.data.email,
                RoleId: res.data.data.RoleId,
                username: res.data.data.username,
                phone_number: res.data.data.phone_number,
                profile_picture: res.data.data.profile_picture,
                is_verify: res.data.data.is_verify,
                WarehouseId: res?.data.data.WarehouseId,
            }))
            navigate("/")
        }
        catch(err){
            console.log(err)
        }
        navigate(place.state.from)
    }

    const handleFailure = (err) => {
        console.log(err)
    }

    const handleClick = () => {
        onClose()
        formik.handleSubmit()
    }

    return(

        <Box>
            <Link to={"/"}>
                <Box
                    justifyContent={"center"}
                    display={"flex"} 
                    textAlign={"center"}
                    minW={{ lg: "960px", md: null, base: null }}
                    mt="35px"
                    >
                    <Image src={delisha} height={"75px"} width={"150px"} />
                </Box>
            </Link>
            <Box display={"flex"} justifyContent={"center"} maxW="1190px"  pt="100px" mx={"auto"}>

            <Box width={{lg: "50%", md: "100%", base: "100%"}} fontSize="16px">

                <Box 
                    w="420px"
                    mx={{ lg: null, md: "auto", base: "auto" }}
                    ml={{ lg: "75px", md: null, base: null }}
                    boxShadow={"0 0 10px 0 rgb(0 0 0 / 10%)"}
                    border="1px solid var(--N75,#E5E7E9)"
                    borderRadius={"3px"}
                    p="24px 40px 32px "
                    textAlign={"center"}>
                    

                    <Text fontSize="28px" fontWeight={'bold'}> Register Your Account Now </Text>

                <form onSubmit={formik.handleSubmit}>
                        <Box m="25px 0 8px">
                            <Box>
                                <Text 
                                    textAlign="start"
                                    fontSize={"10px"}
                                    mb="5px"
                                    fontWeight={"normal"}
                                    >
                                    Email
                                </Text>
                                <FormControl isInValid={formik.errors.email}>
                                    <Input 
                                        value={formik.values.email}
                                        name="email"
                                        type="text"
                                        border={"1px solid #d4dae2"}
                                        onChange={formHandler}
                                    />
                                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                                </FormControl>
                                <Text 
                                    fontSize={"10px"}
                                    textAlign="start"
                                    mt="6px"
                                    fontWeight={"normal"}
                                    >
                                    Example: Delisha@gmail.com
                                </Text>
                            </Box>
                        </Box>

                        <Button
                            display={"flex"}
                            w="100%"
                            bgColor={"#0058a3"}
                            _hover={false}
                            color={"#fff"}
                            m="30px 0"
                            borderRadius={"20px"}
                            onClick={onOpen}
                            isDisabled={!formik.values.email}
                        >
                            <Text fontWeight={"bold"}>Register</Text>
                        </Button>
                        <AlertDialog
                            isOpen={isOpen}
                            leastDestructiveRef={cancel}
                            onClose={onClose}
                        >
                        <AlertDialogOverlay>
                            <AlertDialogContent
                                p={"32px 32px 24px"}
                                my="auto"
                                boxSize={"-moz-fit-content"}
                                maxW="600px"
                            >
                                <AlertDialogHeader p="0"></AlertDialogHeader>
                                <AlertDialogBody textAlign={"center"} p="0">
                                  <Text fontWeight={"bold"} fontSize="26px" mb={"14px"}>
                                    {formik.values.email}
                                  </Text>
                                  <Text  fontSize={"16px"} m="0px 16px 16px">
                                    are you already inserting email correctly?
                                  </Text>
                                </AlertDialogBody>

                                <AlertDialogFooter  p="0" alignSelf="center">
                                    <Button
                                        ref={cancel}
                                        onClick={onClose}
                                        w="164px"
                                        h="48px"
                                        mr={"6px"}
                                        borderRadius="8px"
                                        fontWeight={"bold"}
                                        bgColor="white"
                                        border="1px solid #0058a3"
                                        color={"#0058a3"}
                                        _hover={false}
                                    >
                                        Replace
                                    </Button>
                                    <Button
                                       fontWeight={"bold"}
                                       bgColor="#0058a3"
                                       color={"white"}
                                       type="submit"
                                       onClick={handleClick}
                                       w="164px"
                                       h="48px"
                                       borderRadius="8px"
                                       _hover={false}
                                    >
                                    That's right
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </form> 
            <Box margin="24px 0">
              <Box justifyContent={"space-between"} display="flex">
                <Box width="33%">
                  <hr />
                </Box>

                <Box width="33%">
                  <hr />
                </Box>
              </Box>
              <Text
                textAlign={"center"}
                mt="-13px"
                mx={"auto"}
                bgColor={"white"}
              >
                or register with
              </Text>
            </Box>

            <Box display={"flex"}  gap="2" mt={"30px"}>
                <GoogleLogin 
                    clientId={clientId}
                    buttonText={null}
                    onSuccess={handleSuccess}
                    onFailure={handleFailure}
                    cookiePolicy={"single_host_origin"}
                    isSignedIn={false}
                    render={(renderProps) => (
                        <Button
                        display={"flex"}
                        onClick={renderProps.onClick}
                        w="100%"
                        bgColor={"white"}
                        border="1px solid #0058a3"
                        _hover={false}
                        >
                          <Box mr="6px" my={"auto"}>
                            <FcGoogle fontSize={"25px"}/>
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
                    display={"flex"}
                    onClick={renderProps.onClick}
                    bgColor={"white"}
                    w="100%"
                    border="1px solid #0058a3"
                    _hover={false}
                    >
                    <Box mr="6px" my={"auto"}>
                        <FaFacebook fontSize={"25px"} color="#3b5998" />
                    </Box>
                        <Text>Facebook</Text>
                    </Button>
                )}
                />
            </Box>
            <hr></hr>
            <Box mt="60px" fontSize={"14px"} textAlign="center">
              <Text display={"inline"} mr="1">
                Do you have a Delisha account?
              </Text>
              <Link to={"/login"}>
                <Text display={"inline"} color={"#0058a3"}>
                  Login
                </Text>
              </Link>
            </Box>

 


          </Box>
        </Box>
      </Box>
   </Box>

    )

  }


  export default Register