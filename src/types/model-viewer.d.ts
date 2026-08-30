import type * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      alt?: string;
      loading?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      'shadow-intensity'?: string;
      exposure?: string;
      'camera-orbit'?: string;
      'field-of-view'?: string;
    };
    }
  }
}
