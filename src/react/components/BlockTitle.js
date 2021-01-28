import React from 'react';
import { useTheme } from '../shared/use-theme';

const BlockTitle = (props) => {
  const {
    tag = 'div',
    className,
    withBlock = true,

    // Theme
    ios,
    material,

    // Children
    children,

    // Rest
    ...rest
  } = props;

  const Component = tag;

  const attrs = {
    ...rest,
  };

  const { themeClasses } = useTheme({ ios, material });

  const c = themeClasses(
    {
      base: {
        initial: `px-4 mt-8 flex items-center ${withBlock ? '-mb-6' : 'mb-2'}`,
        ios: `font-semibold`,
        material: `font-medium`,
        common: ``,
      },
    },
    className
  );

  return (
    <Component className={c.base} {...attrs}>
      {children}
    </Component>
  );
};

export default BlockTitle;
