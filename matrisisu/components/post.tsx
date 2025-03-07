"use client"
import type React from "react"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import type { PostType } from "./post-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, Send } from "lucide-react"

interface PostProps {
    post: PostType
    onUpvote: (postId: string) => void
    onAddComment: (postId: string, comment: string) => void
}

export function Post({ post, onUpvote, onAddComment }: PostProps) {
    const [comment, setComment] = useState("")
    const [showComments, setShowComments] = useState(false)

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault()
        onAddComment(post.id, comment)
        setComment("")
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const formatDate = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true })
        } catch (error) {
            return "some time ago"
        }
    }

    return (
        <Card className="bg-white shadow-sm hover:shadow transition-shadow duration-200">
            <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full">
                        <p className="text-gray-600 ">A</p>
                    </div>
                    <div>
                        <p className="font-medium">{post.author}</p>
                        <p className="text-xs text-gray-500 ">{formatDate(post.createdAt)}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <p className="whitespace-pre-wrap">{post.content}</p>
            </CardContent>
            <CardFooter className="flex flex-col border-t pt-3 space-y-3">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 text-gray-600  hover:text-blue-600 "
                            onClick={() => onUpvote(post.id)}
                        >
                            <ThumbsUp className="h-4 w-4" />
                            <span>{post.upvotes}</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center space-x-1 text-gray-600 "
                            onClick={() => setShowComments(!showComments)}
                        >
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.comments.length}</span>
                        </Button>
                    </div>
                </div>

                {showComments && (
                    <div className="w-full space-y-3">
                        {post.comments.length > 0 && (
                            <div className="space-y-3 pt-2 border-t w-full">
                                {post.comments.map((comment) => (
                                    <div key={comment.id} className="flex space-x-3">
                                        <div className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full">
                                            <p className="text-gray-600  ">{comment.author.charAt(0).toUpperCase()}</p>
                                        </div>
                                        <div className="flex-1 bg-gray-50  p-3 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-sm">{comment.author}</p>
                                                <p className="text-xs text-gray-500  ">{formatDate(comment.createdAt)}</p>
                                            </div>
                                            <p className="text-sm mt-1">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmitComment} className="flex space-x-2 pt-2">
                            <textarea
                                placeholder="Write a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[60px] flex-1 resize-none"
                            />
                            <Button type="submit" size="icon" disabled={!comment.trim()} className="self-end">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}

