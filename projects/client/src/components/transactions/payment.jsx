import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Text,
} from '@chakra-ui/react';
import { AiOutlineSafety } from 'react-icons/ai';
import { IoCloseSharp } from 'react-icons/io5';

const Payment = ({
  BCARadio,
  BNIRadio,
  MandiriRadio,
  createNewTransaction,
  paymentIsOpen,
  paymentOnclose,
  BCA,
  BCAChecked,
  BNI,
  BNIChecked,
  mandiri,
  MandiriChecked,
  totalBill,
  totalPrice,
}) => {
  return (
    <Modal
      isOpen={paymentIsOpen}
      onClose={paymentOnclose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent width={'434.55px'} borderRadius={'10px'} mt={110}>
        <ModalBody w={'434.55px'}>
          <Button
            bgColor={'#fff'}
            _hover={'none'}
            color={'#0095DA'}
            ml={-6}
            onClick={() => paymentOnclose()}
          >
            <IoCloseSharp fontSize={'25px'} />{' '}
          </Button>
          <Box
            ml={'-24px'}
            w={'434.55px'}
            h={'7px'}
            bgColor={'rgb(243, 244, 245)'}
          />
          <Box h={'129.96px'} p={'8px 0px'}>
            <Text
              pt={'16px'}
              pb={'16px'}
              fontWeight={800}
              fontSize={'16px'}
              lineHeight={'22px'}
              m={'0px'}
              color={'#31353BF5'}
            >
              Payment Summary
            </Text>
            <Box
              display={'flex'}
              flexDir={'row'}
              justifyContent={'space-between'}
              mb={'8px'}
              fontSize={'14px'}
              lineHeight={'18px'}
              whiteSpace={'nowrap'}
              overflow={'hidden'}
              textOverflow={'ellipsis'}
              color={'#31353BAD'}
            >
              <Text>Total Cost</Text>
              <Text>
                {
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })
                    .format(totalBill)
                    .split(',')[0]
                }
              </Text>
            </Box>
            <Box
              display={'flex'}
              flexDir={'row'}
              justifyContent={'space-between'}
              fontSize={'14px'}
              lineHeight={'18px'}
              color={'#31353BAD'}
            >
              <Text>Transaction fees</Text>
              <Text>
                {
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })
                    .format(1000)
                    .split(',')[0]
                }
              </Text>
            </Box>
          </Box>
          <Box
            ml={'-24px'}
            w={'434.55px'}
            h={'7px'}
            bgColor={'rgb(243, 244, 245)'}
          />
          <Box
            display={'flex'}
            h={'210.92px'}
            pt={'8px 0px'}
            flexDir={'column'}
          >
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              pb={'8px'}
              pt={'16px'}
              h={'45.98px'}
            >
              <Text
                fontSize={'16px'}
                fontWeight={800}
                lineHeight={'22px'}
                color={'#31353BF5'}
              >
                Payment Methods
              </Text>
            </Box>
            <RadioGroup>
              <Box
                display={'flex'}
                pt={'12px'}
                h={'51.99px'}
                alignItems={'center'}
                borderBottom={'1px solid rgb(229, 231, 233)'}
                onClick={BCARadio}
                cursor={'pointer'}
              >
                <Image
                  p={'0px 12px 14px 0px'}
                  w={'45px'}
                  h={'26px'}
                  src={BCA}
                />
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  flex={'1 1 0%'}
                  minH={'52px'}
                  pr={'16px'}
                  pb={'12px'}
                  flexDir={'row'}
                >
                  <Text
                    fontSize={'14px'}
                    fontWeight={700}
                    lineHeight={'20px'}
                    color={'#31353BF5'}
                  >
                    BCA Virtual Account
                  </Text>
                  <Radio
                    whiteSpace={'nowrap'}
                    paddingLeftp={'8px'}
                    position={'relative'}
                    isChecked={BCAChecked}
                  />
                </Box>
              </Box>

              <Box
                display={'flex'}
                pt={'12px'}
                h={'51.99px'}
                alignItems={'center'}
                borderBottom={'1px solid rgb(229, 231, 233)'}
                onClick={BNIRadio}
                cursor={'pointer'}
              >
                <Image
                  p={'0px 12px 14px 0px'}
                  w={'45px'}
                  h={'27px'}
                  src={BNI}
                />
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  flex={'1 1 0%'}
                  minH={'52px'}
                  pr={'16px'}
                  pb={'12px'}
                  flexDir={'row'}
                >
                  <Text
                    fontSize={'14px'}
                    fontWeight={700}
                    lineHeight={'20px'}
                    color={'#31353BF5'}
                  >
                    BNI Virtual Account
                  </Text>
                  <Radio
                    whiteSpace={'nowrap'}
                    paddingLeftp={'8px'}
                    position={'relative'}
                    isChecked={BNIChecked}
                  />
                </Box>
              </Box>
              <Box
                display={'flex'}
                pt={'12px'}
                h={'51.99px'}
                alignItems={'center'}
                onClick={MandiriRadio}
                cursor={'pointer'}
              >
                <Image
                  p={'0px 12px 16px 0px'}
                  w={'46px'}
                  h={'29px'}
                  src={mandiri}
                />
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  flex={'1 1 0%'}
                  minH={'52px'}
                  pr={'16px'}
                  pb={'12px'}
                  flexDir={'row'}
                >
                  <Text
                    fontSize={'14px'}
                    fontWeight={700}
                    lineHeight={'20px'}
                    color={'#31353BF5'}
                  >
                    Mandiri Virtual Account
                  </Text>
                  <Radio
                    whiteSpace={'nowrap'}
                    paddingLeftp={'8px'}
                    position={'relative'}
                    isChecked={MandiriChecked}
                  />
                </Box>
              </Box>
            </RadioGroup>
          </Box>
        </ModalBody>

        <ModalFooter
          display={'flex'}
          justifyContent={'space-between'}
          flexDir={'row'}
          p={'12px 16px'}
        >
          <Box>
            <Text
              color={'#31353BF5'}
              fontSize={'12px'}
              fontWeight={700}
              lineHeight={'20px'}
              whiteSpace={'nowrap'}
              textOverflow={'ellipsis'}
              overflow={'hidden'}
            >
              Total Bill
            </Text>
            <Text
              color={'#31353BF5'}
              fontSize={'16px'}
              fontWeight={800}
              m={'0px'}
              lineHeight={'20px'}
            >
              {
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                })
                  .format(totalPrice)
                  .split(',')[0]
              }
            </Text>
          </Box>
          <Button
            variant="ghost"
            h={'40px'}
            w={'201.28px'}
            p={'0px 16px'}
            lineHeight={'18px'}
            borderRadius={'8px'}
            fontWeight={800}
            bgColor={'#0095DA'}
            color={'#fff'}
            onClick={createNewTransaction}
            _hover={'none'}
            _active={{
              bgColor: '#0370A2',
            }}
          >
            <Text pl={'2px'}>Pay Now</Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Payment;
