import { AppBar, Button, Container } from '@cb-common/ui-react';
import Wizard from './Wizard';

export function App(): JSX.Element {
  return (
    <Container>
      <AppBar />
      <Wizard />
    </Container>
  );
}

export default App;
