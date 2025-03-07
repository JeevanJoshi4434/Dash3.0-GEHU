"use client"
import { PostList } from "@/components/post-list"
import { CreatePostForm } from "@/components/create-post-form"
import { UserProvider } from "@/context/userContext"

type Message = {
  id: string
  content: string
  isUser: boolean
}

export default function ChatApp() {
  return <CommunityPage />
}

function CommunityPage() {
  return (
    <UserProvider>

      <div className="min-h-screen ">
        <div className="container mx-auto py-8 px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8 text-center">Community Posts</h1>
          <CreatePostForm />
          <PostList />
        </div>
      </div>
    </UserProvider>
  )
}

