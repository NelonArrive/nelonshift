'use client'

import { useEffect } from 'react'
import ReactPaginate from 'react-paginate'
import { useProjectsStore } from '../store'

interface ProjectsPaginationProps {
  totalPages: number
  totalItems: number
}

export function ProjectsPagination({ totalPages, totalItems }: ProjectsPaginationProps) {
  const { page, setPage, limit } = useProjectsStore()

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1)
    }
  }, [page, totalPages, setPage])

  if (totalPages <= 1) return null

  return (
    <div className='mt-8 space-y-3'>
      <div className='text-center text-sm text-muted-foreground'>
        Показано {Math.min((page - 1) * limit + 1, totalItems)}–
        {Math.min(page * limit, totalItems)} из {totalItems} проектов
      </div>
      
      <ReactPaginate
        breakLabel='...'
        nextLabel='→'
        onPageChange={event => setPage(event.selected + 1)}
        marginPagesDisplayed={1}
        forcePage={page - 1}
        pageRangeDisplayed={3}
        pageCount={totalPages}
        previousLabel='←'
        containerClassName='flex gap-2 justify-center select-none'
        pageLinkClassName='flex items-center justify-center h-8 w-8 rounded-full border border-muted-foreground/30
          text-muted-foreground text-sm font-medium transition-all duration-200 ease-in-out
          hover:bg-muted hover:text-foreground hover:scale-105 active:scale-95'
        activeLinkClassName='!text-white !border-primary !scale-110 shadow-sm'
        breakLinkClassName='text-muted-foreground px-2'
        previousLinkClassName='flex items-center justify-center h-8 w-8 rounded-full border border-muted-foreground/30
          text-muted-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95'
        nextLinkClassName='flex items-center justify-center h-8 w-8 rounded-full border border-muted-foreground/30
          text-muted-foreground hover:bg-muted transition-all duration-200 hover:scale-105 active:scale-95'
        disabledClassName='opacity-50 pointer-events-none cursor-not-allowed scale-100'
      />
    </div>
  )
}