import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

const ModalAddNewCategory = ({
  addNewCategory,
  inputFileRef,
  closeAddNewModal,
  isOpenAddNewCategory,
  onCloseAddNewCategory,
  formikAddNewCategory,
  inputChangeHandler,
  selectImage,
  setSelectImage,
  doubleOnClick,
}) => {
  return (
    <Modal
      isOpen={isOpenAddNewCategory}
      onClose={onCloseAddNewCategory}
      motionPreset="slideInBottom"
      size={'md'}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <form onSubmit={formikAddNewCategory.handleSubmit}>
        <ModalOverlay bg="blackAlpha.400" />
        <ModalContent borderRadius={'10px'} mt={'120px'}>
          <ModalHeader
            fontSize={'2xl'}
            fontWeight="bold"
            textAlign={'center'}
            borderBottom={'thin dashed #E5E7E9'}
          >
            Add New Category
          </ModalHeader>

          <ModalBody pt={'15px'}>
            <Box
              h={'200px'}
              bgColor={'#E2E2E2'}
              borderRadius={'8px'}
              w={'399.06px'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              mx={'auto'}
              p={'32px'}
              flexDir={'column'}
            >
              {selectImage ? (
                <Box
                  w={'200px'}
                  bgColor={'#fff'}
                  display={'flex'}
                  justifyContent={'center'}
                  p={'3px 0px'}
                >
                  <Image
                    h={selectImage ? '80px' : '47px'}
                    src={selectImage ? selectImage : null}
                  />
                </Box>
              ) : (
                <Image
                  h={selectImage ? '80px' : '47px'}
                  src={selectImage ? selectImage : null}
                />
              )}
              <FormControl
                isInvalid={formikAddNewCategory.errors.category_image}
              >
                <Input
                  display="none"
                  ref={inputFileRef}
                  name="category_image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setSelectImage(URL.createObjectURL(event.target.files[0]));
                    formikAddNewCategory.setFieldValue(
                      'category_image',
                      event.target.files[0],
                    );
                  }}
                />
                <Button
                  bgColor={selectImage ? '#0095DA' : null}
                  mt={'20px'}
                  display={'flex'}
                  colorScheme={'blue'}
                  color={'#fff'}
                  onClick={() => {
                    inputFileRef.current.click();
                  }}
                  width="200px"
                  mx={'auto'}
                  borderRadius={'8px'}
                >
                  {formikAddNewCategory?.values?.category_image?.name ||
                    'Search'}
                </Button>
                <FormErrorMessage>
                  {formikAddNewCategory.errors.category_image}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <FormLabel mt={'15px'} fontSize={'20px'}>
              Category Name
            </FormLabel>
            <FormControl isInvalid={formikAddNewCategory.errors.category_name}>
              <Input
                type="text"
                name={'category_name'}
                value={formikAddNewCategory.values.category_name}
                onChange={inputChangeHandler}
              />
              <FormErrorMessage>
                {formikAddNewCategory.errors.category_name}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              bgColor="white"
              color={'#0095DA'}
              border={'1px solid #0095DA'}
              mr={3}
              _hover={false}
              onClick={closeAddNewModal}
              borderRadius={'8px'}
            >
              Cancel
            </Button>
            <Button
              bgColor={'#0095DA'}
              color={'white'}
              mr={3}
              _hover={false}
              onClick={addNewCategory}
              borderRadius={'8px'}
              isDisabled={
                !formikAddNewCategory.values.category_name ||
                !formikAddNewCategory.values.category_image
              }
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};
export default ModalAddNewCategory;
