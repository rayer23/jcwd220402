import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Text,
    useDisclosure,
  } from "@chakra-ui/react";
  import { useEffect } from "react";
  import { useSelector } from "react-redux";
  import { Link, useLocation } from "react-router-dom";
  
  const ProtectedRoute = ({ children }) => {
    const authSelector = useSelector((state) => state.auth);
  
    const location = useLocation();
  
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const backToLogin = () => {
      onClose();
    };
  
    const openAlert = () => {
      onOpen();
    };
  
    useEffect(() => {
      if (!authSelector.id) {
        openAlert();
      }
    }, []);
  
    if (authSelector.id) {
      return (children);
    } else if (!authSelector.id){
      return (
        <>
          <AlertDialog
            isCentered
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={backToLogin}
            size={"sm"}
            closeOnEsc={false}
          >
            <AlertDialogOverlay
            >
              <AlertDialogContent borderRadius={"25px"} mt={"-120px"} border={"1px solid #0058a3"}>
                <AlertDialogHeader
                  fontSize="lg"
                  fontWeight="bold"
                  color={"#0058a3"}
                  pt={"20px"}
                >
                  Caution!
                </AlertDialogHeader>
  
                <AlertDialogBody>
                  <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    boxSizing={"border-box"}
                  >
                    <Text
                      pb={"15px"}
                      fontFamily={
                        "Open Sauce One, Nunito Sans, -apple-system, sans-serif"
                      }
                      fontWeight={550}
                    >
                      You should login first before doing any sort of transactions
                    </Text>
                    <Link to={"/login"} replace state={{ from: location }}>
                      <Button
                        borderRadius={"20px"}
                        mt={"10px"}
                        width={"190px"}
                        bgColor="#0058a3"
                        color="white"
                        onClick={backToLogin}
                      >
                        Alright!
                      </Button>
                    </Link>
                  </Box>
                </AlertDialogBody>
  
                <AlertDialogFooter pb={"7px"}></AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </>
      );
    }
  };
  
  export default ProtectedRoute;