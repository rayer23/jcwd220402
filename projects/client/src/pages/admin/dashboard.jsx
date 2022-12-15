import { Box, Image, Text } from "@chakra-ui/react";

const AdminDashboard = () => {
  return (
    <>
      <Box marginTop="100px" marginLeft={"275px"} marginRight={"20px"}>
        <Box>
          <Text fontWeight={"bold"} fontSize="30px">
            Content
          </Text>
          <br />
          {/* <Image
              src={Logo}
              alt="Logo"
              textAlign={"center"}
              paddingLeft="35%"
              // justifyContent={"center"}
              // justifyItems="center"
              // justifySelf={"center"}
              // alignItems="center"
              // alignSelf={"center"}
              // alignContent={"center"}
              // textAlign="center"
            /> */}
          <Text textAlign="center">
            Admin dashboard
          </Text>
          <br />
          <br />
          <Text textAlign={"center"}>
            You are the admin. Let's do something!
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;
