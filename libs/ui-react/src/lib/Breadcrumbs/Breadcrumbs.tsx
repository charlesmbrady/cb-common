import MuiBreadcrumbs, { BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material/Breadcrumbs';
import Typography from '../Typography/Typography';
import Link from '../Link/Link';

// export type BreadcrumbsProps = React.ComponentProps<typeof MuiBreadcrumbs>;
export type Breadcrumb = {
  text: string;
  link?: string | null;
};

export type BreadcrumbsProps = MuiBreadcrumbsProps & {
  links?: Breadcrumb[];
};

export function Breadcrumbs({ links, ...rest }: BreadcrumbsProps) {
  // return <MuiBreadcrumbs {...props} />;
  return (
    <MuiBreadcrumbs aria-label="breadcrumb" {...rest}>
      {links?.map((link) =>
        link.link ? (
          <Link underline="hover" color="inherit" href={link.link}>
            {link.text}
          </Link>
        ) : (
          <Typography>{link.text}</Typography>
        )
      )}
    </MuiBreadcrumbs>
  );
}

export default Breadcrumbs;
