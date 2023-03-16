import {
  Box,
  Text,
  Button,
  GridItem,
  CircularProgress,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../api';
import { MdKeyboardArrowUp } from 'react-icons/md';
import { MdKeyboardArrowDown } from 'react-icons/md';
import moment from 'moment';

const Shipping = ({
  closestWarehouseTransaction,
  shippingFeePay,
  selectedCourir,
  productWeight,
  shippingError,
  setShippingError,
}) => {
  const [userData, setUserData] = useState({});
  const [warehouseData, setWarehouseData] = useState({});
  const [courirDuration, setCourirDuration] = useState('');
  const [results, setResults] = useState({});
  const [openSelect, setOpenSelect] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingCourir, setShippingCourir] = useState('');
  const [shippingDetails, setShippingDetails] = useState(false);
  const [shippingDate, setShippingDate] = useState('');
  const [closestWarehouse, setClosestWarehouse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  shippingFeePay(shippingFee);
  // ShippingFeePayMobile(shippingFee)
  selectedCourir(courirDuration);
  closestWarehouseTransaction(closestWarehouse);

  const fetchUserData = async () => {
    try {
      const fetchUser = await axiosInstance.get('/shipment/userAddress');
      setUserData(fetchUser.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWarehouseData = async () => {
    try {
      const fetchWarehouse = await axiosInstance.get(
        '/shipment/warehouseAddress',
      );
      setWarehouseData(fetchWarehouse.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchFormik = useFormik({
    initialValues: {
      destination: '',
      origin: '',
      weight: '',
      courier: '',
    },
    onSubmit: async () => {
      try {
        const costForm = {
          origin: closestCity[0].warehouse.cityId,
          destination: userData.cityId,
          weight: productWeight,
          courier: 'tiki',
        };

        const response = await axiosInstance.post('/shipment/query', costForm);
        setClosestWarehouse(closestCity[0].warehouse.id);
        setResults(response);
        setIsLoading(true);
      } catch (error) {
        console.log('Server error creating cost query');
      }
    },
  });

  const shipmentButton = () => {
    setOpenSelect(false);
    setShippingDetails(true);
  };
  const mapCosts = () => {
    return results?.data?.results[0]?.costs.map((val) => {
      return (
        <Box
          value={val.cost[0].value}
          cursor={'pointer'}
          _hover={{ bgColor: '#dfe1e3' }}
          onClick={() => setShippingFee(val.cost[0].value)}
        >
          <Box onClick={shipmentButton} h={'56px'}>
            <Box
              h={'56px'}
              onClick={() =>
                setShippingDate(
                  Number(val.cost[0].etd) === 1
                    ? 'tomorrow'
                    : moment()
                        .add('days', Number(val.cost[0].etd))
                        .format('D MMM'),
                )
              }
            >
              <Box
                h={'56px'}
                onClick={() =>
                  setCourirDuration(
                    `${val.service} at ${
                      Number(val.cost[0].etd) === 1
                        ? 'tomorrow'
                        : moment()
                            .add('days', Number(val.cost[0].etd))
                            .format('DD MMM YYYY')
                    }`,
                  )
                }
              >
                <Box
                  h={'56px'}
                  p={'12px 15px'}
                  alignItems={'center'}
                  onClick={() => setShippingCourir(val.service)}
                >
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    fontSize={'12px'}
                  >
                    <Text
                      fontWeight={700}
                      lineHeight={'18px'}
                      letterSpacing={'0px'}
                      m={'0px 8px 0px 0px'}
                      color={'#31353B'}
                    >
                      {val.service}
                    </Text>
                    <Text
                      color={'#31353BAD'}
                      fontWeight={400}
                      lineHeight={'18px'}
                      letterSpacing={'0px'}
                      m={'0px'}
                    >
                      {val.cost[0].value.toLocaleString('in-ID', {
                        style: 'currency',
                        currency: 'IDR',
                      })}
                    </Text>
                  </Box>
                  <Box
                    fontSize={'12px'}
                    color={'#31353BAD'}
                    fontWeight={400}
                    lineHeight={'18px'}
                    letterSpacing={'0px'}
                    m={'0px'}
                  >
                    <Text>
                      Estimated arrival{' '}
                      {Number(val.cost[0].etd) === 1
                        ? 'tomorrow'
                        : moment()
                            .add('days', Number(val.cost[0].etd))
                            .format('D MMM')}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            borderBottom={'1px solid #e9ebed'}
            h={'1px'}
            mt={'-2px'}
            w={'283.5px'}
            ml={'10px'}
          />
        </Box>
      );
    });
  };

  function distanceBetweenTwoPlace(
    firstLat,
    firstLon,
    secondLat,
    secondLon,
    unit,
  ) {
    var firstRadlat = (Math.PI * firstLat) / 180;
    var secondRadlat = (Math.PI * secondLat) / 180;
    var theta = firstLon - secondLon;
    var radtheta = (Math.PI * theta) / 180;
    var distance =
      Math.sin(firstRadlat) * Math.sin(secondRadlat) +
      Math.cos(firstRadlat) * Math.cos(secondRadlat) * Math.cos(radtheta);
    if (distance > 1) {
      distance = 1;
    }
    distance = Math.acos(distance);
    distance = (distance * 180) / Math.PI;
    distance = distance * 60 * 1.1515;
    if (unit == 'K') {
      distance = distance * 1.609344;
    }
    if (unit == 'N') {
      distance = distance * 0.8684;
    }
    return distance;
  }

  const chooseOne = [];
  const tempDist = [];
  for (var i = 0; i < warehouseData.length; i++) {
    const tempNum = distanceBetweenTwoPlace(
      userData.latitude,
      userData.longitude,
      warehouseData[i].latitude,
      warehouseData[i].longitude,
      'K',
    );
    tempDist.push(tempNum);
    chooseOne.push({
      warehouse: warehouseData[i],
      distance: tempNum,
    });
  }
  const minDist = Math.min(...tempDist);
  const closestCity = chooseOne.filter((x) => x.distance == minDist);

  const openSelectButton = () => {
    searchFormik.handleSubmit();

    if (openSelect === true) {
      setOpenSelect(false);
      setShippingDetails(true);
    } else if (openSelect === false) {
      setOpenSelect(true);
      setShippingError(false);
      setShippingDetails(false);
    }
  };

  useEffect(() => {
    fetchWarehouseData();
    fetchUserData();
  }, [openSelect]);

  return (
    <>
      <GridItem w={'355.99px'} mt={'10px'}>
        <Button
          border={'1px solid #0095DA'}
          mt={10}
          h={'40px'}
          width={'350px'}
          lineHeight={'20px'}
          height={'40px'}
          fontWeight={700}
          borderRadius={'8px'}
          fontSize={'13px'}
          bgColor={'#fff'}
          color={'#0095DA'}
          display={'flex'}
          alignItems={'center'}
          onClick={openSelectButton}
          justifyContent={'flex-end'}
          gap={!shippingFee ? '110px' : '125px'}
          _hover={{
            bgColor: '#0095DA',
            color: '#fff',
          }}
          _active={{
            bgColor: '#0095DA',
            color: '#fff',
          }}
        >
          <Text>{!shippingFee ? 'Shipping' : shippingCourir}</Text>
          <Box>
            {openSelect === true ? (
              <MdKeyboardArrowUp
                style={{ fontSize: '25px', marginRight: '-8px' }}
              />
            ) : (
              <MdKeyboardArrowDown
                style={{ fontSize: '25px', marginRight: '-8px' }}
              />
            )}
          </Box>
        </Button>
        {shippingError === true ? (
          <Text
            fontSize={'12px'}
            lineHeight={'1.4'}
            color={'#D6001C'}
            marginTop={'6px'}
          >
            Choose shipping first*
          </Text>
        ) : null}
        {openSelect === true ? (
          <Box
            w={'350px'}
            h={'168px'}
            border={'1px solid #e6e6e6'}
            borderRadius={'8px'}
          >
            {isLoading && mapCosts()}
            {isLoading === false ? (
              <Box
                w={'350px'}
                h={'168px'}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                alignContent={'center'}
              >
                <CircularProgress
                  isIndeterminate
                  color="#0095DA"
                  thickness="16px"
                  size="60px"
                />
              </Box>
            ) : null}
          </Box>
        ) : null}
        {shippingFee && shippingDetails === true ? (
          <Box
            w={'350px'}
            border={'1px solid #e4e6e9'}
            mt={'10px'}
            p={'10px 10px'}
            borderRadius={'8px'}
          >
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              fontSize={'12px'}
              lineHeight={'1.3'}
              color={'#31353BF5'}
              fontWeight={700}
            >
              <Text>
                {`Tiki ${
                  shippingCourir === 'ECO'
                    ? 'Economy'
                    : shippingCourir === 'REG'
                    ? 'Regular'
                    : 'Overnight'
                }`}
              </Text>
              <Text>
                {
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })
                    .format(shippingFee)
                    .split(',')[0]
                }
              </Text>
            </Box>
            <Text
              color={'#31353BF5'}
              m={'8px 0px 0px'}
              fontSize={'12px'}
              lineHeight={'1.3'}
            >
              Estimated arrival {shippingDate}
            </Text>
          </Box>
        ) : null}
      </GridItem>
    </>
  );
};

export default Shipping;
