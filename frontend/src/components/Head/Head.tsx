import { Helmet } from 'react-helmet-async';

type HeadProps = {
  title?: string;
  description?: string;
};

export const Head = ({ title = '', description = '' }: HeadProps = {}) => {
  return (
    <Helmet title={title ? `${title} | Wardrobe Rotate` : "Wardrobe Rotate"} defaultTitle="Wardrobe Rotate">
      <meta name="description" content={description} />
    </Helmet>
  );
};
