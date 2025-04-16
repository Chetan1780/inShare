import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import moment from 'moment'
import { ExternalLink } from 'lucide-react'
import { showToast } from '@/Helper/ShowToast'

const ActiveLinks = ({ userId,upload }) => {
    const [files, setFiles] = useState([])

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                    const response = await fetch(
                    `${import.meta.env.VITE_API_BACKEND_URL}/api/files/active_links/${userId}`,
                    {   method:'GET',
                        credentials: 'include',
                    }
                )
                const data = await response.json()
                if (data.success) {
                    setFiles(data.file)
                }
            } catch (error) {
                console.error('Error fetching active links:', error)
            }
        }

        if (userId) {
            fetchLinks()
        }
    }, [userId,upload])

    return (
        <div className="flex justify-center items-center  bg-gray-100 p-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg border p-6 border-gray-200">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">📄 Active PDF Links</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-base text-gray-700">File Name</TableHead>
                            <TableHead className="text-base text-gray-700">Sharable Link</TableHead>
                            <TableHead className="text-base text-gray-700">Expires At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {files.length > 0 ? (
                            files.map((file) => (
                                <TableRow key={file._id} className="hover:bg-gray-50 transition">
                                    <TableCell className="font-medium text-gray-800">
                                        {file?.fileOriginalName || 'Untitled'}
                                    </TableCell>
                                    <TableCell>
                                        <button
                                            onClick={() => {
                                                const url = `${import.meta.env.VITE_API_FRONTEND_URL}/pdf-view/${file._id}`
                                                navigator.clipboard.writeText(url)
                                                {showToast('success','Link copied to Clipboard!!')}
                                            }}
                                            className="text-blue-600 flex items-center gap-1 font-semibold hover:underline focus:outline-none"
                                        >
                                            Copy Link <ExternalLink size={16} />
                                        </button>
                                    </TableCell>

                                    <TableCell className="text-gray-700">
                                        {moment(file.expiresAt).format('MMMM Do YYYY, h:mm:ss A')}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-gray-500 py-6">
                                    No active links found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ActiveLinks
