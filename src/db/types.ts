import * as prisma from '@prisma/client'

export type UUID = string

// Some Resources have both an 'id' field that contains a cuid
// as well as a __other__ field that represents that resource's
// canonical id
//
// Site.hostname
// Post.url_slug
export type Id =
  | { type_: 'Cuid'; val: string }
  | { type_: 'Canonical'; val: string }

export type Site = prisma.Site
export type Post = prisma.Post
export type Comment = prisma.Comment
export type User = prisma.User
export type Admin = prisma.Admin

export namespace Admin {
  export type WithoutPassword = Omit<Admin, 'password'>
}
