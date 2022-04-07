import {gql} from 'apollo-server';

export const schema = gql`
  type Video {
    """
    Unique video id
    """
    _id: ID!

    """
    Video Title
    """
    title: String!

    """
    Video Description
    """
    description: String

    """
    Video Thumbnail
    """
    thumbnail: String

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
    mongoose timestamp
    """
    createdAt: String!

    """
    mongoose timestamp
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
    """
    renderVideo(
      renderType: RenderType!
      repoURL: String!
      renderOptions: RenderOptionsInput!
      title: String!
      description: String!
      hasWebhook: Boolean!
      visibility: VideoVisibility!
    ): Video

    """
    Update the video status. This is an internal mutation that requires internal authorization.
    """
    updateStatus(
      id: ID!
      status: VideoStatus!
      uploadedURL: String
      thumbnail: String
    ): Video!

    """
    Update video title. Must be video owner.
    """
    updateVideoTitle(id: ID!, title: String!): Video!

    """
    Update video description. Must be video owner.
    """
    updateVideoDescription(id: ID!, title: String!): Video!
  }
`;
