import { Box, Image, Text } from "@chakra-ui/react";
import Gambar from "../../assets/admin.svg";

const Dashboard = () => {
  return (
    <>
      <Box marginTop="90px" marginLeft={"90px"} marginRight={"20px"}>
        <Box>
          <Text fontWeight={"bold"} fontSize={"2xl"}>
            Admin Dashboard
          </Text>
          <br />
          <Image
            src={Gambar}
            alt={"Admin Dashboard"}
            w="500px"
            mx={"auto"}
            mb="14px"
          />
          <Text textAlign={"center"} fontWeight={"bold"}>
            You are the admin.
          </Text>
          <Text textAlign={"center"}>
            Delisha is an e-commerce application that implements more than one
            warehouse in storing goods.
          </Text>
          <Text textAlign={"center"}>
            The application of this aims to increase the speed of delivery and
            also reduce shipping costs.
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
