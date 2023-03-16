import {
    Box,
    Button,
    Text,
    HStack,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react"
  import { BiArrowBack, BiUser } from "react-icons/bi"
  import { Link, useNavigate } from "react-router-dom"
  import { useSelector } from "react-redux"
  import AddressCard from "../../components/profile/AddressCard"
  import { axiosInstance } from "../../api/index"
  import React, { useState } from "react"
  import { useEffect } from "react"
  import { useFormik } from "formik"
  import * as Yup from "yup"
  import FormAddress from "../../components/profile/FormAddress"
  import Alert from "../../components/alert"
  import EditForm from "../../components/profile/EditForm"
  
  const AddressList = () => {
    const authSelector = useSelector((state) => state.auth)
  const [selectedNewProvince, setSelectedNewProvince] = useState(0)
  const [selectedNewCity, setSelectedNewCity] = useState(0)
  const [selectedEditProvince, setSelectedEditProvince] = useState(0)
  const [selectedEditCity, setSelectedEditCity] = useState(0)
  console.log(selectedEditCity)
  console.log(selectedEditProvince)
  const [openedEdit, setOpenedEdit] = useState(null)
  console.log(openedEdit?.id)
  const [address, setAddress] = useState([])
  const [deleteAlert, setDeleteAlert] = useState(null)
  const [defaultAlert, setDefaultAlert] = useState(null)
  const [currentSearch, setCurrentSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const {
    onOpen: onOpenAlert,
    isOpen: isOpenAlert,
    onClose: onCloseAlert,
  } = useDisclosure()

  const {
    isOpen: isOpenAddNewAddress,
    onOpen: onOpenAddNewAddress,
    onClose: onCloseAddNewAddress,
  } = useDisclosure()

  const doubleOnClick1 = () => {
    editFormik.handleSubmit()
    setSelectedEditProvince(0)
    setSelectedEditCity(0)
    onCloseAlert()
    setIsLoading(false)
  }

  const doubleOnClick2 = () => {
    setDeleteAlert(null)
    deleteHandler(deleteAlert.id)
    setIsLoading(false)
  }

  const doubleOnClick3 = () => {
    setDefaultAlert(null)
    setAsDefault(defaultAlert.id)
    setIsLoading(false)
  }

  const { onOpen, isOpen, onClose } = useDisclosure()

  const toast = useToast()

  const doubleOnClick = () => {
    formikAddNewAddress.handleSubmit()
    setIsLoading(false)
  }

  const cancelRef = React.useRef()

  const fetchAddress = async () => {
    try {
      const response = await axiosInstance.get("/address/userAddress", {
        params: {
          recipients_name: currentSearch,
          full_address: currentSearch,
        },
      })

      setAddress(response.data.data)
      setIsLoading(true)
    } catch (error) {
      console.log(error)
    }
  }

  const formikAddNewAddress = useFormik({
    initialValues: {
      recipients_name: "",
      phone_number: "",
      address_labels: "",
      province: "",
      city: "",
      districts: "",
      full_address: "",
    },
    onSubmit: async ({
      recipients_name,
      phone_number,
      address_labels,
      districts,
      full_address,
    }) => {
      try {
        const response = await axiosInstance.post("/address/addNewAddress", {
          recipients_name,
          phone_number,
          address_labels,
          province: selectedNewProvince,
          city: selectedNewCity,
          districts,
          full_address,
        })
        toast({
          title: "Success to add new adderess",
          description: response.data.message,
          status: "success",
        })

        formikAddNewAddress.setFieldValue("recipients_name", "")
        formikAddNewAddress.setFieldValue("phone_number", "")
        formikAddNewAddress.setFieldValue("address_labels", "")
        formikAddNewAddress.setFieldValue("province", "")
        formikAddNewAddress.setFieldValue("city", "")
        formikAddNewAddress.setFieldValue("districts", "")
        formikAddNewAddress.setFieldValue("full_address", "")
        fetchAddress()
        onClose()
        onCloseAddNewAddress()
        setSelectedNewProvince(0)
        setSelectedNewCity(0)
      } catch (error) {
        console.log(error)
        toast({
          title: "Failed to add",
          description: error.response.data.message,
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      recipients_name: Yup.string().required().min(3),
      phone_number: Yup.string()
        .required()
        .matches(/^\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/, "Must be valid number")
        .min(9)
        .max(15),
      address_labels: Yup.string().required().min(4),
      districts: Yup.string().required(),
      full_address: Yup.string().required().min(5),
    }),
    validateOnChange: false,
  })

  const formChangeHandler = ({ target }) => {
    const { name, value } = target
    formikAddNewAddress.setFieldValue(name, value)
  }

  const editFormik = useFormik({
    initialValues: {
      recipients_name: "",
      phone_number: "",
      address_labels: "",
      districts: "",
      full_address: "",
    },
    onSubmit: async ({
      recipients_name,
      phone_number,
      address_labels,
      districts,
      full_address,
    }) => {
      try {
        const response = await axiosInstance.patch(
          `/address/updateAddress/${openedEdit.id}`,
          {
            recipients_name,
            phone_number,
            address_labels,
            province: selectedEditProvince,
            city: selectedEditCity,
            districts,
            full_address,
          }
        )
        toast({
          title: "Address Edited",
          description: response.data.message,
          status: "success",
        })

        editFormik.setFieldValue("recipients_name", "")
        editFormik.setFieldValue("phone_number", "")
        editFormik.setFieldValue("address_labels", "")
        editFormik.setFieldValue("full_address", "")
        editFormik.setFieldValue("districts", "")
        setOpenedEdit(null)
      } catch (error) {
        console.log(error)
        toast({
          title: "Failed Edit Address",
          status: "error",
        })
      }
    },
    validationSchema: Yup.object({
      recipients_name: Yup.string().min(3),
      phone_number: Yup.string()
        .matches(/^\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/, "Must be valid number")
        .min(9)
        .max(15),
      address_labels: Yup.string().min(4),
      districts: Yup.string(),
      full_address: Yup.string().min(7),
    }),
    validateOnChange: false,
  })

  const editFormChangeHandler = ({ target }) => {
    const { name, value } = target
    editFormik.setFieldValue(name, value)
  }

  const deleteHandler = async (id) => {
    try {
      const response = await axiosInstance.delete(
        `/address/deleteAddress/${id}`
      )
      toast({
        message: "address deleted",
        description: response.data.message,
        status: "success",
      })
      fetchAddress()
    } catch (error) {
      console.log(error.response)
      toast({
        message: "Failed to delete",
        description: error.response.data.message,
        status: "error",
      })
    }
  }

  const setAsDefault = async (id) => {
    try {
      const response = await axiosInstance.patch(`/address/setDefault/${id}`)

      toast({
        message: "Address set as default",
        description: response.data.message,
        status: "success",
      })
      fetchAddress()
    } catch (error) {
      console.log(error.response)
      toast({
        message: "Fail to set default",
        description: error.response.data.message,
        status: "error",
      })
    }
  }

  const formikSearch = useFormik({
    initialValues: {
      search: "",
    },
    onSubmit: ({ search }) => {
      setCurrentSearch(search)
      setIsLoading(false)
    },
  })

  const searchHandler = ({ target }) => {
    const { name, value } = target
    formikSearch.setFieldValue(name, value)
  }

  useEffect(() => {
    fetchAddress()
  }, [openedEdit, currentSearch])

  useEffect(() => {
    if (openedEdit) {
      editFormik.setFieldValue("address_labels", openedEdit.address_labels)
      editFormik.setFieldValue("full_address", openedEdit.full_address)
      editFormik.setFieldValue("recipients_name", openedEdit.recipients_name)
      editFormik.setFieldValue("phone_number", openedEdit.phone_number)
      editFormik.setFieldValue("districts", openedEdit.districts)
    }
  }, [openedEdit])
  
    return (
      <>
        <Box
          mt="120px"
          fontSize={"16px"}
          color="rgba(0,0,0,.54)"
          >
          <Box w="1208px" marginX={"auto"}>
            <Box display={"flex"} mt="80px" mb="16px">
              <Box mr="8px" my={"auto"}>
                <BiUser fontSize={"20px"} />
              </Box>
              <Text fontSize={"16px"} fontWeight="bold" my={"auto"}>
                {authSelector.username}
              </Text>
            </Box>
            <Box  borderRadius="10px">
              <HStack>
                {/* Personal Info */}
                <Box display={"flex"} height="53px" fontWeight={"bold"}>
                  <Link to="/user/profile">
                    <Box p="16px 24px" _hover={{ color: "#32769C" }}>
                      <Text>Personal Data</Text>
                    </Box>
                  </Link>
                </Box>
  
                {/* Change Password */}
                <Box display={"flex"} height="53px" fontWeight={"bold"}>
                  <Link to="/user/profile/change-password">
                    <Box p="16px 24px" _hover={{ color: "#32769C" }}>
                      <Text>Change Password</Text>
                    </Box>
                  </Link>
                </Box>
  
                {/* Address List */}
                <Box display={"flex"} height="53px" fontWeight={"bold"}>
                  <Button
                    p="16px 24px"
                    color="#32769C"
                    // borderBottom={"2px solid #32769C"}
                    borderRadius="1px"
                    variant="link"
                  >
                    <Text>Address List</Text>
                  </Button>
                </Box>
              </HStack>
              <Box 
                    w={"1208px"}
                    h="auto"
                    border="1px solid #dfe1e3"
                    borderRadius={'20px'}
                    >
              <Box  p="24px 32px">
                <Box display={"flex"} justifyContent="space-between">
                  <Box>
                  <Button
                    m="0 4px"
                    _hover={false}
                    color="white"
                    bgColor={"#0058a3"}
                    onClick={onOpenAddNewAddress}
                    borderRadius={"10px"}
                  >
                    Add New Addresses
                  </Button>
                  </Box>
                </Box>
                {isLoading &&
                  address.map((val) => {
                    return (
                      <AddressCard
                        key={val.id.toString()}
                        address_labels={val.address_labels}
                        recipients_name={val.recipients_name}
                        full_address={val.full_address}
                        phone_number={val.phone_number}
                        id={val.id}
                        on_delete={() => setDeleteAlert(val)}
                        on_edit={() => setOpenedEdit(val)}
                        on_default={() => setDefaultAlert(val)}
                        is_default={val.is_default}
                        isLoading={isLoading}
                      />
                    )
                  })}
              </Box>
            </Box>
          </Box>
          </Box>
  
          {/* add new address modal */}
          <FormAddress
            isOpen={isOpenAddNewAddress}
            onClose={onCloseAddNewAddress}
            onOpen={onOpen}
            formChangeHandler={formChangeHandler}
            formik={formikAddNewAddress}
            header={"Add Address"}
            selectProvince={setSelectedNewProvince}
            selectCity={setSelectedNewCity}
          />
  
          {/* Alert Add New Address */}
          <Alert
            header={"Add New Address"}
            body={"Is the address you entered correct?"}
            responsive="Confirm add new address."
            cancelRef={cancelRef}
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => doubleOnClick()}
            rightButton={"Add Address"}
            leftButton={"Change Address"}
            color={"#0058a3"}
          />
  
          {/* modal edit address */}
          <EditForm
            editFormChangeHandler={editFormChangeHandler}
            formik={editFormik}
            isOpenMod={openedEdit}
            onSubmit={onOpenAlert}
            onCloseMod={() => setOpenedEdit(null)}
            selectProvince={setSelectedEditProvince}
            selectCity={setSelectedEditCity}
          />
  
          {/* Alert Edit address */}
          <Alert
            header={"Edit Address"}
            body={"Is the address you entered correct?"}
            responsive="Confirm edit address."
            cancelRef={cancelRef}
            isOpen={isOpenAlert}
            onClose={onCloseAlert}
            onSubmit={() => doubleOnClick1()}
            rightButton={"Edit Address"}
            leftButton={"Change Address"}
            color={"#0058a3"}
          />
  
          {/* Alert set as default*/}
          <Alert
            header={"Set As Primary Address?"}
            body={`Are you sure to make "${defaultAlert?.address_labels}" as your primary address? You can only select one primary address.`}
            responsive="Confirm primary address."
            cancelRef={cancelRef}
            isOpen={defaultAlert}
            onClose={() => setDefaultAlert(null)}
            onSubmit={() => doubleOnClick3()}
            leftButton={"Cancel"}
            rightButton={"Yes, Right"}
            color={"#0058a3"}
          />
  
          {/* Alert Delete */}
          <Alert
            header={"Delete Address"}
            body={`Are you sure you want to delete "${deleteAlert?.address_labels}"? You cannot restore an address that has been deleted.`}
            responsive={"Confirm delete address."}
            cancelRef={cancelRef}
            isOpen={deleteAlert}
            onClose={() => setDeleteAlert(null)}
            onSubmit={() => doubleOnClick2()}
            leftButton={"Cancel"}
            rightButton={"Delete"}
            color={"#0058a3"}
          />
        </Box>
  
      </>
    )
  }
  
  export default AddressList