import {
    Alert,
    FormControl,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Grid,
    GridItem,
    HStack,
    Select,
    Spacer,
    Text,
    Flex,
    Center,
    Spinner,
    Icon,
    useToast,
    Image,
    Stack,
    InputGroup,
    Input,
    InputRightElement,
    FormHelperText,
    Tooltip,
    useColorModeValue,
    FormLabel,
    // CircularProgress,
} from "@chakra-ui/react"
import { BiSearchAlt, BiReset } from "react-icons/bi";
import { BsFilterLeft } from "react-icons/bs";
import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { CgChevronLeft, CgChevronRight } from "react-icons/cg"
import { axiosInstance } from "../../api"
import ProductItem from "../../components/product/ProductItem"
import Navbar from "../../components/navbar/navbar"

const Product = () => {
    const [products, setProducts] = useState([])
    const [category, setCategory] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [page, setPage] = useState(1)
    const [maxPage, setMaxPage] = useState(1)
    const [sortBy, setSortBy] = useState("product_name")
    const [sortDir, setSortDir] = useState("ASC")
    const [filter, setFilter] = useState("All")
    const [searchProduct, setSearchProduct] = useState()
    const [searchValue, setSearchValue] = useState("")
    const [searchParam, setSearchParam] = useSearchParams()
    const [catPage, setCatPage] = useState(1)
    const [catTotalCount, setCatTotalCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [catId, setCatId] = useState([])

    const catPerRow = 5
    const [next, setNext] = useState(catPerRow)

    const fetchProduct = async () => {
        const maxItemsPerPage = 10

        try {
            const response = await axiosInstance.get(`/product`, {
                params: {
                    _page: page,
                    _limit: maxItemsPerPage,
                    _sortBy: sortBy,
                    _sortDir: sortDir,
                    CategoryId: filter,
                    product_name: searchValue,
                    category_name: searchValue,
                },
            })
            setTotalCount(response.data.dataCount)
            setMaxPage(Math.ceil(response.data.dataCount / maxItemsPerPage))

            if (page === 1) {
                setProducts(response.data.data)
            } else {
                setProducts(response.data.data)
            }  
            setIsLoading(true)
        } catch (err) {
            console.log(err)
        }
    }
    const fetchCategory = async () => {
        try {
            const response = await axiosInstance.get(`/product/category`, {
                params: {
                    _limit: 12,
                    _page: catPage,
                    _sortDir: "ASC",
                },
            })
            setCatTotalCount(response.data.dataCount)
            if (catPage === 1) {
                setCategory(response.data.data)
            } else {
                setCategory(response.data.data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const test = async () => {
        try {
            const response = await axiosInstance.get(
                `/product/category/${filter}`
            )
            setCatId(response.data.data)
        } catch (err) {
            console.log(err)
        }
    }
    const renderProduct = () => {
        return products.map((val) => {
            return (
                <ProductItem
                    key={val.id.toString()}
                    product_name={val.product_name}
                    image_url={val.Image_Urls[0]?.image_url}
                    price={val.price}
                    id={val.id}
                />
            )
        })
    }

    // Button Handler
    const sortBtnHandler = ({ target }) => {
        const { value } = target
        setSortBy(value.split(" ")[0])
        setSortDir(value.split(" ")[1])

        const params = {}
        if (searchParam.get("name")) {
            params["name"] = searchParam.get("name")
        }
        params[value.split(" ")[0]] = value.split(" ")[1]
        setSearchParam(params)
    }

    const filterBtnHandler = ({ target }) => {
        const { value } = target
        setFilter(value)

        setSearchParam(value)
    }

    const nextPageBtnHandler = () => {
        setPage(page + 1)
    }

    const prevPageBtnHandler = () => {
        setPage(page - 1)
    }

    const searchBtnHandler = () => {
        setSearchValue(searchProduct)
        const params = {}
        params["name"] = searchProduct
        setSearchParam(params)
    }
    const handleKeyEnter = (e) => {
        if (e.key === "Enter") {
            setSearchValue(searchProduct)
        }
    }
    const seeMoreBtnHandler = () => {
        setNext(next + category.length)
    }
    const seeLessBtnHandler = () => {
        setNext(catPerRow)
    }
    const resetBtnHandler = () => {
        setSearchParam(false)
        setSortBy(false)
        setFilter(false)
        window.location.reload(false)
    }

    useEffect(() => {
        for (let entry of searchParam.entries()) {
            if (entry[0] === "name") {
                setSearchValue(entry[1])
            }
            if (entry[0] === "product_name" || entry[0] === "price") {
                setSortBy(entry[0])
                setSortDir(entry[1])
            }
            if ((entry = [0] === "category")) {
                setFilter(entry[1])
            }
        }
        fetchProduct()
        fetchCategory()
        test()
    }, [page, sortBy, sortDir, filter, searchValue, catPage, searchParam])
    return (
        <>
            <Navbar
                onClick={() => searchBtnHandler()}
                onChange={(e) => setSearchProduct(e.target.value)}
                onKeyDown={handleKeyEnter}
            />
            <Box
                mx="auto"
                mt="120px"
                w="1100px"
                display={{ base: "none", md: "none", lg: "block" }}
            >
                {/* Filter and Search */}
        
                {/* Content */}
                <Box >
                    {/* Fitler */}
                    <Center>
                        <Flex flexWrap={"wrap"} color={useColorModeValue("bluelight", "white")} >
                        <Box className="filter">
                            <Box
                            m="10px"
                            mb="10px"
                            borderWidth="1px"
                            boxShadow="1px 1px 6px 1px #e0e0e0"
                            borderRadius="15px"
                            >
                            <Box
                                alignItems={"center"}
                                h="40px"
                                borderTopRadius="10px"
                                align="center"
                                bg="bluelight.400"
                                display="flex"
                            >
                                <Box h="25px" ml="10px">
                                <Icon boxSize="6" as={BsFilterLeft} />
                                </Box>
                                <Box h="25px">
                                <Text mx="10px" fontWeight="bold">
                                    Filter
                                </Text>
                                </Box>
                                <Icon
                                sx={{ _hover: { cursor: "pointer" } }}
                                boxSize="6"
                                as={BiReset}
                                onClick={resetBtnHandler}
                                />
                            </Box>
                            <Flex m={2} wrap="wrap">
                                <FormControl w="" m={1}>
                                <FormLabel fontSize="x-small">Category Option</FormLabel>
                                <Select 
                                placeholder="All Categories"
                                onChange={filterBtnHandler}
                                >
                                    {category.slice(0, next).map((val, i) => (
                                                    <option
                                                        value={val.id || val.category_name}
                                                        bgColor="white"
                                                        borderBottom="1px solid #dfe1e3"
                                                        justifyContent="flex-start"
                                                        _hover={{
                                                            bgColor: "#dfe1e3",
                                                            borderRadius: "10px",
                                                            color: "#0095DA",
                                                        }}
                                                        key={i}
                                                    >
                                                        {val.category_name}
                                                    </option>  
                                        ))}
                                </Select>
                                </FormControl>
                                <FormControl w="" m={1}>
                                <FormLabel fontSize="x-small">Sort Format</FormLabel>
                                <Select
                                    onChange={sortBtnHandler}
                                >
                                    <option value="product_name ASC">A - Z</option>
                                    <option value="product_name DESC">Z - A</option>
                                    <option value="price DESC">Highest</option>
                                    <option value="price ASC">Lowest</option>
                                </Select>
                                </FormControl>
                                {/* <FormControl w="" m={1}>
                                <FormLabel fontSize="x-small">Search </FormLabel>
                                <InputGroup>
                                    <Input
                                    placeholder="Find Your Favourite Stuff"
                                    _placeholder={{
                                        color: useColorModeValue("bluelight", "white"),
                                        opacity: 0.5,
                                    }}
                                    id="search"
                                    type="text"
                                    
                                    onChange={(e) => setSearchProduct(e.target.value)}
                                    onKeyDown={handleKeyEnter}
                                    />
                                    <InputRightElement>
                                    <Icon
                                        fontSize="xl"
                                        as={BiSearchAlt}
                                        sx={{ _hover: { cursor: "pointer" } }}
                                        onClick={() => searchBtnHandler()}
                                    />
                                    </InputRightElement>
                                </InputGroup>
                                </FormControl> */}
                            </Flex>
                            <Box  p='5px' mt='-20px' ml="10px" display="grid" h="auto" w="160px">
                            {next < category.length ? (
                                    <Button
                                        onClick={() => seeMoreBtnHandler()}
                                        mt="6"
                                        colorScheme="linkedin"
                                        variant="link"
                                        justifyContent="flex-start"
                                        >
                                            <Text
                                                fontSize="12px"
                                                w="110px"
                                                textAlign="start"
                                                >
                                                See More
                                            </Text>
                                    </Button>
                                            ) : (
                                    <Button
                                        onClick={() => seeLessBtnHandler()}
                                         mt="6"
                                        colorScheme="linkedin"
                                        variant="link"
                                        justifyContent="flex-start"
                                                >
                                            <Text
                                                fontSize="12px"
                                                w="110px"
                                                textAlign="start"
                                                >
                                            See Less
                                            </Text>
                                    </Button>
                                    )}
                            </Box>
                            </Box>
                        </Box>
                        </Flex>
                    </Center>
                    

                    {/* Product */}
                    <Box borderRadius="12px" w="912px" display="grid"  >
                        {isLoading === false ? (
                            <Box
                                display={"grid"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                alignContent={"center"}
                            >
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.500'
                                    size='xl'
                                />
                            </Box>
                        ) : !products.length ? (
                            <Alert status="warning">
                                <AlertIcon />
                                <AlertTitle textAlign="center">
                                There were No Products Found.
                                </AlertTitle>
                            </Alert>
                        ) : null}
                        <GridItem>
                            <Grid
                                p="16px 0"
                                pl="16px"
                                gap="4"
                                templateColumns="repeat(5,1fr)"
                            >
                                {isLoading && renderProduct()}
                            </Grid>
                            <HStack justifyContent="end" gap="2px">
                                {page === 1 ? null : (
                                    <CgChevronLeft
                                        bgColor="#0095DA"
                                        onClick={prevPageBtnHandler}
                                        color="#0095DA"
                                        cursor="pointer"
                                        size={30}
                                    />
                                )}
                                <Text>{page}</Text>
                                {page >= maxPage ? null : (
                                    <CgChevronRight
                                        bgColor="#0095DA"
                                        color="#0095DA"
                                        onClick={nextPageBtnHandler}
                                        cursor="pointer"
                                        size={30}
                                    />
                                )}
                            </HStack>
                        </GridItem>
                    </Box>
                </Box>
            </Box>
            

            {/* Responsive */}
            <Box
                mx="auto"
                mt="52px"
                display={{ base: "block", md: "block", lg: "none" }}
                maxW="500px"
            >
                {/* Filter and Search */}
                <Box position="fixed" bgColor="white" w="100%" mt={'20px'}>
                    <Box
                        marginBlockEnd="16px"
                        marginBlockStart="18px"
                        display="grid"
                        alignItems="center"
                        gridTemplateColumns="repeat(3,1fr)"
                        gap="4px"
                        maxW="500px"
                        p="16px"
                        
                    >
                        {/* Filter */}
                        <GridItem justifySelf="end" ml="30px">
                            <Select
                                placeholder="Filter"
                                onChange={filterBtnHandler}
                            >
                                {category.map((val) => (
                                    <option
                                        value={val.id}
                                        bgColor="white"
                                        borderBottom="1px solid #dfe1e3"
                                        justifyContent="flex-start"
                                        _hover={{
                                            bgColor: "#dfe1e3",
                                            borderRadius: "10px",
                                            color: "#0095DA",
                                        }}
                                    >
                                        {val.category_name}
                                    </option>
                                ))}
                            </Select>
                        </GridItem>

                        {/* Sort */}
                        <GridItem justifySelf="end" ml="30px" >
                            <Select
                                onChange={sortBtnHandler}
                                placeholder="Sort"
                            >
                                <option value="product_name ASC">A - Z</option>
                                <option value="product_name DESC">Z - A</option>
                                <option value="price DESC">Highest</option>
                                <option value="price ASC">Lowest</option>
                            </Select>
                        </GridItem>

                        {/* Reset */}
                        <GridItem justifySelf="end">
                                <Icon
                                    sx={{ _hover: { cursor: "pointer" } }}
                                    boxSize="6"
                                    color="#0095DA"
                                    as={BiReset}
                                    onClick={resetBtnHandler}
                                    />
                        </GridItem>
                    </Box>
                </Box>

                {/* Content */}
                <Box mx="auto" w="500px">
                    <Center>
                        {/* Product */}
                        <Box borderRadius="12px" mt="110px" w="500px">
                            {isLoading === false ? (
                                <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                    alignContent={"center"}
                                >
                                    <Spinner
                                        thickness='4px'
                                        speed='0.65s'
                                        emptyColor='gray.200'
                                        color='blue.500'
                                        size='xl'
                                    />
                                </Box>
                            ) : !products.length ? (
                                <Alert status="warning">
                                    <AlertIcon />
                                    <AlertTitle textAlign="center">
                                        No Products Found
                                    </AlertTitle>
                                </Alert>
                            ) : null}

                            <Grid
                                p="16px 0"
                                pl="16px"
                                gap="4"
                                templateColumns="repeat(2,1fr)"
                                justifyItems="center"
                                w="500px"
                            >
                                {isLoading && renderProduct()}
                            </Grid>
                        </Box>
                    </Center>
                </Box>

                {/* Page */}

                <Box gap="2px" mb="10px" w="500px">
                    <Center>
                        {page === 1 ? null : (
                            <CgChevronLeft
                                bgColor="#0095DA"
                                onClick={prevPageBtnHandler}
                                color="#0095DA"
                                cursor="pointer"
                                size={30}
                            />
                        )}
                        <Text>{page}</Text>
                        {page >= maxPage ? null : (
                            <CgChevronRight
                                bgColor="#0095DA"
                                color="#0095DA"
                                onClick={nextPageBtnHandler}
                                cursor="pointer"
                                size={30}
                            />
                        )}
                    </Center>
                </Box>
            </Box>
        </>

        
    )
}

export default Product




