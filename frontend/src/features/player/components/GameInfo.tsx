import { Form } from 'components/Form/Form';
import { FormInput } from 'components/FormInput/FormInput';
import { FormItem } from 'components/FormItem/FormItem';
import { GameVo } from '../../../model/GameVo';
import React from 'react';
import { Text } from 'components/Text/Text';

export type GameInfoProps = {
  game: GameVo;
};

export const GameInfo = (props: GameInfoProps) => (
  <Form>
    <FormItem>
      <Text type="h1">Информация об игре</Text>
    </FormItem>
    <FormItem>
      <FormInput name="title" label="Название игры" value={props.game?.title} disabled />
    </FormItem>
    <FormItem>
      <FormInput name="title" label="Информация об игре" value={props.game?.description} disabled />
    </FormItem>
    <FormItem>
      <FormInput name="title" label="Статус игры" value={props.game?.gameState} disabled />
    </FormItem>
  </Form>
);
