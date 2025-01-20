import { Link, List, ListItem, ListItemText } from '@mui/material';

export function Contact() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./contact.css file.
   */
  function EmailLink() {
    return (
      <span>
        <Link href="mailto:charlesmbrady@gmail.com">
          charlesmbrady@gmail.com
        </Link>
        {/* TODO: add social links */}
      </span>
    );
  }

  return (
    <>
      <p>
        Whether you’re looking for a full-scale application or just want to
        discuss visionary ideas over a virtual coffee, I’m here to talk. I
        welcome scheduled calls so we can dive deep into your project’s needs
        without interruptions.
      </p>

      <List>
        <ListItem>How to contact me:</ListItem>
        <ListItem>
          <ListItemText primary="Email" secondary={<EmailLink />} />
        </ListItem>
        {/* TODO: add socials */}
      </List>
      <p>
        I look forward to hearing from you and exploring how we can innovate
        together.
      </p>
    </>
  );
}

export default Contact;
