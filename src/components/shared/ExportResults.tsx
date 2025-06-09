'use client'

import { Button, HStack, useToast } from '@chakra-ui/react'
import { FaFileCsv, FaFilePdf } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'

interface ExportResultsProps {
  data: any[]
  filename: string
  type: 'seoScan' | 'heatMap' | 'citation'
}

export default function ExportResults({ data, filename, type }: ExportResultsProps) {
  const toast = useToast()

  const exportToCSV = () => {
    try {
      const csv = Papa.unparse(data)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: 'Export Successful',
        description: 'Results exported to CSV successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export results to CSV',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const exportToPDF = () => {
    try {
      const doc = new jsPDF()
      
      // Add title
      doc.setFontSize(16)
      doc.text(`${type === 'seoScan' ? 'SEO Scan' : type === 'heatMap' ? 'Keyword Heat Map' : 'Citation'} Results`, 14, 15)
      
      // Add date
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25)
      
      // Add table
      autoTable(doc, {
        startY: 30,
        head: [Object.keys(data[0])],
        body: data.map(item => Object.values(item)),
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 153, 225],
          textColor: 255,
          fontSize: 10,
          fontStyle: 'bold',
        },
      })
      
      doc.save(`${filename}.pdf`)
      
      toast({
        title: 'Export Successful',
        description: 'Results exported to PDF successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export results to PDF',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  return (
    <HStack spacing={4}>
      <Button
        leftIcon={<FaFileCsv />}
        colorScheme="blue"
        variant="outline"
        onClick={exportToCSV}
      >
        Export CSV
      </Button>
      <Button
        leftIcon={<FaFilePdf />}
        colorScheme="red"
        variant="outline"
        onClick={exportToPDF}
      >
        Export PDF
      </Button>
    </HStack>
  )
} 