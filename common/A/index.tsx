/**
 * A link to a certain page, an anchor tag
 */

import styled from "styled-components";

export const A = styled.a.attrs({
  rel: "noopener noreferrer",
  target: "_blank"
})`
  color: #000;
  text-decoration: none;
`;
