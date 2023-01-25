import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
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
  useToast,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { axiosInstance } from '../../api';
import { TbSearch } from 'react-icons/tb';
import { IoIosAlert } from 'react-icons/io';
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

const ProductHistory = () => {
  const [stockData, setStockData] = useState([]);
  const [currentSearch, setCurrentSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('id');
  const [sortDir, setSortDir] = useState('ASC');
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(1);
  const [endTime, setEndTime] = useState(1);

  const toast = useToast();

  const fetchAdminData = async () => {
    const maxItemsPerPage = 6;
    try {
      const response = await axiosInstance.get('/export/stock', {
        params: {
          _page: page,
          _limit: maxItemsPerPage,
          id: currentSearch,
          _sortBy: sortBy,
          _sortDir: sortDir,
          currentTime: currentTime,
          endTime: endTime,
        },
      });

      setTotalCount(response.data.dataCount);
      setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage));
      setStockData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderStock = () => {
    return stockData.map((val) => {
      return (
        <Tr key={val.id.toString()}>
          <Td>{val.id}</Td>
          <Td>{val.Product?.product_name}</Td>
          <Td>{val.stock_before}</Td>
          <Td>{val.stock_after}</Td>
          <Td>{val.Type_Journal?.type == 0 ? 'Reduced' : 'Added'}</Td>
          <Td>{val.Type_Journal?.name}</Td>
          <Td>
            <Text>
              {val.createdAt.split('T')[0]} /{' '}
              {val.createdAt.split('T')[1].split('.000Z')}
            </Text>
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

  const formikSearch = useFormik({
    initialValues: {
      search: '',
    },
    onSubmit: ({ search }) => {
      setCurrentSearch(search);
      setPage(1);
    },
  });
  const formikDate = useFormik({
    initialValues: {
      currentTime: '',
    },
    onSubmit: ({ start, end }) => {
      setCurrentTime(start);
      setEndTime(end);
      setPage(1);
    },
  });

  const searchAdminHandler = ({ target }) => {
    const { name, value } = target;
    formikSearch.setFieldValue(name, value);
  };
  const currentTimeHandler = ({ target }) => {
    const { value } = target;
    setCurrentTime(value);
    fetchAdminData();
  };
  const endTimeHandler = ({ target }) => {
    const { value } = target;
    setEndTime(value);
    fetchAdminData();
  };
  const sortCategoryHandler = ({ target }) => {
    const { value } = target;
    setSortBy(value.split(' ')[0]);
    setSortDir(value.split(' ')[1]);
  };

  useEffect(() => {
    fetchAdminData();
  }, [currentSearch, page, sortDir, sortBy, currentTime, endTime]);

  return (
    <Box marginLeft={'90px'} mt={90}>
      <Box display={'flex'} justifyContent="space-between" mr="2">
        <HStack>
          <Box>
            <Text fontSize={'2xl'} fontWeight="bold">
              Stock Report
            </Text>
          </Box>
        </HStack>

        <HStack mt="5px" justifyContent="center">
          <Box gap="4" mr={30} display={'flex'}>
            <Select
              onChange={sortCategoryHandler}
              fontSize={'15px'}
              fontWeight="normal"
              variant="filled"
              width={'110px'}
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

            <form onSubmit={formikSearch.handleSubmit}>
              <FormControl>
                <InputGroup textAlign={'right'}>
                  <Button borderRightRadius={'0'} type="submit">
                    <TbSearch />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Search by ID"
                    name="search"
                    w="200px"
                    onChange={searchAdminHandler}
                    borderLeftRadius="0"
                    value={formikSearch.values.search}
                  />
                </InputGroup>
              </FormControl>
            </form>
          </Box>
        </HStack>
      </Box>
      <Table mt={2} variant={'striped'} colorScheme={'blue'} size="lg">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Product Name</Th>
            <Th>Stock Before</Th>
            <Th>Stock After</Th>
            <Th>Journal Type</Th>
            <Th>Journal Name</Th>
            <Th>Report Date</Th>
          </Tr>
        </Thead>
        <Tbody>{renderStock()}</Tbody>
      </Table>
      {!stockData.length ? (
        <Box p="10px" bgColor={'#E5F9F6'}>
          <Box mx="auto">
            <Box display={'flex'} mx="auto" w="170px">
              <IoIosAlert fontSize={'25px'} color="#0095DA" />
              <Text fontWeight="medium" ml="2">
                No stock changes found
              </Text>
            </Box>
          </Box>
        </Box>
      ) : null}

      <Text fontSize={'2xl'} fontWeight="bold" color={'#0095DA'}>
        Total Reports:{totalCount}
      </Text>

      <HStack justifyContent="right">
        <Box gap="4" mr={30} display={'flex'}>
          <FormLabel mt={2} for="start">
            Start date:
          </FormLabel>
          <Input
            type="date"
            id="start"
            name="start"
            w={175}
            onChange={currentTimeHandler}
            value={formikDate.values.start}
            defaultValue="2022-12-01"
            min="2020-01-01"
            max="2025-12-31"
          ></Input>

          <FormLabel mt={2} for="end">
            End date:
          </FormLabel>
          <Input
            type="date"
            id="end"
            name="end"
            w={175}
            onChange={endTimeHandler}
            value={formikDate.values.end}
            defaultValue="2023-01-31"
            min="2020-01-01"
            max="2025-12-31"
          ></Input>
        </Box>
      </HStack>

      {/* Page */}
      <HStack justifyContent={'center'} mt={'20px'} mb={'50px'} ml={'-20px'}>
        <Button
          bgColor={'white'}
          color={'#0095DA'}
          onClick={previousPage}
          w={'60px'}
          isDisabled={page === 1 ? true : null}
        >
          <BsArrowBarLeft fontSize={'40px'} />
        </Button>
        <Text w={'10px'} fontSize={'14px'}>
          {page}
        </Text>
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
    </Box>
  );
};
export default ProductHistory;
