import {
  Box,
  Image,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  useToast,
  FormControl,
  Stack,
  Input,
  FormLabel,
  FormErrorMessage,
  Select,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { axiosInstance } from '../../api/index';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';

import CarouselProduct from '../../components/admin/carouselproduct';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { TbCameraPlus } from 'react-icons/tb';
import gambar from '../../assets/default_image.png';
import Alert from '../../components/alert';

const ManageProductDetail = () => {
  const [dataDetail, setDataDetail] = useState({});
  const toast = useToast();
  const params = useParams();
  const [adminUpdate, setAdminUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = useRef();
  const [category, setCategory] = useState({});
  const inputFileRef = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageData, setImageData] = useState({});
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [deleteAlertImage, setDeleteAlertImage] = useState(null);
  const authSelector = useSelector((state) => state.auth);

  const {
    isOpen: isOpenAddNewProduct,
    onOpen: onOpenAddNewProduct,
    onClose: onCloseAddNewProduct,
  } = useDisclosure();

  const fetchProductData = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/product/detail/${params.id}`,
      );

      setDataDetail(response.data.data);
      setImageData(dataDetail.Image_Urls);

      editDetailFormik.setFieldValue(
        'product_name',
        response.data.data.product_name,
      );
      editDetailFormik.setFieldValue(
        'description',
        response.data.data.description,
      );
      editDetailFormik.setFieldValue(
        'product_weight',
        response.data.data.product_weight,
      );
      editDetailFormik.setFieldValue('price', response.data.data.price);
      editDetailFormik.setFieldValue(
        'category_name',
        response.data.data.Category.category_name,
      );
      editDetailFormik.setFieldValue(
        'CategoryId',
        response.data.data.Category.CategoryId,
      );

      setIsLoading(true);
      const categoryRes = await axiosInstance.get('/admin/product/category');
      setCategory(categoryRes.data.data);
    } catch (err) {
      console.log(err);
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
  const doubleOnClick = () => {
    setDeleteAlertImage(null);
    deleteImage(deleteAlertImage);
  };
  const renderImages = () => {
    return Array.from(dataDetail.Image_Urls).map((val) => {
      return (
        <GridItem textAlign={'center'}>
          <Box>
            <Image width="150px" height="150px" src={val?.image_url} />
            <Button
              color={'white'}
              bgColor="red"
              isDisabled={authSelector.RoleId !== 3 ? true : false}
              onClick={() => setDeleteAlertImage(val)}
            >
              <RiDeleteBin2Line />
            </Button>
          </Box>
        </GridItem>
      );
    });
  };

  const deleteImage = async (val) => {
    try {
      await axiosInstance.delete(`/admin/product/detail/images/${val.id}`);
      toast({ title: 'Success deleted product image', status: 'success' });
      fetchProductData();
    } catch (error) {
      console.log(error);
      toast({ title: 'Error deleting product image', status: 'error' });
    }
  };

  const destroyProduct = async () => {
    try {
      await axiosInstance.delete(`/admin/product/detail/${params.id}`);
      toast({ title: 'Product removed', status: 'success' });
      fetchProductData();
    } catch (err) {
      console.log(err);
      toast({ title: 'Error deleting product', status: 'error' });
    }
  };

  const editDetailFormik = useFormik({
    initialValues: {
      product_name: '',
      description: '',
      product_weight: '',
      price: '',
      CategoryId: '',
    },
    onSubmit: async (values) => {
      try {
        let updateProduct = {
          product_name: values.product_name,
          description: values.description,
          product_weight: values.product_weight,
          price: values.price,
          CategoryId: values.CategoryId,
        };
        await axiosInstance.patch(
          `/admin/product/detail/${params.id}`,
          updateProduct,
        );

        setAdminUpdate(false);
        toast({ title: 'Product edited', status: 'success' });
        fetchProductData();
      } catch (err) {
        console.log(err);
      }
    },
    validationSchema: Yup.object({
      product_name: Yup.string().required().min(3),
      description: Yup.string().required(),
      price: Yup.number().required(),
      CategoryId: Yup.number().required(),
    }),
    validateOnChange: false,
  });
  const addPictureFormik = useFormik({
    initialValues: {
      image_url: '',
    },

    onSubmit: async ({ image_url }) => {
      try {
        const data = new FormData();

        if (image_url) {
          data.append('image_url', image_url);
        }
        await axiosInstance.post(`/admin/product/detail/${params.id}`, data);

        setAdminUpdate(false);
        toast({ title: 'Product image added successfully', status: 'success' });
        fetchProductData();
      } catch (err) {
        console.log(err);
      }
    },
    validateOnChange: false,
  });

  const formChangeHandler = ({ target }) => {
    const { name, value } = target;
    editDetailFormik.setFieldValue(name, value);
  };

  const onCloseModal = () => {
    addPictureFormik.handleSubmit();
    onCloseAddNewProduct();
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <Box ml="185px" p={'40px'} pt={'5px'}>
      <Grid templateColumns="repeat(2, 1fr)">
        <GridItem w="100%">
          <Heading size={'lg'} p={5}>
            Product Data Details
          </Heading>
        </GridItem>
      </Grid>

      {!adminUpdate ? (
        <Flex direction={{ base: 'column', md: 'column', lg: 'row' }}>
          <Box>
            <Stack>
              <CarouselProduct />
              <Grid templateColumns={'repeat(3, 1fr)'}>
                {isLoading && renderImages()}
              </Grid>
            </Stack>
          </Box>
          <Box
            flex={'1'}
            w={'full'}
            h={'full'}
            ml={10}
            alignItems={'flex-start'}
          >
            <Heading size={'md'}>Name</Heading>
            <Text fontSize={'xl'}>{dataDetail.product_name}</Text>
            <br />
            <Heading size={'md'}>Description</Heading>
            <Text fontSize={'xl'}>{dataDetail.description}</Text>
            <br />
            <Heading size={'md'}>Weight</Heading>
            <Text fontSize={'xl'}>{dataDetail.product_weight} gr</Text>
            <br />

            <Heading size={'md'}>Price</Heading>
            <Text fontSize={'xl'}>
              {dataDetail?.price
                ? dataDetail.price.toLocaleString('in-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })
                : ''}
            </Text>
            <br />
            <Heading size={'md'}>Category</Heading>
            <Text fontSize={'xl'}>{dataDetail?.Category?.category_name}</Text>
            <Box mt={10}>
              <Button
                width="160px"
                color="white"
                bgColor="#0095DA"
                _hover={false}
                mr={5}
                isDisabled={authSelector.RoleId !== 3 ? true : false}
                onClick={onOpenAddNewProduct}
              >
                Add New Picture
              </Button>

              <Button
                width="160px"
                color="white"
                bgColor="#F29500"
                _hover={false}
                mr={5}
                isDisabled={authSelector.RoleId !== 3 ? true : false}
                onClick={() => setAdminUpdate(true)}
              >
                Edit Product Details
              </Button>
              <Link to="/admin/product">
                <Button
                  width="160px"
                  _hover={false}
                  bgColor="red"
                  color="white"
                >
                  Back
                </Button>
              </Link>
            </Box>
          </Box>
        </Flex>
      ) : (
        <form onSubmit={editDetailFormik.handleSubmit}>
          <Stack ml={10}>
            <FormControl isInvalid={editDetailFormik.errors.product_name}>
              <FormLabel>Product name</FormLabel>
              <Input
                value={editDetailFormik.values.product_name}
                name="product_name"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>
                {editDetailFormik.errors.product_name}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                height="100px"
                value={editDetailFormik.values.description}
                name="description"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>
                {editDetailFormik.errors.description}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.product_weight}>
              <FormLabel>Weight(gr)</FormLabel>
              <Input
                value={editDetailFormik.values.product_weight}
                name="product_weight"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>
                {editDetailFormik.errors.product_weight}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.price}>
              <FormLabel>Price</FormLabel>
              <Input
                value={editDetailFormik.values.price}
                name="price"
                onChange={formChangeHandler}
              />
              <FormErrorMessage>
                {editDetailFormik.errors.price}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={editDetailFormik.errors.CategoryId}>
              <FormLabel>Category</FormLabel>
              <Select
                name="CategoryId"
                onChange={formChangeHandler}
                placeholder="Select category"
              >
                {renderCategory()}
              </Select>
              <FormErrorMessage>
                {editDetailFormik.errors.CategoryId}
              </FormErrorMessage>
            </FormControl>
            <Box>
              <Button
                colorScheme="red"
                width="100px"
                onClick={() => setAdminUpdate(false)}
                marginRight="10px"
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                width="100px"
                onClick={() => editDetailFormik.handleSubmit()}
              >
                Save
              </Button>
            </Box>
          </Stack>
        </form>
      )}
      {/* Alert Delete images*/}
      <Alert
        body={`Are you sure to delete this picture`}
        cancelRef={cancelRef}
        color={'#0095DA'}
        header={'Delete Product'}
        isOpen={deleteAlertImage}
        leftButton={'Cancel'}
        onClose={() => setDeleteAlertImage(null)}
        onSubmit={() => doubleOnClick()}
        rightButton={'Delete'}
      />
      <Modal
        isOpen={isOpenAddNewProduct}
        onClose={onCloseAddNewProduct}
        motionPreset="slideInBottom"
        size={'3xl'}
      >
        <form onSubmit={addPictureFormik.handleSubmit}>
          <ModalOverlay />
          <ModalContent p="20px">
            <ModalHeader fontSize={'xl'} fontWeight="bold">
              Add New Picture
            </ModalHeader>

            <ModalBody>
              <HStack>
                <FormControl isInvalid={addPictureFormik.errors.image_url}>
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
                      addPictureFormik.setFieldValue(
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
                    {addPictureFormik.errors.image_url}
                  </FormErrorMessage>
                </FormControl>
              </HStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onCloseAddNewProduct}>
                Cancel
              </Button>
              <Button colorScheme="blue" mr={3} onClick={onCloseModal}>
                Add Picture
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </Box>
  );
};

export default ManageProductDetail;
