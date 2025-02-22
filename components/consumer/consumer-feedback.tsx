"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { feedback } from "@/data/dummy-comments";

export function ConsumerFeedback() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(feedback.length / itemsPerPage);

  const currentFeedback = feedback.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentarios de consumidores</CardTitle>
        <CardDescription>Haz scroll para ver más.</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ScrollArea className="h-[250px] pr-4">
          <div className="space-y-3">
            {currentFeedback.map((item, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <p className="text-sm text-muted-foreground">{item.comment}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage((p) => p - 1);
                }}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage((p) => p + 1);
                }}
                className={
                  currentPage >= totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}
