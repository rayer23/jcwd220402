import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Image,
  Td,
  Text,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { axiosInstance } from '../../api';
import { FiEdit } from 'react-icons/fi';
import { RiDeleteBin2Line } from 'react-icons/ri';

import AddNewCategory from '../../components/admin/addcategory';
import EditCategory from '../../components/admin/editcategory';

const AdminCategoryItems = ({
  CategoryId,
  fetchCategory,
  category_name,
  category_image,
  onDelete,
  isOpenAddNewCategory,
  onCloseAddNewCategory,
  inputFileRef,
}) => {
  const [selectImage, setSelectImage] = useState(null);

  const authSelector = useSelector((state) => state.auth);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isOpenEditCategory,
    onOpen: onOpenEditCategory,
    onClose: onCloseEditCategory,
  } = useDisclosure();

  const toast = useToast();

  const formikAddNewCategory = useFormik({
    initialValues: {
      category_name: '',
      category_image: null,
    },
    onSubmit: async ({ category_name, category_image }) => {
      try {
        let newCategory = new FormData();

        newCategory.append('category_name', category_name);
        newCategory.append('category_image', category_image);

        const response = await axiosInstance.post(
          '/admin/categories',
          newCategory,
        );

        formikAddNewCategory.setFieldValue('category_name', '');
        formikAddNewCategory.setFieldValue('category_image', null);
        if (formikAddNewCategory.errors !== true) {
          onCloseAddNewCategory();
        }
        toast({
          title: 'Category Created',
          description: response.data.message,
          status: 'success',
        });

        setSelectImage(null);
        fetchCategory();
      } catch (err) {
        console.log(err);
        toast({
          title: 'Failed Create New Category',
          description: err.response.data.message,
          status: 'error',
        });
      }
    },
  });

  const editFormik = useFormik({
    initialValues: {
      category_name: '',
      category_image: null,
    },
    onSubmit: async ({ category_name, category_image }) => {
      try {
        const newCategory = new FormData();

        if (category_name) {
          newCategory.append('category_name', category_name);
        }

        if (category_image) {
          newCategory.append('category_image', category_image);
        }

        const response = await axiosInstance.patch(
          `/admin/categories/${CategoryId}`,
          newCategory,
        );

        toast({
          title: 'Category Edited',
          description: response.data.message,
          status: 'success',
        });

        onCloseEditCategory();
        setSelectImage(null);
        fetchCategory();
      } catch (error) {
        console.log(error);
        toast({
          title: 'Failed Edit Category',
          description: error.response.data.message,
          status: 'error',
        });
      }
    },
  });

  const addNewCategory = () => {
    formikAddNewCategory.handleSubmit();
  };

  const inputChangeHandler = ({ target }) => {
    const { name, value } = target;

    formikAddNewCategory.setFieldValue(name, value);
  };

  const editChangeHandler = ({ target }) => {
    const { name, value } = target;

    editFormik.setFieldValue(name, value);
  };

  const confirmDeleteBtnHandler = () => {
    onClose();
    onDelete();
  };

  const closeAddNewModal = () => {
    onCloseAddNewCategory();
    formikAddNewCategory.setFieldValue('category_name', '');
    formikAddNewCategory.setFieldValue('category_image', null);
    setSelectImage(null);
  };

  const closeEditModal = () => {
    onCloseEditCategory();
    editFormik.setFieldValue('category_name', '');
    editFormik.setFieldValue('category_image', null);
    setSelectImage(null);
  };

  const apiImg = process.env.REACT_APP_IMAGE_URL;

  useEffect(() => {
    if (isOpenEditCategory) {
      editFormik.setFieldValue('category_name', category_name);
    }
    fetchCategory();
  }, [isOpenEditCategory]);

  return (
    <>
      {/* category data table */}
      <Tr>
        <Td>
          <Text fontWeight={'700'}>{category_name || 'null'}</Text>
        </Td>
        <Td>
          <Image
            mx={'auto'}
            src={`${apiImg}/${category_image}`}
            width={'80px'}
            height={'80px'}
          />
        </Td>

        {/* Edit and Delete Button */}
        <Td>
          <Button
            bgColor="#0095DA"
            _hover={false}
            marginLeft="15px"
            marginRight="5px"
            _active={false}
            color="white"
            onClick={onOpenEditCategory}
            width="50px"
            pr={'1px'}
            pl={'1px'}
            isDisabled={authSelector.RoleId !== 3 ? true : false}
          >
            <FiEdit fontSize={'20px'} />
          </Button>
          <Button
            _active={false}
            pr={'1px'}
            pl={'1px'}
            width="50px"
            bgColor="#FF0000"
            _hover={false}
            color="white"
            onClick={() => onOpen()}
            isDisabled={authSelector.RoleId !== 3 ? true : false}
          >
            <RiDeleteBin2Line fontSize={'20px'} />
          </Button>
        </Td>
      </Tr>

      {/* Alert Dialog For Delete Category */}
      <AlertDialog
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        closeOnEsc={false}
      >
        <AlertDialogOverlay bg="blackAlpha.400">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Category
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete {category_name} ?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={onClose}
                bgColor={'#0095DA'}
                _hover={false}
                color={'white'}
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                _hover={false}
                onClick={confirmDeleteBtnHandler}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Modal Add new Category */}
      <AddNewCategory
        isOpenAddNewCategory={isOpenAddNewCategory}
        onCloseAddNewCategory={onCloseAddNewCategory}
        closeAddNewModal={closeAddNewModal}
        formikAddNewCategory={formikAddNewCategory}
        inputChangeHandler={inputChangeHandler}
        selectImage={selectImage}
        setSelectImage={setSelectImage}
        addNewCategory={addNewCategory}
        inputFileRef={inputFileRef}
      />

      {/* Modal Edit Category */}
      <EditCategory
        isOpenEditCategory={isOpenEditCategory}
        onOpenEditCategory={onOpenEditCategory}
        onCloseEditCategory={onCloseEditCategory}
        editFormik={editFormik}
        category_name={category_name}
        editChangeHandler={editChangeHandler}
        selectImage={selectImage}
        setSelectImage={setSelectImage}
        apiImg={apiImg}
        category_image={category_image}
        inputFileRef={inputFileRef}
        closeEditModal={closeEditModal}
      />
    </>
  );
};

export default AdminCategoryItems;
