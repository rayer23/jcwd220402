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

const ModalEditCategory = ({
  addNewCategory,
  isOpenEditCategory,
  onOpenEditCategory,
  onCloseEditCategory,
  editFormik,
  category_name,
  editChangeHandler,
  selectImage,
  setSelectImage,
  apiImg,
  category_image,
  inputFileRef,
  closeEditModal,
}) => {
  return (
    <Modal
      isOpen={isOpenEditCategory}
      onOpen={onOpenEditCategory}
      onClose={onCloseEditCategory}
      motionPreset="slideInBottom"
      size={'md'}
      closeOnEsc={false}
    >
      <form onSubmit={editFormik.handleSubmit}>
        <ModalOverlay bg="blackAlpha.400" />
        <ModalContent borderRadius={'10px'} mt={'120px'}>
          <ModalHeader
            fontSize={'2xl'}
            fontWeight="bold"
            textAlign={'center'}
            borderBottom={'thin dashed #E5E7E9'}
          >
            Edit Category
          </ModalHeader>
          <ModalBody>
            <FormControl isInvalid={editFormik.errors.category_image}>
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
                <Box
                  w={'200px'}
                  bgColor={'#fff'}
                  display={'flex'}
                  justifyContent={'center'}
                  p={'3px 0px'}
                >
                  <Image
                    h={selectImage ? '80px' : '80px'}
                    src={
                      selectImage ? selectImage : `${apiImg}/${category_image}`
                    }
                  />
                </Box>
                <Input
                  display="none"
                  ref={inputFileRef}
                  name="category_image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    setSelectImage(URL.createObjectURL(event.target.files[0]));
                    editFormik.setFieldValue(
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
                  minH={'40px'}
                >
                  {selectImage
                    ? editFormik?.values?.category_image?.name
                    : 'Change Image'}
                </Button>
              </Box>
              <FormErrorMessage>
                {editFormik.errors.category_image}
              </FormErrorMessage>
            </FormControl>
            <FormLabel mt={'15px'} fontSize={'20px'}>
              Category Name
            </FormLabel>
            <FormControl isInvalid={editFormik.errors.category_name}>
              <Input
                type="text"
                name={'category_name'}
                defaultValue={category_name}
                onChange={editChangeHandler}
              />
              <FormErrorMessage>
                {editFormik.errors.category_name}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              bgColor="white"
              color={'#0095DA'}
              border={'1px solid #0095DA'}
              mr={3}
              onClick={closeEditModal}
              borderRadius={'8px'}
            >
              Cancel
            </Button>
            <Button
            w={'80px'}
              borderRadius={'8px'}
              bgColor={'#0095DA'}
              color={'white'}
              _hover={false}
              mr={3}
              type="submit"
              isDisabled={
                category_name !== editFormik.values.category_name || selectImage
                  ? false
                  : true
              }
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default ModalEditCategory;
