import { Box, Container, Heading, Text, VStack, HStack, Input, Button, useColorMode, Badge, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, FormControl, FormLabel, Spinner, useToast } from '@chakra-ui/react'
import { FaSearch, FaEdit } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/AdminSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'

export default function UserManagement() {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await api.getUsers(0, 100)
      setUsers(response.content || response)
    } catch (error) {
      toast({ title: 'Error loading users', description: error.message, status: 'error', duration: 5000, position: 'top' })
    } finally {
      setLoading(false)
    }
  }

  const breadcrumbItems = [
    { label: 'Admin', path: '/admin/dashboard' },
    { label: 'User Management', path: '/admin/users' }
  ]

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (user) => {
    setSelectedUser({ ...user })
    onOpen()
  }

  const handleSave = async () => {
    try {
      await api.updateUser(selectedUser.id, { name: selectedUser.name, email: selectedUser.email })
      toast({ title: 'User updated successfully!', status: 'success', duration: 3000, position: 'top' })
      await loadUsers()
      onClose()
    } catch (error) {
      toast({ title: 'Update failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'PATIENT': return 'blue'
      case 'DOCTOR': return 'purple'
      case 'DIETITIAN': return 'green'
      case 'SUPPORT_STAFF': return 'orange'
      case 'SYSTEM_ADMIN': return 'red'
      case 'SUPER_ADMIN': return 'pink'
      default: return 'gray'
    }
  }

  return (
    <Box display="flex">
      <AdminSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1400px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <Heading mb={6}>User Management</Heading>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md" mb={6}>
            <HStack spacing={3}>
              <Input
                placeholder="Search by name or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
                leftElement={<FaSearch />}
              />
              <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" size="lg" leftIcon={<FaSearch />}>
                Search
              </Button>
            </HStack>
          </Box>

          {loading ? (
            <VStack py={12}><Spinner size="xl" color="brand.500" /></VStack>
          ) : (
          <VStack spacing={4} align="stretch">
            {filteredUsers.map((user) => (
              <Box 
                key={user.id} 
                bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
                p={6} 
                rounded="xl" 
                shadow="md" 
                border="1px" 
                borderColor={colorMode === 'dark' ? 'whiteAlpha.200' : 'gray.200'}
              >
                <HStack justify="space-between" align="start">
                  <VStack align="start" spacing={3} flex="1">
                    <HStack>
                      <Text fontWeight="bold" fontSize="xl">{user.name}</Text>
                      <Badge colorScheme={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    </HStack>
                    <HStack spacing={6}>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.500">User ID</Text>
                        <Text fontWeight="semibold">{user.id}</Text>
                      </VStack>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.500">Email</Text>
                        <Text fontWeight="semibold">{user.email}</Text>
                      </VStack>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" color="gray.500">Role</Text>
                        <Text fontWeight="semibold">{user.role}</Text>
                      </VStack>
                    </HStack>
                  </VStack>
                  <Button
                    leftIcon={<FaEdit />}
                    colorScheme="brand"
                    variant="outline"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>
          )}
            {!loading && filteredUsers.length === 0 && (
              <Box 
                bg={colorMode === 'dark' ? '#1a2559' : 'white'} 
                p={12} 
                rounded="xl" 
                shadow="md" 
                textAlign="center"
              >
                <Text color="gray.500" fontSize="lg">No users found</Text>
              </Box>
            )}

          {selectedUser && (
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>User ID</FormLabel>
                      <Input value={selectedUser.id} isReadOnly bg={colorMode === 'dark' ? '#0b1437' : 'gray.100'} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input 
                        value={selectedUser.name} 
                        onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input 
                        value={selectedUser.email} 
                        onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        value={selectedUser.role}
                        onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                      >
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="DIETITIAN">Dietitian</option>
                        <option value="SUPPORT_STAFF">Support Staff</option>
                        <option value="SYSTEM_ADMIN">System Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </Select>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
                  <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" onClick={handleSave}>
                    Save Changes
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </Container>
      </Box>
    </Box>
  )
}
