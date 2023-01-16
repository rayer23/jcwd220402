import { Box, Button } from "@chakra-ui/react"
import { BsArrowBarLeft, BsArrowBarRight } from 'react-icons/bs';

const Pagination = ({ previousPage, page, maxPage, nextPage }) => {
  return (
    <Box p="20px" fontSize={"16px"}>
      <Box textAlign={"center"}>
      <Button
            onClick={previousPage}
            disabled={page === 1 ? true : null}
            _hover={false}
            _active={false}
            color="#0095DA"
            bgColor={'white'}
          >
            <BsArrowBarLeft fontSize={'25px'} />
          </Button>

          <Box display={'inline'}>{page}</Box>

          <Button
            onClick={nextPage}
            disabled={page >= maxPage ? true : null}
            _hover={false}
            color="#0095DA"
            _active={false}
            bgColor={'white'}
          >
            <BsArrowBarRight fontSize={'25px'} />
          </Button>
          <Box>
            Page: {page} of {maxPage}
          </Box>
      </Box>
    </Box>
  )
}

export default Pagination
