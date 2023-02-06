import { Box, Button, Text, HStack } from "@chakra-ui/react"
import { BiArrowBack, BiUser } from "react-icons/bi"
import { Link } from "react-router-dom"
import Password from "../../components/profile/Password"
import { useSelector } from "react-redux"

const ChangePassword = () => {
    const authSelector = useSelector((state) => state.auth)
    return (
        <>
            <Box
                mt="120px"
                fontSize={"16px"}
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

                    <Box borderRadius="10px">
                    {/* <Box border={"1px solid #dfe1e3"} borderRadius="10px"> */}
                        <HStack>
                            {/* Personal Info */}
                            <Box
                                display={"flex"}
                                height="53px"
                                fontWeight={"bold"}
                            >
                                <Link to="/user/profile">
                                    <Box
                                        p="16px 24px"
                                        _hover={{ color: "#32769C" }}
                                    >
                                        <Text>Personal Data</Text>
                                    </Box>
                                </Link>
                            </Box>

                            {/* Change Password */}
                            <Box
                                display={"flex"}
                                height="53px"
                                fontWeight={"bold"}
                            >
                                <Button
                                    p="16px 24px"
                                    color="#32769C"
                                    // borderBottom={"2px solid #32769C"}
                                    borderRadius="px"
                                    variant="link"
                                >
                                    <Text>Change Password</Text>
                                </Button>
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
                        <Password />
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default ChangePassword