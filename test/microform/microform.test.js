import 'regenerator-runtime/runtime';
import React from 'react'
import {render, screen, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { SimpleFunctionalComponent } from './microform.js'

test('rendering and getting value a basic Multiform', async () => {
  const rightTestResult = {
    'simple-form-1': { name: 'john', email: 'john@mail.com' },
    'simple-form-2': { name: 'alice', email: 'alice@mail.com' }
  }
  let testResult;
  function submitCallback(data) {
    testResult = data;
  }

  render(<SimpleFunctionalComponent submitCallback={ submitCallback } />);

  await act(async () => {
    // По неизвестной мне причине нужно выполнить какой-нибудь user event перед основными, иначе в текстовое поле записывается только последняя буква.
    // Попробуй закомментировать этот событие и увидишь сам.
    await userEvent.clear(screen.getByTestId('simple-form-1-field-name'));

    await userEvent.type(screen.getByTestId('simple-form-1-field-name'), rightTestResult['simple-form-1'].name);
    await userEvent.type(screen.getByTestId('simple-form-1-field-email'),  rightTestResult['simple-form-1'].email);
    await userEvent.type(screen.getByTestId('simple-form-2-field-name'),  rightTestResult['simple-form-2'].name);
    await userEvent.type(screen.getByTestId('simple-form-2-field-email'),  rightTestResult['simple-form-2'].email);
  });

  screen.getByText('Вывести значения всех микроформ').click();

  expect(JSON.stringify(testResult)).toEqual(JSON.stringify(rightTestResult));
})
