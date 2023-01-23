import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Button, Image, UnorderedList } from '@chakra-ui/react';
import Banner from '../assets/newCollection.png';
import Diskon from '../assets/diskon.png';
import Diskon50 from '../assets/diskon50.png';
import React from 'react';

const Carousel = () => {
  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1400,
    swipeToSlide: true,
    lazyLoad: true,
    initialSlide: 0,
    appendDots: (dots) => (
      <Box p={'30px'}>
        <UnorderedList margin={'1px'} color={'white'}>
          {' '}
          {dots}{' '}
        </UnorderedList>
      </Box>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const myStyle = {
    display: true,
    width: 1400,
    height: '400px',
    borderRadius: 40,
  };

  const slider = React.useRef(null);
  return (
    <>
      <Box display={{ lg: 'inline', base: 'none' }}>
        <Box
          mx={'auto'}
          mt={'70px'}
          style={myStyle}
          cursor={'pointer'}
          mb={'20px'}
        >
          <Slider ref={slider} {...settings}>
            <Box>
              <Image
                src={Banner}
                borderRadius={'15px'}
                height={'400px'}
                width={'1400px'}
              />
            </Box>
            <Box>
              <Image
                src={Diskon}
                borderRadius={'15px'}
                height={'400px'}
                width={'1400px'}
              />
            </Box>
            <Box>
              <Image
                src={Diskon50}
                borderRadius={'15px'}
                height={'400px'}
                width={'1400px'}
              />
            </Box>
          </Slider>
          <Box
            display={'flex'}
            width={'1440px'}
            justifyContent={'space-between'}
            ml={'-20px'}
            mt={'-210px'}
          >
            <Button
              onClick={() => slider?.current?.slickPrev()}
              borderRadius={'50px'}
              color={'#0095DA'}
              bgColor={'#E5F9F6'}
              _hover={{
                color: '#fff',
                bgColor: '#0095DA',
              }}
            >
              ❮
            </Button>
            <Button
              display={'inline'}
              onClick={() => slider?.current?.slickNext()}
              borderRadius={'50px'}
              color={'#0095DA'}
              bgColor={'E5F9F6'}
              _hover={{
                color: '#fff',
                bgColor: '#0095DA',
              }}
            >
              ❯
            </Button>
          </Box>
        </Box>
      </Box>

      <Box display={{ lg: 'none', base: 'inline' }}>
        <Box
          mt={'50px'}
          style={{
            display: true,
            width: 490,
            height: '150px',
            borderRadius: 40,
          }}
          cursor={'pointer'}
          mb={'20px'}
          maxW={'500px'}
          ml={'6px'}
        >
          <Slider {...settings}>
            <Box>
              <Image
                src={Banner}
                borderRadius={'15px'}
                height={'150px'}
                width={'480px'}
              />
            </Box>
            <Box>
              <Image
                src={Diskon}
                borderRadius={'15px'}
                height={'150px'}
                width={'480px'}
              />
            </Box>
            <Box>
              <Image
                src={Diskon50}
                borderRadius={'15px'}
                height={'150px'}
                width={'480px'}
              />
            </Box>
          </Slider>
        </Box>
      </Box>
    </>
  );
};

export default Carousel;