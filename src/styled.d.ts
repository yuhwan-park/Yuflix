import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    fontColor: {
      lighter: string;
      darker: string;
    };
  }
}
