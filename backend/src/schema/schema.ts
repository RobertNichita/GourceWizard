import {gql} from 'apollo-server';

// TODO: Look into modularizing this soon.
export const schema = gql`
  type User {
    """
    Unique user id
    """
    id: ID!

    """
    Username
    """
    username: String!

    """
    List of videos created by the user
    """
    videos: [Video!]
  }

  type Video {
    """
    Unique video id
    """
    _id: ID!

    """
    User who generated this video
    """
    owner: User!

    """
    Video Title
    """
    title: String!

    """
    Video Description
    """
    description: String

    """
    Video Thumbnail TODO: Are we doing this?
    """
    thumbnail: String @deprecated

    """
    Video Playback URL
    """
    url: String

    """
    Video Visibility
    """
    visibility: VideoVisibility!

    """
    Repository used to create video
    This is only visible to the owner
    """
    repositoryURL: String!

    """
    JSON representation of render options used.
    This is only visible to the owner
    TODO: think about this more?
    """
    renderOptions: RenderOptions

    """
    Status of video
    """
    status: VideoStatus!

    """
    Whether the video has a webhook associated with it or not
    """
    hasWebhook: Boolean!

    """
    TODO: How do we want to do dates. unix time style or string timestamps?
    """
    createdAt: String!

    """
    TODO: How do we want to do dates. unix time style or string timestamps?
    """
    updatedAt: String!
  }

  """
  start - percent of log duration to start at, 0<= start <= stop
  stop - percent of log duration to stop at, stop <= 1
  key - flag to display the legend
  elasticity - elsaticity physics of file nodes moving 0.5 <= elasticity <= 3
  bloomMultiplier - float, 0.5 <= bloomMultiplier <= 1.5
  bloomIntensity - float, 0.5 <= bloomIntensity <= 1.5
  title - string
  """
  type RenderOptions {
    start: Float
    stop: Float
    key: Boolean
    elasticity: Float
    bloomMultiplier: Float
    bloomIntensity: Float
    title: String
  }

  input RenderOptionsInput {
    start: Float
    stop: Float
    key: Boolean
    elasticity: Float
    bloomMultiplier: Float
    bloomIntensity: Float
    title: String
  }

  enum VideoStatus {
    ENQUEUED
    FAILED
    TIMEOUT
    UPLOADED
  }

  enum VideoVisibility {
    """
    Video is public and accessible to anyone with a link.
    It may also appear in the 'Recently Uploaded' section of the website.
    """
    PUBLIC

    """
    Video is private, only accessible to the video owner.
    """
    PRIVATE
  }

  enum RenderType {
    GOURCE
  }

  """
  Query
  """
  type Query {
    hello: String
    helloAuth: String

    """
    Return the current user
    """
    me: User

    """
    Return user with the specified id
    """
    user(id: ID!): User

    """
    Return the page of 6 videos offset by 6 * offset videos, created by the current user
    """
    videos(offset: Int!): videoPage

    """
    Return video with the specified id
    """
    video(id: ID!): Video
  }

  type videoPage {
    videos: [Video]
    next: Boolean
  }

  """
  Mutation
  """
  type Mutation {
    """
    Deletes the video with the given ID
    """
    deleteVideo(videoId: ID!): Video

    """
    Create and enqueue a render job for the given repository
    and visualization type.
    TODO: What is renderOptions going to look like?
    """
    renderVideo(
      renderType: RenderType!
      repoURL: String!
      renderOptions: RenderOptionsInput!
      title: String!
      description: String!
      hasWebhook: Boolean!
    ): Video

    """
    Update the video status.

    TODO: This mutation should only be called by the render workers,
    so we need a way to restrict this. For now it is left open.
    This is an internal mutation.
    """
    updateStatus(
      id: ID!
      status: VideoStatus!
      uploadedURL: String
      thumbnail: String
    ): Video!

    """
    Update video title. Must be video owner.
    TODO: what are the naming conventions in graphql land?
    """
    updateVideoTitle(id: ID!, title: String!): Video!

    """
    Update video description. Must be video owner.
    """
    updateVideoDescription(id: ID!, title: String!): Video!
  }
`;

/**
 * GraphQL Schema
 *
 * type Video
 *  owner: User
 *  createdAt: Timestamp
 *  updatedAt: Timestamp
 *  title: String
 *  description: String
 *  thumbnail: String
 *  url: String
 *  visibility: VideoVisibility
 *  gitRepoURL: String (Only visible to owner)
 *  renderOptions: String(JSON representation of [1]), Only visible to owner)
 *
 * enum VideoVisibility: PUBLIC, PRIVATE
 *
 * type User
 *  name: String
 *  username: String
 *  avatarURL: String
 *
 * type Library
 *  owner: User
 *  videos: [Video]
 *
 * type WebhookVideoSubscription -- what do we call this?
 *  repository: {
 *    full_name : string,
 *    ??private : boolean
 * }
 *  whatever-we-need-for-webhook-stuff
 */

// [1]
//  "gource": {
//   // All fields are optional.
//   // "-f": true, // -f // Not necessary
//   "resolution": "-1280x720", // -1280x720 -- USER
//   "--start-date": "'YYYY-MM-DD hh:mm:ss +tz", // --start-date 'YYYY-MM-DD hh:mm:ss +tz' --- USER
//   "--stop-date":  "'YYYY-MM-DD hh:mm:ss +tz",  // Stop at a date and optional time -- USER
//   "--stop-at-time": 1, // seconds... stop after 30 seconds? -- SYSTEM
//   "--seconds-per-day": 1, //seconds -- SYSTEM
//   "--key": true, // bool, -- USER
//   "--time-scale": 1.0, // float -- ???
//   "--elasticity": 1.0, // float -- USER
//   "--bloom-multiplier": 2.0, // float -- USER
//   "--bloom-intensity": 1.5, // float -- USER
//   "--title": "Title Here" // String -- USER
// },
