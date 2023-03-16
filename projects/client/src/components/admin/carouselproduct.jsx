import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Box, Button, Image, UnorderedList } from '@chakra-ui/react';

import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../api';
import { useParams } from 'react-router-dom';

const CarouselProductSlider = () => {
  const [images, setImages] = useState([]);
  const params = useParams();
  const apiImg = process.env.REACT_APP_IMAGE_URL;

  const fetchProductData = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/product/detail/${params.id}`,
      );

      setImages(response.data.data.Image_Urls);
      // console.log(images)
    } catch (err) {
      console.log(err);
    }
  };

  const renderImages = () => {
    // console.warn(images);
    return images.map((val) => {
      return (
        <Box>
          <Image
            width="300px"
            height="300px"
            src={val.image_url || ""} 
            alt="Product images"
          />
        </Box>
      );
    });
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const settings = {
    dots: true,
    autoplay: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 600,
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
    width: 300,
    height: 300,
    borderRadius: 40,
  };

  const slider = React.useRef(null);
  return (
    <>
      <Box
        mx={'auto'}
        ml={'80px'}
        mt={'10px'}
        style={myStyle}
        cursor={'pointer'}
      >
        <Slider ref={slider} {...settings}>
          {renderImages()}
        </Slider>
        <Button
          mt={'-320px'}
          ml={'-20px'}
          onClick={() => slider?.current?.slickPrev()}
          borderRadius={'50px'}
          color={'#0095DA'}
          bgColor={'E5F9F6'}
          _hover={{
            color: 'white',
            bgColor: '#0095DA',
          }}
        >
          ❮
        </Button>
        <Button
          display={'inline'}
          mt={'-370px'}
          ml={'280px'}
          onClick={() => slider?.current?.slickNext()}
          borderRadius={'50px'}
          color={'#0095DA'}
          bgColor={'E5F9F6'}
          _hover={{
            display: 'inline',
            color: 'white',
            bgColor: '#0095DA',
          }}
        >
          ❯
        </Button>
      </Box>
    </>
  );
};

export default CarouselProductSlider;
