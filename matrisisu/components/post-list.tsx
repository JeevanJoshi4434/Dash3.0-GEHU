"use client"

import { useState, useEffect } from "react"
import { Post } from "@/components/post"

export type Comment = {
  id: string
  content: string
  author: string
  createdAt: string
}

export type PostType = {
  id: string
  content: string
  upvotes: number
  comments: Comment[]
  author: string
  createdAt: string
}

// Sample data - in a real app, this would come from a database
const initialPosts: PostType[] = [
  {
    id: "1",
    content: "Just discovered this amazing new framework! It's going to revolutionize how we build web applications.",
    upvotes: 24,
    author: "Sarah Johnson",
    createdAt: "2025-03-05T14:48:00.000Z",
    comments: [
      {
        id: "c1",
        content: "I've been using it for a month now. It's really great!",
        author: "Mike Smith",
        createdAt: "2025-03-05T15:30:00.000Z",
      },
      {
        id: "c2",
        content: "Could you share some resources to learn more about it?",
        author: "Emily Chen",
        createdAt: "2025-03-05T16:15:00.000Z",
      },
    ],
  },
  {
    id: "2",
    content:
      "What's your favorite productivity hack? I've been using the Pomodoro technique and it's been a game-changer for my focus.",
    upvotes: 18,
    author: "Alex Rivera",
    createdAt: "2025-03-04T09:22:00.000Z",
    comments: [
      {
        id: "c3",
        content: "I like time blocking my entire day. It helps me stay on track.",
        author: "Jordan Lee",
        createdAt: "2025-03-04T10:45:00.000Z",
      },
    ],
  },
  {
    id: "3",
    content: "Just launched my portfolio website after weeks of work! Would love some feedback from the community.",
    upvotes: 32,
    author: "Taylor Wong",
    createdAt: "2025-03-03T18:10:00.000Z",
    comments: [],
  },
]

export function PostList() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPosts = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let posts = [...initialPosts]; 
      const more = localStorage.getItem('more');
      if (more) {
        const parsedPosts = JSON.parse(more);
        console.log(parsedPosts);
        posts = [...posts, ...parsedPosts];
      }
      setPosts(posts);
      setLoading(false);
    };
  
    loadPosts();
  }, []);
  

  const handleUpvote = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post)),
    )
  }

  const handleAddComment = (postId: string, commentContent: string) => {
    if (!commentContent.trim()) return

    const newComment: Comment = {
      id: `c${Date.now()}`,
      content: commentContent,
      author: "Current User",
      createdAt: new Date().toISOString(),
    }

    setPosts((currentPosts) =>
      currentPosts.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post)),
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 mt-8">
        
      </div>
    )
  }

  return (
    <div className="space-y-6 mt-8">
      {posts.length === 0 ? (
        <div className="text-center py-12 bg-whited rounded-lg shadow">
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        posts.map((post) => <Post key={post.id} post={post} onUpvote={handleUpvote} onAddComment={handleAddComment} />)
      )}
    </div>
  )
}

