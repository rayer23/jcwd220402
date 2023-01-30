import { Box, Button, Checkbox, HStack, Image, Input, Text, Textarea, useDisclosure } from "@chakra-ui/react"
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useEffect, useState } from "react"
import { axiosInstance } from "../../api"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import AlertDialogDeleteCartItem from "../../components/Cart/AlertDeleteCartItems"



const CartItems = ({ totalStocks, cartNote, isChecked, productName, description, package_weight, price, productImage, quantity, CartId, fetchMyCart, onDelete, allChecked, fetchTotalPrice, productId }) => {

    const [count, setCount] = useState(quantity)
    const [addNote, setAddNote] = useState(false)
    const [inputText, setInputText] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()

    const countPlus = async () => {
        try {
            await axiosInstance.patch(`/carts/increment/${CartId}`)
            fetchMyCart()
            setCount(quantity + 1)

            fetchTotalPrice()
        } catch (err) {
            console.log(err)
        }
    }

    const countMinus = async () => {
        try {
            await axiosInstance.patch(`/carts/decrement/${CartId}`)
            fetchMyCart()
            if (quantity <= 1) {
                return 1
            }
            setCount(quantity - 1)

            fetchTotalPrice()
        } catch (err) {
            console.log(err)
        }
    }

    const cartStock = totalStocks.map((val) => val.stock)

    let productStocks = 0

    for (let i = 0; i < cartStock.length; i++) {
        productStocks += Number(cartStock[i])
    }

    const cartItemsChecked = async () => {
        try {
            await axiosInstance.patch(`/carts/cartChecked/${CartId}`)

            fetchTotalPrice()
        } catch (err) {
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues: {
            note: "",
        },
        onSubmit: async ({ note }) => {
            try {
                await axiosInstance.patch(`/carts/updateCartNote/${CartId}`, {
                    note: note
                })

                setAddNote(false)
            } catch (err) {
                console.log(err)
            }
        }
    })

    const formChangeHandler = ({ target }) => {
        const { name, value } = target

        formik.setFieldValue(name, value)

        setInputText(value)
    }

    const confirmDeleteBtnHandler = () => {
        onClose()
        onDelete()
    }

    const openTextArea = () => {
        setAddNote(true)

        if (cartNote !== null) {
            setInputText(cartNote)
        }
    }

    const navigate = useNavigate()

    const productBtnHandler = () => {
        navigate(`/product/${productId}/${productName}`)
    }

    useEffect(() => {
        if (productStocks === 0) {
            setCount(1)
        }

        fetchMyCart()
    }, [isChecked, allChecked, inputText, addNote, count])

    return (
        <>
            <Box display={{ lg: "inline", base: "none" }}>
                {/* cart Items */}
                <Box height={addNote === true ? '235px' : productStocks === 0 ? '173px' : '143.89px'} width={'630px'} p={'16px 0px'} display={'block'} >
                    <Box
                        height={'71.8px'}
                        width={'630px'}
                        pl={'3px'}
                    >
                        {/* if stock = 0 */}
                        {productStocks === 0 ? (
                            <Text
                                fontSize={'14px'}
                                fontWeight={'600'}
                                lineHeight={'1,4'}
                                cursor={'pointer'}
                                color={'#D6001C'}
                                fontFamily={"Open Sauce One, sans-serif"}
                                p={'0px 0px 0px 40px'}
                                mt={'6px'}
                                mb={'12px'}
                            >
                                Out of stock
                            </Text>
                        ) : null}
                        <HStack >
                            {/* Checkbox */}
                            <Box
                                width={'20px'}
                                height={'20px'}
                                // bgColor={'#0058a3'}
                                p={'0'}
                            >
                                <Checkbox
                                    borderColor={'#0058a3'}
                                    size={'lg'}
                                    isChecked={isChecked}
                                    onChange={() => cartItemsChecked()}
                                    disabled={productStocks === 0 ? true : false}
                                >
                                </Checkbox>
                            </Box>
                            {/* Product Detail */}
                            <Box
                                cursor={'pointer'}
                                pl={'12px'}
                                onClick={productBtnHandler}
                            >
                                <Image
                                    src={productImage}
                                    minWidth={'69px'}
                                    minHeight={'69px'}
                                    maxW={'69px'}
                                    maxH={'69px'}
                                    borderRadius={'6px'}
                                    filter={productStocks === 0 ? 'grayscale(100%)' : null}
                                />
                            </Box>
                            <Box pl={'4px'} height={'71.8px'} onClick={productBtnHandler} cursor={'pointer'}>
                                <Text
                                    fontSize={'17px'}
                                    whiteSpace={'nowrap'}
                                    overflow={'hidden'}
                                    textOverflow={'ellipsis'}
                                    fontWeight={'1000'}
                                    width={'390px'}
                                    color={productStocks === 0 ? "#b5b6b9" : "#111!important"}
                                    fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                >
                                    {productName}
                                </Text>
                                <Text
                                    fontSize={'15px'}
                                    fontWeight={'700'}
                                    lineHeight={'20px'}
                                    letterSpacing={'0px'}
                                    textDecoration={'initial'}
                                    color={productStocks === 0 ? "#b0b1b4" : "#31353BF5"}
                                    mt={'8px'}
                                    fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                >
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                    }).format(price).split(",")[0]}
                                </Text>
                                <Text
                                    fontSize={'13px'}
                                    // fontWeight={'700'}
                                    lineHeight={'20px'}
                                    letterSpacing={'0px'}
                                    textDecoration={'initial'}
                                    color={productStocks === 0 ? "#b0b1b4" : "#484848"}
                                    mt={'5px'}
                                    fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                    >
                                Package weight: {package_weight} kg
                                </Text>
                            </Box>
                            <Box>
                                        <Text
                                            fontSize={'15px'}
                                            fontWeight={'700'}
                                            lineHeight={'20px'}
                                            letterSpacing={'0px'}
                                            textDecoration={'initial'}
                                            color={productStocks === 0 ? "#b0b1b4" : "#31353BF5"}
                                            mb={'15px'}
                                            fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                           >
                                            {new Intl.NumberFormat("id-ID", {
                                                style: "currency",
                                                currency: "IDR",
                                            }).format(price * quantity).split(",")[0]}
                                        </Text>
                            </Box>
                        </HStack>
                        {/* add note */}
                        {addNote !== true ? (
                            <Box
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                                mt={productStocks === 0 ? '8px' : '16px'}
                            >
                                {cartNote.length ? (
                                    <>
                                        <Box
                                            display={"flex"}
                                            alignContent={'flex-start'}
                                            width={'355px'}
                                        >
                                            <Text
                                                fontSize={"12px"}
                                                textOverflow={'ellipsis'}
                                                overflow={'hidden'}
                                                pl={'38px'}
                                                whiteSpace={'nowrap'}
                                                fontFamily={"Open Sauce One, sans-serif"}
                                                pr={"0px"}
                                                mr={'5px'}
                                                display={'inline-block'}
                                                color={'#73767a'}
                                            >
                                                {cartNote}
                                            </Text>
                                            <Text
                                                fontSize={'12px'}
                                                fontWeight={700}
                                                lineHeight={'1,4'}
                                                cursor={'pointer'}
                                                color={'#0058a3'}
                                                fontFamily={"Open Sauce One, sans-serif"}
                                                onClick={openTextArea}
                                            >
                                                Change
                                            </Text>
                                        </Box>
                                    </>
                                ) :
                                    productStocks === 0 ? (
                                        <Text
                                            fontSize={'14px'}
                                            fontWeight={'600'}
                                            lineHeight={'1,4'}
                                            cursor={'pointer'}
                                            color={'#D6001C'}
                                            fontFamily={"Open Sauce One, sans-serif"}
                                            p={'0px 0px 0px 40px'}
                                        >
                                            {""}
                                        </Text>
                                    ) :
                                        (
                                            <Text
                                                fontSize={'12px'}
                                                fontWeight={'600'}
                                                lineHeight={'1,4'}
                                                cursor={'pointer'}
                                                color={'#0058a3'}
                                                fontFamily={"Open Sauce One, sans-serif"}
                                                p={'0px 0px 0px 38px'}
                                                onClick={openTextArea}
                                            >
                                                Add Notes
                                            </Text>
                                        )}
                                        
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'flex-end'}
                                >
                                    {/* Cart Items Delete Button */}
                                    <Box
                                        fontSize={'24px'}
                                        display={'inline-block'}
                                        verticalAlign={'middle'}
                                        cursor={'pointer'}
                                        mr={'52px'}
                                        mt={'-4px'}
                                        pl={'16px'}
                                        color={'#8d96aa'}
                                        borderLeft={'2px solid #bfc9d9'}
                                        onClick={() => onOpen()}
                                    >
                                        <RiDeleteBin6Line
                                        />
                                    </Box>
                                    {/* increment cart quantity */}
                                    <Box
                                        fontSize={'20px'}
                                        fontFamily={'inherit'}
                                        fontWeight={'700'}
                                        lineHeight={'24px'}
                                        cursor={'pointer'}
                                        color={count > 1 ? "#0058a3" : '#c0cada'}
                                        onClick={countMinus}
                                    >
                                        <AiOutlineMinusCircle />
                                    </Box>
                                    <Box p={'0px 12px'} position={'relative'}>
                                        <Text
                                            textAlign={'center'}
                                            width={'31.02px'}
                                            lineHeight={'1.15'}
                                            fontSize={'14px'}
                                            height={'100%'}
                                            fontWeight={'400px'}
                                            fontFamily={'inherit'}

                                            color={productStocks === 0 ? "#b5b6b9" : "#737697"}
                                        >
                                            {count}
                                        </Text>
                                    </Box>
                                    {/* decrement cart quantity */}
                                    <Box
                                        fontSize={'20px'}
                                        fontFamily={'inherit'}
                                        fontWeight={'700'}
                                        lineHeight={'24px'}
                                        cursor={'pointer'}
                                        color={productStocks <= count ? "#c0cada" : "#0058a3"}
                                        onClick={countPlus}
                                    >
                                        <AiOutlinePlusCircle />
                                    </Box>
                                </Box>
                            </Box>
                        ) : (
                            // if add notes open
                            <>
                                <Box
                                    display={'flex'}
                                    alignItems={'center'}
                                    justifyContent={'space-between'}
                                    m={'16px 0px 0px'}
                                >
                                    <form onSubmit={formik.handleSubmit}>
                                        <Text
                                            fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                            fontSize={'12px'}
                                            pl={'55px'}
                                            pb={'-15px'}
                                            color={'#0058a3'}
                                            onClick={() => setAddNote(false)}
                                            cursor={'pointer'}
                                            fontWeight={600}
                                        >
                                            Cancel Notes
                                        </Text>
                                        <Textarea
                                            mt={'-15px'}
                                            m={'0px 0px 0px 38px'}
                                            w={'230px'}
                                            height={'80px'}
                                            cols={'20'}
                                            overflow={"auto"}
                                            rows={'2'}
                                            borderColor={"#0058a3"}
                                            border={'1px'}
                                            _hover={'none'}
                                            fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                            fontSize={'14px'}
                                            Placeholder={"Make sure you don't enter your confidential data"}
                                            onChange={formChangeHandler}
                                            name="note"
                                            defaultValue={cartNote}
                                            maxLength={140}
                                        />
                                        <Button
                                            type="submit"
                                            bgColor={"#0058a3"}
                                            _hover={"none"}
                                            _active={'none'}
                                            size={'sm'}
                                            borderRadius={'20px'}
                                            // borderTopEndRadius={'30px'}
                                            // borderBottomEndRadius={'30px'}
                                            // pl={'0px'}
                                            ml={'10px'}
                                        >
                                            <Text
                                                fontSize={'11px'}
                                                fontWeight={'600'}
                                                lineHeight={'1,4'}
                                                cursor={'pointer'}
                                                color={'#fff'}
                                                fontFamily={"Open Sauce One, sans-serif"}
                                                // pl={'5px'}
                                                onClick={openTextArea}
                                                borderRadius={'10px'}
                                            >
                                                Change
                                            </Text>
                                        </Button>
                                        <Button
                                            color={'red'}
                                            bgColor={"#fff"}
                                            flexDirection={'block'}
                                            onClick={() => setAddNote(false)}
                                            _active={'none'}
                                            _hover={'none'}
                                            borderColor={'black'}
                                        >
                                        </Button>
                                    </form>

                                    <Box
                                        display={'flex'}
                                        alignItems={'center'}
                                        justifyContent={'flex-end'}
                                        mt={'20px'}
                                    >
                                        {/* delete cart */}
                                        <Box
                                            fontSize={'24px'}
                                            display={'inline-block'}
                                            verticalAlign={'middle'}
                                            cursor={'pointer'}
                                            mr={'52px'}
                                            mt={'-4px'}
                                            pl={'16px'}
                                            color={'#8d96aa'}
                                            borderLeft={'2px solid #bfc9d9'}
                                            onClick={() => onOpen()}
                                        >
                                            <RiDeleteBin6Line
                                            />
                                        </Box>

                                        {/* set cart quantity */}
                                        <Box
                                            fontSize={'20px'}
                                            fontFamily={'inherit'}
                                            fontWeight={'700'}
                                            lineHeight={'24px'}
                                            cursor={'pointer'}
                                            color={count > 1 ? "#0095DA" : '#c0cada'}
                                            onClick={countMinus}
                                        >
                                            <AiOutlineMinusCircle />
                                        </Box>
                                        <Box p={'0px 12px'} position={'relative'}>
                                            <Text
                                                textAlign={'center'}
                                                width={'31.02px'}
                                                lineHeight={'1.15'}
                                                fontSize={'14px'}
                                                height={'100%'}
                                                fontWeight={'400px'}
                                                fontFamily={'inherit'}
                                                color={'#737697'}
                                            >
                                                {count}
                                            </Text>
                                        </Box>
                                        <Box
                                            fontSize={'20px'}
                                            fontFamily={'inherit'}
                                            fontWeight={'700'}
                                            lineHeight={'24px'}
                                            cursor={'pointer'}
                                            color={count > 0 ? "#0095DA" : "#c0cada"}
                                            onClick={countPlus}
                                        >
                                            <AiOutlinePlusCircle />
                                        </Box>
                                    </Box>
                                </Box>
                                <Box
                                    pl={'195px'}
                                    fontFamily={"Open Sauce One,Nunito Sans, sans-serif"}
                                    fontSize={'12px'}
                                    color={"#73767a"}
                                >
                                    <Text>{inputText.length}/140</Text>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>
                <Box width={"650px"} h={'1.5px'} bgColor={"#dfe1e3"} />
            </Box>
            {/* Delete Cart Items Dialog*/}
            <AlertDialogDeleteCartItem
                isOpen={isOpen}
                onClose={onClose}
                confirmDeleteBtnHandler={confirmDeleteBtnHandler}
            />
        </>
    )
}

export default CartItems