import * as prisma from '@prisma/client'

export type UUID = string

// Some Resources have both an 'id' field that contains a cuid
// as well as a __other__ field that represents that resource's
// canonical id
//
// Site.hostname
// Post.url_slug

export type Cuid = { type_: 'Cuid'; val: string }
export type CanonicalId = { type_: 'Canonical'; val: string }

export type Id = Cuid | CanonicalId

export const canonicalId = (val: string): CanonicalId => ({
  type_: 'Canonical',
  val,
})

export const cuid = (val: string): Cuid => ({
  type_: 'Cuid',
  val,
})

export type Nullable<T> = T | null

export type Site = prisma.Site
export type Post = prisma.Post
export type CommentTreeState = prisma.CommentTreeState
export type CommentVote = prisma.CommentVote

export interface Interactions {
  commentVotes: Record<CommentVote['id'], CommentVote>
}

export type Comment = prisma.Comment

export namespace Comment {
  // Incoming from the client-side
  export type Raw = {
    body: string
    parentCommentId: Nullable<string>
    authorId: Nullable<string>
    anonAuthorName: Nullable<string>
  }

  export type WithAuthor = Comment & {
    author: Nullable<User>
  }

  export type WithAuthorAndPost = Comment & {
    post: Post,
    author: Nullable<User>
  }

  // This is the "raw" query response from prisma
  // Recursive comment tree
  export type WithRepliesAndAuthor = WithAuthor & {
    replies?: WithRepliesAndAuthor[]
  }
}

export type User = prisma.User

export namespace User {
  export type WithoutPassword = Omit<User, 'password'>
}
