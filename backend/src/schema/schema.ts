import { buildSchema } from "graphql";

export const schema = buildSchema(`
  type Query {
    hello: String
  }
  
  type Mutation {
    renderVideo(renderType: RenderType!, repoURL: String!, videoId: ID!): [String]
  }

  enum RenderType {
    GOURCE
  }
`);