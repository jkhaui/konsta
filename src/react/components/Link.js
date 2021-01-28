import React from 'react';
import { cls } from '../shared/cls';
import { useTheme } from '../shared/use-theme';

const Link = (props) => {
  const {
    tag = 'a',
    className,
    colors: colorsProp,

    // Toolbar/navbar link
    navbar,
    toolbar,

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

  const colors = {
    text: 'text-primary',
    ...colorsProp,
  };

  const c = themeClasses({
    base: {
      initial: `${colors.text} inline-flex space-x-1 items-center cursor-pointer select-none`,
      ios: `active:opacity-30 duration-300 active:duration-0`,
      material: `active:opacity-55`,
      common: `ios-active:opacity-30 ios:duration-300 ios-active:duration-0 material-active:opacity-55`,
    },
    toolbar: {
      initial: 'h-full max-h-12',
      material: 'p-x-3',
      common: '',
    },
    navbar: {
      initial: 'h-full max-h-12',
      material: 'p-x-3',
      common: '',
    },
  });

  const classes = cls(
    // base
    c.base,

    // toolbar
    toolbar && c.toolbar,

    // navbar
    navbar && c.navbar,

    className
  );

  return (
    <Component className={classes} {...attrs}>
      {children}
    </Component>
  );
};

export default Link;
