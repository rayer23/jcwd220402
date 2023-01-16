import { Button, FormControl, Input, InputGroup } from '@chakra-ui/react';
import { TbSearch } from 'react-icons/tb';

const Search = ({ formikSearch, searchHandler, placeholder, width }) => {
  return (
    <form onSubmit={formikSearch.handleSubmit}>
      <FormControl>
        <InputGroup textAlign={'right'}>
          <Button
            borderRightRadius={'0'}
            type="submit"
            bgColor={'white'}
            _hover={false}
            border="1px solid #e2e8f0"
            borderRight={'0px'}
          >
            <TbSearch />
          </Button>
          <Input
            type={'text'}
            placeholder={placeholder}
            name="search"
            w={width}
            onChange={searchHandler}
            borderLeftRadius="0"
            value={formikSearch.values.search}
            bgColor={'white'}
            _hover={false}
          />
        </InputGroup>
      </FormControl>
    </form>
  );
};

export default Search;
