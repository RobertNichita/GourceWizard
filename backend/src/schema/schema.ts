import { gql } from "apollo-server";

export const schema = gql`
  type Query {
    hello: String
  }
  
  type Mutation {
    renderVideo(renderType: RenderType!, repoURL: String!, videoId: ID!): [String]
  }

  enum RenderType {
    GOURCE
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
//   "--output-framerate": 25, // Required Int Enum (25, 30, 60) -- SYSTEM
//   "--output-ppm-stream": "-", // Should always be STDIN? -- SYSTEM,
//   "--bloom-multiplier": 2.0, // float -- USER
//   "--bloom-intensity": 1.5, // float -- USER
//   "--title": "Title Here" // String -- USER
// },