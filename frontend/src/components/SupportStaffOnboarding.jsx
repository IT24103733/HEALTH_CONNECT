import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, VStack, HStack, Text, Icon, Box } from '@chakra-ui/react'
import { FaHome, FaTicketAlt, FaPhoneAlt, FaCheckCircle } from 'react-icons/fa'
import { useState } from 'react'

export default function SupportStaffOnboarding({ isOpen, onClose }) {
  const [step, setStep] = useState(0)

  const steps = [
    { icon: FaHome, title: 'Dashboard', desc: 'Track completed tickets, manage your checklist, and review best practices for excellent customer support' },
    { icon: FaTicketAlt, title: 'Pending Tickets', desc: 'View support requests from patients, doctors, and dietitians. Accept tickets to start live chat conversations' },
    { icon: FaPhoneAlt, title: 'Contact Staff', desc: 'Access contact information for admins and super admins when you need escalation or assistance' },
    { icon: FaCheckCircle, title: 'Best Practices', desc: 'Always be professional, respond promptly, document issues clearly, and escalate when necessary' }
  ]

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1)
    else onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome to Health Connect Support!</ModalHeader>
        <ModalBody>
          <VStack spacing={6} align="center" py={6}>
            <Box p={6} bg="brand.50" rounded="full">
              <Icon as={steps[step].icon} boxSize={16} color="brand.500" />
            </Box>
            <Text fontSize="2xl" fontWeight="bold">{steps[step].title}</Text>
            <Text textAlign="center" color="gray.600">{steps[step].desc}</Text>
            <HStack spacing={2}>
              {steps.map((_, i) => (
                <Box key={i} w={2} h={2} rounded="full" bg={i === step ? 'brand.500' : 'gray.300'} />
              ))}
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>Skip</Button>
          <Button bgGradient="linear(to-r, brand.500, purple.400)" color="white" onClick={handleNext}>
            {step < steps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
