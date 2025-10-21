import { Box, Container, Heading, Text, VStack, HStack, Input, Button, useColorMode, Badge, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, FormControl, FormLabel, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Spinner } from '@chakra-ui/react'
import { FaSearch, FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import SuperAdminSidebar from '../../components/SuperAdminSidebar'
import BreadcrumbNav from '../../components/Breadcrumb'
import { api } from '../../services/api'
import { register } from '../../services/auth'

export default function SuperAdminUserManagement() {
  const { colorMode } = useColorMode()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [userToDelete, setUserToDelete] = useState(null)
  const cancelRef = useRef()
  const toast = useToast()
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'PATIENT', specialization: '' })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

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
    { label: 'Super Admin', path: '/super-admin/dashboard' },
    { label: 'User Management', path: '/super-admin/users' }
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
      toast({ title: 'User updated successfully!', status: 'success', duration: 3000, isClosable: true, position: 'top' })
      await loadUsers()
      onClose()
    } catch (error) {
      toast({ title: 'Update failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({ title: 'Please fill all required fields', status: 'error', duration: 3000, isClosable: true, position: 'top' })
      return
    }
    try {
      await register(newUser.name, newUser.email, newUser.password, newUser.role, newUser.specialization)
      toast({ title: 'User created successfully!', description: `${newUser.name} has been added to the system.`, status: 'success', duration: 3000, isClosable: true, position: 'top' })
      await loadUsers()
      setNewUser({ name: '', email: '', password: '', role: 'PATIENT', specialization: '' })
      onCreateClose()
    } catch (error) {
      toast({ title: 'Creation failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
    }
  }

  const handleDeleteConfirm = (user) => {
    setUserToDelete(user)
    onDeleteOpen()
  }

  const handleDelete = async () => {
    try {
      await api.deleteUser(userToDelete.id)
      toast({ title: 'User deleted successfully!', description: `${userToDelete.name} has been removed from the system.`, status: 'success', duration: 3000, isClosable: true, position: 'top' })
      await loadUsers()
      onDeleteClose()
    } catch (error) {
      toast({ title: 'Deletion failed', description: error.message, status: 'error', duration: 5000, position: 'top' })
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
      <SuperAdminSidebar />
      <Box ml="250px" w="calc(100% - 250px)" minH="100vh" bg={colorMode === 'dark' ? '#0b1437' : 'gray.50'}>
        <Container maxW="1400px" py={8}>
          <BreadcrumbNav items={breadcrumbItems} />
          <HStack justify="space-between" mb={6}>
            <Heading>User Management</Heading>
            <Button leftIcon={<FaPlus />} bgGradient="linear(to-r, purple.500, pink.400)" color="white" onClick={onCreateOpen}>
              Create New User
            </Button>
          </HStack>

          <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={6} rounded="xl" shadow="md" mb={6}>
            <HStack spacing={3}>
              <Input
                placeholder="Search by name or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
              />
              <Button bgGradient="linear(to-r, purple.500, pink.400)" color="white" size="lg" leftIcon={<FaSearch />}>
                Search
              </Button>
            </HStack>
          </Box>

          {loading ? (
            <VStack py={12}><Spinner size="xl" color="purple.500" /></VStack>
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
                  <HStack>
                    <Button leftIcon={<FaEdit />} colorScheme="purple" variant="outline" onClick={() => handleEdit(user)}>
                      Edit
                    </Button>
                    <Button leftIcon={<FaTrash />} colorScheme="red" variant="outline" onClick={() => handleDeleteConfirm(user)}>
                      Delete
                    </Button>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
          )}
            {!loading && filteredUsers.length === 0 && (
              <Box bg={colorMode === 'dark' ? '#1a2559' : 'white'} p={12} rounded="xl" shadow="md" textAlign="center">
                <Text color="gray.500" fontSize="lg">No users found</Text>
              </Box>
            )}

          {/* Edit User Modal */}
          {selectedUser && (
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Edit User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4}>
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input value={selectedUser.name} onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input value={selectedUser.email} onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})} />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Role</FormLabel>
                      <Select value={selectedUser.role} onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}>
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
                  <Button bgGradient="linear(to-r, purple.500, pink.400)" color="white" onClick={handleSave}>
                    Save Changes
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}

          {/* Create User Modal */}
          <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create New User</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input type="email" placeholder="email@example.com" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
                  </FormControl>
                  {(newUser.role === 'DOCTOR' || newUser.role === 'DIETITIAN') && (
                    <FormControl>
                      <FormLabel>Specialization</FormLabel>
                      <Input placeholder="e.g., Cardiology" value={newUser.specialization} onChange={(e) => setNewUser({...newUser, specialization: e.target.value})} />
                    </FormControl>
                  )}
                  <FormControl>
                    <FormLabel>Role</FormLabel>
                    <Select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
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
                <Button variant="ghost" mr={3} onClick={onCreateClose}>Cancel</Button>
                <Button bgGradient="linear(to-r, purple.500, pink.400)" color="white" onClick={handleCreateUser}>
                  Create User
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Delete Confirmation Dialog */}
          <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete User
                </AlertDialogHeader>
                <AlertDialogBody>
                  Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
                </AlertDialogBody>
                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onDeleteClose}>Cancel</Button>
                  <Button colorScheme="red" onClick={handleDelete} ml={3}>Delete</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Container>
      </Box>
    </Box>
  )
}
