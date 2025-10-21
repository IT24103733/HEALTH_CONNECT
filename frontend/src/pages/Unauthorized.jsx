import { Box, Container, VStack, Heading, Text, Button } from '@chakra-ui/react'
import { FaLock } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function Unauthorized() {
  const navigate = useNavigate()

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Container maxW="md">
        <VStack spacing={6} textAlign="center">
          <Box p={6} bg="red.50" rounded="full">
            <FaLock size={64} color="#E53E3E" />
          </Box>
          <Heading size="xl">Access Denied</Heading>
          <Text color="gray.600" fontSize="lg">
            You don't have permission to access this page.
          </Text>
          <Button
            bgGradient="linear(to-r, brand.500, purple.400)"
            color="white"
            size="lg"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}
