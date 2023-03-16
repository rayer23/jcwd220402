import {
  Box,
  Container,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Flex,
  Tag,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2} color={'#0095DA'}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Box
      //    border={'1px solid black'}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container as={Stack} maxW={'6xl'} py={10} mt={'70px'}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 6, lg: 6, xl: 6 }}
          spacing={8}
        >
          <Stack align={['center', 'center', 'flex-start', 'flex-start']}>
            <ListHeader>Warehouse</ListHeader>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              About Delisha
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Career
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Partner
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Help and Guide
            </Link>
          </Stack>
          <Stack align={['center', 'center', 'flex-start', 'flex-start']}>
            <ListHeader>Support</ListHeader>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Support
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Knowledge base
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Developer API
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Server Status
            </Link>
          </Stack>
          <Stack align={['center', 'center', 'flex-start', 'flex-start']}>
            <ListHeader>Follow us</ListHeader>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Instagram
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Facebook
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Twitter
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Discord
            </Link>
          </Stack>
          <Stack align={['center', 'center', 'flex-start', 'flex-start']}>
            <ListHeader>Powered by</ListHeader>
            <Link
              href={'https://reactjs.org/'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              React.js
            </Link>
            <Link
              href={'https://chakra-ui.com/'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Chakra-UI
            </Link>
            <Link
              href={'https://nodejs.org/en/'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Node.js
            </Link>
            <Link
              href={'https://www.mysql.com/'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Mysql
            </Link>
          </Stack>

          <Stack align={['center', 'center', 'flex-start', 'flex-start']}>
            <ListHeader>Kelompok 2</ListHeader>
            <Link
              href={'https://github.com/rayer23'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Fadel Farhan
            </Link>
            <Link
              href={'https://github.com/michaeltanto'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Listanto
            </Link>
            <Link
              href={'https://github.com/VrabeEureka'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Nugraha Triputra
            </Link>
          </Stack>
          <Stack align={['center', 'center', 'flex-start', 'flex-start']}>
            <ListHeader>Legal</ListHeader>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Terms
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Privacy{' '}
            </Link>
            <Link
              href={'#'}
              color="rgb(125,125,128)"
              _hover={{ color: '#0095DA' }}
            >
              Security
            </Link>
          </Stack>
        </SimpleGrid>
      </Container>
      <Box py={10}>
        <Flex
          align={'center'}
          _before={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            mr: 8,
          }}
          _after={{
            content: '""',
            borderBottom: '1px solid',
            borderColor: useColorModeValue('gray.200', 'gray.700'),
            flexGrow: 1,
            ml: 8,
          }}
        ></Flex>
        <Text pt={6} fontSize={'sm'} textAlign={'center'}>
          Copyright © 2022 Delisha
        </Text>
        <Text pt={6} fontSize={'sm'} textAlign={'center'}>
          Made with 💖
        </Text>
      </Box>
    </Box>
  );
}
