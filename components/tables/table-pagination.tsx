'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TablePaginationProps {
  totalPages: number
  currentPage: number
  totalItems: number
  itemsPerPage: number
}

export default function TablePagination({ 
  totalPages, 
  currentPage, 
  totalItems, 
  itemsPerPage 
}: TablePaginationProps = { 
  totalPages: 1, 
  currentPage: 1, 
  totalItems: 10, 
  itemsPerPage: 10 
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(params).forEach(([key, value]) => {
      newParams.set(key, value)
    })
    return newParams.toString()
  }

  const handlePageChange = (page: number) => {
    router.push(`${pathname}?${createQueryString({ page: page.toString() })}`)
  }

  const handleItemsPerPageChange = (value: string) => {
    router.push(`${pathname}?${createQueryString({ page: '1', pageSize: value })}`)
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} entries
      </div>
      <div className="flex items-center space-x-4">
        <Select 
          value={itemsPerPage.toString()} 
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent>
            {[2, 5, 10, 20, 50].map(value => (
              <SelectItem key={value} value={value.toString()}>
                {value} items per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        >
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}