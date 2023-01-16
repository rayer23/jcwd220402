import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  GridItem,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../api';
import { useSelector } from 'react-redux';
import CategoryItems from './categoryitems';
import {
  BsArrowBarLeft,
  BsArrowBarRight
} from 'react-icons/bs';
import { TbSearch } from 'react-icons/tb';
import { MdAddToPhotos } from 'react-icons/md';


const AdminCategory = () => {
  const authSelector = useSelector((state) => state.auth);

  const [showCategory, setShowCategory] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('ASC');
  const [count, setCount] = useState(1);
  const [isLoading, setIsloading] = useState(false);

  const inputFileRef = useRef(null);

  const toast = useToast();

  const { onClose } = useDisclosure();

  const {
    isOpen: isOpenAddNewCategory,
    onOpen: onOpenAddNewCategory,
    onClose: onCloseAddNewCategory,
  } = useDisclosure();

  const fetchCategory = async () => {
    const maxItemsPerPage = 5;
    try {
      const response = await axiosInstance.get('/admin/categories', {
        params: {
          _page: page,
          _limit: maxItemsPerPage,
          category_name: currentSearch,
          _sortBy: sortBy,
          _sortDir: sortDir,
        },
      });

      setCount(response.data.dataCount);
      setShowCategory(response.data.data);
      setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage));
      setIsloading(true);
    } catch (err) {
      console.log(err);
    }
  };

  const resetFilterBtnHandler = () => {
    formik.setFieldValue('search', '');
    setPage(1);
    setCurrentSearch('');
    setSortBy('id');
    setSortDir('ASC');
  };

  const formik = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: ({ search }) => {
      setCurrentSearch(search);
      setPage(1);
    },
  });

  const searchCategoryHandler = ({ target }) => {
    const { name, value } = target;
    formik.setFieldValue(name, value);
  };

  const sortCategoryHandler = ({ target }) => {
    const { value } = target;

    setSortBy(value);
  };

  const sortDateHandler = ({ target }) => {
    const { value } = target;

    setSortDir(value);
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const previousPage = () => {
    setPage(page - 1);
  };

  const deleteCategoryHandler = async (id) => {
    try {
      await axiosInstance.delete(`/admin/categories/${id}`);

      fetchCategory();

      toast({
        title: 'Category Deleted',
        status: 'info',
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const renderCategory = () => {
    return showCategory.map((val) => {
      return (
        <CategoryItems
          key={val.id.toString()}
          category_name={val.category_name}
          category_image={val.category_image}
          fetchCategory={fetchCategory}
          onDelete={() => deleteCategoryHandler(val.id)}
          isOpenAddNewCategory={isOpenAddNewCategory}
          onCloseAddNewCategory={onCloseAddNewCategory}
          inputFileRef={inputFileRef}
          CategoryId={val.id}
        />
      );
    });
  };

  useEffect(() => {
    fetchCategory();
  }, [page, currentSearch, sortBy, sortDir]);

  return (
    <>
      <Box mt={'90px'} width="750px" h={'750px'} ml={'520px'}>
        <Box p="" display={'flex'} justifyContent="space-between">
          <VStack>
            <Text fontSize={'2xl'} fontWeight="bold" mb={'10px'} mr={'410px'}>
              Category Management
            </Text>

            <HStack>
              <Box mr={'-275px'}>
                <HStack>
                  <Button
                    bgColor={'#0095DA'}
                    color={authSelector.RoleId !== 3 ? '#F20000' : 'white'}
                    _hover={false}
                    isDisabled={authSelector.RoleId !== 3 ? true : false}
                    onClick={() => onOpenAddNewCategory()}
                    w="50px"
                  >
                    <MdAddToPhotos />
                  </Button>
                  <Select
                    onChange={sortCategoryHandler}
                    variant="filled"
                    fontSize={'15px'}
                    fontWeight="normal"
                    width={'92px'}
                    color={'#6D6D6F'}
                  >
                    <option value="category_name">Name</option>
                    <option value="updatedAt">Date</option>
                  </Select>

                  <Select
                    onChange={sortDateHandler}
                    variant="filled"
                    fontWeight="normal"
                    fontSize={'15px'}
                    width={'85px'}
                    color={'#6D6D6F'}
                  >
                    <option value="ASC">A-Z</option>
                    <option value="DESC">Z-A</option>
                  </Select>
                  <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                      <InputGroup>
                        <Input
                          size={'md'}
                          type={'text'}
                          placeholder="Search Category"
                          width={'200px'}
                          onChange={searchCategoryHandler}
                          name="search"
                          value={formik.values.search}
                        />
                        <InputRightElement width="5rem">
                          <Button
                            h="2rem"
                            ml={'30px'}
                            bgColor="#fff"
                            type="submit"
                            _hover={'none'}
                          >
                            <TbSearch fontSize={'15px'} />
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </form>
                </HStack>
              </Box>
            </HStack>
          </VStack>
        </Box>

        {/* Table Category Data */}
        <Box
          mt={'25px'}
          pt={'0px'}
          borderTop={'10px solid #fff'}
          boxShadow={'rgba(0, 0, 0, 0.15) 0px 0.5rem 1rem'}
          borderRadius={'10px'}
          h={'650px'}
          width={'700px'}
        >
          <Table
            mt={'-5px'}
            variant={count === 0 || isLoading === false ? 'simple' : 'striped'}
            colorScheme="blue"
          >
            <Thead
              // bgColor={'#0095DA'}
              border={'1px solid #fff'}
              borderRadius={'10px'}
            >
              <Tr h={'25px'}>
                <Th width={'200px'} fontSize={'14px'}>
                  Category Name
                </Th>
                <Th width={'425px'} textAlign={'center'} fontSize={'14px'}>
                  Category Image
                </Th>
                <Th width={'200px'} textAlign={'center'} fontSize={'14px'}>
                  Option
                </Th>
              </Tr>
            </Thead>

            {isLoading === false ? (
              <Tbody bgColor={'white'} maxW={'450px'}>
                <Tr>
                  <Td bgColor={'#fff'}>
                    <Box
                      mt={'70px'}
                      display={'flex'}
                      ml={'250px'}
                      justifyContent={'center'}
                      alignItems={'center'}
                      alignContent={'center'}
                    >
                      <CircularProgress
                        isIndeterminate
                        color="#0095DA"
                        thickness="20px"
                        size="30px"
                      />
                    </Box>
                  </Td>
                </Tr>
              </Tbody>
            ) : null}
            {count === 0 ? (
              // not found
              <Tbody bgColor={'white'} maxW={'300px'}>
                <Tr>
                  <Td maxW={'250px'} bgColor={'#fff'}>
                    <Box
                      w={'200px'}
                      h={'342.59px'}
                      display={'flex'}
                      justifyContent={'center'}
                      flexDir={'column'}
                      alignContent={'center'}
                      alignItems={'center'}
                      mt={'70px'}
                      ml={'230px'}
                    >
                      <Text
                        textAlign={'center'}
                        fontSize={'16px'}
                        color={'#31353BAD'}
                        m={'14px 3.5px'}
                        fontWeight={'bold'}
                        lineHeight={'16px'}
                      >
                        Category Not Found
                      </Text>
                      <Text
                        textAlign={'center'}
                        fontSize={'14px'}
                        color={'#31353BAD'}
                        m={'3.5px 3.5px 28px'}
                        fontWeight={'unset'}
                        lineHeight={'16px'}
                      >
                        The category you are trying to find was not found
                      </Text>
                      <Button
                        onClick={resetFilterBtnHandler}
                        borderRadius={'8px'}
                        minH={'40px'}
                        textAlign={'center'}
                        fontSize={'16px'}
                        lineHeight={'22px'}
                        fontWeight={600}
                        fontFamily={'Open Sauce One, sans-serif'}
                        color={'#fff'}
                        bgColor={'#0095DA'}
                        w={'200px'}
                        _hover={{
                          bgColor: '#0370A2',
                        }}
                        _active={{
                          bgColor: '#0370A2',
                        }}
                      >
                        Reset
                      </Button>
                    </Box>
                  </Td>
                </Tr>
              </Tbody>
            ) : (
              <Tbody bgColor={'#fff'}>{isLoading && renderCategory()}</Tbody>
            )}
            <Tfoot>
              <Tr></Tr>
            </Tfoot>
          </Table>
        </Box>
      </Box>

      {/* Change Page */}
      <GridItem>
        <HStack justifyContent={'center'} mt={'50px'} mb={'50px'} ml={'50px'}>
          <Button
            bgColor={'white'}
            color={'#0095DA'}
            onClick={previousPage}
            w={'60px'}
            isDisabled={page === 1 ? true : null}
          >
            <BsArrowBarLeft fontSize={'40px'} />
          </Button>
          <Button
            w={'10px'}
            p={'10px'}
            fontSize={'14px'}
            _hover={'none'}
            onClick={'none'}
          >
            {page}
          </Button>
          <Button
            bgColor={'white'}
            color="#0095DA"
            onClick={nextPage}
            w={'60px'}
            isDisabled={page >= maxPage ? true : null}
          >
            <BsArrowBarRight fontSize={'40px'} />
          </Button>
        </HStack>
      </GridItem>
    </>
  );
};

export default AdminCategory;
