import React from 'react';
import {ComponentMeta, ComponentStory} from '@storybook/react';
import { Texts } from './Texts';

export default {
  title: 'components/Texts',
  component: Texts,
} as ComponentMeta<typeof Texts>;

export const Basic: ComponentStory<typeof Texts> = args => (
  <Texts {...args} />
);

Basic.args = {};
