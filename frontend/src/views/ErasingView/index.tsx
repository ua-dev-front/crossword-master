import React from 'react';
import { Mode } from 'store';
import DrawingOrErasingView, {
  Props as DrawingOrErasingViewProps,
} from 'views/DrawingOrErasingView';

export type Props = Omit<DrawingOrErasingViewProps, 'mode'>;

export default function DrawingView(props: Props) {
  return <DrawingOrErasingView mode={Mode.Erase} {...props} />;
}
