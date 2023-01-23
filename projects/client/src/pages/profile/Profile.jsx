import {
    Box,
    Button,
    Text,
    HStack,
    useToast,
    useDisclosure,
} from "@chakra-ui/react"

import {  BiUser } from "react-icons/bi"

import UserInfo from "../../components/profile/UserInfo"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {  useSelector } from "react-redux"
// import { logout } from "../../redux/features/authSlice"

const Profile = () => {
    const authSelector = useSelector((state) => state.auth)
    // const navigate = useNavigate()
    // const dispatch = useDispatch()
    // const toast = useToast()
    // const location = useLocation()
    // const apiImg = process.env.REACT_APP_IMAGE_URL

    // const refreshPage = () => {
    //     window.location.reload(false)
    // }

    // const logoutBtnHandler = () => {
    //     localStorage.removeItem("auth_token")
    //     dispatch(logout())

    //     toast({
    //         title: "User Logout",
    //         status: "info",
    //     })

    //     if (
    //         location.pathname === "/cart" ||
    //         location.pathname === "/transaction-list" ||
    //         location.pathname === "/user/profile" ||
    //         location.pathname === "/user/profile/change-password" ||
    //         location.pathname === "/user/profile/address"
    //     ) {
    //         navigate("/login")
    //         refreshPage()
    //     } else {
    //         refreshPage()
    //     }
    // }

    return (
        <>
            <Box
                mt="120px"
                fontSize={"16px"}
                display={{ base: "none", md: "none", lg: "block" }}
                color="rgba(0,0,0,.54)"
            >
                <Box w="1208px" marginX={"auto"}>
                    <Box display={"flex"} mt="80px" mb="16px" color={'#32769C'}>
                        <Box mr="8px" my={"auto"}>
                            <BiUser fontSize={"20px"} />
                        </Box>
                        <Text fontSize={"16px"} fontWeight="bold" my={"auto"}>
                            {authSelector.username}
                        </Text>
                    </Box>

                    <Box  borderRadius="10px">
                        <HStack>
                            {/* Personal Data */}
                            <Box
                                display={"flex"}
                                height="53px"
                                fontWeight={"bold"}
                            >
                                <Button
                                    p="16px 24px"
                                    color="#32769C"
                                    // borderBottom={"2px solid #32769C"}
                                    borderRadius="1px"
                                    variant="link"
                                >
                                    <Text>Personal Data</Text>
                                </Button>
                            </Box>

                            {/* Change Password */}
                            <Box
                                display={"flex"}
                                height="53px"
                                fontWeight={"bold"}
                            >
                                <Link to="/user/profile/change-password">
                                    <Box
                                        p="16px 24px"
                                        _hover={{ color: "#32769C" }}
                                    >
                                        <Text>Change Password</Text>
                                    </Box>
                                </Link>
                            </Box>

                            {/* Address List */}
                            <Box
                                display={"flex"}
                                height="53px"
                                fontWeight={"bold"}
                            >
                                <Link to="/user/profile/address">
                                    <Box
                                        p="16px 24px"
                                        _hover={{ color: "#32769C" }}
                                    >
                                        <Text>Address List</Text>
                                    </Box>
                                </Link>
                            </Box>
                        </HStack>
                        <UserInfo />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Profile