import { Box } from '@chakra-ui/react';
import Carousel from '../components/carousel';
import HomeCategory from '../components/category/homecategory';
import HomeProduct from '../components/product/HomeProduct';

const HomePage = () => {
  return (
    <Box>
      <Box width={{ lg: '1408px', base: '490px' }} marginX={'auto'}>
        <Box
          paddingBottom="24px"
          paddingTop={'60px'}
          h="auto"
          minHeight={'240px'}
        >
          <Carousel />
          <HomeCategory />
        </Box>
      </Box>

      {/* Product Card */}
      <HomeProduct />
    </Box>
  );
};

export default HomePage;
