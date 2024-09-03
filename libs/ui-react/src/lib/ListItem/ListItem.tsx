import styled from '@emotion/styled';

const StyledListItem = styled.div`
  color: pink;
`;

export function ListItem() {
  return (
    <StyledListItem>
      <h1>Welcome to ListItem!</h1>
    </StyledListItem>
  );
}

export default ListItem;
