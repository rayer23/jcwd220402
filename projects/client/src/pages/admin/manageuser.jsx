import {
  Avatar,
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Center,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useState } from "react";
import { IoIosAlert } from "react-icons/io";
import { TbSearch } from "react-icons/tb";
import { axiosInstance } from "../../api";
import AddressUser from "../../components/admin/addressuser";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai"

import { FcHome } from "react-icons/fc";

const ManageUserData = () => {
  const [userData, setUserData] = useState([]);
  const [currentSearch, setCurrentSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState("username");
  const [sortDir, setSortDir] = useState("ASC");
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [openedAddress, setOpenedAddress] = useState(false);

  const nextPage = () => {
    setPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
  };

  const fetchUserData = async () => {
    const maxItemsPerPage = 8;
    try {
      const response = await axiosInstance.get("/userData/allUser", {
        params: {
          _page: page,
          _limit: maxItemsPerPage,
          username: currentSearch,
          _sortBy: sortBy,
          _sortDir: sortDir,
        },
      });

      setTotalCount(response.data.dataCount);
      setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage));

      if (page === 1) {
        setUserData(response.data.data);
      } else {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const apiImg = process.env.REACT_APP_IMAGE_URL;

  const renderUser = () => {
    return userData.map((val) => {
      return (
        <Tr>
          <Td p="5px">{val.id}</Td>
          <Td p="5px">{val.username || "null"}</Td>
          <Td p="10px">
            <Avatar
              size={"lg"}
              borderRadius={"0"}
              name={val.username}
              src={`${apiImg}/${val.profile_picture}`}
            />
          </Td>
          <Td p="5px">{val.email}</Td>
          <Td p="5px">{val.phone_number || "null"}</Td>
          <Td p="5px" maxW={"200px"}>
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={() => setOpenedAddress(val)}
            >
              <FcHome font-size="1.5rem" />
            </Button>
          </Td>
        </Tr>
      );
    });
  };

  const formikSearch = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: ({ search }) => {
      setCurrentSearch(search);
      setPage(1);
    },
  });

  const searchAdminHandler = ({ target }) => {
    const { name, value } = target;
    formikSearch.setFieldValue(name, value);
  };
  const sortCategoryHandler = ({ target }) => {
    const { value } = target;

    setSortBy(value.split(" ")[0]);
    setSortDir(value.split(" ")[1]);
  };

  useEffect(() => {
    fetchUserData();
  }, [currentSearch, page, sortDir, sortBy, openedAddress]);

  return (
    <Box marginLeft={"90px"}>
      <Box p="20px 0" display={"flex"} justifyContent="space-between" mr="4">
        <Box display={"flex"} gap="4" my={"auto"}>
          <Text fontSize={"2xl"} fontWeight="bold">
            User Data Management
          </Text>
        </Box>

        <Box gap="4" display={"flex"}>
          <Select
            variant="filled"
            onChange={sortCategoryHandler}
            fontSize={"15px"}
            fontWeight="normal"
            width={"90px"}
            color={"#6D6D6F"}
          >
            <option value="username ASC" selected>
              A-Z
            </option>
            <option value="username DESC">Z-A</option>
            <option value="createdAt DESC">Latest</option>
            <option value="createdAt ASC">Old</option>
          </Select>

          <form onSubmit={formikSearch.handleSubmit}>
            <FormControl>
              <InputGroup textAlign={"right"}>
              <Button borderRightRadius={"0"} type="submit">
                  <TbSearch />
                </Button>
                <Input
                  type={"text"}
                  placeholder="Search by username"
                  name="search"
                  w="200px"
                  onChange={searchAdminHandler}
                  _placeholder={"halo"}
                  borderLeftRadius="0"
                  value={formikSearch.values.search}
                />

                
              </InputGroup>
            </FormControl>
          </form>
        </Box>
      </Box>

      <Table size="lg" variant="striped" colorScheme="blue">
        <Thead>
          <Tr>
            <Th p="5px">id</Th>
            <Th p="5px">Username</Th>
            <Th p="5px">Photo Profile</Th>
            <Th p="5px">Email</Th>
            <Th p="5px">Phone Number</Th>
            <Th p="5px">Address</Th>
          </Tr>
        </Thead>
        <Tbody>{renderUser()}</Tbody>
      </Table>
      {!userData.length ? (
        <Box p="10px" bgColor={"#E5F9F6"}>
          <Box mx="auto">
            <Box display={"flex"} mx="auto" w="170px">
              <IoIosAlert fontSize={"25px"} color="#0095DA" />
              <Text fontWeight="medium" ml="2">
                No user found
              </Text>
            </Box>
          </Box>
        </Box>
      ) : null}
        <Text fontSize={"2xl"} fontWeight="bold" color={"#0095DA"}>
          Total User:{totalCount}
        </Text>
    

        <Box p="20px">
        <Box textAlign={"center"}>
          <Button
            onClick={previousPage}
            disabled={page === 1 ? true : null}
            _hover={false}
            _active={false}
          >
            <AiOutlineLeftCircle fontSize={"20px"} />
          </Button>

          <Box display={"inline"}>{page}</Box>

          <Button
            onClick={nextPage}
            disabled={page >= maxPage ? true : null}
            _hover={false}
            _active={false}
          >
            <AiOutlineRightCircle fontSize={"20px"} />
          </Button>
          <Box>
            Page: {page} of {maxPage}
          </Box>
        </Box>
      </Box>

      <AddressUser
        color={"#0095DA"}
        header="Details Address"
        isOpen={openedAddress}
        onClose={() => setOpenedAddress(null)}
        val={openedAddress?.Addresses?.map((val) => {
          if (!val) {
            return "halo";
          } else {
            return (
              <Card>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="s" textTransform="uppercase">
                        Receptients Name
                      </Heading>
                      <Text pt="2" fontSize="md">
                        {val.recipients_name}{" "}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="s" textTransform="uppercase">
                        Full Address
                      </Heading>
                      <Text pt="2" fontSize="md">
                        {val.full_address}{" "}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="s" textTransform="uppercase">
                        Phone Number
                      </Heading>
                      <Text pt="2" fontSize="md">
                        {val.phone_number}{" "}
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
            );
          }
        })}
      />
    </Box>
  );
};
export default ManageUserData;
