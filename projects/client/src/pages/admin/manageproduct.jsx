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
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  useDisclosure,
  FormErrorMessage,
  ModalOverlay,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  AlertTitle,
  Image,
  Select,
  InputGroup,
  Textarea,
} from '@chakra-ui/react';
import { axiosInstance } from '../../api/index';
import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import gambar from '../../assets/default_image.png';
import { useSelector } from 'react-redux';

import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { TbCameraPlus } from 'react-icons/tb';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';
import { TbSearch } from 'react-icons/tb';
import { MdAddToPhotos } from 'react-icons/md';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin2Line } from 'react-icons/ri';
import Alert2 from '../../components/alert';

const ManageProduct = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const cancelRef = useRef();
  const authSelector = useSelector((state) => state.auth);

  const [openedEdit, setOpenedEdit] = useState(null);
  const [rows, setRows] = useState(0);
  const [admin, setAdmin] = useState([]);
  const [pages, setPages] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [keywordHandler, setKeywordHandler] = useState('');
  const maxItemsPage = 5;
  const [deleteAlert, setDeleteAlert] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const inputFileRef = useRef();

  const [category, setCategory] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('ASC');
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchProductData = async () => {
    try {
      const productData = await axiosInstance.get('/admin/product', {
        params: {
          _keywordHandler: keyword,
          _page: pages,
          _limit: maxItemsPage,
          _sortBy: sortBy,
          _sortDir: sortDir,
        },
      });
      setData(productData.data.data);
      setTotalCount(productData.data.totalRows);
      setAdmin(productData.data.data);

      setRows(productData.data.totalRows - maxItemsPage);
      setMaxPage(Math.ceil(productData.data.totalRows / maxItemsPage));

      const categoryRes = await axiosInstance.get('/admin/product/category');
      setCategory(categoryRes.data.data);

      setIsLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const renderCategory = () => {
    return Array.from(category).map((val) => {
      return (
        <option value={val.id} key={val.id.toString()}>
          {val.category_name}
        </option>
      );
    });
  };
  const nextPage = () => {
    setPages(pages + 1);
  };

  const prevPage = () => {
    setPages(pages - 1);
  };

  const searchKey = () => {
    setPages(0);
    setKeyword(keywordHandler);
  };

  const doubleOnClick = () => {
    setDeleteAlert(null);
    deleteBtnHandler(deleteAlert);
  };

  const deleteBtnHandler = async (val) => {
    try {
      await axiosInstance.delete(`/admin/product/detail/${val.id}`);
      toast({ title: 'Successfully deleted product', status: 'success' });
      fetchProductData();
    } catch (error) {
      console.log(error);
    }
  };
  const renderProductData = () => {
    return data.map((val) => {
      return (
        <Tr key={val.id.toString()}>
          <Td>{val.id.toString()}</Td>
          <Td>
            <Image
              width="100px"
              height="100px"
              src={val?.Image_Urls[0]?.image_url}
            />
          </Td>
          <Td>{val.product_name || 'null'}</Td>
          <Td>{val.description || 'null'}</Td>
          <Td>{val.product_weight || 'null'} gr</Td>
          <Td>
            {val.price
              ? val.price.toLocaleString('in-ID', {
                  style: 'currency',
                  currency: 'IDR',
                })
              : 'null'}
          </Td>
          <Td>{val?.Category?.category_name}</Td>
          <Td>
            <Box>
              <Box mb={'2'}>
                <Link to={`/admin/product/detail/${val.id}`}>
                  <Button
                    width={'50px'}
                    bgColor={'#0095DA'}
                    _hover={false}
                    color="white"
                  >
                    <FiEdit fontSize={'20px'} />
                  </Button>
                </Link>
              </Box>
              <Box>
                <Button
                  width={'50px'}
                  bgColor={'#FF0000'}
                  _hover={false}
                  color="white"
                  isDisabled={authSelector.RoleId !== 3 ? true : false}
                  onClick={() => setDeleteAlert(val)}
                  //   onClick={() => deleteBtnHandler(val)}
                  //   onClick={() => onOpen()}
                >
                  <RiDeleteBin2Line fontSize={'20px'} />
                </Button>
              </Box>
            </Box>
          </Td>
        </Tr>
      );
    });
  };

  const {
    isOpen: isOpenAddNewProduct,
    onOpen: onOpenAddNewProduct,
    onClose: onCloseAddNewProduct,
  } = useDisclosure();

  const formikAddProduct = useFormik({
    initialValues: {
      image_url: {},
      product_name: '',
      description: '',
      product_weight: '',
      price: '',
      CategoryId: '',
    },
    onSubmit: async ({
      image_url,
      product_name,
      description,
      product_weight,
      price,
      CategoryId,
    }) => {
      try {
        const data = new FormData();

        if (image_url) {
          data.append('image_url', image_url);
        }
        if (product_name) {
          data.append('product_name', product_name);
        }
        if (description) {
          data.append('description', description);
        }
        if (product_weight) {
          data.append('product_weight', product_weight);
        }
        if (price) {
          data.append('price', price);
        }
        if (CategoryId) {
          data.append('CategoryId', CategoryId);
        }
        const response = await axiosInstance.post('/admin/product/', data);

        toast({
          title: 'Registration Success',
          description: response.data.message,
          status: 'success',
        });
        formikAddProduct.setFieldValue('image_url', '');
        formikAddProduct.setFieldValue('product_name', '');
        formikAddProduct.setFieldValue('description', '');
        formikAddProduct.setFieldValue('product_weight', '');
        formikAddProduct.setFieldValue('price', '');
        formikAddProduct.setFieldValue('CategoryId', '');
        fetchProductData();
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
      product_name: Yup.string().required().min(3),
      description: Yup.string().required().min(3),
      product_weight: Yup.number().required(),
      price: Yup.number().required().min(3),
      CategoryId: Yup.number().required(),
    }),
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    formikAddProduct.setFieldValue(name, value);
  };

  const onCloseModal = () => {
    formikAddProduct.handleSubmit();
    onCloseAddNewProduct();
  };

  const sortCategoryHandler = ({ target }) => {
    const { value } = target;
    setSortBy(value.split(' ')[0]);
    setSortDir(value.split(' ')[1]);
  };

  useEffect(() => {
    fetchProductData();
    // fetchCategory();
  }, [openedEdit, pages, keyword, sortBy, sortDir]);

  return (
    <>
      <Box marginLeft="90px" mt={90}>
        <HStack justifyContent="space-between">
          <Box>
            <Text fontSize={'2xl'} fontWeight="bold">
              Product Data Management
            </Text>
          </Box>
        </HStack>

        <HStack mt="5px" justifyContent="right">
          <Button
            bgColor={'#0095DA'}
            color="white"
            _hover={false}
            isDisabled={authSelector.RoleId !== 3 ? true : false}
            onClick={onOpenAddNewProduct}
            w="50px"
          >
            <MdAddToPhotos />
          </Button>
          <Box gap="4" display={'flex'}>
            <Select
              onChange={sortCategoryHandler}
              fontSize={'15px'}
              fontWeight="normal"
              variant="filled"
              width={'150px'}
              color={'#6D6D6F'}
              _placeholder="Sort By"
            >
              <option value="ID ASC" selected>
                ID ASC
              </option>
              <option value="ID DESC">ID DESC</option>
              <option value="createdAt DESC">Latest</option>
              <option value="createdAt ASC">Oldest</option>
            </Select>

            {/* <form onSubmit={formikSearch.handleSubmit}> */}
            <FormControl>
              <InputGroup textAlign={'right'}>
                <Button
                  borderRightRadius={'0'}
                  type="submit"
                  onClick={searchKey}
                >
                  <TbSearch />
                </Button>
                <Input
                  type="text"
                  placeholder="Search by Name or Description"
                  name="search"
                  w="260px"
                  onChange={(event) => setKeywordHandler(event.target.value)}
                  borderLeftRadius="0"
                  value={keywordHandler}
                />
              </InputGroup>
            </FormControl>
          </Box>
        </HStack>
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th w="10px">ID</Th>
              <Th w="150px">Product pictures</Th>
              <Th w="150px">Name</Th>
              <Th w="450px">Description</Th>
              <Th>Weight</Th>
              <Th>Price</Th>
              <Th>Category</Th>
              <Th>Option</Th>
            </Tr>
          </Thead>
          <Tbody>{isLoading && renderProductData()}</Tbody>
        </Table>
        <Text fontSize={'2xl'} fontWeight="bold" color={'#0095DA'}>
          Total Products : {totalCount}
        </Text>
      </Box>

      <Grid templateColumns={'repeat(3, 1fr'} mt={15}>
        <GridItem />
        <GridItem>
          {!admin.length ? (
            <Alert status="warning" ml="100px">
              <AlertIcon />
              <AlertTitle>No post found</AlertTitle>
            </Alert>
          ) : null}

          <HStack justifyContent={'center'} mt={'20px'} mb={'50px'} ml={'50px'}>
            <Button
              bgColor={'white'}
              color={'#0095DA'}
              onClick={prevPage}
              w={'60px'}
              isDisabled={pages + 1 === 1 ? true : null}
            >
              <BsArrowBarLeft fontSize={'40px'} />
            </Button>
            <Text w={'10px'} fontSize={'14px'}>
              {pages + 1}
            </Text>
            <Button
              bgColor={'white'}
              color="#0095DA"
              onClick={nextPage}
              w={'60px'}
              isDisabled={pages + 1 >= maxPage ? true : null}
            >
              <BsArrowBarRight fontSize={'40px'} />
            </Button>
          </HStack>
        </GridItem>
        <GridItem />
      </Grid>

      {/* Alert Delete */}
      <Alert2
        body={`Are you sure to delete "${deleteAlert?.product_name}"`}
        cancelRef={cancelRef}
        color={'#0095DA'}
        header={'Delete Product'}
        isOpen={deleteAlert}
        leftButton={'Cancel'}
        onClose={() => setDeleteAlert(null)}
        onSubmit={() => doubleOnClick()}
        rightButton={'Delete'}
      />

      {/* Modal New Admin */}
      <Modal
        isOpen={isOpenAddNewProduct}
        onClose={onCloseAddNewProduct}
        motionPreset="slideInBottom"
        size={'4xl'}
      >
        <form onSubmit={formikAddProduct.handleSubmit}>
          <ModalOverlay />
          <ModalContent p="20px">
            <ModalHeader fontSize={'2xl'} fontWeight="bold">
              Add New Product
            </ModalHeader>

            <ModalBody>
              <HStack>
                <FormControl isInvalid={formikAddProduct.errors.image_url}>
                  <Image
                    w={'150px'}
                    h="150px"
                    objectFit={'cover'}
                    borderRadius={'8px'}
                    border="3px solid"
                    color={'#0095DA'}
                    mx="auto"
                    src={selectedImage ? selectedImage : gambar}
                  />
                  <Button
                    borderRadius={'50%'}
                    w="auto"
                    h="30px"
                    border="2px solid"
                    onClick={() => inputFileRef.current.click()}
                    color={'#0095DA'}
                    _hover={false}
                    ml="58%"
                    size={'xs'}
                    mt="-33px"
                  >
                    <TbCameraPlus color={'#0095DA'} />
                  </Button>

                  <Input
                    w="100%"
                    _hover={false}
                    fontWeight="bold"
                    bgColor={'white'}
                    onChange={(e) => {
                      console.log(e.target.files[0].File);
                      formikAddProduct.setFieldValue(
                        'image_url',
                        e.target.files[0],
                      );
                      setSelectedImage(URL.createObjectURL(e.target.files[0]));
                    }}
                    accept="image/*"
                    name="image_url"
                    type="file"
                    color="transparent"
                    border="0"
                    display={'none'}
                    ref={inputFileRef}
                  />
                  <FormErrorMessage>
                    {formikAddProduct.errors.image_url}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
              <FormLabel>Name</FormLabel>
              <FormControl isInvalid={formikAddProduct.errors.product_name}>
                <Input
                  value={formikAddProduct.values.product_name}
                  name="product_name"
                  type="text"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>
                  {formikAddProduct.errors.product_name}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={'15px'}>Description</FormLabel>
              <FormControl isInvalid={formikAddProduct.errors.description}>
                <Textarea
                  value={formikAddProduct.values.description}
                  name="description"
                  onChange={formChangeHandler}
                />

                <FormErrorMessage>
                  {formikAddProduct.errors.description}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={'15px'}>Weight (gr)</FormLabel>
              <FormControl isInvalid={formikAddProduct.errors.product_weight}>
                <Input
                  value={formikAddProduct.values.product_weight}
                  name="product_weight"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>
                  {formikAddProduct.errors.product_weight}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={'15px'}>Price</FormLabel>
              <FormControl isInvalid={formikAddProduct.errors.price}>
                <Input
                  value={formikAddProduct.values.price}
                  name="price"
                  onChange={formChangeHandler}
                />
                <FormErrorMessage>
                  {formikAddProduct.errors.price}
                </FormErrorMessage>
              </FormControl>

              <FormLabel mt={'15px'}>Category</FormLabel>
              <FormControl isInvalid={formikAddProduct.errors.CategoryId}>
                <Select
                  name="CategoryId"
                  onChange={formChangeHandler}
                  placeholder="Select category"
                >
                  {isLoading && renderCategory()}
                </Select>
                <FormErrorMessage>
                  {formikAddProduct.errors.CategoryId}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onCloseAddNewProduct}>
                Cancel
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onCloseModal}>
                Add New Product
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default ManageProduct;
