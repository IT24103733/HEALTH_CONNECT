import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, VStack, HStack, Text, Icon, Box } from '@chakra-ui/react'
import { FaHome, FaFileAlt, FaUsers, FaPhoneAlt } from 'react-icons/fa'
import { useState } from 'react'

export default function SuperAdminOnboarding({ isOpen, onClose }) {
  const [step, setStep] = useState(0)

  const steps = [
    { icon: FaHome, title: 'Dashboard', desc: 'Monitor active users and manage your administrative checklist for system oversight' },
    { icon: FaFileAlt, title: 'Compliance Logs', desc: 'Access and export audit logs with date filters for regulatory compliance and security monitoring' },
    { icon: FaUsers, title: 'User Management', desc: 'Full control: create new users, modify existing users, delete users, and manage all roles across the system' },
    { icon: FaPhoneAlt, title: 'Contact Information', desc: 'Access contacts for cybersecurity manager, operations managers, admin manager, and support staff manager for coordination' }
  ]

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1)
    else onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome to Super Admin Portal!</ModalHeader>
        <ModalBody>
          <VStack spacing={6} align="center" py={6}>
            <Box p={6} bg="purple.50" rounded="full">
              <Icon as={steps[step].icon} boxSize={16} color="purple.500" />
            </Box>
            <Text fontSize="2xl" fontWeight="bold">{steps[step].title}</Text>
            <Text textAlign="center" color="gray.600">{steps[step].desc}</Text>
            <HStack spacing={2}>
              {steps.map((_, i) => (
                <Box key={i} w={2} h={2} rounded="full" bg={i === step ? 'purple.500' : 'gray.300'} />
              ))}
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Skip</Button>
          <Button bgGradient="linear(to-r, purple.500, pink.400)" color="white" onClick={handleNext}>
            {step < steps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
