import { Box, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CartItem = ({
  product_name,
  quantity,
  product_weight,
  price,
  image_urls,
}) => {
  return (
    <Link to={'/cart'}>
      <Box h={'1px'} bgColor={'#0095DA'} mt={'-2px'} />
      <Box
        display={'flex'}
        flexDirection={'row'}
        mt={'15px'}
        pl={'10px'}
        pr={'10px'}
        pb={'13px'}
      >
        <Image src={image_urls} h={'35px'} w={'35px'} />
        <Box pl={'10px'}>
          <Text
            fontWeight={600}
            fontSize={'14px'}
            whiteSpace={'nowrap'}
            overflow={'hidden'}
            textOverflow={'ellipsis'}
            width={'200px'}
            fontColor={'#31353BF5'}
            _hover={{
              color: 'blue',
            }}
          >
            {product_name}
          </Text>
          <Text
            fontWeight={400}
            fontSize={'12px'}
            width={'180px'}
            fontColor={'#31353BF5'}
          >
            {quantity} {quantity > 1 ? 'items' : 'item'} ({product_weight}gr)
          </Text>
        </Box>
      </Box>
      <Box>
        <Text
          pl={'3px'}
          fontWeight={700}
          fontSize={'15px'}
          mt={'-42px'}
          textAlign={'right'}
          pb={'20px'}
          mr={'8px'}
        >
          {
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
            })
              .format(price)
              .split(',')[0]
          }
        </Text>
      </Box>
    </Link>
  );
};

export default CartItem;
