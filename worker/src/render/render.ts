interface VideoRenderer {
  render(): Promise<RenderResult>;
}

interface RenderResult {}

interface VideoRequest {}

class GourceVideoRequest implements VideoRequest {
  x: string;

  constructor(x: string) {
    this.x = x;
  }
}
