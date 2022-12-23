import { Box, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import error from '../assets/error.svg';

const NotFound = () => {
  return (
    <Box mt="66px">
      <Box mx="auto">
        <Image src={error} w="600px" mx={'auto'} mb="14px" />

        <Text textAlign={'center'}>
          Sorry, the page you're looking for doesn't exist.{' '}
          <Link to={'/'}>
            <Text
              color={'#0095DA'}
              display="inline"
              textDecoration={'underline'}
            >
              Return to home
            </Text>
          </Link>
        </Text>
      </Box>
    </Box>
  );
};

export default NotFound;
