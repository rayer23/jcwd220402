import {
  AlertIcon,
  AlertTitle,
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
  useDisclosure,
  useToast,
  Center,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { axiosInstance } from '../../api';
import * as Yup from 'yup';
import AddAdmin from '../../components/admin/addadmin';
import Alert from '../../components/alert';
import EditAdmin from '../../components/admin/editadmin';
import {
  RiUserAddFill,
  RiUserSettingsFill,
  RiUserUnfollowFill,
} from 'react-icons/ri';
import { TbSearch } from 'react-icons/tb';
import { IoIosAlert } from 'react-icons/io';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

const ManageAdmin = () => {
  const [userData, setUserData] = useState([]);
  const cancelRef = React.useRef();
  const [currentSearch, setCurrentSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('username');
  const [sortDir, setSortDir] = useState('ASC');
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const toast = useToast();

  const {
    isOpen: isOpenAddNewAdmin,
    onOpen: onOpenAddNewAdmin,
    onClose: onCloseAddNewAdmin,
  } = useDisclosure();

  const { onOpen, isOpen, onClose } = useDisclosure();

  const {
    onOpen: onOpenAlert,
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure();

  const [openedEdit, setOpenedEdit] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(null);

  const fetchAdminData = async () => {
    const maxItemsPerPage = 4;
    try {
      const response = await axiosInstance.get('/userData/AllWarehouseAdmin', {
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
        <Tr key={val.id.toString()}>
          <Td>{val.username}</Td>
          <Td w="100px">
            <Avatar
              size={'lg'}
              borderRadius={'0'}
              name={val.username}
              src={`${apiImg}/${val.profile_picture}`}
            />
          </Td>
          <Td w="240px">{val.email}</Td>
          <Td w="160px">{val.phone_number || 'null'}</Td>
          <Td>{val.Role.role_name || 'null'}</Td>
          <Td>{val.Warehouse?.warehouse_name || 'null '}</Td>
          <Td>
            <Box>
              <Box mb={'2'}>
                <Button
                  width={'60px'}
                  bgColor={'#0095DA'}
                  _hover={false}
                  color="white"
                  marginRight={'10px'}
                  onClick={() => setOpenedEdit(val)}
                >
                  <RiUserSettingsFill size={'25'} />
                </Button>
                <Button
                  width={'60px'}
                  bgColor="#FF0000"
                  _hover={false}
                  color="white"
                  onClick={() => setDeleteAlert(val)}
                >
                  <RiUserUnfollowFill size={'25'} />
                </Button>
              </Box>
              <Box></Box>
            </Box>
          </Td>
        </Tr>
      );
    });
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
  };

  const formikAddNewAdmin = useFormik({
    initialValues: {
      email: '',
      password: '',
      phone_number: '',
      username: '',
      WarehouseId: '',
    },
    onSubmit: async ({
      email,
      password,
      phone_number,

      profile_picture,
      username,
      WarehouseId,
    }) => {
      try {
        const adminData = new FormData();

        if (email) {
          adminData.append('email', email);
        }

        if (password) {
          adminData.append('password', password);
        }

        if (phone_number) {
          adminData.append('phone_number', phone_number);
        }

        if (profile_picture) {
          adminData.append('profile_picture', profile_picture);
        }

        if (username) {
          adminData.append('username', username);
        }

        if (WarehouseId) {
          adminData.append('WarehouseId', WarehouseId);
        }

        const response = await axiosInstance.post(
          '/userData/addNewAdmin',
          adminData,
        );

        toast({
          title: 'Registration Success',
          description: response.data.message,
          status: 'success',
        });
        formikAddNewAdmin.setFieldValue('email', '');
        formikAddNewAdmin.setFieldValue('password', '');
        formikAddNewAdmin.setFieldValue('phone_number', '');
        formikAddNewAdmin.setFieldValue('username', '');
        formikAddNewAdmin.setFieldValue('WarehouseId', '');
        fetchAdminData();
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
      email: Yup.string().required().email(),
      password: Yup.string()
        .required(8)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
        ),
      phone_number: Yup.number().required(9),
      profile_picture: Yup.string().required(),
      username: Yup.string().required(6),
    }),
    validateOnChange: false,
  });

  const editFormik = useFormik({
    initialValues: {
      phone_number: '',
      profile_picture: '',
      username: '',
      WarehouseId: '',
    },
    onSubmit: async ({
      email,
      phone_number,
      profile_picture,
      username,
      WarehouseId,
    }) => {
      try {
        const adminData = new FormData();

        if (email) {
          adminData.append('email', email);
        }

        if (phone_number) {
          adminData.append('phone_number', phone_number);
        }

        if (profile_picture) {
          adminData.append('profile_picture', profile_picture);
        }

        if (username) {
          adminData.append('username', username);
        }

        if (WarehouseId) {
          adminData.append('WarehouseId', WarehouseId);
        }

        const response = await axiosInstance.patch(
          `/userData/editAdmin/${openedEdit.id}`,
          adminData,
        );
        toast({
          title: 'Admin Edited',
          description: response.data.message,
          status: 'success',
        });

        editFormik.setFieldValue('phone_number', '');
        editFormik.setFieldValue('profile_picture', '');
        editFormik.setFieldValue('username', '');
        editFormik.setFieldValue('WarehouseId', '');
        fetchAdminData();
        setOpenedEdit(null);
      } catch (error) {
        console.log(error);
        toast({
          title: 'Failed Edit Admin',
          description: error.response.data.message,
          status: 'error',
        });
      }
    },
    validationSchema: Yup.object({
      password: Yup.string().matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
      ),
      phone_number: Yup.number(),
      username: Yup.string(),
    }),
    validateOnChange: false,
  });

  const deleteAdminHandler = async (id) => {
    try {
      await axiosInstance.delete(`/userData/deleteAdmin/${id}`);

      fetchAdminData();

      toast({
        title: 'Admin Deleted',
        status: 'info',
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Failed Delete Admin',
        description: error.response.data.message,
        status: 'error',
      });
    }
  };

  const formikSearch = useFormik({
    initialValues: {
      search: '',
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
    setSortBy(value.split(' ')[0]);
    setSortDir(value.split(' ')[1]);
  };
  const doubleOnClick = () => {
    onClose();
    onCloseAddNewAdmin();
    formikAddNewAdmin.handleSubmit();
  };

  const doubleOnClick1 = () => {
    editFormik.handleSubmit();
    onCloseAlert();
    setSelectedImage(null);
  };

  const doubleOnClick2 = () => {
    setDeleteAlert(null);
    deleteAdminHandler(deleteAlert.id);
  };

  useEffect(() => {
    fetchAdminData();
  }, [
    openedEdit,
    deleteAlert,
    selectedImage,
    currentSearch,
    page,
    sortDir,
    sortBy,
  ]);

  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue('email', openedEdit.email);
      editFormik.setFieldValue('phone_number', openedEdit.phone_number);
      editFormik.setFieldValue('profile_picture', openedEdit.profile_picture);
      editFormik.setFieldValue('username', openedEdit.username);
      editFormik.setFieldValue('WarehouseId', openedEdit.WarehouseId);
    }
  }, [openedEdit]);
  return (
    <Box marginLeft={'90px'}>
      <Box p="20px 0" display={'flex'} justifyContent="space-between" mr="8">
        <Box display={'flex'} gap="4" my={'auto'}>
          <Text fontSize={'2xl'} fontWeight="bold">
            Admin Data Management
          </Text>
        </Box>

        <Box gap="4" display={'flex'}>
          <Button
            w={'50px'}
            bgColor={'#0095DA'}
            color="white"
            _hover={false}
            onClick={onOpenAddNewAdmin}
          >
            <RiUserAddFill size={'25'} />
          </Button>
          <Select
            onChange={sortCategoryHandler}
            variant="filled"
            fontSize={'15px'}
            fontWeight="normal"
            width={'90px'}
            color={'#6D6D6F'}
            _placeholder="Sort By"
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
              <InputGroup textAlign={'right'}>
                <Button borderRightRadius={'0'} type="submit">
                  <TbSearch />
                </Button>
                <Input
                  type={'text'}
                  placeholder="Search by username"
                  name="search"
                  w="200px"
                  onChange={searchAdminHandler}
                  _placeholder={'halo'}
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
            <Th>Username</Th>
            <Th>Photo Profile</Th>
            <Th>Email</Th>
            <Th>Phone Number</Th>
            <Th>Role</Th>
            <Th>Warehouse</Th>
            <Th>Option</Th>
          </Tr>
        </Thead>
        <Tbody>{renderUser()}</Tbody>
      </Table>
      {!userData.length ? (
        <Box p="10px" bgColor={'#E5F9F6'}>
          <Box mx="auto">
            <Box display={'flex'} mx="auto" w="170px">
              <IoIosAlert fontSize={'25px'} color="#0095DA" />
              <Text fontWeight="medium" ml="2">
                No admin found
              </Text>
            </Box>
          </Box>
        </Box>
      ) : null}

      {/* Alert Delete */}
      <Alert
        body={`Are you sure to delete "${deleteAlert?.username}"`}
        cancelRef={cancelRef}
        color={'#0095DA'}
        header={'Delete Admin'}
        isOpen={deleteAlert}
        leftButton={'Cancel'}
        onClose={() => setDeleteAlert(null)}
        onSubmit={() => doubleOnClick2()}
        rightButton={'Delete'}
      />

      {/* Modal Add Admin */}

      <AddAdmin
        formikAddNewAdmin={formikAddNewAdmin}
        isOpenAddNewAdmin={isOpenAddNewAdmin}
        onCloseAddNewAdmin={onCloseAddNewAdmin}
        header="Add New Admin"
        onOpen={onOpen}
        color="#0095DA"
      />

      {/* Alert Add New Admin */}
      <Alert
        header={'Add New Admin'}
        body={'Is data that you entered is correct'}
        cancelRef={cancelRef}
        isOpen={isOpen}
        leftButton={'Cancel'}
        onClose={onClose}
        rightButton={'Add New Admin'}
        onSubmit={() => doubleOnClick()}
        color={'#0095DA'}
      />

      {/* Modal Edit Admin */}
      <EditAdmin
        editFormik={editFormik}
        isOpen={openedEdit}
        header={'Edit Admin'}
        onClose={() => setOpenedEdit(null)}
        color={'#0095DA'}
        onOpen={onOpenAlert}
        onCloseMod={() => setOpenedEdit(null)}
      />

      {/* Alert Edit admin */}
      <Alert
        body={'Is data that you entered correct?'}
        cancelRef={cancelRef}
        color={'#0095DA'}
        header={'Edit Admin'}
        isOpen={isOpenAlert}
        leftButton={'Cancel'}
        onClose={onCloseAlert}
        onSubmit={doubleOnClick1}
        rightButton={'Edit Admin'}
      />

      <Text fontSize={'2xl'} fontWeight="bold" color={'#0095DA'}>
        Total Admin: {totalCount}
      </Text>

      <Box p="20px">
        <Box textAlign={'center'}>
          <Button
            onClick={previousPage}
            disabled={page === 1 ? true : null}
            _hover={false}
            _active={false}
            color="#0095DA"
            bgColor={'white'}
          >
            <BsArrowBarLeft fontSize={'25px'} />
          </Button>

          <Box display={'inline'}>{page}</Box>

          <Button
            onClick={nextPage}
            disabled={page >= maxPage ? true : null}
            _hover={false}
            _active={false}
            color="#0095DA"
            bgColor={'white'}
          >
            <BsArrowBarRight fontSize={'25px'} />
          </Button>
          <Box>
            Page: {page} of {maxPage}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default ManageAdmin;
