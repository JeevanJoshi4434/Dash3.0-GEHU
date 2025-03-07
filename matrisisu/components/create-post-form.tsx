"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/hooks/useUser"

export function CreatePostForm() {
    const { user } = useUser();
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        let newList: any[] = [];
        const all = localStorage.getItem('more');

        if (all) {
            newList = JSON.parse(all);
        }

        const data = {
            id: `p${Date.now()}`,
            content: content,
            upvotes: 0,
            author: "Anonymous",
            createdAt: new Date().toISOString(),
            comments: [],
        };

        newList.push(data);
        localStorage.setItem('more', JSON.stringify(newList));

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setContent("");
        setIsSubmitting(false);
    };


    return (
        <div className="bg-white rounded-md shadow-sm">
            <form onSubmit={handleSubmit}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Create a Post</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                    <textarea
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[120px] w-full outline-none resize-none"
                    />
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-3">
                    <Button type="submit" disabled={!content.trim() || isSubmitting}>
                        {isSubmitting ? "Posting..." : "Post"}
                    </Button>
                </CardFooter>
            </form>
        </div>
    )
}

