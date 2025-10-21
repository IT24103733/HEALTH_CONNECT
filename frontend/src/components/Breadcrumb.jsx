import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'

export default function BreadcrumbNav({ items }) {
  return (
    <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={6}>
      {items.map((item, index) => (
        <BreadcrumbItem key={index} isCurrentPage={index === items.length - 1}>
          {index === items.length - 1 ? (
            <BreadcrumbLink fontWeight="semibold">{item.label}</BreadcrumbLink>
          ) : (
            <BreadcrumbLink as={Link} to={item.path}>{item.label}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}
